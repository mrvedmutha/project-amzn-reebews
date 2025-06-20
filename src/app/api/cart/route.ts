import { NextRequest, NextResponse } from "next/server";
import { cartPublicService } from "@/services/cart/cart-public.services";

/**
 * GET /api/cart?signup={signuptoken}
 * Get cart details by signup token for external access (admin.reebews.com)
 * Requires REEBEWS_MAIN_API key in Authorization header
 */
export async function GET(req: NextRequest) {
  try {
    // Validate Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing or invalid authorization header",
          error: "Authorization Bearer token is required",
        },
        { status: 401 }
      );
    }

    const providedApiKey = authHeader.replace("Bearer ", "");
    const expectedApiKey = process.env.REEBEWS_MAIN_API;

    if (!expectedApiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error",
          error: "REEBEWS_MAIN_API not configured",
        },
        { status: 500 }
      );
    }

    if (providedApiKey !== expectedApiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid API key",
          error: "Unauthorized access",
        },
        { status: 401 }
      );
    }

    // Get signup token from query parameters
    const { searchParams } = new URL(req.url);
    const signupToken = searchParams.get("signup");

    if (!signupToken || typeof signupToken !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Missing signup token",
          error: "signup query parameter is required",
        },
        { status: 400 }
      );
    }

    // Get cart details by signup token
    const cart = await cartPublicService.getCartBySignupToken(signupToken);

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart not found",
          error: "No completed cart found with the provided signup token",
        },
        { status: 404 }
      );
    }

    // Return cart details
    return NextResponse.json(
      {
        success: true,
        message: "Cart details retrieved successfully",
        data: cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in cart API:", error);

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
