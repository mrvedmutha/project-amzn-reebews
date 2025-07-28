import { NextResponse } from "next/server";
import { HealthcheckService } from "@/services/healthcheck/healthcheck.service";

export async function GET() {
  try {
    const healthcheck = await HealthcheckService.performHealthcheck();
    
    const statusCode = healthcheck.status === "healthy" ? 200 : 503;
    
    return NextResponse.json(healthcheck, { status: statusCode });
  } catch (error) {
    console.error("Healthcheck API Error:", error);
    
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        services: {
          database: {
            status: "unhealthy",
            error: "Healthcheck service failed",
          },
          api: {
            status: "unhealthy",
          },
        },
      },
      { status: 503 }
    );
  }
}