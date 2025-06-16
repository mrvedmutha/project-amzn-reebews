import { NextRequest, NextResponse } from "next/server";
import { verifyPayPalWebhook } from "@/lib/paypal";
import { dbConnect } from "@/lib/database/db";
import { CartModel } from "@/models/cart/cart.model";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

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
        await handleSuccessfulPayment(event);
        break;

      case "PAYMENT.CAPTURE.DENIED":
        await handleFailedPayment(event);
        break;

      case "PAYMENT.CAPTURE.REFUNDED":
        await handleRefundedPayment(event);
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

async function handleSuccessfulPayment(event: any) {
  try {
    const { resource } = event;
    const { custom_id: cartId } = resource;

    if (!cartId) {
      console.error("Cart ID not found in payment data");
      return;
    }

    // Update cart status
    const cart = await CartModel.findByIdAndUpdate(
      cartId,
      {
        status: "completed",
        paymentId: resource.id,
      },
      { new: true }
    );

    if (!cart) {
      console.error("Cart not found:", cartId);
      return;
    }

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
          paymentId: resource.id,
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
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
}

async function handleFailedPayment(event: any) {
  try {
    const { resource } = event;
    const { custom_id: cartId } = resource;

    if (!cartId) {
      console.error("Cart ID not found in payment data");
      return;
    }

    // Update cart status to cancelled
    await CartModel.findByIdAndUpdate(cartId, {
      status: "cancelled",
      paymentId: resource.id,
    });
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}

async function handleRefundedPayment(event: any) {
  try {
    const { resource } = event;
    const { custom_id: cartId } = resource;

    if (!cartId) {
      console.error("Cart ID not found in payment data");
      return;
    }

    // Update cart status to cancelled for refunds
    await CartModel.findByIdAndUpdate(cartId, {
      status: "cancelled",
      paymentId: resource.id,
    });
  } catch (error) {
    console.error("Error handling refunded payment:", error);
  }
}
