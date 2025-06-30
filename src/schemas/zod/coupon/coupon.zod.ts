import { z } from "zod";
import { CouponType } from "@/enums/coupon.enum";

export const CouponCreateZod = z.object({
  code: z.string().min(3).max(32).toUpperCase(),
  type: z.nativeEnum(CouponType),
  value: z.number().min(0),
  maxDiscount: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).optional(),
  expiresAt: z.date().optional(),
  usageLimit: z.number().min(1).optional(),
  affiliate: z.string().max(64).optional(),
  isActive: z.boolean().optional(),
});

// Coupon code validator for frontend (async)
export const CouponCodeZod = z
  .string()
  .optional()
  .refine(
    async (code) => {
      if (!code) return true;
      // Simulate async API call to validate coupon
      const res = await fetch(`/api/coupon?code=${code}`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.valid;
    },
    {
      message: "This coupon is invalid or expired.",
    }
  );
