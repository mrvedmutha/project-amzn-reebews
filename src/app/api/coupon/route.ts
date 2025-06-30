import { NextRequest, NextResponse } from "next/server";
import { CouponModel } from "@/models/coupon/coupon.model";
import { CouponCreateZod } from "@/schemas/zod/coupon/coupon.zod";
import { dbConnect } from "@/lib/database/db";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const parsed = CouponCreateZod.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }
    const coupon = await CouponModel.create(parsed.data);
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.json(
      { error: "Coupon code required" },
      { status: 400 }
    );
  }
  const coupon = await CouponModel.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });
  if (!coupon) {
    return NextResponse.json(
      { valid: false, reason: "Invalid or expired coupon" },
      { status: 404 }
    );
  }
  // Optionally check expiry, usage, etc.
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json(
      { valid: false, reason: "Coupon expired" },
      { status: 410 }
    );
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json(
      { valid: false, reason: "Coupon usage limit reached" },
      { status: 410 }
    );
  }
  return NextResponse.json({ valid: true, coupon });
}
