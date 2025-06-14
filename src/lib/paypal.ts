// Crypto import removed as it's not used in this file

export interface PayPalOrderOptions {
  amount: number;
  currency: string;
  description?: string;
  reference_id?: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

// Get PayPal access token
const getPayPalAccessToken = async (): Promise<string> => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await fetch(`${baseURL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get PayPal access token: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.access_token;
  } catch (error: any) {
    console.error("Error getting PayPal access token:", error);
    throw new Error("Failed to authenticate with PayPal");
  }
};

// Create PayPal order
export const createPayPalOrder = async (
  options: PayPalOrderOptions
): Promise<PayPalOrderResponse> => {
  const accessToken = await getPayPalAccessToken();
  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  try {
    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: options.reference_id || `order_${Date.now()}`,
          description: options.description || "Reebews Subscription",
          amount: {
            currency_code: options.currency,
            value: options.amount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/thank-you`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
        brand_name: "Reebews",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
      },
    };

    const response = await fetch(`${baseURL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("PayPal order creation failed:", errorData);
      throw new Error(`Failed to create PayPal order: ${response.statusText}`);
    }

    const order = await response.json();
    return order;
  } catch (error: any) {
    console.error("Error creating PayPal order:", error);
    throw new Error("Failed to create PayPal order");
  }
};

// Capture PayPal payment
export const capturePayPalPayment = async (orderId: string) => {
  const accessToken = await getPayPalAccessToken();
  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  try {
    const response = await fetch(
      `${baseURL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("PayPal payment capture failed:", errorData);
      throw new Error(
        `Failed to capture PayPal payment: ${response.statusText}`
      );
    }

    const captureData = await response.json();
    return captureData;
  } catch (error: any) {
    console.error("Error capturing PayPal payment:", error);
    throw new Error("Failed to capture PayPal payment");
  }
};

// Verify PayPal webhook signature
export const verifyPayPalWebhook = async (
  headers: Record<string, string>,
  body: string
): Promise<boolean> => {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    throw new Error("PayPal webhook ID is not configured");
  }

  const accessToken = await getPayPalAccessToken();
  const baseURL =
    process.env.NODE_ENV === "production"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  try {
    const verificationData = {
      auth_algo: headers["paypal-auth-algo"],
      cert_id: headers["paypal-cert-id"],
      transmission_id: headers["paypal-transmission-id"],
      transmission_sig: headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    };

    const response = await fetch(
      `${baseURL}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationData),
      }
    );

    if (!response.ok) {
      console.error("PayPal webhook verification failed:", response.statusText);
      return false;
    }

    const result = await response.json();
    return result.verification_status === "SUCCESS";
  } catch (error: any) {
    console.error("Error verifying PayPal webhook:", error);
    return false;
  }
};
 