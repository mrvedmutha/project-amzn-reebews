import { CartModel } from "@/models/cart/cart.model";
import { PlanModel } from "@/models/plan/plan.model";
import type { ICart } from "@/types/cart/cart.types";
import { getPlanIdByName } from "@/helpers/plan";
import { generateSignupToken } from "@/lib/auth/token";
import { calculateSubscriptionEndDate } from "@/lib/utils/subscription-dates";
import {
  PaymentStatus,
  PaymentGateway,
  Plan,
  BillingCycle,
  Currency,
} from "@/enums/checkout.enum";
import { dbConnect } from "@/lib/database/db";
import { v4 as uuidv4 } from "uuid";

export const cartPublicService = {
  /**
   * Get cart details by signup token for external access
   * Only returns completed carts
   */
  async getCartBySignupToken(signupToken: string): Promise<ICart | null> {
    await dbConnect();

    try {
      const cart = (await CartModel.findOne({
        signupToken,
        "payment.status": PaymentStatus.COMPLETED, // Only completed carts
      }).lean()) as ICart | null;

      return cart;
    } catch (error) {
      console.error("Error getting cart by signup token:", error);
      throw new Error("Failed to retrieve cart details");
    }
  },

  /**
   * Get cart details by signup token for signup flow
   * Returns any cart (completed or not) for signup process
   */
  async getCartBySignupTokenForSignup(
    signupToken: string
  ): Promise<ICart | null> {
    await dbConnect();

    try {
      const cart = (await CartModel.findOne({
        signupToken,
        // No payment status filter - get any cart
      }).lean()) as ICart | null;

      return cart;
    } catch (error) {
      console.error("Error getting cart by signup token for signup:", error);
      throw new Error("Failed to retrieve cart details");
    }
  },

  /**
   * Get cart details by ID
   */
  async getCartById(cartId: string): Promise<ICart | null> {
    await dbConnect();

    try {
      const cart = (await CartModel.findById(cartId).lean()) as ICart | null;

      return cart;
    } catch (error) {
      console.error("Error getting cart by ID:", error);
      throw new Error("Failed to retrieve cart details");
    }
  },

  /**
   * Create a new cart with embedded subscription
   * Enhanced with Plan model validation and dynamic pricing
   */
  async createCart(cartData: {
    plan: Plan;
    billingCycle: BillingCycle;
    amount: number;
    currency: Currency;
    userDetails: {
      name: string;
      email: string;
      address: {
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
      };
      company?: string;
      gstNumber?: string;
    };
    paymentGateway: PaymentGateway;
    userId?: string;
  }): Promise<{
    cartId: string;
    paymentId: string;
    signupToken?: string; // Optional - only for free plans
  }> {
    await dbConnect();

    try {
      // Generate IDs - NO signupToken for paid plans
      const paymentId = uuidv4();

      // Enhanced: Validate plan exists in database and get dynamic pricing
      let validatedAmount = cartData.amount;
      let planValidationMessage = "";

      try {
        const planFromDb = (await PlanModel.findOne({
          name: cartData.plan,
          isActive: true,
        }).lean()) as any; // Type as any for now since we're accessing nested properties

        if (planFromDb) {
          // Use dynamic pricing from database if available
          const dynamicPrice =
            cartData.billingCycle === BillingCycle.MONTHLY
              ? planFromDb.pricing.monthly[cartData.currency]
              : planFromDb.pricing.yearly[cartData.currency];

          // Only use dynamic pricing if it matches the provided amount (within 1% tolerance)
          const priceDifference = Math.abs(dynamicPrice - cartData.amount);
          const tolerance = cartData.amount * 0.01; // 1% tolerance

          if (priceDifference <= tolerance) {
            validatedAmount = dynamicPrice;
            planValidationMessage = `Plan validated from database. Using dynamic pricing: ${validatedAmount}`;
          } else {
            planValidationMessage = `Plan found in database but using provided amount due to price mismatch. DB: ${dynamicPrice}, Provided: ${cartData.amount}`;
          }
        } else {
          planValidationMessage = `Plan '${cartData.plan}' not found in database, using provided amount`;
        }
      } catch (error) {
        console.warn("Plan validation failed, using provided amount:", error);
        planValidationMessage = "Plan validation failed, using provided amount";
      }

      console.log(
        `📋 Cart creation with plan validation: ${planValidationMessage}`
      );

      // Determine if this is a free plan
      const isFree = cartData.plan === Plan.FREE || validatedAmount === 0;

      // Create cart with embedded subscription first
      const cart = await CartModel.create({
        userId: cartData.userId,
        user: {
          name: cartData.userDetails.name,
          email: cartData.userDetails.email,
          address: cartData.userDetails.address,
          business: {
            company: cartData.userDetails.company,
            gstin: cartData.userDetails.gstNumber,
          },
        },
        subscription: {
          planId: getPlanIdByName(cartData.plan),
          planName: cartData.plan,
          billingCycle: cartData.billingCycle,
          amount: validatedAmount, // Use validated amount
          currency: cartData.currency,
          isActive: true,
          startDate: isFree ? new Date() : undefined, // Set immediately for free plans
          endDate: isFree ? null : undefined, // Free plans never expire
        },
        payment: {
          id: paymentId,
          method: cartData.paymentGateway,
          totalAmount: validatedAmount, // Use validated amount
          currency: cartData.currency,
          status: isFree ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
        },
        isSignupCompleted: false,
      });

      // For free plans, generate and save signupToken after cart creation
      let signupToken: string | undefined;
      if (isFree) {
        signupToken = generateSignupToken({
          email: cartData.userDetails.email,
          plan: cartData.plan as any, // Plan and UserPlan have same values
          cartId: cart._id.toString(),
        });

        // Update cart with signupToken
        await CartModel.findByIdAndUpdate(cart._id, {
          signupToken,
          tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
      }

      const result: any = {
        cartId: cart._id.toString(),
        paymentId,
      };

      // Only include signupToken for free plans
      if (signupToken) {
        result.signupToken = signupToken;
      }

      return result;
    } catch (error) {
      console.error("Error creating cart:", error);
      throw new Error("Failed to create cart");
    }
  },

  /**
   * Update cart payment status and subscription dates
   * Generates signupToken when payment is completed
   */
  async updateCartPayment(
    cartId: string,
    paymentUpdate: {
      transactionId?: string;
      status: PaymentStatus;
      paymentMethod?: string;
    }
  ): Promise<ICart | null> {
    await dbConnect();

    try {
      const updateFields: any = {
        "payment.status": paymentUpdate.status,
        updatedAt: new Date(),
      };

      if (paymentUpdate.transactionId) {
        updateFields["payment.transactionId"] = paymentUpdate.transactionId;
      }

      if (paymentUpdate.paymentMethod) {
        updateFields["payment.paymentMethod"] = paymentUpdate.paymentMethod;
      }

      // If payment is completed, update subscription dates AND generate signupToken
      if (paymentUpdate.status === PaymentStatus.COMPLETED) {
        const cart = await CartModel.findById(cartId);
        if (cart) {
          const now = new Date();
          updateFields["subscription.startDate"] = now;

          if (cart.subscription.planName === Plan.FREE) {
            // Free plans never expire
            updateFields["subscription.endDate"] = null;
          } else {
            // Calculate end date based on billing cycle
            const endDate = calculateSubscriptionEndDate(
              now,
              cart.subscription.billingCycle
            );
            updateFields["subscription.endDate"] = endDate;
          }

          // Generate signupToken when payment is completed (if not already exists)
          if (!cart.signupToken) {
            updateFields["signupToken"] = generateSignupToken({
              email: cart.user.email,
              plan: cart.subscription.planName as any, // Plan and UserPlan have same values
              cartId: cart._id.toString(),
            });
            updateFields["tokenExpiry"] = new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ); // 24 hours
          }
        }
      }

      const updatedCart = await CartModel.findByIdAndUpdate(
        cartId,
        { $set: updateFields },
        { new: true }
      );

      return updatedCart?.toObject() as ICart | null;
    } catch (error) {
      console.error("Error updating cart payment:", error);
      throw new Error("Failed to update cart payment");
    }
  },

  /**
   * Mark signup as completed
   */
  async completeSignup(signupToken: string): Promise<ICart | null> {
    await dbConnect();

    try {
      const cart = await CartModel.findOneAndUpdate(
        { signupToken },
        {
          $set: {
            isSignupCompleted: true,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      return cart?.toObject() as ICart | null;
    } catch (error) {
      console.error("Error completing signup:", error);
      throw new Error("Failed to complete signup");
    }
  },
};
