// src/app/api/admin/logout/route.ts
import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearAdminCookie();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}