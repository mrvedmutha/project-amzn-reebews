import mongoose, { Model, Document } from "mongoose";
import CouponSchema from "../../schemas/coupon/coupon.schema";
import { ICoupon } from "@/types/coupon.types";

export interface ICouponDocument extends Omit<ICoupon, "id">, Document {}

const Coupon: Model<ICouponDocument> =
  mongoose.models.Coupon ||
  mongoose.model<ICouponDocument>("Coupon", CouponSchema);

export default Coupon;
