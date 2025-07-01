import { Currency } from "@/enums/checkout.enum";

export interface IPlanPricing {
  monthly: Record<Currency.USD | Currency.INR, number>;
  yearly: Record<Currency.USD | Currency.INR, number>;
}

export interface IPlanFeatures {
  numberOfProducts: number;
  numberOfCampaigns: number;
  numberOfPromotions: number;
  marketplaces: number;
  monthlyReviews: number | "unlimited";
  additionalReviewsCost: boolean;
  additionalProductsCost: {
    additionalReviews: Record<Currency.USD | Currency.INR, number>;
    additionalProducts: Record<Currency.USD | Currency.INR, number>;
  };
  whiteLabel: boolean;
  customDomain: boolean;
  emailSupport: boolean;
  prioritySupport: boolean;
  dedicatedAccountManager: boolean;
  analyticsDashboard: "basic" | "advanced";
  reviewFiltering: boolean;
  customerSegmentation: boolean;
}

export interface IPlan {
  _id?: string;
  planId: number;
  name: string;
  displayName: string;
  description: string;
  pricing: IPlanPricing;
  features: IPlanFeatures;
  isActive: boolean;
  sortOrder: number;
}
