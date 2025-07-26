import { z } from "zod";
import {
  PaymentMethod,
  Plan,
  Currency,
  BillingCycle,
  CouponType,
  Country,
  IndianState,
  USState,
  CanadianProvince,
} from "@/enums/checkout.enum";
import { validatePostalCode, getPostalCodeConfig, requiresState } from "@/lib/validation/postal-code-validation";

/**
 * Address validation schema with dynamic postal code validation
 */
export const AddressZod = z.object({
  street: z
    .string()
    .min(5, { message: "Street address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().optional(),
  country: z.nativeEnum(Country, { message: "Please select a valid country" }),
  pincode: z.string().min(1, { message: "Postal code is required" }),
}).refine((data) => {
  // Validate postal code
  if (!validatePostalCode(data.pincode, data.country)) {
    return false;
  }
  // Validate state is provided for countries that require it
  if (requiresState(data.country) && (!data.state || data.state.length < 2)) {
    return false;
  }
  return true;
}, (data) => {
  // Check which validation failed and return appropriate error
  if (!validatePostalCode(data.pincode, data.country)) {
    return {
      message: "Please enter a valid postal code for the selected country",
      path: ["pincode"],
    };
  }
  if (requiresState(data.country) && (!data.state || data.state.length < 2)) {
    return {
      message: "State/Province is required for the selected country",
      path: ["state"],
    };
  }
  return {
    message: "Please check your address details",
    path: ["country"],
  };
});

/**
 * Creates address schema with country-specific postal code validation
 */
export const createAddressZodWithCountry = (country: Country) => {
  const config = getPostalCodeConfig(country);
  const needsState = requiresState(country);
  
  return z.object({
    street: z
      .string()
      .min(5, { message: "Street address must be at least 5 characters" }),
    city: z.string().min(2, { message: "City must be at least 2 characters" }),
    state: needsState 
      ? z.string().min(2, { message: "State/Province is required" })
      : z.string().optional(),
    country: z.nativeEnum(Country, { message: "Please select a valid country" }),
    pincode: z
      .string()
      .min(1, { message: `${config.label} is required` })
      .refine((value) => validatePostalCode(value, country), {
        message: config.errorMessage,
      }),
  });
};

/**
 * Checkout form validation schema
 */
export const CheckoutFormZod = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  companyName: z.string().optional(),
  address: AddressZod,
  gstNumber: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    message: "Please select a valid payment method",
  }),
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
  discountValue: z
    .number()
    .min(0, { message: "Discount value must be positive" }),
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
export type AddressType = z.infer<typeof AddressZod>;
export type CheckoutFormType = z.infer<typeof CheckoutFormZod>;
export type PlanDetailsType = z.infer<typeof PlanDetailsZod>;
export type CouponDetailsType = z.infer<typeof CouponDetailsZod>;
export type CouponApplicationType = z.infer<typeof CouponApplicationZod>;
export type PlanSelectionType = z.infer<typeof PlanSelectionZod>;
export type PaymentProcessingType = z.infer<typeof PaymentProcessingZod>;
