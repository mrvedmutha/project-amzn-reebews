import { NextResponse } from "next/server";
import { PlanService } from "@/services/plan/plan.service";
import { PlanModel } from "@/models/plan/plan.model";
import { IPlan } from "@/types/plan/plan.types";
import fs from "fs";
import path from "path";

/**
 * @swagger
 * /api/plans/seed:
 *   post:
 *     summary: Seed the database with subscription plans
 *     description: >
 *       Clears existing plans and repopulates the database using the
 *       PlanService and data from a local JSON file.
 *     tags:
 *       - Plans
 *     responses:
 *       200:
 *         description: Plans seeded successfully.
 *       500:
 *         description: Failed to seed plans.
 */
export async function POST() {
  try {
    const filePath = path.join(process.cwd(), "plans-data.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const plansData: IPlan[] = JSON.parse(fileContents);

    // Clear existing plans
    await PlanModel.deleteMany({});
    console.log("Cleared existing plans.");

    // Create new plans using the service
    for (const plan of plansData) {
      await PlanService.createPlan(plan);
    }
    console.log(`Inserted ${plansData.length} new plans using PlanService.`);

    return NextResponse.json({
      message: "Plans seeded successfully using PlanService",
      count: plansData.length,
    });
  } catch (error) {
    console.error("Error seeding plans:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to seed plans", details: errorMessage },
      { status: 500 }
    );
  }
}
