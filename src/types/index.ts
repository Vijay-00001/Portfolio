// src/types/index.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  period?: string;
}

export interface Skill {
  name: string;
  icon: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

export interface ExperienceItem {
  id: string;
  type: "work" | "education";
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
  companyUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  coverImage: string;
}

export interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export interface PersonalInfo {
  name: string;
  title: string;
  description: string;
  longBio: string;
  email: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  stats: { label: string; value: string }[];
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  projects: Project[];
  skillCategories: SkillCategory[];
  experiences: ExperienceItem[];
  testimonials: Testimonial[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
  updated_at: string;
}

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  category?: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
}