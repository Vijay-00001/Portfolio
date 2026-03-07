// src/app/api/admin/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api-guard";
import { getProjects, createProject } from "@/lib/mongodb";
import { sanitizeInput } from "@/lib/sanitize";

export async function GET() {
  const auth = await verifyAdminRequest();
  if (!auth.authenticated) return auth.response!;

  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminRequest();
  if (!auth.authenticated) return auth.response!;

  try {
    const body = await request.json();

    const project = {
      title: sanitizeInput(body.title || "", 200),
      description: sanitizeInput(body.description || "", 500),
      longDescription: sanitizeInput(body.longDescription || "", 2000),
      image: sanitizeInput(body.image || "", 500),
      techStack: Array.isArray(body.techStack)
        ? body.techStack.map((t: string) => sanitizeInput(t, 50))
        : [],
      githubUrl: sanitizeInput(body.githubUrl || "", 500),
      liveUrl: sanitizeInput(body.liveUrl || "", 500),
      featured: Boolean(body.featured),
      period: sanitizeInput(body.period || "", 100),
    };

    if (!project.title || !project.description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const id = await createProject(project);
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}