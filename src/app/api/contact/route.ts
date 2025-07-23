import { NextRequest, NextResponse } from "next/server";
import { ContactService } from "@/services/contact/contact.service";
import { IContactSubmissionRequest, IContactSubmissionResponse } from "@/types/contact/contact.types";

/**
 * Verifies Google reCAPTCHA v2 token
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.GOOGLE_RECAPTCHA_V2_SECRET}&response=${token}`,
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

/**
 * Validates API key for request authentication
 */
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  const validApiKey = process.env.REEBEWS_API_KEY;
  
  if (!apiKey || !validApiKey) {
    return false;
  }
  
  return apiKey === validApiKey;
}

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a contact form
 *     description: Creates a new contact form submission with reCAPTCHA verification and API key protection.
 *     tags:
 *       - Contact
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - userType
 *               - query
 *               - recaptchaToken
 *             properties:
 *               fullName:
 *                 type: string
 *                 maxLength: 100
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               userType:
 *                 type: string
 *                 enum: [buyer, seller]
 *                 example: "seller"
 *               query:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *                 example: "I need help setting up my first review campaign."
 *               recaptchaToken:
 *                 type: string
 *                 example: "03AGdBq25..."
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contact form submitted successfully"
 *                 contactId:
 *                   type: string
 *                   example: "605c72ef8e8b5c001f5e4d5a"
 *       400:
 *         description: Invalid request data or reCAPTCHA verification failed
 *       401:
 *         description: Invalid or missing API key
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Server error
 */
export async function POST(request: NextRequest): Promise<NextResponse<IContactSubmissionResponse>> {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing API key" },
        { status: 401 }
      );
    }

    // Parse request body
    let body: IContactSubmissionRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { fullName, email, userType, query, recaptchaToken } = body;

    // Validate required fields
    if (!fullName || !email || !userType || !query || !recaptchaToken) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate field lengths and formats
    if (fullName.trim().length === 0 || fullName.length > 100) {
      return NextResponse.json(
        { success: false, message: "Full name must be between 1 and 100 characters" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (!["buyer", "seller"].includes(userType)) {
      return NextResponse.json(
        { success: false, message: "User type must be either 'buyer' or 'seller'" },
        { status: 400 }
      );
    }

    if (query.trim().length < 10 || query.length > 500) {
      return NextResponse.json(
        { success: false, message: "Query must be between 10 and 500 characters" },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    // Create contact submission
    const contact = await ContactService.createContact({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      userType,
      query: query.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully. We'll get back to you within 24 hours.",
        contactId: contact._id?.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while processing your request. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Retrieve contact form submissions
 *     description: Fetches contact form submissions with pagination (Admin only).
 *     tags:
 *       - Contact
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of contacts to retrieve
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of contacts to skip for pagination
 *     responses:
 *       200:
 *         description: Contact submissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 contacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Invalid or missing API key
 *       500:
 *         description: Server error
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing API key" },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const skip = Math.max(parseInt(searchParams.get("skip") || "0"), 0);

    // Fetch contacts
    const contacts = await ContactService.getAllContacts(limit, skip);

    return NextResponse.json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("Contact GET API Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching contacts." },
      { status: 500 }
    );
  }
}