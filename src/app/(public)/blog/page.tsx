// src/app/blog/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles about web development, React, Next.js, TypeScript, and software engineering best practices.",
  openGraph: {
    title: "Blog | Vijay Chauhan",
    description:
      "Articles about web development, React, Next.js, TypeScript, and software engineering best practices.",
  },
};

export default function BlogPage() {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent font-medium tracking-widest uppercase text-sm mb-3">
            Articles
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            Blog & Insights
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Thoughts on web development, software engineering, and building
            great products.
          </p>
        </div>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group flex flex-col sm:flex-row gap-6 p-6 rounded-3xl border border-border bg-card hover:luxury-shadow-hover transition-all duration-500">
                <div className="relative overflow-hidden rounded-2xl sm:w-64 sm:flex-shrink-0 aspect-video sm:aspect-[4/3]">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 256px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <time className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs rounded-md bg-accent/10 text-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}