import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

import { IRazorpayPayment } from "@/types/razorpay/razorpayPayment.types";
import { IRazorpayWebhookEvent } from "@/types/razorpay/razorpayWebhookEvent.types";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("x-razorpay-signature");

    if (!signature) {
      return new NextResponse("No signature", { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body) as IRazorpayWebhookEvent;

    // Handle different event types
    switch (event.event) {
      case "payment.authorized":
        // Payment was successful
        await handleSuccessfulPayment(event.payload.payment.entity);
        break;
      case "payment.failed":
        // Payment failed
        await handleFailedPayment(event.payload.payment.entity);
        break;
      // Add more event handlers as needed
    }

    return new NextResponse("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}

async function handleSuccessfulPayment(payment: IRazorpayPayment) {
  // Implement your success logic here
  // For example:
  // - Update user's subscription status
  // - Send confirmation email
  // - Update database records
  console.log("Payment successful:", payment);
}

async function handleFailedPayment(payment: IRazorpayPayment) {
  // Implement your failure logic here
  // For example:
  // - Notify user about failed payment
  // - Update payment status in database
  console.log("Payment failed:", payment);
}
