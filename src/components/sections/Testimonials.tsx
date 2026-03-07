// src/components/sections/Testimonials.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { usePortfolioData } from "@/components/providers/DataProvider";
import { FiStar } from "react-icons/fi";

export default function Testimonials() {
  const { testimonials } = usePortfolioData();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="testimonials" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="Testimonials" subtitle="What Clients Say" />

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="relative p-8 rounded-3xl bg-card border border-border luxury-shadow hover:luxury-shadow-hover transition-all duration-500"
            >
              <span className="absolute top-6 right-8 text-6xl font-display text-accent/10 leading-none select-none">
                &ldquo;
              </span>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <FiStar key={j} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6 relative z-10 italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover border-2 border-accent/20"
                />
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}