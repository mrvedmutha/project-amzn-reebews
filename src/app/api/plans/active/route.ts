import { NextResponse } from "next/server";
import { PlanService } from "@/services/plan/plan.service";

/**
 * @swagger
 * /api/plans/active:
 *   get:
 *     summary: Retrieve active subscription plans
 *     description: Fetches a list of all subscription plans that are currently marked as active, sorted by their defined sort order.
 *     tags:
 *       - Plans
 *     responses:
 *       200:
 *         description: A list of active plans.
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
    const activePlans = await PlanService.getActivePlans();
    return NextResponse.json({ plans: activePlans });
  } catch (error) {
    console.error("API Error fetching active plans:", error);
    return new NextResponse("An error occurred while fetching active plans.", {
      status: 500,
    });
  }
}
