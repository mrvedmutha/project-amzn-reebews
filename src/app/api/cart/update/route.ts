import { NextRequest, NextResponse } from "next/server";
import { CartModel } from "@/models/cart/cart.model";

export async function PATCH(req: NextRequest) {
  try {
    const { cartId, paymentId, currency, status } = await req.json();

    // Fetch cart to get planDetails
    const cartDoc = await CartModel.findById(cartId);
    if (!cartDoc) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const now = new Date();
    const billingCycle = cartDoc.planDetails.billingCycle;
    const expiryDate =
      billingCycle === "yearly"
        ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
        : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const cart = await CartModel.findByIdAndUpdate(
      cartId,
      {
        status,
        paymentId,
        currency,
        purchaseDate: now,
        expiryDate,
      },
      { new: true }
    );

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}
