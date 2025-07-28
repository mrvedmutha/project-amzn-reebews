import { dbConnect } from "@/lib/database/db";
import mongoose from "mongoose";

export interface HealthcheckResult {
  status: "healthy" | "unhealthy";
  timestamp: string;
  services: {
    database: {
      status: "healthy" | "unhealthy";
      responseTime?: number;
      error?: string;
    };
    api: {
      status: "healthy" | "unhealthy";
      responseTime?: number;
      error?: string;
    };
  };
}

export const HealthcheckService = {
  async performHealthcheck(): Promise<HealthcheckResult> {
    const timestamp = new Date().toISOString();
    let overallStatus: "healthy" | "unhealthy" = "healthy";

    const [databaseHealth, apiHealth] = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkApiHealth(),
    ]);

    if (databaseHealth.status === "unhealthy" || apiHealth.status === "unhealthy") {
      overallStatus = "unhealthy";
    }

    return {
      status: overallStatus,
      timestamp,
      services: {
        database: databaseHealth,
        api: apiHealth,
      },
    };
  },

  async checkDatabaseHealth(): Promise<{
    status: "healthy" | "unhealthy";
    responseTime?: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      await dbConnect();
      
      const isConnected = mongoose.connection.readyState === 1;
      if (!isConnected) {
        throw new Error("Database connection is not ready");
      }

      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: "healthy",
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        status: "unhealthy",
        responseTime,
        error: error instanceof Error ? error.message : "Unknown database error",
      };
    }
  },

  async checkApiHealth(): Promise<{
    status: "healthy" | "unhealthy";
    responseTime?: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      const port = process.env.PORT || 3000;
      const hostname = process.env.HOSTNAME || 'localhost';
      
      const response = await fetch(`http://${hostname}:${port}/api/plans`, {
        method: 'GET',
        headers: {
          'User-Agent': 'healthcheck',
        },
        signal: AbortSignal.timeout(5000),
      });

      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      return {
        status: "healthy",
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        status: "unhealthy",
        responseTime,
        error: error instanceof Error ? error.message : "API not responding",
      };
    }
  },
};