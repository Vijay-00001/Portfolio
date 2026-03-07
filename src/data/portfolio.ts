// src/data/portfolio.ts
import type {
  PersonalInfo,
  Project,
  SkillCategory,
  ExperienceItem,
  Testimonial,
  BlogPost,
} from "@/types";

export const personalInfo: PersonalInfo = {
  name: "Vijay Chauhan",
  title: "Full Stack Developer",
  description:
    "I build scalable, high-performance web applications using modern stacks like MERN, MEAN, Next.js, NestJS, and Laravel — turning complex ideas into clean, user-friendly products.",
  longBio:
    "A passionate Full Stack Developer with a B.Tech in Information Technology from Shantilal Shah Government Engineering College (8.16 CGPA). Experienced in building production-grade web applications using Next.js, React, Angular, Laravel, NestJS, and the MERN/MEAN stacks. Currently developing Trillium — a multi-portal healthcare management system with role-based access for clinics, patients, and doctors. I enjoy solving complex engineering challenges, writing clean architecture, and shipping products that users love.",
  email: "vmchauhan46246@gmail.com",
  location: "India",
  avatarUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  resumeUrl: "/resume.pdf",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  twitterUrl: "https://twitter.com",
  stats: [
    { label: "Projects Delivered", value: "10+" },
    { label: "Tech Stacks", value: "6+" },
    { label: "CGPA", value: "8.16" },
    { label: "Year of Grad", value: "2024" },
  ],
};

export const projects: Project[] = [
  {
    id: "1",
    title: "Trillium",
    description:
      "Multi-portal healthcare system for admin, clinic, patient, and referral doctors with role-based access and Canadian health card verification.",
    longDescription:
      "A comprehensive multi-portal healthcare management system with role-based access for admins, clinics, patients, and referral doctors. Manages patient profiles, cases, appointments, payments, and reports in one unified platform. Integrated Canadian health card verification and secure document storage with AWS S3. Built with Laravel, Angular, and MySQL with a focus on clean UX for clinic staff.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop",
    techStack: ["Laravel", "Angular", "MySQL", "AWS S3", "TypeScript", "REST API"],
    liveUrl: "",
    githubUrl: "",
    featured: true,
    period: "Jan 2025 — Present",
  },
  {
    id: "2",
    title: "The Bus Network",
    description:
      "Web platform for tour and school bus bookings with real-time management and AI-based email suggestions using ChatGPT.",
    longDescription:
      "A full-featured web platform for tour and school bus bookings with real-time fleet management. Built with MERN stack and SQL, using Google Cloud for image and video storage. Integrated AI-based email suggestion system using ChatGPT API to improve operator–customer communication. Focused on intuitive user flows for searching, booking, and managing trips.",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=500&fit=crop",
    techStack: ["React", "Node.js", "Express", "SQL", "Google Cloud", "ChatGPT API"],
    liveUrl: "",
    githubUrl: "",
    featured: true,
    period: "Apr 2024 — Jul 2024",
  },
  {
    id: "3",
    title: "Streamline",
    description:
      "Platform to watch, download, and store movies with user accounts, Stripe subscriptions, and cloud media storage.",
    longDescription:
      "A streaming platform where users can watch, download, and store movies with full account management. Built with the MERN stack, Next.js, and NestJS, using MongoDB for data and AWS S3 / Cloudinary for media storage. Integrated Stripe for subscription-based payments and secure billing. Designed simple user journeys: browse → play → subscribe → manage content.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=500&fit=crop",
    techStack: ["Next.js", "NestJS", "MongoDB", "AWS S3", "Cloudinary", "Stripe"],
    liveUrl: "",
    githubUrl: "",
    featured: true,
    period: "Jan 2024 — Apr 2024",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    icon: "💻",
    skills: [
      { name: "JavaScript", icon: "🟨", level: 92 },
      { name: "TypeScript", icon: "📘", level: 85 },
      { name: "PHP", icon: "🐘", level: 82 },
      { name: "HTML5 / CSS3", icon: "🌐", level: 90 },
      { name: "Java", icon: "☕", level: 72 },
      { name: "C", icon: "⚙️", level: 68 },
    ],
  },
  {
    title: "Frameworks",
    icon: "🚀",
    skills: [
      { name: "Next.js", icon: "▲", level: 88 },
      { name: "NestJS", icon: "🐱", level: 82 },
      { name: "React (MERN)", icon: "⚛️", level: 90 },
      { name: "Angular (MEAN)", icon: "🅰️", level: 80 },
      { name: "Laravel", icon: "🔺", level: 85 },
      { name: "Tailwind CSS", icon: "🎨", level: 88 },
      { name: "Bootstrap", icon: "🅱️", level: 80 },
      { name: "Electron.js", icon: "⚡", level: 70 },
    ],
  },
  {
    title: "Cloud & Database",
    icon: "☁️",
    skills: [
      { name: "MongoDB", icon: "🍃", level: 88 },
      { name: "MySQL", icon: "🐬", level: 85 },
      { name: "AWS S3", icon: "☁️", level: 80 },
      { name: "Cloudinary", icon: "🖼️", level: 78 },
      { name: "Firebase", icon: "🔥", level: 75 },
      { name: "Git / GitHub", icon: "📂", level: 88 },
    ],
  },
  {
    title: "Tools",
    icon: "🛠️",
    skills: [
      { name: "VS Code", icon: "💻", level: 95 },
      { name: "Windsurf", icon: "🏄", level: 80 },
      { name: "IntelliJ IDEA", icon: "🧠", level: 75 },
      { name: "Jira", icon: "📋", level: 78 },
      { name: "MS Teams", icon: "👥", level: 82 },
      { name: "phpMyAdmin", icon: "🐘", level: 80 },
    ],
  },
];

export const experiences: ExperienceItem[] = [
  {
    id: "1",
    type: "work",
    company: "Trillium Healthcare",
    role: "Full Stack Developer",
    period: "Jan 2025 — Present",
    description:
      "Building a multi-portal healthcare system for admin, clinic, patient, and referral doctors with role-based access. Managing patient profiles, cases, appointments, payments, and reports. Integrated Canadian health card verification and AWS S3 for secure document storage.",
    technologies: ["Laravel", "Angular", "MySQL", "AWS S3", "REST API"],
    companyUrl: "",
  },
  {
    id: "2",
    type: "work",
    company: "The Bus Network",
    role: "Full Stack Developer",
    period: "Apr 2024 — Jul 2024",
    description:
      "Developed a web platform for tour and school bus bookings with real-time fleet management. Used Google Cloud for media storage and integrated ChatGPT API for AI-based email suggestions to improve communication flows.",
    technologies: ["React", "Node.js", "Express", "SQL", "Google Cloud", "ChatGPT API"],
  },
  {
    id: "3",
    type: "work",
    company: "Streamline",
    role: "Full Stack Developer",
    period: "Jan 2024 — Apr 2024",
    description:
      "Built a streaming platform for watching, downloading, and storing movies. Implemented Stripe subscription payments, cloud media storage with AWS S3 and Cloudinary, and a clean user journey from browsing to content management.",
    technologies: ["Next.js", "NestJS", "MongoDB", "AWS S3", "Cloudinary", "Stripe"],
  },
  {
    id: "4",
    type: "education",
    company: "Shantilal Shah Government Engineering College",
    role: "Bachelor of Technology (IT) — 8.16 CGPA",
    period: "Aug 2020 — Jun 2024",
    description:
      "Built projects like a Sports Management System and a Video Calling Web App using PHP, MySQL, HTML, CSS, and JavaScript. Applied OOP and Data Structures in real work, collaborated on GitHub, and developed strong engineering fundamentals.",
    technologies: ["PHP", "MySQL", "HTML", "CSS", "JavaScript", "OOP", "Data Structures"],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Manager",
    company: "Healthcare Solutions",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    content:
      "Exceptional work on our healthcare platform. The multi-portal system was delivered with outstanding quality, clean architecture, and a UX that our clinic staff genuinely enjoys using.",
    rating: 5,
  },
  {
    id: "2",
    name: "Michael Park",
    role: "CTO",
    company: "TransitTech",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content:
      "The Bus Network platform was a game-changer. The AI email integration and real-time booking system showed incredible technical depth and attention to user experience.",
    rating: 5,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Founder",
    company: "StreamMedia",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content:
      "Streamline was built with incredible attention to detail — from Stripe integration to cloud media storage. The platform handles thousands of users smoothly.",
    rating: 5,
  },
  {
    id: "4",
    name: "David Kim",
    role: "Engineering Lead",
    company: "NextGen Apps",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    content:
      "A talented developer who understands both frontend finesse and backend architecture. The code is clean, well-documented, and production-ready from day one.",
    rating: 5,
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "building-performant-nextjs-apps",
    title: "Building Performant Next.js Applications in 2025",
    excerpt:
      "Learn the essential techniques for building blazing-fast Next.js applications, from server components to edge rendering.",
    content: `
## Introduction

Performance is not just a feature — it is the foundation of great user experience.

## Server Components

React Server Components reduce client-side JavaScript by rendering on the server.

### Key Benefits
- Reduced client-side JavaScript
- Direct database access without API routes
- Automatic code splitting

## Conclusion

By leveraging these techniques, you can build Next.js applications that score 95+ on Lighthouse.
    `,
    date: "2025-01-15",
    readTime: "8 min read",
    tags: ["Next.js", "Performance", "React"],
    coverImage:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
  },
  {
    slug: "mern-vs-mean-stack",
    title: "MERN vs MEAN: Choosing the Right Stack in 2025",
    excerpt:
      "A practical comparison of MERN and MEAN stacks based on real project experience.",
    content: `
## Introduction

Choosing between MERN and MEAN depends on your project requirements and team expertise.

## MERN Stack

React provides flexibility with its component-based architecture and massive ecosystem.

## MEAN Stack

Angular offers a batteries-included framework with TypeScript-first approach.

## Conclusion

Both stacks are powerful. Choose based on project scale, team skills, and long-term maintainability.
    `,
    date: "2025-01-08",
    readTime: "6 min read",
    tags: ["MERN", "MEAN", "Full Stack"],
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
  },
  {
    slug: "laravel-angular-healthcare",
    title: "Building Healthcare Apps with Laravel and Angular",
    excerpt:
      "Lessons learned from building a multi-portal healthcare system with role-based access.",
    content: `
## Introduction

Healthcare applications demand exceptional security, reliability, and user experience.

## Multi-Portal Architecture

Separating admin, clinic, patient, and doctor portals with role-based access.

## Security Considerations

Health card verification, HIPAA compliance, and secure document storage with AWS S3.

## Conclusion

Healthcare apps require extra attention to security and UX for non-technical users.
    `,
    date: "2024-12-20",
    readTime: "7 min read",
    tags: ["Laravel", "Angular", "Healthcare"],
    coverImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop",
  },
];

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];