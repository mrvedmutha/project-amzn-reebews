import { NextRequest } from "next/server";
import { cartPublicService } from "@/services/cart/cart-public.services";
import { EmailService } from "@/lib/email/email.service";
import { PaymentStatus } from "@/enums/checkout.enum";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(req: NextRequest) {
  try {
    const { cartId, transactionId, status, paymentMethod } = await req.json();

    console.log(`📝 Cart update request received:`, {
      cartId,
      transactionId,
      status,
      paymentMethod,
    });

    // Validate required fields
    if (!cartId || !status) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get cart before update to check previous status
    const cartBeforeUpdate = await cartPublicService.getCartById(cartId);

    // Update cart payment using service
    const updatedCart = await cartPublicService.updateCartPayment(cartId, {
      transactionId,
      status: status as PaymentStatus,
      paymentMethod,
    });

    if (!updatedCart) {
      return Response.json(
        { success: false, message: "Cart not found or failed to update" },
        { status: 404 }
      );
    }

    const wasAlreadyCompleted =
      cartBeforeUpdate?.payment.status === PaymentStatus.COMPLETED;
    const isNowCompleted = status === PaymentStatus.COMPLETED;

    console.log(`🔍 Email conditions check:`, {
      status,
      expectedStatus: PaymentStatus.COMPLETED,
      statusMatch: isNowCompleted,
      wasAlreadyCompleted,
      shouldSendEmail: isNowCompleted && !wasAlreadyCompleted,
    });

    // Send welcome email only if payment just became completed (not if it was already completed)
    if (isNowCompleted && !wasAlreadyCompleted) {
      console.log(
        `🎯 Payment just completed! Sending welcome email for cart ${cartId}...`
      );
      try {
        const signupToken = uuidv4();

        // Send welcome email with signup link
        await EmailService.sendSignupEmail(
          updatedCart.user.email,
          updatedCart.user.name,
          signupToken,
          {
            plan: updatedCart.subscription.planName,
            amount: updatedCart.payment.totalAmount,
            currency: updatedCart.payment.currency,
            billingCycle: updatedCart.subscription.billingCycle,
          }
        );

        console.log(
          `✅ Welcome email sent successfully to ${updatedCart.user.email}`
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
        console.error("❌ Error sending welcome email:", error);
        // We still return success since payment was successful
        // but log the error for monitoring
        return Response.json(
          {
            success: true,
            message: "Cart updated but welcome email could not be sent",
            data: updatedCart,
            emailError: error.message,
          },
          { status: 200 }
        );
      }
    } else {
      console.log(
        `⏭️ Skipping email: isNowCompleted=${isNowCompleted}, wasAlreadyCompleted=${wasAlreadyCompleted}, reason=${!isNowCompleted ? "payment not completed" : "payment was already completed"}`
      );
    }

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
