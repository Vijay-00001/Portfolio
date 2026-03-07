// src/lib/auth.ts
import { cookies } from "next/headers";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "fallback-secret-change-me";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

// ── Web Crypto based HMAC (works in ALL runtimes: Node, Edge, Browser) ──

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

// ── Token generation and verification ──

export async function generateToken(): Promise<string> {
  return hmacSign("admin-session-valid", ADMIN_SECRET);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const expected = await generateToken();
    if (token.length !== expected.length) return false;

    // Constant-time comparison
    let mismatch = 0;
    for (let i = 0; i < token.length; i++) {
      mismatch |= token.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return mismatch === 0;
  } catch {
    return false;
  }
}

// ── Password verification ──

export function verifyPassword(password: string): boolean {
  if (!password || !ADMIN_PASSWORD) return false;
  if (password.length !== ADMIN_PASSWORD.length) return false;

  let mismatch = 0;
  for (let i = 0; i < password.length; i++) {
    mismatch |= password.charCodeAt(i) ^ ADMIN_PASSWORD.charCodeAt(i);
  }
  return mismatch === 0;
}

// ── Cookie management ──

export async function setAdminCookie(): Promise<void> {
  const token = await generateToken();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    return verifyToken(token);
  } catch {
    return false;
  }
}

// ── Helper for API route protection ──

export async function requireAdmin(): Promise<boolean> {
  return isAdminAuthenticated();
}