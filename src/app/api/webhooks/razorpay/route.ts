import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/database/db";
import { CartModel } from "@/models/cart/cart.model";
import { IRazorpayPayment } from "@/types/razorpay/razorpayPayment.types";
import { IRazorpayWebhookEvent } from "@/types/razorpay/razorpayWebhookEvent.types";

export async function POST(req: Request) {
  try {
    // Connect to database
    await dbConnect();

    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("x-razorpay-signature");

    if (!signature) {
      console.error("No Razorpay signature found in headers");
      return new NextResponse("No signature", { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid Razorpay signature");
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body) as IRazorpayWebhookEvent;
    console.log("Received Razorpay webhook event:", event.event);

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
      default:
        console.log("Unhandled Razorpay event:", event.event);
    }

    return new NextResponse("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Error processing Razorpay webhook:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}

async function handleSuccessfulPayment(payment: IRazorpayPayment) {
  try {
    console.log("Processing successful payment:", payment);

    // Extract cart ID from payment notes
    const cartId = payment.notes?.cartId;
    if (!cartId) {
      console.error("Cart ID not found in payment notes:", payment.notes);
      return;
    }

    console.log("Updating cart status for cartId:", cartId);

    // Update cart status
    const cart = await CartModel.findByIdAndUpdate(
      cartId,
      {
        status: "completed",
        paymentId: payment.id,
      },
      { new: true }
    );

    if (!cart) {
      console.error("Cart not found:", cartId);
      return;
    }

    console.log("Cart updated successfully:", cart);

    // Call payment success webhook
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payment-success`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId,
          paymentId: payment.id,
          status: "completed",
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "Failed to call payment success webhook:",
        await response.text()
      );
    } else {
      console.log("Payment success webhook called successfully");
    }
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
}

async function handleFailedPayment(payment: IRazorpayPayment) {
  try {
    console.log("Processing failed payment:", payment);

    // Extract cart ID from payment notes
    const cartId = payment.notes?.cartId;
    if (!cartId) {
      console.error("Cart ID not found in payment notes:", payment.notes);
      return;
    }

    console.log("Updating cart status to cancelled for cartId:", cartId);

    // Update cart status to cancelled
    const cart = await CartModel.findByIdAndUpdate(
      cartId,
      {
        status: "cancelled",
        paymentId: payment.id,
      },
      { new: true }
    );

    if (!cart) {
      console.error("Cart not found:", cartId);
      return;
    }

    console.log("Cart updated to cancelled:", cart);
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}
