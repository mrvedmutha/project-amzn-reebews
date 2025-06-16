import { NextResponse } from "next/server";
import { CartModel } from "@/models/cart/cart.model";
import { Plan } from "@/enums/checkout.enum";
import { UserPlan } from "@/enums/users/user-plan.enum";
import { dbConnect } from "@/lib/database/db";

export async function POST(req: Request) {
  try {
    // Connect to database
    await dbConnect();

    const body = await req.json();
    const {
      plan,
      currency,
      amount,
      userDetails,
      paymentGateway,
      billingCycle,
    } = body;

    // Validate required fields
    if (!userDetails?.name || !userDetails?.email || !userDetails?.address) {
      return NextResponse.json(
        { error: "Missing required user details" },
        { status: 400 }
      );
    }

    // Map Plan to UserPlan
    let userPlan: UserPlan;
    if (plan === Plan.FREE) {
      userPlan = UserPlan.FREE;
    } else {
      userPlan = billingCycle === "yearly" ? UserPlan.YEARLY : UserPlan.MONTHLY;
    }

    // Create cart with subscription details
    const cart = await CartModel.create({
      userDetails,
      planDetails: {
        plan: userPlan,
        amount,
        currency,
        billingCycle,
        isSubscription: plan !== Plan.FREE,
      },
      paymentGateway,
      finalAmount: amount,
      status: "pending",
    });

    return NextResponse.json({ cartId: cart._id });
  } catch (error) {
    console.error("Failed to create cart:", error);
    return NextResponse.json(
      { error: "Failed to create cart" },
      { status: 500 }
    );
  }
}
