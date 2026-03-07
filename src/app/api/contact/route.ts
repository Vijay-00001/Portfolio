// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { insertContactMessage } from "@/lib/mongodb";
import { sanitizeInput, validateContactForm } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || "5", 10);
    const limit = rateLimit(ip, maxRequests, 60 * 1000);

    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          errors: [
            `Too many requests. Please try again in ${Math.ceil(limit.resetIn / 1000)} seconds.`,
          ],
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(limit.resetIn / 1000).toString(),
          },
        }
      );
    }

    // Parse body
    const body = await request.json();

    // Validate
    const validation = validateContactForm(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Sanitize
    const sanitized = {
      name: sanitizeInput(body.name, 100),
      email: sanitizeInput(body.email, 254),
      message: sanitizeInput(body.message, 5000),
    };

    // Store in MongoDB
    const messageId = await insertContactMessage(sanitized);

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully.",
        id: messageId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        success: false,
        errors: ["An internal server error occurred. Please try again later."],
      },
      { status: 500 }
    );
  }
}

// Block other methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}