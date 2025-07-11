import { dbConnect } from "@/lib/database/db";
import { PlanModel } from "@/models/plan/plan.model";
import { IPlan } from "@/types/plan/plan.types";

/**
 * Service for handling plan-related database operations.
 */
export const PlanService = {
  /**
   * Retrieves all subscription plans from the database.
   * @returns A promise that resolves to an array of all plans.
   */
  async getAllPlans(): Promise<IPlan[]> {
    try {
      await dbConnect();
      const plans = await PlanModel.find({}).sort({ sortOrder: "asc" }).lean();
      return plans as IPlan[];
    } catch (error) {
      console.error("Error fetching all plans:", error);
      throw new Error("Could not retrieve plans.");
    }
  },

  /**
   * Retrieves all active subscription plans from the database.
   * @returns A promise that resolves to an array of active plans.
   */
  async getActivePlans(): Promise<IPlan[]> {
    try {
      await dbConnect();
      const activePlans = await PlanModel.find({ isActive: true })
        .sort({ sortOrder: "asc" })
        .lean();
      return activePlans as IPlan[];
    } catch (error) {
      console.error("Error fetching active plans:", error);
      throw new Error("Could not retrieve active plans.");
    }
  },

  /**
   * Creates a new subscription plan in the database.
   * @param planData - The data for the new plan to create.
   * @returns A promise that resolves to the newly created plan.
   */
  async createPlan(planData: Omit<IPlan, "_id">): Promise<IPlan> {
    try {
      await dbConnect();
      const newPlan = await PlanModel.create(planData);
      return newPlan.toObject() as IPlan;
    } catch (error) {
      console.error("Error creating plan:", error);
      throw new Error("Could not create plan.");
    }
  },

  /**
   * Retrieves a subscription plan by its ID from the database.
   * @param id - The ID of the plan to retrieve.
   * @returns A promise that resolves to the plan, or null if not found.
   */
  async getPlanById(id: string): Promise<IPlan | null> {
    try {
      await dbConnect();
      const plan = await PlanModel.findById(id).lean();
      return plan as IPlan | null;
    } catch (error) {
      console.error("Error fetching plan by ID:", error);
      throw new Error("Could not retrieve plan by ID.");
    }
  },
};
