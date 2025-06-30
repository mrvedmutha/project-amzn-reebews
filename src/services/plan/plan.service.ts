import { PlanModel } from "@/models/plan/plan.model";
import { PlanCreateZod, PlanUpdateZod } from "@/schemas/zod/plan/plan.zod";
import type { IPlan, IPlanCreate, IPlanUpdate } from "@/types/plan/plan.types";
import { Plan } from "@/enums/checkout.enum";
import { dbConnect } from "@/lib/database/db";

export const planService = {
  /**
   * Create a new plan
   */
  async create(data: IPlanCreate): Promise<IPlan> {
    await dbConnect();

    // Validate input using Zod schema
    const parsed = PlanCreateZod.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        parsed.error.errors.map((e: any) => e.message).join(", ")
      );
    }

    // Check if plan with same planId or name already exists
    const existingPlan = await PlanModel.findOne({
      $or: [{ planId: data.planId }, { name: data.name }],
    });

    if (existingPlan) {
      throw new Error("Plan with this ID or name already exists");
    }

    // Save to database
    const plan = new PlanModel(parsed.data);
    await plan.save();
    return plan.toObject();
  },

  /**
   * Get all plans with pagination and filtering
   */
  async getAll(
    limit = 25,
    skip = 0,
    filters: {
      isActive?: boolean;
      name?: Plan;
    } = {}
  ): Promise<IPlan[]> {
    await dbConnect();

    let query: any = {};

    // Apply filters
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.name) {
      query.name = filters.name;
    }

    const plans = await PlanModel.find(query)
      .sort({ sortOrder: 1, planId: 1 }) // Sort by sortOrder then planId
      .skip(skip)
      .limit(limit)
      .lean();
    return plans as unknown as IPlan[];
  },

  /**
   * Get plan by ID
   */
  async getById(id: string): Promise<IPlan | null> {
    await dbConnect();
    const plan = await PlanModel.findById(id).lean();
    return plan ? (plan as unknown as IPlan) : null;
  },

  /**
   * Get plan by planId (0, 1, 2, 3)
   */
  async getByPlanId(planId: number): Promise<IPlan | null> {
    await dbConnect();
    const plan = await PlanModel.findOne({ planId }).lean();
    return plan ? (plan as unknown as IPlan) : null;
  },

  /**
   * Get plan by name (free, basic, pro, enterprise)
   */
  async getByName(name: Plan): Promise<IPlan | null> {
    await dbConnect();
    const plan = await PlanModel.findOne({ name }).lean();
    return plan ? (plan as unknown as IPlan) : null;
  },

  /**
   * Get all active plans for public display
   */
  async getActivePlans(): Promise<IPlan[]> {
    await dbConnect();
    const plans = await PlanModel.find({ isActive: true })
      .sort({ sortOrder: 1, planId: 1 })
      .lean();
    return plans as unknown as IPlan[];
  },

  /**
   * Update plan by ID
   */
  async updateById(id: string, data: IPlanUpdate): Promise<IPlan | null> {
    await dbConnect();

    // Use partial validation for updates
    const parsed = PlanUpdateZod.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        parsed.error.errors.map((e: any) => e.message).join(", ")
      );
    }

    // Check if updating name conflicts with existing plan
    if (data.name) {
      const existingPlan = await PlanModel.findOne({
        name: data.name,
        _id: { $ne: id },
      });

      if (existingPlan) {
        throw new Error("Plan with this name already exists");
      }
    }

    const updated = await PlanModel.findByIdAndUpdate(id, parsed.data, {
      new: true,
    }).lean();
    return updated ? (updated as unknown as IPlan) : null;
  },

  /**
   * Update plan by planId
   */
  async updateByPlanId(
    planId: number,
    data: IPlanUpdate
  ): Promise<IPlan | null> {
    await dbConnect();

    const parsed = PlanUpdateZod.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        parsed.error.errors.map((e: any) => e.message).join(", ")
      );
    }

    const updated = await PlanModel.findOneAndUpdate({ planId }, parsed.data, {
      new: true,
    }).lean();
    return updated ? (updated as unknown as IPlan) : null;
  },

  /**
   * Delete plan by ID
   */
  async deleteById(id: string): Promise<void> {
    await dbConnect();
    await PlanModel.findByIdAndDelete(id);
  },

  /**
   * Soft delete plan (mark as inactive)
   */
  async deactivateById(id: string): Promise<IPlan | null> {
    await dbConnect();
    const updated = await PlanModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).lean();
    return updated ? (updated as unknown as IPlan) : null;
  },

  /**
   * Activate plan
   */
  async activateById(id: string): Promise<IPlan | null> {
    await dbConnect();
    const updated = await PlanModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).lean();
    return updated ? (updated as unknown as IPlan) : null;
  },

  /**
   * Get plan count
   */
  async getCount(filters: { isActive?: boolean } = {}): Promise<number> {
    await dbConnect();

    let query: any = {};
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    return await PlanModel.countDocuments(query);
  },
};
