import { NextResponse } from "next/server";
import { PlanService } from "@/services/plan/plan.service";

/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Retrieve all subscription plans
 *     description: Fetches a list of all subscription plans available in the system, sorted by their defined sort order.
 *     tags:
 *       - Plans
 *     responses:
 *       200:
 *         description: A list of plans.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plan'
 *       500:
 *         description: Server error
 */
export async function GET() {
  try {
    const plans = await PlanService.getAllPlans();
    return NextResponse.json({ plans });
  } catch (error) {
    console.error("API Error fetching all plans:", error);
    return new NextResponse("An error occurred while fetching plans.", {
      status: 500,
    });
  }
}
