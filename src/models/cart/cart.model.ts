import mongoose from "mongoose";
import { ICart } from "@/types/cart/cart.types";
import { CartSchema } from "@/schemas/cart/cart.schema";

/**
 * Cart model for checkout management
 * Handles cart data with user details, subscription reference, and payment information
 */
export const CartModel =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
