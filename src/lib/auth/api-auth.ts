import { NextRequest, NextResponse } from "next/server";

/**
 * Valid API keys for external access
 * These are long-lived keys that don't expire
 * Add new keys here as needed for different clients
 */
const VALID_API_KEYS = new Set(
  [
    process.env.ADMIN_REEBEWS_API_KEY, // For admin.reebews.com
    process.env.MOBILE_APP_API_KEY, // For mobile app (if needed)
    process.env.ANALYTICS_API_KEY, // For analytics service (if needed)
  ].filter(Boolean)
); // Remove undefined values

/**
 * Validate API key from Authorization header
 * Simple single API key approach for protecting external API access
 */
export function validateApiKey(req: NextRequest): NextResponse | null {
  // Check Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing or invalid authorization header",
        error: "Authorization Bearer token is required",
      },
      { status: 401 }
    );
  }

  // Extract the provided API key
  const providedKey = authHeader.replace("Bearer ", "");
  const expectedApiKey = process.env.REEBEWS_API_KEY;

  // Check if API key is configured
  if (!expectedApiKey) {
    return NextResponse.json(
      {
        success: false,
        message: "Server configuration error",
        error: "REEBEWS_API_KEY not configured",
      },
      { status: 500 }
    );
  }

  // Validate the provided API key
  if (providedKey !== expectedApiKey) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid API key",
        error: "Unauthorized access",
      },
      { status: 401 }
    );
  }

  // Return null if validation passes (no error)
  return null;
}

/**
 * Helper function to create unauthorized response
 */
function createUnauthorizedResponse(
  message: string = "Unauthorized access"
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid API key",
      error: message,
    },
    { status: 401 }
  );
}
