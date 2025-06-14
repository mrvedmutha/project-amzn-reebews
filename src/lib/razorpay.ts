import Razorpay from "razorpay";
import crypto from "crypto";

export interface RazorpayOrderOptions {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export const createRazorpayOrder = async (options: RazorpayOrderOptions) => {
  // Check if environment variables are available
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error(
      "Razorpay credentials are missing. Please check your environment variables."
    );
    throw new Error("Razorpay credentials are not configured");
  }

  // Initialize Razorpay instance
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    // Validate required fields
    if (!options.amount || !options.currency || !options.receipt) {
      throw new Error("Missing required fields for order creation");
    }

    // Log order creation attempt (only in development)
    if (process.env.NODE_ENV === "development") {
      console.log("Creating Razorpay order with:", {
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
      });
    }

    const order = await razorpay.orders.create({
      amount: options.amount * 100, // Convert to paise
      currency: options.currency,
      receipt: options.receipt,
      notes: options.notes,
    });

    if (!order || !order.id) {
      throw new Error("Failed to create Razorpay order: Invalid response");
    }

    return order;
  } catch (error: any) {
    console.error("Error creating Razorpay order:", {
      error: error.message,
      details: error.error,
      stack: error.stack,
    });

    if (error.error) {
      throw new Error(
        `Razorpay error: ${
          error.error.description || error.error.message || "Unknown error"
        }`
      );
    }
    throw new Error("Failed to create Razorpay order");
  }
};

export const verifyRazorpayPayment = async (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  try {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    return generatedSignature === signature;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};
