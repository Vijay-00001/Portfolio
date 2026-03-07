// src/app/api/admin/projects/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api-guard";
import { updateProject, deleteProject } from "@/lib/mongodb";
import { sanitizeInput } from "@/lib/sanitize";

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Props) {
  const auth = await verifyAdminRequest();
  if (!auth.authenticated) return auth.response!;

  try {
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = sanitizeInput(body.title, 200);
    if (body.description !== undefined) data.description = sanitizeInput(body.description, 500);
    if (body.longDescription !== undefined) data.longDescription = sanitizeInput(body.longDescription, 2000);
    if (body.image !== undefined) data.image = sanitizeInput(body.image, 500);
    if (body.techStack !== undefined)
      data.techStack = body.techStack.map((t: string) => sanitizeInput(t, 50));
    if (body.githubUrl !== undefined) data.githubUrl = sanitizeInput(body.githubUrl, 500);
    if (body.liveUrl !== undefined) data.liveUrl = sanitizeInput(body.liveUrl, 500);
    if (body.featured !== undefined) data.featured = Boolean(body.featured);
    if (body.period !== undefined) data.period = sanitizeInput(body.period, 100);

    const success = await updateProject(id, data);
    if (!success) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Props) {
  const auth = await verifyAdminRequest();
  if (!auth.authenticated) return auth.response!;

  try {
    const { id } = await params;
    const success = await deleteProject(id);
    if (!success) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}