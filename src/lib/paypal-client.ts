export interface PayPalPaymentOptions {
  orderId: string;
  userEmail: string;
  userName: string;
  amount: number;
  currency: string;
}

export const initializePayPalPayment = (options: PayPalPaymentOptions) => {
  if (typeof window === "undefined") {
    throw new Error("PayPal can only be initialized in browser environment");
  }

  if (!options.orderId) {
    throw new Error("Order ID is required to initialize PayPal payment");
  }

  // Check if PayPal SDK is loaded
  if (!(window as any).paypal) {
    throw new Error(
      "PayPal SDK is not loaded. Please ensure the PayPal script is included."
    );
  }

  const paypal = (window as any).paypal;

  return paypal.Buttons({
    // Set up the transaction
    createOrder: function (data: any, actions: any) {
      // Return the order ID created on the server
      return Promise.resolve(options.orderId);
    },

    // Finalize the transaction
    onApprove: function (data: any, actions: any) {
      return fetch("/api/paypal/capture-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      })
        .then((response) => response.json())
        .then((orderData) => {
          // Handle successful payment
          console.log("PayPal payment successful:", orderData);

          // Redirect to thank you page
          window.location.href = "/checkout/thank-you";
        })
        .catch((error) => {
          console.error("PayPal payment capture failed:", error);
          // Handle error appropriately
          alert("Payment processing failed. Please try again.");
        });
    },

    // Handle payment errors
    onError: function (err: any) {
      console.error("PayPal payment error:", err);
      alert("Payment failed. Please try again.");
    },

    // Handle payment cancellation
    onCancel: function (data: any) {
      console.log("PayPal payment cancelled:", data);
      // Optionally handle cancellation
    },

    // Styling options
    style: {
      color: "blue",
      shape: "rect",
      label: "paypal",
      layout: "vertical",
      height: 45,
    },
  });
};

// Initialize PayPal SDK
export const loadPayPalSDK = (clientId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).paypal) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error("Failed to load PayPal SDK"));
    };

    document.head.appendChild(script);
  });
};
 