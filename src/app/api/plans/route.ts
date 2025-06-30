import { NextRequest, NextResponse } from "next/server";
import { planService } from "@/services/plan/plan.service";
import { Plan } from "@/enums/checkout.enum";

/**
 * GET /api/plans
 * Retrieve all plans with optional filtering and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse query parameters
    const limit = parseInt(searchParams.get("limit") || "25");
    const skip = parseInt(searchParams.get("skip") || "0");
    const isActive = searchParams.get("isActive");
    const planName = searchParams.get("name");

    // Validate limit and skip
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid limit parameter",
          error: "Limit must be between 1 and 100",
        },
        { status: 400 }
      );
    }

    if (skip < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid skip parameter",
          error: "Skip must be non-negative",
        },
        { status: 400 }
      );
    }

    // Build filters
    const filters: any = {};

    if (isActive !== null) {
      if (isActive === "true") {
        filters.isActive = true;
      } else if (isActive === "false") {
        filters.isActive = false;
      }
    }

    if (planName && Object.values(Plan).includes(planName as Plan)) {
      filters.name = planName as Plan;
    }

    // Get plans using service
    const plans = await planService.getAll(limit, skip, filters);
    const totalCount = await planService.getCount(filters);

    return NextResponse.json(
      {
        success: true,
        message: "Plans retrieved successfully",
        data: {
          plans,
          pagination: {
            limit,
            skip,
            total: totalCount,
            hasMore: skip + limit < totalCount,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching plans:", error);

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

/**
 * POST /api/plans
 * Create a new plan
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.displayName || !body.planId === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
          error: "name, displayName, and planId are required",
        },
        { status: 400 }
      );
    }

    // Validate plan name
    if (!Object.values(Plan).includes(body.name)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid plan name",
          error: `Plan name must be one of: ${Object.values(Plan).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Create plan using service
    const plan = await planService.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Plan created successfully",
        data: plan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating plan:", error);

    // Handle validation errors
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan already exists",
          error: error.message,
        },
        { status: 409 }
      );
    }

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
