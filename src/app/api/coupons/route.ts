import { NextRequest, NextResponse } from "next/server";
import { couponService } from "@/lib/services/coupon.service";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const coupon = await couponService.createCoupon(data);
    return NextResponse.json({ coupon });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }
    const coupon = await couponService.getCouponByCode(code);
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ coupon });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
