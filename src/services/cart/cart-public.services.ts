import { CartModel } from "@/models/cart/cart.model";
import { ICart } from "@/types/cart/cart.types";
import { getPlanIdByName, isFreeplan } from "@/helpers/plan";

/**
 * Calculate subscription end date based on billing cycle
 */
const calculateSubscriptionEndDate = (
  startDate: Date,
  billingCycle: BillingCycle
): Date => {
  const endDate = new Date(startDate);

  if (billingCycle === BillingCycle.YEARLY) {
    // Add exactly 365 days for yearly plans
    endDate.setDate(endDate.getDate() + 365);
  } else {
    // Add exactly 30 days for monthly plans
    endDate.setDate(endDate.getDate() + 30);
  }

  return endDate;
};
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
    signupToken: string;
  }> {
    await dbConnect();

    try {
      // Generate IDs and tokens
      const paymentId = uuidv4();
      const signupToken = uuidv4();
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Determine if this is a free plan
      const isFree = cartData.plan === Plan.FREE || cartData.amount === 0;

      // Create cart with embedded subscription
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
          amount: cartData.amount,
          currency: cartData.currency,
          isActive: true,
          startDate: isFree ? new Date() : undefined, // Set immediately for free plans
          endDate: isFree ? null : undefined, // Free plans never expire
        },
        payment: {
          id: paymentId,
          method: cartData.paymentGateway,
          totalAmount: cartData.amount,
          currency: cartData.currency,
          status: isFree ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
        },
        signupToken,
        tokenExpiry,
        isSignupCompleted: false,
      });

      return {
        cartId: cart._id.toString(),
        paymentId,
        signupToken,
      };
    } catch (error) {
      console.error("Error creating cart:", error);
      throw new Error("Failed to create cart");
    }
  },

  /**
   * Update cart payment status and subscription dates
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

      // If payment is completed, update subscription dates
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
