// src/app/api/github/route.ts
import { NextResponse } from "next/server";
import type { GitHubRepo } from "@/types";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const username = process.env.GITHUB_USERNAME;
    if (!username) {
      return NextResponse.json(
        { error: "GitHub username not configured" },
        { status: 500 }
      );
    }

    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6&type=owner`,
      { headers, next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(`GitHub API responded with ${res.status}`);
    }

    const repos: GitHubRepo[] = await res.json();

    const filtered = repos
      .filter((r) => !r.fork)
      .map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        stargazers_count: r.stargazers_count,
        language: r.language,
        fork: r.fork,
        updated_at: r.updated_at,
      }));

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    );
  }
}