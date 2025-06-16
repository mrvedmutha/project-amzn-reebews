import { NextRequest, NextResponse } from "next/server";
import { capturePayPalPayment } from "@/lib/paypal";
import { dbConnect } from "@/lib/database/db";
import { CartModel } from "@/models/cart/cart.model";
import { generateSignupToken } from "@/lib/auth/token";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const orderId = searchParams.get("token");
    const cartId = searchParams.get("cartId");

    if (!orderId || !cartId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=missing_params`
      );
    }

    // Connect to database
    await dbConnect();

    // Capture the payment
    const captureData = await capturePayPalPayment(orderId);

    if (captureData.status !== "COMPLETED") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=payment_failed`
      );
    }

    // Get cart details for token generation
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      console.error("Cart not found:", cartId);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=cart_not_found`
      );
    }

    // Generate signup token
    const signupToken = generateSignupToken({
      email: cart.userDetails.email,
      plan: cart.planDetails.plan,
      cartId: cart._id.toString(),
    });

    // Update cart status and add token
    const updatedCart = await CartModel.findByIdAndUpdate(
      cartId,
      {
        status: "completed",
        paymentId: captureData.id,
        paymentGateway: "paypal",
        signupToken,
        tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
      { new: true }
    );

    if (!updatedCart) {
      console.error("Cart not found:", cartId);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=cart_not_found`
      );
    }

    // Call payment success webhook
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/payment/success`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartId,
            paymentGateway: "paypal",
            paymentId: captureData.id,
            status: "completed",
          }),
        }
      );
    } catch (error) {
      console.error("Error calling payment success webhook:", error);
    }

    // Redirect to thank you page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/thank-you`
    );
  } catch (error) {
    console.error("Error processing PayPal payment:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=payment_failed`
    );
  }
}
