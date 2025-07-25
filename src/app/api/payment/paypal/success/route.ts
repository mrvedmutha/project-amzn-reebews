import { NextRequest, NextResponse } from "next/server";
import { capturePayPalPayment } from "@/lib/payment/paypal/paypal";
import { dbConnect } from "@/lib/database/db";
import { CartModel } from "@/models/cart/cart.model";

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

    // Verify cart exists
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      console.error("Cart not found:", cartId);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=cart_not_found`
      );
    }

    // Call unified cart update route
    const updateRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/update`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          transactionId: captureData.id,
          status: "completed",
          paymentMethod: "paypal",
        }),
      }
    );
    if (!updateRes.ok) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=cart_update_failed`
      );
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
