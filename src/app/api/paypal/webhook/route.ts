import { NextRequest, NextResponse } from "next/server";
import { verifyPayPalWebhook } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers: Record<string, string> = {};

    // Extract PayPal headers
    request.headers.forEach((value, key) => {
      if (key.toLowerCase().startsWith("paypal-")) {
        headers[key.toLowerCase()] = value;
      }
    });

    // Verify webhook signature
    const isValid = await verifyPayPalWebhook(headers, body);

    if (!isValid) {
      console.error("Invalid PayPal webhook signature");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        console.log("PayPal payment completed:", event);
        // Handle successful payment
        // Update database, send emails, etc.
        break;

      case "PAYMENT.CAPTURE.DENIED":
        console.log("PayPal payment denied:", event);
        // Handle denied payment
        break;

      case "PAYMENT.CAPTURE.REFUNDED":
        console.log("PayPal payment refunded:", event);
        // Handle refund
        break;

      default:
        console.log("Unhandled PayPal webhook event:", event.event_type);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("PayPal webhook processing failed:", error);

    return NextResponse.json(
      {
        error: "Failed to process PayPal webhook",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
