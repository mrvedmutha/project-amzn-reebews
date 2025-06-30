import mongoose from "mongoose";
import { PlanSchema } from "@/schemas/plan/plan.schema";

/**
 * Plan model for subscription plan management
 * Handles plan definitions, features, and pricing
 */
export const PlanModel =
  mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
