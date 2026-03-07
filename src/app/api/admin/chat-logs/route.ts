// src/app/api/admin/chat-logs/route.ts
import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/api-guard";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  const auth = await verifyAdminRequest();
  if (!auth.authenticated) return auth.response!;

  try {
    const { db } = await connectToDatabase();
    const logs = await db
      .collection("chat_logs")
      .find()
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json(
      logs.map((l) => ({
        question: l.question,
        answer: l.answer,
        category: l.category,
        createdAt: l.createdAt,
      }))
    );
  } catch {
    return NextResponse.json([]);
  }
}