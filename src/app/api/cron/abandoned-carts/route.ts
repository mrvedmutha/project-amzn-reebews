import { NextResponse } from "next/server";
import { CartModel } from "@/models/cart/cart.model";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    // Find carts that have been pending for more than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const abandonedCarts = await CartModel.find({
      status: "pending",
      createdAt: { $lt: oneHourAgo },
    });

    // Send reminder emails
    for (const cart of abandonedCarts) {
      await resend.emails.send({
        from: "ReeBews <noreply@reebews.com>",
        to: cart.userDetails.email,
        subject: "Complete Your ReeBews Purchase",
        html: `
          <div>
            <h1>Hi ${cart.userDetails.name},</h1>
            <p>We noticed you started a purchase for the ${cart.planDetails.plan} plan but didn't complete it.</p>
            <p>Your cart is still waiting for you! Click the link below to complete your purchase:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/checkout?cartId=${cart._id}">
              Complete Your Purchase
            </a>
            <p>This link will expire in 24 hours.</p>
            <p>Best regards,<br>The ReeBews Team</p>
          </div>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${abandonedCarts.length} reminder emails`,
    });
  } catch (error) {
    console.error("Error processing abandoned carts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process abandoned carts" },
      { status: 500 }
    );
  }
}
