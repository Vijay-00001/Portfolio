// src/lib/api-guard.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "fallback-secret-change-me";

async function hmacSign(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAdminRequest(): Promise<{
  authenticated: boolean;
  response?: NextResponse;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Unauthorized — please login" },
          { status: 401 }
        ),
      };
    }

    const expected = await hmacSign("admin-session-valid", ADMIN_SECRET);

    if (token.length !== expected.length) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Invalid session" },
          { status: 401 }
        ),
      };
    }

    let mismatch = 0;
    for (let i = 0; i < token.length; i++) {
      mismatch |= token.charCodeAt(i) ^ expected.charCodeAt(i);
    }

    if (mismatch !== 0) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Session expired — please login again" },
          { status: 401 }
        ),
      };
    }

    return { authenticated: true };
  } catch {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Authentication error" },
        { status: 500 }
      ),
    };
  }
}