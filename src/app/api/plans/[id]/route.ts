import { NextRequest, NextResponse } from "next/server";
import { planService } from "@/services/plan/plan.service";

/**
 * GET /api/plans/[id]
 * Retrieve a specific plan by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID parameter
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid plan ID",
          error: "Plan ID is required and must be a valid string",
        },
        { status: 400 }
      );
    }

    // Get plan from service
    const plan = await planService.getById(id);

    if (!plan) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan not found",
          error: "No plan found with the provided ID",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Plan retrieved successfully",
        data: plan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching plan:", error);

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
 * PUT /api/plans/[id]
 * Update a specific plan by ID
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Validate ID parameter
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid plan ID",
          error: "Plan ID is required and must be a valid string",
        },
        { status: 400 }
      );
    }

    // Update plan using service
    const updatedPlan = await planService.updateById(id, body);

    if (!updatedPlan) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan not found",
          error: "No plan found with the provided ID",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Plan updated successfully",
        data: updatedPlan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating plan:", error);

    // Handle validation errors
    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan name conflict",
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

/**
 * DELETE /api/plans/[id]
 * Delete a specific plan by ID
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID parameter
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid plan ID",
          error: "Plan ID is required and must be a valid string",
        },
        { status: 400 }
      );
    }

    // Check if plan exists before deletion
    const plan = await planService.getById(id);
    if (!plan) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan not found",
          error: "No plan found with the provided ID",
        },
        { status: 404 }
      );
    }

    // Delete plan using service
    await planService.deleteById(id);

    return NextResponse.json(
      {
        success: true,
        message: "Plan deleted successfully",
      },
      { status: 204 }
    );
  } catch (error) {
    console.error("Error deleting plan:", error);

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
