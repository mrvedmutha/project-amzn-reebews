import { NextRequest, NextResponse } from "next/server";
import { PlanService } from "@/services/plan/plan.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Plan ID is required." },
        { status: 400 }
      );
    }
    const plan = await PlanService.getPlanById(id);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found." }, { status: 404 });
    }
    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch plan." },
      { status: 500 }
    );
  }
}
