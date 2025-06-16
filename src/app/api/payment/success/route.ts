import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/db";
import { CartModel } from "@/models/cart/cart.model";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      cartId,
    } = body;

    // Validate required fields
    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !cartId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Invalid payment signature");
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update cart status
    const cart = await CartModel.findByIdAndUpdate(
      cartId,
      {
        status: "completed",
        paymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!cart) {
      console.error("Cart not found:", cartId);
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    console.log("Cart updated successfully:", cart);

    // Call payment success webhook
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/payment-success`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId,
          paymentId: razorpay_payment_id,
          status: "completed",
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "Failed to call payment success webhook:",
        await response.text()
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
      cart,
    });
  } catch (error: any) {
    console.error("Error processing payment success:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
