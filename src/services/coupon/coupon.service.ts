import Coupon from "../../models/coupon/coupon.model";
import { ICoupon } from "@/types/coupon.types";
import { dbConnect } from "@/lib/database/db";

class CouponService {
  async createCoupon(data: Partial<ICoupon>) {
    await dbConnect();
    return await Coupon.create(data);
  }

  async getCouponByCode(code: string) {
    await dbConnect();
    return await Coupon.findOne({ code });
  }

  async validateCoupon(code: string) {
    await dbConnect();
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return { isValid: false, error: "Invalid coupon code" };
    }

    // Check if coupon is within valid date range
    const currentDate = new Date();
    if (currentDate < coupon.startDate || currentDate > coupon.endDate) {
      return {
        isValid: false,
        error: "Coupon has expired or is not yet active",
      };
    }

    // Check if coupon has usage limit and if it's been reached
    if (coupon.isLimit && coupon.limit !== undefined && coupon.limit <= 0) {
      return { isValid: false, error: "Coupon usage limit has been reached" };
    }

    return { isValid: true, coupon };
  }

  async applyCoupon(code: string) {
    await dbConnect();
    const validation = await this.validateCoupon(code);

    if (!validation.isValid || !validation.coupon) {
      return validation;
    }

    const coupon = validation.coupon;

    // If the coupon has a usage limit, decrease it by 1
    if (coupon.isLimit && coupon.limit !== undefined) {
      coupon.limit -= 1;
      await coupon.save();
    }

    return { isValid: true, coupon };
  }
}

export const couponService = new CouponService();
