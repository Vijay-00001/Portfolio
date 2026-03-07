// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { processQuery } from "@/lib/ai-engine";
import { saveChatLog } from "@/lib/mongodb";
import { sanitizeInput } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const limit = rateLimit(`chat-${ip}`, 30, 60 * 1000);

    if (!limit.allowed) {
      return NextResponse.json(
        {
          text: "Whoa, slow down! 😅 Too many messages. Try again in a moment.",
          type: "text",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== "string" || message.trim().length < 1) {
      return NextResponse.json(
        { text: "Please type a message! 💬", type: "text" },
        { status: 400 }
      );
    }

    const sanitized = sanitizeInput(message, 500);
    const response = processQuery(sanitized, sessionId);

    // Non-blocking log
    saveChatLog({
      sessionId: sessionId || "anonymous",
      question: sanitized,
      answer: response.text,
      category: response.type,
    }).catch(() => {});

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({
      text: "Oops! Something went wrong. Try again! 😅",
      type: "text",
      suggestions: ["Show skills", "Projects?", "Contact"],
    });
  }
}