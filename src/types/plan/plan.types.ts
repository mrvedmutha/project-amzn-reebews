import { Types } from "mongoose";
import { Plan, BillingCycle, Currency } from "@/enums/checkout.enum";

/**
 * Plan pricing structure for different currencies
 */
export interface IPlanPricing {
  USD: number;
  INR: number;
}

/**
 * Additional costs for plan features
 */
export interface IPlanAdditionalCosts {
  additionalReviews: IPlanPricing; // Cost per additional review
  additionalProducts: IPlanPricing; // Cost per additional product
}

/**
 * Plan features configuration
 */
export interface IPlanFeatures {
  numberOfProducts: number;
  numberOfCampaigns: number;
  numberOfPromotions: number;
  marketplaces: number;
  monthlyReviews: number | "unlimited"; // number or "unlimited"
  additionalReviewsCost: boolean; // false means unlimited reviews included
  additionalProductsCost: IPlanAdditionalCosts;
  whiteLabel: boolean;
  customDomain: boolean;
  emailSupport: boolean;
  prioritySupport: boolean;
  dedicatedAccountManager: boolean;
  analyticsDashboard: "basic" | "advanced";
  reviewFiltering: boolean;
  customerSegmentation: boolean;
}

/**
 * Plan interface for subscription management
 */
export interface IPlan {
  _id: Types.ObjectId;
  planId: number; // 0 = free, 1 = basic, 2 = pro, 3 = enterprise
  name: Plan;
  displayName: string;
  description: string;
  pricing: {
    monthly: IPlanPricing;
    yearly: IPlanPricing;
  };
  features: IPlanFeatures;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
