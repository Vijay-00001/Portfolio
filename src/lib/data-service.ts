// src/lib/data-service.ts
import type { PortfolioData } from "@/types";
import {
  getSettings,
  getProjects,
  getSkillCategories,
  getExperiences,
  getTestimonials,
} from "@/lib/mongodb";
import {
  personalInfo as staticPersonalInfo,
  projects as staticProjects,
  skillCategories as staticSkills,
  experiences as staticExperiences,
  testimonials as staticTestimonials,
} from "@/data/portfolio";
// import { log } from "@/lib/logger";

function getStaticData(): PortfolioData {
  // log("info", "DataService", "Using static data (no DB connection)");
  return {
    personalInfo: staticPersonalInfo,
    projects: staticProjects,
    skillCategories: staticSkills,
    experiences: staticExperiences,
    testimonials: staticTestimonials,
  };
}

export async function getPortfolioData(): Promise<PortfolioData> {
  if (!process.env.MONGODB_URI) {
    // log("warn", "DataService", "MONGODB_URI not set — using static data");
    return getStaticData();
  }

  try {
    const [settings, projects, skills, experiences, testimonials] =
      await Promise.all([
        getSettings().catch((e) => {
          // log("warn", "DataService", "Settings fetch failed", e);
          return null;
        }),
        getProjects().catch((e) => {
          // log("warn", "DataService", "Projects fetch failed", e);
          return [];
        }),
        getSkillCategories().catch((e) => {
          // log("warn", "DataService", "Skills fetch failed", e);
          return [];
        }),
        getExperiences().catch((e) => {
          // log("warn", "DataService", "Experiences fetch failed", e);
          return [];
        }),
        getTestimonials().catch((e) => {
          // log("warn", "DataService", "Testimonials fetch failed", e);
          return [];
        }),
      ]);

    const data: PortfolioData = {
      personalInfo: settings || staticPersonalInfo,
      projects: projects.length > 0 ? projects : staticProjects,
      skillCategories: skills.length > 0 ? skills : staticSkills,
      experiences: experiences.length > 0 ? experiences : staticExperiences,
      testimonials: testimonials.length > 0 ? testimonials : staticTestimonials,
    };

    // log("success", "DataService", "Portfolio data loaded from DB");
    return data;
  } catch (error) {
    // log("error", "DataService", "Full DB failure — using static data", error);
    return getStaticData();
  }
}