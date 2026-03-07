// src/components/sections/Hero.tsx
"use client";

import { motion, Variants } from "framer-motion";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiDownload,
  FiArrowDown,
} from "react-icons/fi";
import { usePortfolioData } from "@/components/providers/DataProvider";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const item : Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export default function Hero() {
  const { personalInfo } = usePortfolioData();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-float [animation-delay:3s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <motion.div variants={item} className="inline-block mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Available for work
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-6"
        >
          <span className="text-foreground">Crafting</span>
          <br />
          <span className="gradient-text">Digital</span>{" "}
          <span className="text-foreground">Experiences</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance leading-relaxed"
        >
          {personalInfo.description}
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-4 rounded-2xl bg-accent text-accent-foreground font-semibold text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-shadow"
          >
            View My Work
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            href={personalInfo.resumeUrl}
            download
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border bg-card font-semibold text-sm hover:border-accent/50 transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            Download Resume
          </motion.a>
        </motion.div>

        <motion.div
          variants={item}
          className="flex items-center justify-center gap-3"
        >
          {[
            { icon: FiGithub, href: personalInfo.githubUrl, label: "GitHub" },
            { icon: FiLinkedin, href: personalInfo.linkedinUrl, label: "LinkedIn" },
            { icon: FiMail, href: `mailto:${personalInfo.email}`, label: "Email" },
          ].map((social) => (
            <motion.a
              key={social.label}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              href={social.href}
              target={social.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={social.label}
              className="p-3 rounded-xl border border-border bg-card/50 text-muted-foreground hover:text-accent hover:border-accent/50 transition-all duration-300"
            >
              <social.icon className="w-5 h-5" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <FiArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}