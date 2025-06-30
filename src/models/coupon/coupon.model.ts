import mongoose from "mongoose";
import { ICoupon } from "@/types/coupon/coupon.types";
import { CouponSchema } from "@/schemas/coupon/coupon.schema";

export const CouponModel =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
