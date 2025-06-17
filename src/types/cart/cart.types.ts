import { Types } from "mongoose";
import { UserPlan } from "@/enums/users/user-plan.enum";

export interface CartUserAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface CartUserDetails {
  name: string;
  email: string;
  address: CartUserAddress;
  company?: string;
  gstNumber?: string;
}

export interface CartPlanDetails {
  plan: UserPlan;
  amount: number;
  currency: "USD" | "INR";
}

export interface Cart {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
  userDetails: CartUserDetails;
  planDetails: CartPlanDetails;
  paymentGateway: "razorpay" | "paypal";
  couponCode?: string;
  discountAmount?: number;
  finalAmount: number;
  status: "pending" | "completed" | "cancelled";
  signupToken?: string;
  tokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
