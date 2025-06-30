import { Schema } from "mongoose";
import { CouponType } from "@/enums/coupon.enum";

export const CouponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 32,
    },
    type: {
      type: String,
      enum: Object.values(CouponType),
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      required: false,
      min: 0,
    },
    minOrderAmount: {
      type: Number,
      required: false,
      min: 0,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
    usageLimit: {
      type: Number,
      required: false,
      min: 1,
    },
    usedCount: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    affiliate: {
      type: String,
      required: false,
      trim: true,
      maxlength: 64,
    },
  },
  { timestamps: true }
);
