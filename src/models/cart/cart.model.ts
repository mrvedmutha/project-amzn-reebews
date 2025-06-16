import { model, models } from "mongoose";
import { Cart } from "@/types/cart/cart.types";
import { CartSchema } from "@/schemas/cart/cart.schema";

export const CartModel = models.Cart || model<Cart>("Cart", CartSchema);
