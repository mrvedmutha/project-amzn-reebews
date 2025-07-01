import mongoose from "mongoose";
import { IPlan } from "@/types/plan/plan.types";
import { PlanSchema } from "@/schemas/plan/plan.schema";

/**
 * Plan model for managing subscription plans.
 *
 * @remarks
 * This model defines the structure of subscription plans, including pricing,
 * features, and other metadata. It uses the {@link PlanSchema} to enforce
 * data consistency and validation.
 *
 * @example
 * Fetching all active plans:
 * ```ts
 * const activePlans = await PlanModel.find({ isActive: true }).sort({ sortOrder: 1 });
 * ```
 */
export const PlanModel =
  (mongoose.models.Plan as mongoose.Model<IPlan>) ||
  mongoose.model<IPlan>("Plan", PlanSchema);
