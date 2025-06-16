import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/db";
import { CartModel } from "@/models/cart/cart.model";
import { verifyPayPalWebhook } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { orderId, cartId, paymentId, signature } = body;

    if (!orderId || !cartId || !paymentId || !signature) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the payment with PayPal
    const isValid = await verifyPayPalWebhook(orderId, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid PayPal payment" },
        { status: 400 }
      );
    }

    // Update cart status
    const updatedCart = await CartModel.findByIdAndUpdate(
      cartId,
      {
        status: "completed",
        paymentId: paymentId,
        paymentGateway: "paypal",
      },
      { new: true }
    );

    if (!updatedCart) {
      console.error("Cart not found:", cartId);
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Call payment success webhook
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payment/success`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartId,
            paymentGateway: "paypal",
            paymentId: paymentId,
            status: "completed",
          }),
        }
      );
    } catch (error) {
      console.error("Error calling payment success webhook:", error);
    }

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error processing PayPal payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
