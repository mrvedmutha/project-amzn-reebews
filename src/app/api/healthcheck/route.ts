import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    // Basic API check - if we can respond, API is working
    const timestamp = new Date().toISOString();
    
    // Quick database connectivity check
    let dbStatus = "healthy";
    let dbError = null;
    
    try {
      await dbConnect();
      const isConnected = mongoose.connection.readyState === 1;
      if (!isConnected) {
        dbStatus = "unhealthy";
        dbError = "Database not connected";
      }
    } catch (error) {
      dbStatus = "unhealthy";
      dbError = "Database connection failed";
    }

    const response = {
      status: dbStatus === "healthy" ? "ok" : "error",
      timestamp,
      database: dbStatus,
      ...(dbError && { error: dbError })
    };

    // Return appropriate status code
    const statusCode = dbStatus === "healthy" ? 200 : 503;
    
    return NextResponse.json(response, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Healthcheck failed"
      },
      { status: 503 }
    );
  }
}