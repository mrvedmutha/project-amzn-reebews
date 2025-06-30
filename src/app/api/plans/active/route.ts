import { NextRequest, NextResponse } from "next/server";
import { planService } from "@/services/plan/plan.service";

/**
 * GET /api/plans/active
 * Retrieve all active plans for public display
 */
export async function GET(req: NextRequest) {
  try {
    // Get only active plans
    const plans = await planService.getActivePlans();

    return NextResponse.json(
      {
        success: true,
        message: "Active plans retrieved successfully",
        data: plans,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching active plans:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
