// src/app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, setAdminCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit login attempts
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const limit = rateLimit(`login-${ip}`, 5, 5 * 60 * 1000); // 5 attempts per 5 min

    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${Math.ceil(limit.resetIn / 1000)}s.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    await setAdminCookie();

    return NextResponse.json({ success: true, message: "Authenticated" });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}