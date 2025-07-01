import { NextRequest, NextResponse } from "next/server";
import { couponService } from "@/services/coupon/coupon.service";
import { CouponType } from "@/enums/checkout.enum";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { code } = data;

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    const coupon = await couponService.getCouponByCode(code);

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    // Check if coupon is within valid date range
    const currentDate = new Date();
    if (currentDate < coupon.startDate || currentDate > coupon.endDate) {
      console.error("Coupon date validation failed:", {
        couponCode: coupon.code,
        currentDate,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
      });
      return NextResponse.json(
        { error: "Coupon has expired or is not yet active" },
        { status: 400 }
      );
    }

    // Check if coupon has usage limit and if it's been reached
    if (coupon.isLimit && coupon.limit !== undefined && coupon.limit <= 0) {
      return NextResponse.json(
        { error: "Coupon usage limit has been reached" },
        { status: 400 }
      );
    }

    // Return coupon details in a format compatible with the frontend
    return NextResponse.json({
      coupon: {
        code: coupon.code,
        discountValue: coupon.value,
        type: CouponType.PERCENTAGE, // Assuming all coupons are percentage-based for now
        description: coupon.description,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
