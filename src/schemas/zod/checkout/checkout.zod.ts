import { z } from "zod";
import { PaymentMethod, Plan, Currency, BillingCycle, CouponType, Country } from "@/enums/checkout.enum";

/**
 * Checkout form validation schema
 */
export const CheckoutFormZod = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  companyName: z.string().optional(),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  postalCode: z.string().min(3, { message: "Postal code must be at least 3 characters" }),
  country: z.nativeEnum(Country, { message: "Please select a valid country" }),
  gstNumber: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod, { message: "Please select a valid payment method" }),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  cvc: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

/**
 * Plan details schema
 */
export const PlanDetailsZod = z.object({
  name: z.string(),
  price: z.object({
    USD: z.number().min(0),
    INR: z.number().min(0),
  }),
  description: z.string(),
  features: z.array(z.string()),
  upgrades: z.array(z.nativeEnum(Plan)).optional(),
  downgrades: z.array(z.nativeEnum(Plan)).optional(),
  billingCycle: z.nativeEnum(BillingCycle),
});

/**
 * Coupon details schema
 */
export const CouponDetailsZod = z.object({
  code: z.string().min(1, { message: "Coupon code is required" }),
  discountValue: z.number().min(0, { message: "Discount value must be positive" }),
  type: z.nativeEnum(CouponType),
  description: z.string(),
});

/**
 * Coupon application schema
 */
export const CouponApplicationZod = z.object({
  code: z.string().min(1, { message: "Please enter a coupon code" }),
});

/**
 * Plan selection schema
 */
export const PlanSelectionZod = z.object({
  plan: z.nativeEnum(Plan),
  billingCycle: z.nativeEnum(BillingCycle),
  currency: z.nativeEnum(Currency),
});

/**
 * Payment processing schema
 */
export const PaymentProcessingZod = z.object({
  plan: z.nativeEnum(Plan),
  billingCycle: z.nativeEnum(BillingCycle),
  currency: z.nativeEnum(Currency),
  totalAmount: z.number().min(0),
  discountAmount: z.number().min(0).optional(),
  couponCode: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

// Type inference exports
export type CheckoutFormType = z.infer<typeof CheckoutFormZod>;
export type PlanDetailsType = z.infer<typeof PlanDetailsZod>;
export type CouponDetailsType = z.infer<typeof CouponDetailsZod>;
export type CouponApplicationType = z.infer<typeof CouponApplicationZod>;
export type PlanSelectionType = z.infer<typeof PlanSelectionZod>;
export type PaymentProcessingType = z.infer<typeof PaymentProcessingZod>; 