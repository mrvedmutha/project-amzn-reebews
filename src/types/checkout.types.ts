import { PaymentMethod, Plan, Currency, BillingCycle, CouponType, Country } from "@/enums/checkout.enum";

export interface CheckoutFormValues {
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  gstNumber?: string;
  paymentMethod: string;
  cardName?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvc?: string;
  agreeToTerms: boolean;
}

export interface PlanDetails {
  name: string;
  price: { USD: number; INR: number };
  description: string;
  features: string[];
  upgrades?: Plan[];
  downgrades?: Plan[];
  billingCycle: BillingCycle;
}

export interface CouponDetails {
  code: string;
  discountValue: number;
  type: CouponType;
  description: string;
}

// Re-export enums for convenience
export { PaymentMethod, Plan, Currency, BillingCycle, CouponType, Country }; 