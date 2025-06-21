import { NextRequest, NextResponse } from "next/server";
import { cartPublicService } from "@/services/cart/cart-public.services";
import { validateApiKey } from "@/lib/auth/api-auth";

/**
 * GET /api/signup?token={signuptoken}
 * Check signup status and return cart details if signup is not completed
 * Requires REEBEWS_API_KEY in Authorization header for external access
 */
export async function GET(req: NextRequest) {
  try {
    // Validate API key for external access
    const authError = validateApiKey(req);
    if (authError) {
      return authError;
    }

    const { searchParams } = new URL(req.url);
    const signupToken = searchParams.get("token");

    if (!signupToken || typeof signupToken !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Missing signup token",
          error: "token query parameter is required",
        },
        { status: 400 }
      );
    }

    // Use the new method that gets any cart (not just completed ones)
    const cart = await cartPublicService.getCartBySignupTokenForSignup(signupToken);

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid signup token",
          error: "No cart found with the provided signup token",
        },
        { status: 404 }
      );
    }

    // Check if token has expired
    if (cart.tokenExpiry && new Date() > cart.tokenExpiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Signup token expired",
          error: "The signup token has expired. Please generate a new one.",
        },
        { status: 401 }
      );
    }

    // Check if signup is already completed
    if (cart.isSignupCompleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Signup already completed",
          error: "This signup has already been completed",
        },
        { status: 400 }
      );
    }

    // Return cart details since signup is not completed
    return NextResponse.json(
      {
        success: true,
        message: "Cart details retrieved successfully",
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking signup status:", error);

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
