// src/app/api/admin/messages/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api-guard";
import { deleteContactMessage } from "@/lib/mongodb";

type Props = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, { params }: Props) {
  const auth = await verifyAdminRequest();
  if (!auth.authenticated) return auth.response!;

  try {
    const { id } = await params;
    const success = await deleteContactMessage(id);
    if (!success) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete message error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}