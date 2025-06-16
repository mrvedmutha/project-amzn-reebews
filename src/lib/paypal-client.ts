import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createPayPalOrderAndGetRedirectUrl } from "./paypal";
import React from "react";

interface PayPalPaymentOptions {
  amount: number;
  currency: string;
  cartId: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const PayPalPaymentButton: React.FC<PayPalPaymentOptions> = ({
  amount,
  currency,
  cartId,
  onSuccess,
  onError,
}) => {
  const handlePayment = async () => {
    try {
      const redirectUrl = await createPayPalOrderAndGetRedirectUrl({
        amount,
        currency,
        cartId,
      });

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        throw new Error("Failed to get PayPal redirect URL");
      }
    } catch (error) {
      console.error("Error initiating PayPal payment:", error);
      onError?.(error);
    }
  };

  return React.createElement(
    PayPalScriptProvider,
    {
      options: {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: currency,
        intent: "capture",
      },
    },
    React.createElement(PayPalButtons, {
      style: { layout: "vertical" },
      createOrder: async () => {
        try {
          const redirectUrl = await createPayPalOrderAndGetRedirectUrl({
            amount,
            currency,
            cartId,
          });
          if (!redirectUrl) {
            throw new Error("Failed to get PayPal redirect URL");
          }
          window.location.href = redirectUrl;
          return "redirecting";
        } catch (error) {
          console.error("Error creating PayPal order:", error);
          onError?.(error);
          throw error;
        }
      },
      onApprove: async () => {
        // This won't be called in our redirect flow
        return;
      },
      onError: (err) => {
        console.error("PayPal error:", err);
        onError?.(err);
      },
    })
  );
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
