// src/app/api/admin/messages/route.ts
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api-guard";
import { getContactMessages } from "@/lib/mongodb";

export async function GET() {
  const auth = await verifyAdminRequest();
  if (!auth.authenticated) return auth.response!;

  try {
    const messages = await getContactMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}