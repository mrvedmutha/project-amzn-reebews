import Coupon from "../models/coupon.model";
import { ICoupon } from "@/types/coupon.types";

class CouponService {
  async createCoupon(data: Partial<ICoupon>) {
    return await Coupon.create(data);
  }

  async getCouponByCode(code: string) {
    return await Coupon.findOne({ code });
  }
}

export const couponService = new CouponService();
