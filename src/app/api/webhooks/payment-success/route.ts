import { NextResponse } from "next/server";
import { CartModel } from "@/models/cart/cart.model";
import { generateSignupToken } from "@/lib/auth/token";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cartId, paymentId, status } = body;

    // Update cart status
    const cart = await CartModel.findByIdAndUpdate(
      cartId,
      {
        status: "completed",
        paymentId,
      },
      { new: true }
    );

    if (!cart) {
      throw new Error("Cart not found");
    }

    // Generate signup token
    const signupToken = await generateSignupToken({
      email: cart.userDetails.email,
      plan: cart.planDetails.plan,
      cartId: cart._id.toString(),
    });

    // Store token in cart
    await CartModel.findByIdAndUpdate(cartId, {
      signupToken,
      tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Redirect URL with token
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/thank-you?token=${signupToken}`;

    return NextResponse.json({
      success: true,
      redirectUrl,
    });
  } catch (error) {
    console.error("Payment webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
