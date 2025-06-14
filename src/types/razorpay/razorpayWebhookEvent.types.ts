import { IRazorpayPayment } from "@/types/razorpay/razorpayPayment.types";

export interface IRazorpayWebhookEvent {
  event: string;
  payload: {
    payment: {
      entity: IRazorpayPayment;
    };
  };
}
