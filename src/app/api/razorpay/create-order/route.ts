import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, receipt, notes } = body;

    if (!amount || !currency || !receipt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const order = await createRazorpayOrder({
      amount,
      currency,
      receipt,
      notes,
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
