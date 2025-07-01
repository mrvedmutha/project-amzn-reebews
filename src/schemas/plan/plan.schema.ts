import { Schema } from "mongoose";
import { IPlan } from "@/types/plan/plan.types";

export const PlanSchema = new Schema<IPlan>(
  {
    planId: { type: Number, required: true, unique: true },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    displayName: { type: String, required: true },
    description: { type: String, required: true },
    pricing: {
      monthly: {
        USD: { type: Number, required: true },
        INR: { type: Number, required: true },
      },
      yearly: {
        USD: { type: Number, required: true },
        INR: { type: Number, required: true },
      },
    },
    features: {
      numberOfProducts: { type: Number, required: true },
      numberOfCampaigns: { type: Number, required: true },
      numberOfPromotions: { type: Number, required: true },
      marketplaces: { type: Number, required: true },
      monthlyReviews: { type: Schema.Types.Mixed, required: true },
      additionalReviewsCost: { type: Boolean, required: true },
      additionalProductsCost: {
        additionalReviews: {
          USD: { type: Number, required: true },
          INR: { type: Number, required: true },
        },
        additionalProducts: {
          USD: { type: Number, required: true },
          INR: { type: Number, required: true },
        },
      },
      whiteLabel: { type: Boolean, required: true },
      customDomain: { type: Boolean, required: true },
      emailSupport: { type: Boolean, required: true },
      prioritySupport: { type: Boolean, required: true },
      dedicatedAccountManager: { type: Boolean, required: true },
      analyticsDashboard: {
        type: String,
        enum: ["basic", "advanced"],
        required: true,
      },
      reviewFiltering: { type: Boolean, required: true },
      customerSegmentation: { type: Boolean, required: true },
    },
    isActive: { type: Boolean, required: true },
    sortOrder: { type: Number, required: true },
    yearlyDiscountPercent: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);
