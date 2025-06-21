import { NextResponse } from "next/server";
import { cartPublicService } from "@/services/cart/cart-public.services";
import { EmailService } from "@/lib/email/email.service";
import {
  Plan,
  BillingCycle,
  Currency,
  PaymentGateway,
} from "@/enums/checkout.enum";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      plan,
      currency,
      amount,
      userDetails,
      paymentGateway,
      billingCycle,
      userId,
    } = body;

    // Validate required fields
    if (!userDetails?.name || !userDetails?.email || !userDetails?.address) {
      return NextResponse.json(
        { error: "Missing required user details" },
        { status: 400 }
      );
    }

    // Validate enum values
    if (!Object.values(Plan).includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (!Object.values(PaymentGateway).includes(paymentGateway)) {
      return NextResponse.json(
        { error: "Invalid payment gateway" },
        { status: 400 }
      );
    }

    // Create cart using service
    const result = await cartPublicService.createCart({
      plan: plan as Plan,
      billingCycle: billingCycle || BillingCycle.MONTHLY,
      amount,
      currency: currency as Currency,
      userDetails,
      paymentGateway: paymentGateway as PaymentGateway,
      userId,
    });

    // For free plans, send welcome email immediately since they don't go through payment flow
    if (plan === Plan.FREE || amount === 0) {
      try {
        // Get the created cart with embedded subscription details
        const cartWithSubscription = await cartPublicService.getCartById(
          result.cartId
        );

        if (cartWithSubscription) {
          // Send welcome email with signup link using embedded subscription data
          await EmailService.sendSignupEmail(
            cartWithSubscription.user.email,
            cartWithSubscription.user.name,
            result.signupToken,
            {
              plan: cartWithSubscription.subscription.planName || plan, // Fallback to request plan
              amount: cartWithSubscription.payment.totalAmount,
              currency: cartWithSubscription.payment.currency,
              billingCycle: billingCycle || BillingCycle.MONTHLY, // Use billingCycle from request
            }
          );

          return NextResponse.json({
            ...result,
            message: "Free plan cart created and welcome email sent",
          });
        }
      } catch (error: any) {
        console.error("Error sending welcome email for free plan:", error);
        // Still return success since cart was created successfully
        return NextResponse.json({
          ...result,
          message: "Free plan cart created but welcome email could not be sent",
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to create cart:", error);
    return NextResponse.json(
      { error: "Failed to create cart" },
      { status: 500 }
    );
  }
}
