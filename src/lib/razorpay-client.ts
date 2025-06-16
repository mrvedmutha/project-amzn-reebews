import crypto from "crypto";

export interface RazorpayPaymentOptions {
  orderId: string;
  paymentMethod: "card" | "upi" | "netbanking" | "wallet";
  userEmail: string;
  userName: string;
  userPhone: string;
  cartId: string;
}

export const initializeRazorpayPayment = (options: RazorpayPaymentOptions) => {
  if (typeof window === "undefined") {
    throw new Error("Razorpay can only be initialized in browser environment");
  }

  if (!options.orderId) {
    throw new Error("Order ID is required to initialize payment");
  }

  if (!options.cartId) {
    throw new Error("Cart ID is required to initialize payment");
  }

  const rzpOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: 0, // Will be set from order
    currency: "INR",
    name: "Reebews",
    description: "Payment for Reebews Subscription",
    order_id: options.orderId,
    handler: async function (response: any) {
      if (
        !response ||
        !response.razorpay_payment_id ||
        !response.razorpay_order_id ||
        !response.razorpay_signature
      ) {
        console.error("Invalid payment response:", response);
        return;
      }

      try {
        // Call our payment success endpoint
        const result = await fetch("/api/payment/success", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            cartId: options.cartId,
          }),
        });

        if (!result.ok) {
          const error = await result.json();
          console.error("Failed to process payment:", error);
          return;
        }

        const data = await result.json();
        console.log("Payment processed successfully:", data);

        // Redirect to thank you page
        window.location.href = "/checkout/thank-you";
      } catch (error) {
        console.error("Error processing payment:", error);
      }
    },
    prefill: {
      name: options.userName,
      email: options.userEmail,
      contact: options.userPhone,
    },
    notes: {
      payment_method: options.paymentMethod,
      cartId: options.cartId,
    },
    theme: {
      color: "#FFB000",
    },
    modal: {
      ondismiss: function () {
        // Handle modal dismissal
        console.log("Payment modal dismissed");
      },
    },
    config: {
      display: {
        blocks: {
          banks: {
            name: "Pay using Net Banking",
            instruments: [
              {
                method: "netbanking",
              },
            ],
          },
          upi: {
            name: "Pay using UPI",
            instruments: [
              {
                method: "upi",
              },
            ],
          },
          wallet: {
            name: "Pay using Wallet",
            instruments: [
              {
                method: "wallet",
              },
            ],
          },
        },
        sequence: ["block.banks", "block.upi", "block.wallet"],
        preferences: {
          show_default_blocks: true,
        },
      },
    },
  };

  const razorpay = new (window as any).Razorpay(rzpOptions);
  razorpay.open();
};
