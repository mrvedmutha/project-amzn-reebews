import { NextResponse } from "next/server";

async function checkDatabase(): Promise<{ status: string; error?: string }> {
  try {
    const { dbConnect } = await import("@/lib/database/db");
    const mongoose = await import("mongoose");
    
    // Set a timeout for database check
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database check timeout')), 2000)
    );
    
    const dbCheckPromise = (async () => {
      await dbConnect();
      return mongoose.default.connection.readyState === 1;
    })();
    
    const isConnected = await Promise.race([dbCheckPromise, timeoutPromise]);
    
    return isConnected 
      ? { status: "healthy" }
      : { status: "unhealthy", error: "Database not connected" };
      
  } catch (error) {
    return { 
      status: "unhealthy", 
      error: error instanceof Error ? error.message : "Database check failed" 
    };
  }
}

export async function GET(request: Request) {
  const timestamp = new Date().toISOString();
  
  // Check if detailed health check is requested
  const { searchParams } = new URL(request.url);
  const detailed = searchParams.get('detailed') === 'true';
  
  if (detailed) {
    const dbHealth = await checkDatabase();
    
    return NextResponse.json(
      {
        status: dbHealth.status === "healthy" ? "ok" : "error",
        timestamp,
        services: {
          api: "healthy",
          database: dbHealth.status,
          ...(dbHealth.error && { database_error: dbHealth.error })
        }
      },
      {
        status: dbHealth.status === "healthy" ? 200 : 503,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    );
  }
  
  // Simple healthcheck for Docker
  return NextResponse.json(
    { 
      status: "ok",
      timestamp
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    }
  );
}