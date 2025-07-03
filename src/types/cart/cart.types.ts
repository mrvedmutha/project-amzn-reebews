import { Types } from "mongoose";
import {
  PaymentGateway,
  PaymentMethod,
  PaymentStatus,
  Currency,
  Plan,
  BillingCycle,
} from "@/enums/checkout.enum";
import { IPlan } from "@/types/plan/plan.types";
import { ICoupon } from "@/types/coupon.types";

/**
 * User address interface
 */
export interface ICartUserAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

/**
 * User business details interface
 */
export interface ICartUserBusiness {
  company?: string;
  gstin?: string;
}

/**
 * User details interface
 */
export interface ICartUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: ICartUserAddress;
  business?: ICartUserBusiness;
}

/**
 * Payment details interface
 */
export interface ICartPayment {
  id: string; // order/invoice ID
  method: PaymentGateway; // razorpay, paypal
  paymentMethod?: PaymentMethod; // card, upi, etc.
  transactionId?: string; // from payment gateway
  totalAmount: number;
  currency: Currency;
  status: PaymentStatus;
}

/**
 * Subscription details embedded in cart
 */
export interface ICartSubscription {
  plan: Types.ObjectId | IPlan; // Reference to Plan
  planAmount: number; // Base plan price at checkout
  planCurrency: Currency; // Currency of the plan price
  isActive: boolean;
  startDate?: Date;
  endDate?: Date | null; // null for free plans that never expire
}

/**
 * Cart interface for checkout management
 */
export interface ICart {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
  user: ICartUser;
  subscription: ICartSubscription; // Embedded subscription data
  billingCycle: BillingCycle;
  payment: ICartPayment;
  coupon?: Types.ObjectId | ICoupon;
  discountAmount?: number;
  signupToken?: string;
  tokenExpiry?: Date;
  isSignupCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Legacy type aliases for backward compatibility
 * @deprecated Use ICartUserAddress instead
 */
export type CartUserAddress = ICartUserAddress;

/**
 * Legacy type alias for backward compatibility
 * @deprecated Use ICartUser instead
 */
export type CartUserDetails = ICartUser;
export interface CartPlanDetails {
  plan: string;
  amount: number;
  currency: Currency;
}

/**
 * @deprecated Use ICart instead
 */
export interface Cart extends ICart {
  userDetails: CartUserDetails;
  planDetails: CartPlanDetails;
  paymentGateway: PaymentGateway;
  paymentId?: string;
  finalAmount: number;
  currency: Currency;
  purchaseDate?: Date;
  expiryDate?: Date;
  status: PaymentStatus;
  tokenExpiresAt?: Date;
}
