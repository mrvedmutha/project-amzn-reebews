import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/db";
import mongoose from "mongoose";

export async function GET() {
  try {
    console.log("Testing database connection...");
    
    // Test connection
    await dbConnect();
    
    // Test database operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    const dbName = mongoose.connection.db.databaseName;
    const readyState = mongoose.connection.readyState;
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      details: {
        database: dbName,
        readyState: readyState === 1 ? "Connected" : `State: ${readyState}`,
        collections: collections.map(c => c.name),
        connectionString: process.env.MONGODB_URI ? "Set" : "Not set"
      }
    });
  } catch (error) {
    console.error("Database connection error:", error);
    
    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
      details: {
        connectionString: process.env.MONGODB_URI ? "Set" : "Not set"
      }
    }, { status: 500 });
  }
}