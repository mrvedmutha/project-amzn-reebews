import { NextRequest, NextResponse } from "next/server";
import { capturePayPalPayment } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderID } = body;

    // Validate required fields
    if (!orderID) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Capture PayPal payment
    const captureData = await capturePayPalPayment(orderID);

    // Check if payment was successful
    if (captureData.status === "COMPLETED") {
      // Here you would typically:
      // 1. Update your database with the successful payment
      // 2. Send confirmation emails
      // 3. Activate the user's subscription

      console.log("PayPal payment captured successfully:", captureData);

      return NextResponse.json({
        success: true,
        captureData,
        message: "Payment captured successfully",
      });
    } else {
      return NextResponse.json(
        {
          error: "Payment capture failed",
          status: captureData.status,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("PayPal payment capture failed:", error);

    return NextResponse.json(
      {
        error: "Failed to capture PayPal payment",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
