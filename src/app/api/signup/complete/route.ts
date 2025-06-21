import { NextRequest, NextResponse } from "next/server";
import { cartPublicService } from "@/services/cart/cart-public.services";
import { validateApiKey } from "@/lib/auth/api-auth";

/**
 * PATCH /api/signup/complete
 * Complete the signup process and mark isSignupCompleted as true
 * Requires REEBEWS_API_KEY in Authorization header for external access
 */
export async function PATCH(req: NextRequest) {
  try {
    // Validate API key for external access
    const authError = validateApiKey(req);
    if (authError) {
      return authError;
    }

    const body = await req.json();
    const { signupToken } = body;

    if (!signupToken || typeof signupToken !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Missing signup token",
          error: "signupToken is required in request body",
        },
        { status: 400 }
      );
    }

    // Complete the signup using the service
    const updatedCart = await cartPublicService.completeSignup(signupToken);

    if (!updatedCart) {
      return NextResponse.json(
        {
          success: false,
          message: "Signup completion failed",
          error: "No cart found with the provided signup token or signup already completed",
        },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Signup completed successfully",
        cart: {
          _id: updatedCart._id,
          signupToken: updatedCart.signupToken,
          isSignupCompleted: updatedCart.isSignupCompleted,
          user: {
            name: updatedCart.user.name,
            email: updatedCart.user.email,
          },
          subscription: {
            planName: updatedCart.subscription.planName,
            amount: updatedCart.subscription.amount,
            currency: updatedCart.subscription.currency,
          },
          updatedAt: updatedCart.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error completing signup:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
