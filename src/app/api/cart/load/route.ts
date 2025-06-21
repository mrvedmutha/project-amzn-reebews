import { NextRequest, NextResponse } from "next/server";
import { cartPublicService } from "@/services/cart/cart-public.services";
import { PaymentStatus } from "@/enums/checkout.enum";

/**
 * GET /api/cart/load?cartId={cartId}
 * Load an existing cart for checkout resumption
 * Only allows loading of pending/failed carts, not completed ones
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cartId = searchParams.get("cartId");

    if (!cartId || typeof cartId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Missing cart ID",
          error: "cartId query parameter is required",
        },
        { status: 400 }
      );
    }

    // Get cart details by ID
    const cart = await cartPublicService.getCartById(cartId);

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart not found",
          error: "No cart found with the provided ID",
        },
        { status: 404 }
      );
    }

    // Only allow resumption for non-completed carts
    if (cart.payment.status === PaymentStatus.COMPLETED) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart already completed",
          error: "This order has already been completed",
        },
        { status: 400 }
      );
    }

    // Return cart details for resumption
    return NextResponse.json(
      {
        success: true,
        message: "Cart loaded successfully",
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error loading cart:", error);

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
