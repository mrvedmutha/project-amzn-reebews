import { CouponType } from "@/enums/coupon.enum";

export interface ICoupon {
  _id?: string;
  code: string;
  type: CouponType;
  value: number;
  maxDiscount?: number;
  minOrderAmount?: number;
  expiresAt?: Date;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
  affiliate?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
