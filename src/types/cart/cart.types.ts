import { Types } from "mongoose";
import {
  PaymentGateway,
  PaymentMethod,
  PaymentStatus,
  Currency,
  Plan,
  BillingCycle,
} from "@/enums/checkout.enum";

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
  name: string;
  email: string;
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
  planId: number; // 0 = free, 1 = basic, 2 = pro, 3 = enterprise
  planName: Plan;
  billingCycle: BillingCycle;
  amount: number;
  currency: Currency;
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
  payment: ICartPayment;
  couponCode?: string;
  discountAmount?: number;
  signupToken?: string;
  tokenExpiry?: Date;
  isSignupCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Legacy interfaces for backward compatibility
 * @deprecated Use ICartUser instead
 */
export interface CartUserAddress extends ICartUserAddress {}
export interface CartUserDetails extends ICartUser {}
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
