import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/payment/razorpay/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, receipt, notes } = body;

    if (!amount || !currency || !receipt || !notes?.cartId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Creating Razorpay order with notes:", notes); //TODO: Remove

    const order = await createRazorpayOrder({
      amount,
      currency,
      receipt,
      notes,
    });

    console.log("Razorpay order created:", order); //TODO: Remove

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
