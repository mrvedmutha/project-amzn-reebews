import { Schema } from "mongoose";
import { IPlan } from "@/types/plan/plan.types";
import { Plan } from "@/enums/checkout.enum";

export const PlanSchema = new Schema<IPlan>(
  {
    planId: {
      type: Number,
      required: true,
      unique: true,
      min: 0,
      max: 3,
      index: true,
    },
    name: {
      type: String,
      required: true,
      enum: Object.values(Plan),
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    pricing: {
      monthly: {
        USD: {
          type: Number,
          required: true,
          min: 0,
        },
        INR: {
          type: Number,
          required: true,
          min: 0,
        },
      },
      yearly: {
        USD: {
          type: Number,
          required: true,
          min: 0,
        },
        INR: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    },
    features: {
      numberOfProducts: {
        type: Number,
        required: true,
        min: 0,
      },
      numberOfCampaigns: {
        type: Number,
        required: true,
        min: 0,
      },
      numberOfPromotions: {
        type: Number,
        required: true,
        min: 0,
      },
      marketplaces: {
        type: Number,
        required: true,
        min: 1,
      },
      monthlyReviews: {
        type: Schema.Types.Mixed, // Can be number or "unlimited"
        required: true,
        validate: {
          validator: function (value: any) {
            return (
              (typeof value === "number" && value >= 0) || value === "unlimited"
            );
          },
          message:
            'Monthly reviews must be a non-negative number or "unlimited"',
        },
      },
      additionalReviewsCost: {
        type: Boolean,
        required: true,
        default: true,
      },
      additionalProductsCost: {
        additionalReviews: {
          USD: {
            type: Number,
            required: true,
            min: 0,
          },
          INR: {
            type: Number,
            required: true,
            min: 0,
          },
        },
        additionalProducts: {
          USD: {
            type: Number,
            required: true,
            min: 0,
          },
          INR: {
            type: Number,
            required: true,
            min: 0,
          },
        },
      },
      whiteLabel: {
        type: Boolean,
        required: true,
        default: false,
      },
      customDomain: {
        type: Boolean,
        required: true,
        default: false,
      },
      emailSupport: {
        type: Boolean,
        required: true,
        default: true,
      },
      prioritySupport: {
        type: Boolean,
        required: true,
        default: false,
      },
      dedicatedAccountManager: {
        type: Boolean,
        required: true,
        default: false,
      },
      analyticsDashboard: {
        type: String,
        required: true,
        enum: ["basic", "advanced"],
        default: "basic",
      },
      reviewFiltering: {
        type: Boolean,
        required: true,
        default: true,
      },
      customerSegmentation: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create additional compound indexes
PlanSchema.index({ isActive: 1, sortOrder: 1 }); // Compound index for active plans sorted
