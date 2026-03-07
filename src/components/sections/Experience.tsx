// src/components/sections/Experience.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { usePortfolioData } from "@/components/providers/DataProvider";
import { FiBriefcase, FiBookOpen } from "react-icons/fi";

export default function Experience() {
  const { experiences } = usePortfolioData();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="experience" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="Experience" subtitle="My Journey" />

        <div ref={ref} className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-8">
            {experiences.map((exp, i) => {
              const isEdu = exp.type === "education";
              const Icon = isEdu ? FiBookOpen : FiBriefcase;

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                  className="relative md:pl-20"
                >
                  <div
                    className={`hidden md:flex absolute left-[1.55rem] top-8 w-4 h-4 rounded-full border-4 border-background z-10 items-center justify-center ${
                      isEdu ? "bg-emerald-500" : "bg-accent"
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  <div className="p-6 md:p-8 rounded-3xl bg-card border border-border luxury-shadow hover:luxury-shadow-hover transition-all duration-500 group">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon
                            className={`w-4 h-4 ${
                              isEdu ? "text-emerald-500" : "text-accent"
                            }`}
                          />
                          <h3 className="font-display text-lg font-bold group-hover:text-accent transition-colors">
                            {exp.role}
                          </h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {exp.companyUrl ? (
                            <a
                              href={exp.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-accent transition-colors"
                            >
                              {exp.company}
                            </a>
                          ) : (
                            exp.company
                          )}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap ${
                          isEdu
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-xs rounded-md bg-muted text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}