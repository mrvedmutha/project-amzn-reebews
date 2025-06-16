import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrderAndGetRedirectUrl } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, description, reference_id, cartId } = body;

    // Validate required fields
    if (!amount || !currency || !cartId) {
      return NextResponse.json(
        { error: "Amount, currency, and cartId are required" },
        { status: 400 }
      );
    }

    // Create PayPal order and get redirect URL
    const redirectUrl = await createPayPalOrderAndGetRedirectUrl({
      amount: parseFloat(amount),
      currency,
      description: description || "Reebews Subscription",
      reference_id: reference_id || `order_${Date.now()}`,
      cartId,
    });

    return NextResponse.json({
      success: true,
      redirectUrl,
    });
  } catch (error: any) {
    console.error("PayPal order creation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}
