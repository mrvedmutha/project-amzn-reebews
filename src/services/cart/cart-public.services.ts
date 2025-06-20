import { CartModel } from "@/models/cart/cart.model";
import { Cart } from "@/types/cart/cart.types";
import { dbConnect } from "@/lib/database/db";

export const cartPublicService = {
  /**
   * Get cart details by signup token for external access
   * Only returns completed carts
   */
  async getCartBySignupToken(signupToken: string): Promise<Cart | null> {
    await dbConnect();

    try {
      const cart = (await CartModel.findOne({
        signupToken,
        status: "completed", // Only completed carts
      }).lean()) as Cart | null;

      return cart;
    } catch (error) {
      console.error("Error getting cart by signup token:", error);
      throw new Error("Failed to retrieve cart details");
    }
  },
};
