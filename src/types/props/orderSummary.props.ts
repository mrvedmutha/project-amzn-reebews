import { PlanDetails } from "@/types/checkout.types";
import {PlanDetailsType} from "@/schemas/zod/checkout/checkout.zod"
import {BillingCycle, Currency} from "@/enums/checkout.enum"

export interface OrderSummaryProps {
    planDetails: PlanDetails;
    plan: string;
    billingCycle: BillingCycle;
    setBillingCycle: (cycle: BillingCycle) => void;
    currency: Currency;
    finalPrice: { USD: number; INR: number };
    originalPrice: { USD: number; INR: number };
    discountAmount: { USD: number; INR: number };
    showDiscount: boolean;
    formatPrice: (price: number) => string;
  }