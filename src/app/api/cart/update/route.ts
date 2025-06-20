import { NextRequest } from "next/server";
import { CartModel } from "@/models/cart/cart.model";
import { EmailService } from "@/lib/email/email.service";
import { dbConnect } from "@/lib/database/db";

export async function PATCH(req: NextRequest) {
  try {
    // Connect to database first
    await dbConnect();

    const { cartId, paymentId, currency, status } = await req.json();

    // Fetch cart to get planDetails
    const cartDoc = await CartModel.findById(cartId);
    if (!cartDoc) {
      return Response.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const billingCycle = cartDoc.planDetails.billingCycle;

    // Calculate expiry date based on billing cycle
    const expiryDate = new Date(now);
    if (billingCycle === "yearly") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    // Generate signup token if payment is successful
    if (status === "completed") {
      const signupToken = EmailService.generateSignupToken();
      const tokenExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

      // Update cart with payment details, signup token, and dates
      const updatedCart = await CartModel.findByIdAndUpdate(
        cartId,
        {
          $set: {
            paymentId,
            currency,
            status,
            signupToken,
            tokenExpiresAt,
            purchaseDate: now,
            expiryDate: expiryDate,
            updatedAt: now,
          },
        },
        { new: true }
      );

      if (!updatedCart) {
        return Response.json(
          { success: false, message: "Failed to update cart" },
          { status: 500 }
        );
      }

      try {
        // Send welcome email with signup link
        await EmailService.sendSignupEmail(
          updatedCart.userDetails.email,
          updatedCart.userDetails.name,
          signupToken,
          {
            plan: updatedCart.planDetails.plan,
            amount: updatedCart.finalAmount,
            currency: updatedCart.currency,
            billingCycle: billingCycle,
          }
        );

        return Response.json(
          {
            success: true,
            message: "Cart updated and welcome email sent",
            data: updatedCart,
          },
          { status: 200 }
        );
      } catch (error: any) {
        console.error("Error sending welcome email:", error);
        // We still return success since payment was successful
        // but log the error for monitoring
        return Response.json(
          {
            success: true,
            message: "Cart updated but welcome email could not be sent",
            data: updatedCart,
          },
          { status: 200 }
        );
      }
    }

    // For non-success statuses, just update the cart
    const updatedCart = await CartModel.findByIdAndUpdate(
      cartId,
      {
        $set: {
          paymentId,
          currency,
          status,
          updatedAt: now,
        },
      },
      { new: true }
    );

    return Response.json(
      {
        success: true,
        message: "Cart updated",
        data: updatedCart,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating cart:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to update cart",
      },
      { status: 500 }
    );
  }
}
