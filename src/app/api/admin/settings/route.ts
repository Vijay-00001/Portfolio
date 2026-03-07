// src/app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api-guard";
import { getSettings, upsertSettings } from "@/lib/mongodb";
import { personalInfo as staticInfo } from "@/data/portfolio";
import { sanitizeInput } from "@/lib/sanitize";

export async function GET() {
  const auth = await verifyAdminRequest();
  if (!auth.authenticated) return auth.response!;

  try {
    const settings = await getSettings();
    return NextResponse.json(settings || staticInfo);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(staticInfo);
  }
}

export async function PUT(request: NextRequest) {
  const auth = await verifyAdminRequest();
  if (!auth.authenticated) return auth.response!;

  try {
    const body = await request.json();

    const settings = {
      name: sanitizeInput(body.name || "", 100),
      title: sanitizeInput(body.title || "", 200),
      description: sanitizeInput(body.description || "", 500),
      longBio: sanitizeInput(body.longBio || "", 2000),
      email: sanitizeInput(body.email || "", 254),
      location: sanitizeInput(body.location || "", 100),
      avatarUrl: sanitizeInput(body.avatarUrl || "", 500),
      resumeUrl: sanitizeInput(body.resumeUrl || "", 500),
      githubUrl: sanitizeInput(body.githubUrl || "", 500),
      linkedinUrl: sanitizeInput(body.linkedinUrl || "", 500),
      twitterUrl: sanitizeInput(body.twitterUrl || "", 500),
      stats: Array.isArray(body.stats)
        ? body.stats.map((s: { label: string; value: string }) => ({
            label: sanitizeInput(s.label || "", 50),
            value: sanitizeInput(s.value || "", 50),
          }))
        : [],
    };

    await upsertSettings(settings);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}