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

function getStaticData(): PortfolioData {
  return {
    personalInfo: staticPersonalInfo,
    projects: staticProjects,
    skillCategories: staticSkills,
    experiences: staticExperiences,
    testimonials: staticTestimonials,
  };
}

export async function getPortfolioData(): Promise<PortfolioData> {
  // If no MongoDB URI configured, use static data
  if (!process.env.MONGODB_URI) {
    return getStaticData();
  }

  try {
    const [settings, projects, skills, experiences, testimonials] =
      await Promise.all([
        getSettings().catch(() => null),
        getProjects().catch(() => []),
        getSkillCategories().catch(() => []),
        getExperiences().catch(() => []),
        getTestimonials().catch(() => []),
      ]);

    return {
      personalInfo: settings || staticPersonalInfo,
      projects: projects.length > 0 ? projects : staticProjects,
      skillCategories: skills.length > 0 ? skills : staticSkills,
      experiences: experiences.length > 0 ? experiences : staticExperiences,
      testimonials: testimonials.length > 0 ? testimonials : staticTestimonials,
    };
  } catch (error) {
    console.error("Failed to fetch portfolio data from DB:", error);
    return getStaticData();
  }
}