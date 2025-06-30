import { z } from "zod";
import { Plan } from "@/enums/checkout.enum";

/**
 * Pricing schema for different currencies
 */
export const PlanPricingZod = z.object({
  USD: z.number().min(0),
  INR: z.number().min(0),
});

/**
 * Additional costs schema
 */
export const PlanAdditionalCostsZod = z.object({
  additionalReviews: PlanPricingZod,
  additionalProducts: PlanPricingZod,
});

/**
 * Plan features validation schema
 */
export const PlanFeaturesZod = z.object({
  numberOfProducts: z.number().min(0),
  numberOfCampaigns: z.number().min(0),
  numberOfPromotions: z.number().min(0),
  marketplaces: z.number().min(1),
  monthlyReviews: z.union([z.number().min(0), z.literal("unlimited")]),
  additionalReviewsCost: z.boolean(),
  additionalProductsCost: PlanAdditionalCostsZod,
  whiteLabel: z.boolean(),
  customDomain: z.boolean(),
  emailSupport: z.boolean(),
  prioritySupport: z.boolean(),
  dedicatedAccountManager: z.boolean(),
  analyticsDashboard: z.enum(["basic", "advanced"]),
  reviewFiltering: z.boolean(),
  customerSegmentation: z.boolean(),
});

/**
 * Plan creation validation schema
 */
export const PlanCreateZod = z.object({
  planId: z.number().min(0).max(3),
  name: z.nativeEnum(Plan),
  displayName: z.string().min(1).max(100).trim(),
  description: z.string().min(1).max(500).trim(),
  pricing: z.object({
    monthly: PlanPricingZod,
    yearly: PlanPricingZod,
  }),
  yearlyDiscountPercent: z.number().min(0).max(100).default(0),
  features: PlanFeaturesZod,
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

/**
 * Plan update validation schema (partial)
 */
export const PlanUpdateZod = PlanCreateZod.omit({ planId: true }).partial();

/**
 * Plan query validation schema
 */
export const PlanQueryZod = z.object({
  planId: z.number().min(0).max(3).optional(),
  name: z.nativeEnum(Plan).optional(),
  isActive: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(25),
  skip: z.number().min(0).default(0),
});

// Type inference
export type PlanCreateType = z.infer<typeof PlanCreateZod>;
export type PlanUpdateType = z.infer<typeof PlanUpdateZod>;
export type PlanQueryType = z.infer<typeof PlanQueryZod>;
