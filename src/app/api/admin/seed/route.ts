// src/app/api/admin/seed/route.ts
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api-guard";
import { seedAllData } from "@/lib/mongodb";
import {
  personalInfo,
  projects,
  skillCategories,
  experiences,
  testimonials,
} from "@/data/portfolio";

export async function POST() {
  const auth = await verifyAdminRequest();
  if (!auth.authenticated) return auth.response!;

  try {
    await seedAllData({
      personalInfo,
      projects,
      skillCategories,
      experiences,
      testimonials,
    });

    return NextResponse.json({
      success: true,
      message: "All data seeded successfully from static file.",
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed data" },
      { status: 500 }
    );
  }
}