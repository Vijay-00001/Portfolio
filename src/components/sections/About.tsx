// src/components/sections/About.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { usePortfolioData } from "@/components/providers/DataProvider";
import { FiMapPin, FiMail } from "react-icons/fi";

export default function About() {
  const { personalInfo } = usePortfolioData();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="About Me" subtitle="Who I Am" />

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/30 to-purple-500/30 blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden border-2 border-border luxury-shadow">
                <Image
                  src={personalInfo.avatarUrl}
                  alt={personalInfo.name}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 px-4 py-2 rounded-2xl glass luxury-shadow"
              >
                <span className="text-2xl">🚀</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-6">
              Hey, I&apos;m{" "}
              <span className="gradient-text">{personalInfo.name}</span>
            </h3>

            <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
              {personalInfo.longBio}
            </p>

            <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-accent" />
                {personalInfo.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <FiMail className="w-4 h-4 text-accent" />
                {personalInfo.email}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {personalInfo.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="text-center p-4 rounded-2xl bg-card border border-border"
                >
                  <p className="text-2xl md:text-3xl font-bold gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}