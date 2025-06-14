export interface RazorpayPaymentOptions {
  orderId: string;
  paymentMethod: "card" | "upi" | "netbanking" | "wallet";
  userEmail: string;
  userName: string;
  userPhone: string;
}

export const initializeRazorpayPayment = (options: RazorpayPaymentOptions) => {
  if (typeof window === "undefined") {
    throw new Error("Razorpay can only be initialized in browser environment");
  }

  if (!options.orderId) {
    throw new Error("Order ID is required to initialize payment");
  }

  const rzpOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: 0, // Will be set from order
    currency: "INR",
    name: "Reebews",
    description: "Payment for Reebews Subscription",
    order_id: options.orderId,
    handler: function (response: any) {
      if (
        !response ||
        !response.razorpay_payment_id ||
        !response.razorpay_order_id ||
        !response.razorpay_signature
      ) {
        console.error("Invalid payment response:", response);
        return;
      }
      // Handle successful payment
      console.log("Payment successful:", response);
      // Redirect to thank you page
      window.location.href = "/checkout/thank-you";
    },
    prefill: {
      name: options.userName,
      email: options.userEmail,
      contact: options.userPhone,
    },
    notes: {
      payment_method: options.paymentMethod,
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

  try {
    // Initialize Razorpay
    const rzp = new (window as any).Razorpay(rzpOptions);
    rzp.open();
  } catch (error) {
    console.error("Error initializing Razorpay:", error);
    throw new Error("Failed to initialize payment. Please try again.");
  }
};
