// src/lib/ai-engine.ts
import * as stringSimilarity from "string-similarity";
import {
  personalInfo,
  projects,
  skillCategories,
  experiences,
  blogPosts,
} from "@/data/portfolio";

// ── Response Types ──

export interface SkillBar {
  name: string;
  level: number;
  icon: string;
}

export interface ProjectCard {
  title: string;
  description: string;
  techStack: string[];
  period?: string;
  liveUrl?: string;
  githubUrl?: string;
  image?: string;
}

export interface LinkItem {
  label: string;
  url: string;
  icon: string;
}

export interface AIResponse {
  text: string;
  skills?: SkillBar[];
  projectCards?: ProjectCard[];
  links?: LinkItem[];
  suggestions?: string[];
  type: "text" | "skills" | "projects" | "experience" | "contact" | "fun";
}

// ── Context Tracker ──

const contextMap = new Map<string, { lastTopic: string; messageCount: number }>();

function getContext(sessionId: string) {
  if (!contextMap.has(sessionId)) {
    contextMap.set(sessionId, { lastTopic: "", messageCount: 0 });
  }
  const ctx = contextMap.get(sessionId)!;
  ctx.messageCount++;
  return ctx;
}

// ── Stopwords ──

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "both",
  "each", "few", "more", "most", "other", "some", "such", "no", "nor",
  "not", "only", "own", "same", "so", "than", "too", "very", "just",
  "don", "now", "and", "but", "or", "if", "while", "because",
  "about", "what", "which", "who", "whom", "this", "that", "these",
  "those", "am", "it", "its", "i", "me", "my", "we", "our", "you",
  "your", "he", "him", "his", "she", "her", "they", "them", "their",
  "tell", "me", "please", "want", "know", "show", "give", "get",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

// ── Intent Definitions ──

interface Intent {
  id: string;
  patterns: string[];
  entities?: string[];
  handler: (query: string, isShort: boolean, ctx: ReturnType<typeof getContext>) => AIResponse;
}

const intents: Intent[] = [
  // ── Greetings ──
  {
    id: "greeting",
    patterns: [
      "hello", "hi", "hey", "hola", "greetings", "sup", "yo",
      "good morning", "good evening", "good afternoon", "howdy",
      "what's up", "whats up",
    ],
    handler: (_q, _s, ctx) => {
      const isFirst = ctx.messageCount <= 1;
      const texts = isFirst
        ? [
            `Hey there! 👋 I'm **${personalInfo.name}'s** AI assistant.\n\nI can tell you about:\n🛠️ **Skills** & tech stack\n📁 **Projects** built\n💼 **Experience** & education\n📧 **Contact** info\n\nWhat interests you?`,
          ]
        : [
            `Hey again! 😊 What else would you like to know?`,
            `Welcome back! Ask me anything about ${personalInfo.name}! 🚀`,
          ];
      return {
        text: texts[Math.floor(Math.random() * texts.length)],
        type: "text",
        suggestions: ["Show me skills", "What projects?", "How to contact?", "Tell a joke"],
      };
    },
  },

  // ── About / Who ──
  {
    id: "about",
    patterns: [
      "about", "who", "yourself", "introduce", "background",
      "tell about", "describe", "bio", "summary", "overview",
      "what do you do", "who are you",
    ],
    handler: (_q, isShort) => {
      if (isShort) {
        return {
          text: `**${personalInfo.name}** — ${personalInfo.title} 🚀\n\n📍 ${personalInfo.location}\n\n${personalInfo.description}`,
          type: "text",
          links: [
            { label: "GitHub", url: personalInfo.githubUrl, icon: "🔗" },
            { label: "LinkedIn", url: personalInfo.linkedinUrl, icon: "💼" },
          ],
          suggestions: ["What skills?", "Show projects", "Education?"],
        };
      }

      return {
        text: `## About ${personalInfo.name} 👨‍💻\n\n${personalInfo.longBio}\n\n📍 **Location:** ${personalInfo.location}\n📧 **Email:** ${personalInfo.email}`,
        type: "text",
        links: [
          { label: "GitHub Profile", url: personalInfo.githubUrl, icon: "🔗" },
          { label: "LinkedIn", url: personalInfo.linkedinUrl, icon: "💼" },
          { label: "Download Resume", url: personalInfo.resumeUrl, icon: "📄" },
        ],
        suggestions: ["Skills overview", "Show all projects", "Work experience"],
      };
    },
  },

  // ── Name ──
  {
    id: "name",
    patterns: ["name", "called", "who is this"],
    handler: () => ({
      text: `The name is **${personalInfo.name}**! ✨\n\nA ${personalInfo.title} based in ${personalInfo.location}.`,
      type: "text",
      suggestions: ["Tell me more", "What skills?"],
    }),
  },

  // ── All Skills ──
  {
    id: "skills",
    patterns: [
      "skills", "technologies", "tech stack", "expertise",
      "proficient", "capable", "what can you do",
      "what do you know", "stack", "specializ",
    ],
    handler: (_q, isShort) => {
      if (isShort) {
        const topSkills = skillCategories
          .flatMap((c) => c.skills)
          .sort((a, b) => b.level - a.level)
          .slice(0, 8);

        return {
          text: `Here are the **top skills** 💪`,
          skills: topSkills.map((s) => ({
            name: s.name,
            level: s.level,
            icon: s.icon,
          })),
          type: "skills",
          suggestions: [
            "Frontend skills?",
            "Backend skills?",
            "All languages?",
            "What tools?",
          ],
        };
      }

      const allSkills = skillCategories.flatMap((c) => c.skills);
      return {
        text: `## Full Skill Set 🛠️\n\n${skillCategories.map((c) => `**${c.icon} ${c.title}**`).join("  •  ")}\n\nHere's the complete breakdown:`,
        skills: allSkills.map((s) => ({
          name: s.name,
          level: s.level,
          icon: s.icon,
        })),
        type: "skills",
        suggestions: ["Show projects", "Work experience", "Contact info"],
      };
    },
  },

  // ── Frontend Skills ──
  {
    id: "frontend",
    patterns: [
      "frontend", "front end", "front-end", "ui",
      "client side", "react", "angular", "next",
      "tailwind", "css", "html", "bootstrap",
      "framework", "frameworks",
    ],
    entities: ["react", "angular", "nextjs", "next.js", "tailwind", "bootstrap", "electron"],
    handler: (query) => {
      const frameworkCat = skillCategories.find(
        (c) => c.title.toLowerCase().includes("frame") || c.title.toLowerCase().includes("front")
      );

      // Check for specific tech
      const specific = findSpecificTech(query);
      if (specific) return specific;

      const skills = frameworkCat?.skills || [];
      return {
        text: `## Frontend & Frameworks 🎨\n\nHere's the frontend expertise:`,
        skills: skills.map((s) => ({ name: s.name, level: s.level, icon: s.icon })),
        type: "skills",
        suggestions: ["Backend skills?", "Show projects", "React details?"],
      };
    },
  },

  // ── Backend Skills ──
  {
    id: "backend",
    patterns: [
      "backend", "back end", "back-end", "server",
      "api", "cloud", "database", "db", "sql",
      "mongo", "mysql", "aws", "firebase",
      "cloudinary", "storage",
    ],
    entities: ["mongodb", "mysql", "aws", "firebase", "cloudinary", "node", "nestjs", "laravel"],
    handler: (query) => {
      const specific = findSpecificTech(query);
      if (specific) return specific;

      const cloudCat = skillCategories.find(
        (c) => c.title.toLowerCase().includes("cloud") || c.title.toLowerCase().includes("data")
      );
      const skills = cloudCat?.skills || [];
      return {
        text: `## Cloud & Database ☁️\n\nBackend and infrastructure skills:`,
        skills: skills.map((s) => ({ name: s.name, level: s.level, icon: s.icon })),
        type: "skills",
        suggestions: ["Frontend skills?", "Show projects", "AWS details?"],
      };
    },
  },

  // ── Languages ──
  {
    id: "languages",
    patterns: [
      "language", "programming language", "code in",
      "javascript", "typescript", "php", "java", "python", "c language",
    ],
    handler: (query) => {
      const specific = findSpecificTech(query);
      if (specific) return specific;

      const langCat = skillCategories.find((c) => c.title.toLowerCase().includes("lang"));
      const skills = langCat?.skills || [];
      return {
        text: `## Programming Languages 💻\n\nLanguages used in production:`,
        skills: skills.map((s) => ({ name: s.name, level: s.level, icon: s.icon })),
        type: "skills",
        suggestions: ["Frameworks?", "Show projects", "Tools used?"],
      };
    },
  },

  // ── Tools ──
  {
    id: "tools",
    patterns: [
      "tool", "software", "ide", "editor",
      "vscode", "vs code", "jira", "git", "github",
      "windsurf", "intellij", "discord", "teams",
    ],
    handler: () => {
      const toolsCat = skillCategories.find((c) => c.title.toLowerCase().includes("tool"));
      const skills = toolsCat?.skills || [];
      return {
        text: `## Development Tools 🛠️\n\nDaily drivers and productivity tools:`,
        skills: skills.map((s) => ({ name: s.name, level: s.level, icon: s.icon })),
        type: "skills",
        suggestions: ["Skills overview", "Show projects"],
      };
    },
  },

  // ── All Projects ──
  {
    id: "projects",
    patterns: [
      "project", "built", "portfolio", "work",
      "showcase", "developed", "created", "made",
      "applications", "apps", "websites",
    ],
    handler: (_q, isShort) => {
      const cards: ProjectCard[] = (isShort ? projects.filter((p) => p.featured) : projects).map((p) => ({
        title: p.title,
        description: p.description,
        techStack: p.techStack,
        period: p.period,
        liveUrl: p.liveUrl || undefined,
        githubUrl: p.githubUrl || undefined,
        image: p.image,
      }));

      return {
        text: isShort
          ? `Here are the **featured projects** 🚀`
          : `## All Projects 📁\n\nHere's everything that's been built:`,
        projectCards: cards,
        type: "projects",
        suggestions: [
          "Tell me about Trillium",
          "Bus Network details",
          "Streamline project",
        ],
      };
    },
  },

  // ── Trillium ──
  {
    id: "trillium",
    patterns: [
      "trillium", "healthcare", "clinic", "patient",
      "health card", "medical", "hospital", "doctor portal",
      "multi portal",
    ],
    handler: () => {
      const p = projects.find((pr) => pr.title.toLowerCase().includes("trillium"));
      if (!p) return fallbackResponse();

      return {
        text: `## ${p.title} 🏥\n\n📅 **${p.period}**\n\n${p.longDescription}`,
        projectCards: [{
          title: p.title,
          description: p.description,
          techStack: p.techStack,
          period: p.period,
          liveUrl: p.liveUrl || undefined,
          githubUrl: p.githubUrl || undefined,
        }],
        type: "projects",
        suggestions: ["Other projects?", "Tech stack used?", "Experience details"],
      };
    },
  },

  // ── Bus Network ──
  {
    id: "busnetwork",
    patterns: [
      "bus", "bus network", "booking", "tour",
      "transport", "school bus", "fleet",
      "chatgpt", "ai email",
    ],
    handler: () => {
      const p = projects.find((pr) => pr.title.toLowerCase().includes("bus"));
      if (!p) return fallbackResponse();

      return {
        text: `## ${p.title} 🚌\n\n📅 **${p.period}**\n\n${p.longDescription}`,
        projectCards: [{
          title: p.title,
          description: p.description,
          techStack: p.techStack,
          period: p.period,
          liveUrl: p.liveUrl || undefined,
          githubUrl: p.githubUrl || undefined,
        }],
        type: "projects",
        suggestions: ["Other projects?", "AI integration details?", "Skills used?"],
      };
    },
  },

  // ── Streamline ──
  {
    id: "streamline",
    patterns: [
      "streamline", "streaming", "movie", "video",
      "watch", "download", "subscribe", "stripe",
      "media", "entertainment",
    ],
    handler: () => {
      const p = projects.find((pr) => pr.title.toLowerCase().includes("stream"));
      if (!p) return fallbackResponse();

      return {
        text: `## ${p.title} 🎬\n\n📅 **${p.period}**\n\n${p.longDescription}`,
        projectCards: [{
          title: p.title,
          description: p.description,
          techStack: p.techStack,
          period: p.period,
          liveUrl: p.liveUrl || undefined,
          githubUrl: p.githubUrl || undefined,
        }],
        type: "projects",
        suggestions: ["Other projects?", "Stripe integration?", "All skills"],
      };
    },
  },

  // ── Experience ──
  {
    id: "experience",
    patterns: [
      "experience", "work history", "career", "job",
      "worked", "professional", "employment", "role",
      "company", "companies",
    ],
    handler: (_q, isShort) => {
      const workExps = experiences.filter((e) => e.type === "work");

      if (isShort) {
        const summary = workExps
          .map((e) => `• **${e.role}** at ${e.company} _(${e.period})_`)
          .join("\n");
        return {
          text: `## Work Experience 💼\n\n${summary}`,
          type: "experience",
          suggestions: ["Tell me about each role", "Education?", "Skills used?"],
        };
      }

      const detailed = workExps
        .map(
          (e) =>
            `### ${e.role} — ${e.company}\n📅 ${e.period}\n\n${e.description}\n\n🛠️ **Tech:** ${e.technologies.join(", ")}`
        )
        .join("\n\n---\n\n");

      return {
        text: `## Professional Experience 💼\n\n${detailed}`,
        type: "experience",
        suggestions: ["Education details?", "Show projects", "Contact info"],
      };
    },
  },

  // ── Education ──
  {
    id: "education",
    patterns: [
      "education", "degree", "college", "university",
      "btech", "b.tech", "cgpa", "study", "studied",
      "qualification", "academic", "school",
      "shantilal", "engineering",
    ],
    handler: () => {
      const edu = experiences.find((e) => e.type === "education");
      if (!edu) {
        return {
          text: "B.Tech in Information Technology with **8.16 CGPA** 🎓",
          type: "text",
          suggestions: ["Work experience?", "Projects built?"],
        };
      }

      return {
        text: `## Education 🎓\n\n### ${edu.role}\n🏛️ **${edu.company}**\n📅 ${edu.period}\n\n${edu.description}\n\n🛠️ **Technologies:** ${edu.technologies.join(", ")}`,
        type: "experience",
        suggestions: ["Work experience?", "Skills learned?", "Projects?"],
      };
    },
  },

  // ── Contact ──
  {
    id: "contact",
    patterns: [
      "contact", "reach", "connect", "email",
      "get in touch", "message", "mail", "talk",
      "communication", "social",
    ],
    handler: () => ({
      text: `## Let's Connect! 🤝\n\nHere are the best ways to reach **${personalInfo.name}**:`,
      links: [
        { label: `📧 ${personalInfo.email}`, url: `mailto:${personalInfo.email}`, icon: "📧" },
        { label: "🔗 GitHub Profile", url: personalInfo.githubUrl, icon: "🔗" },
        { label: "💼 LinkedIn", url: personalInfo.linkedinUrl, icon: "💼" },
        { label: "📄 Download Resume", url: personalInfo.resumeUrl, icon: "📄" },
      ],
      type: "contact",
      suggestions: ["About me", "Show projects", "Hiring info"],
    }),
  },

  // ── Hire / Availability ──
  {
    id: "hire",
    patterns: [
      "hire", "hiring", "freelance", "contract",
      "opportunity", "available", "open to",
      "looking for", "need developer", "work together",
      "collaborate", "availability",
    ],
    handler: () => ({
      text: `## Available for Opportunities! ✅\n\n${personalInfo.name} is currently open for:\n\n🟢 **Full-time roles** — Remote or on-site\n🟢 **Freelance projects** — Web applications\n🟢 **Contract work** — Short & long term\n\n💡 **Expertise:** ${skillCategories.flatMap(c => c.skills).sort((a, b) => b.level - a.level).slice(0, 5).map(s => s.name).join(", ")}\n\nDrop a message through the **Contact** section or email directly!`,
      links: [
        { label: `Email ${personalInfo.name}`, url: `mailto:${personalInfo.email}`, icon: "📧" },
        { label: "LinkedIn", url: personalInfo.linkedinUrl, icon: "💼" },
      ],
      type: "contact",
      suggestions: ["See projects", "Full skill list", "Download resume"],
    }),
  },

  // ── Resume ──
  {
    id: "resume",
    patterns: ["resume", "cv", "download resume", "curriculum"],
    handler: () => ({
      text: `## Resume 📄\n\nYou can download **${personalInfo.name}'s** resume directly:`,
      links: [
        { label: "📥 Download Resume (PDF)", url: personalInfo.resumeUrl, icon: "📄" },
      ],
      type: "text",
      suggestions: ["About me", "Experience", "Skills"],
    }),
  },

  // ── Blog ──
  {
    id: "blog",
    patterns: [
      "blog", "article", "post", "writing",
      "write", "content", "read",
    ],
    handler: () => {
      const postList = blogPosts
        .map((p) => `• **${p.title}** _(${p.readTime})_\n  ${p.excerpt.slice(0, 80)}...`)
        .join("\n\n");

      return {
        text: `## Blog & Articles ✍️\n\n${postList}`,
        links: [{ label: "📖 Read all articles", url: "/blog", icon: "📖" }],
        type: "text",
        suggestions: ["Skills?", "Projects?", "Contact?"],
      };
    },
  },

  // ── Specific Tech ──
  {
    id: "specific_react",
    patterns: ["react", "reactjs", "react.js", "react js"],
    handler: () => findSpecificTech("react") || fallbackResponse(),
  },
  {
    id: "specific_nextjs",
    patterns: ["next", "nextjs", "next.js", "next js"],
    handler: () => findSpecificTech("next") || fallbackResponse(),
  },
  {
    id: "specific_node",
    patterns: ["node", "nodejs", "node.js", "express"],
    handler: () => findSpecificTech("node") || fallbackResponse(),
  },
  {
    id: "specific_typescript",
    patterns: ["typescript", "ts"],
    handler: () => findSpecificTech("typescript") || fallbackResponse(),
  },
  {
    id: "specific_laravel",
    patterns: ["laravel", "php"],
    handler: () => findSpecificTech("laravel") || fallbackResponse(),
  },
  {
    id: "specific_angular",
    patterns: ["angular"],
    handler: () => findSpecificTech("angular") || fallbackResponse(),
  },
  {
    id: "specific_mongodb_q",
    patterns: ["mongo", "mongodb"],
    handler: () => findSpecificTech("mongo") || fallbackResponse(),
  },
  {
    id: "specific_aws",
    patterns: ["aws", "amazon", "s3"],
    handler: () => findSpecificTech("aws") || fallbackResponse(),
  },
  {
    id: "specific_nest",
    patterns: ["nest", "nestjs", "nest.js"],
    handler: () => findSpecificTech("nest") || fallbackResponse(),
  },
  {
    id: "specific_mern",
    patterns: ["mern", "mean", "full stack", "fullstack"],
    handler: () => ({
      text: `## Full Stack Expertise 🔥\n\nProficient in both **MERN** and **MEAN** stacks:\n\n**MERN:** MongoDB + Express + React + Node.js\n**MEAN:** MongoDB + Express + Angular + Node.js\n\nUsed across multiple production projects including **The Bus Network** (MERN) and **Trillium** (MEAN with Laravel backend).`,
      type: "text" as const,
      suggestions: ["Show MERN projects", "Angular projects?", "All skills"],
    }),
  },

  // ── Fun / Joke ──
  {
    id: "fun",
    patterns: ["fun", "interesting", "fact", "random", "surprise", "cool"],
    handler: () => {
      const facts = [
        `🍕 ${personalInfo.name} once solved a production bug at 3 AM. The secret weapon? Pizza and console.log.`,
        `⌨️ First ever program was a calculator in C. Could barely add — but look where we are now! 🚀`,
        `📝 ${personalInfo.name} writes TODO comments with proper grammar. Standards matter! 😄`,
        `☕ Average coffee consumption during a coding sprint: approximately infinite cups.`,
        `🎯 ${personalInfo.name}'s code review motto: "If it works but you can't explain it, it doesn't work."`,
      ];
      return {
        text: facts[Math.floor(Math.random() * facts.length)],
        type: "fun",
        suggestions: ["Tell a joke!", "Show projects", "Skills?"],
      };
    },
  },

  {
    id: "joke",
    patterns: ["joke", "funny", "laugh", "humor", "haha"],
    handler: () => {
      const jokes = [
        "🐛 Why do programmers prefer dark mode?\n\nBecause light attracts bugs!",
        '💻 A SQL query walks into a bar, sees two tables and asks:\n\n_"Can I JOIN you?"_',
        "🤣 Why was the JavaScript developer sad?\n\nBecause they didn't **Node** how to **Express** themselves!",
        "☕ There are only 10 types of people:\n\nThose who understand binary... and those who don't.",
        '🔧 A programmer\'s wife says "Go to the store and get a loaf of bread. If they have eggs, get a dozen."\n\nThe programmer returns with 12 loaves of bread. 🍞',
        "🐍 Why do Python programmers prefer snakes?\n\nBecause they don't like **Java**! ☕",
      ];
      return {
        text: jokes[Math.floor(Math.random() * jokes.length)],
        type: "fun",
        suggestions: ["Another joke!", "Show skills", "About you"],
      };
    },
  },

  // ── Thanks ──
  {
    id: "thanks",
    patterns: ["thanks", "thank you", "thx", "appreciate", "helpful", "great", "awesome", "nice"],
    handler: () => ({
      text: `You're welcome! 😊 Happy to help.\n\nAnything else you'd like to know about **${personalInfo.name}**?`,
      type: "text",
      suggestions: ["Skills", "Projects", "Contact info"],
    }),
  },

  // ── Goodbye ──
  {
    id: "bye",
    patterns: ["bye", "goodbye", "see you", "later", "cya", "quit", "exit"],
    handler: () => ({
      text: `Goodbye! 👋 It was great chatting with you.\n\nFeel free to come back anytime or reach out through the **Contact** section! ✨`,
      type: "text",
      links: [
        { label: "Contact Form", url: "#contact", icon: "📧" },
      ],
    }),
  },

  // ── Location ──
  {
    id: "location",
    patterns: ["where", "location", "based", "city", "country", "live", "from"],
    handler: () => ({
      text: `📍 Based in **${personalInfo.location}**\n\nOpen to **remote work** and collaboration with global teams! 🌍`,
      type: "text",
      suggestions: ["Contact info", "Hiring?", "About me"],
    }),
  },

  // ── This Site ──
  {
    id: "this_site",
    patterns: [
      "this site", "this website", "portfolio site",
      "built this", "how made", "tech behind",
    ],
    handler: () => ({
      text: `## This Portfolio Site 🌐\n\nBuilt with a modern, high-performance stack:\n\n⚡ **Next.js 15+** — App Router, Server Components\n📘 **TypeScript** — Full type safety\n🎨 **Tailwind CSS v4** — Utility-first styling\n✨ **Framer Motion** — Smooth animations\n🍃 **MongoDB** — Contact form & data storage\n🤖 **Custom AI Agent** — This chat!\n🔒 **Secure Admin Panel** — Password-protected CMS\n\nOptimized for **95+ Lighthouse score** and full **SEO compliance**.`,
      type: "text",
      suggestions: ["Show all skills", "See projects", "Contact"],
    }),
  },
];

// ── Find Specific Tech ──

function findSpecificTech(query: string): AIResponse | null {
  const q = query.toLowerCase();

  const techMap: Record<string, () => AIResponse> = {
    react: () => {
      const usedIn = projects.filter((p) => p.techStack.some((t) => t.toLowerCase().includes("react")));
      return {
        text: `## React ⚛️\n\nOne of the **primary skills** — used in production daily.\n\n**Proficiency:** Expert level\n**Stack:** React, React Hooks, Context API, Redux\n\n**Used in ${usedIn.length} project(s):**\n${usedIn.map((p) => `• ${p.title}`).join("\n")}`,
        skills: [{ name: "React / MERN", level: 90, icon: "⚛️" }],
        type: "skills",
        suggestions: ["Next.js skills?", "Show React projects", "Full stack?"],
      };
    },
    next: () => {
      const usedIn = projects.filter((p) => p.techStack.some((t) => t.toLowerCase().includes("next")));
      return {
        text: `## Next.js ▲\n\nGo-to framework for production apps. **This portfolio** is built with it!\n\n**Proficiency:** Advanced\n**Features:** App Router, Server Components, API Routes, SSR/SSG\n\n**Used in ${usedIn.length} project(s):**\n${usedIn.map((p) => `• ${p.title}`).join("\n")}`,
        skills: [{ name: "Next.js", level: 88, icon: "▲" }],
        type: "skills",
        suggestions: ["React skills?", "Show Next.js projects"],
      };
    },
    typescript: () => ({
      text: `## TypeScript 📘\n\nUsed in **every project** for type safety.\n\n**Proficiency:** Advanced\n**Features:** Generics, Utility Types, Strict Mode, Discriminated Unions\n\nBelief: _"If it compiles, it probably works."_ 😄`,
      skills: [{ name: "TypeScript", level: 85, icon: "📘" }],
      type: "skills",
      suggestions: ["JavaScript skills?", "Projects?"],
    }),
    laravel: () => {
      const usedIn = projects.filter((p) => p.techStack.some((t) => t.toLowerCase().includes("laravel")));
      return {
        text: `## Laravel 🔺\n\nPHP framework used for **enterprise-grade** applications.\n\n**Proficiency:** Advanced\n**Features:** Eloquent ORM, Middleware, Queue Jobs, REST APIs\n\n**Used in ${usedIn.length} project(s):**\n${usedIn.map((p) => `• ${p.title}`).join("\n")}`,
        skills: [{ name: "Laravel", level: 85, icon: "🔺" }],
        type: "skills",
        suggestions: ["Angular?", "Trillium details?"],
      };
    },
    angular: () => ({
      text: `## Angular 🅰️\n\nUsed in the **MEAN stack** and **Trillium** healthcare project.\n\n**Proficiency:** Advanced\n**Features:** Components, Services, RxJS, Routing, Forms`,
      skills: [{ name: "Angular (MEAN)", level: 80, icon: "🅰️" }],
      type: "skills",
      suggestions: ["Trillium project?", "React vs Angular?"],
    }),
    mongo: () => ({
      text: `## MongoDB 🍃\n\nPrimary NoSQL database used across multiple projects.\n\n**Proficiency:** Advanced\n**Features:** Aggregation Pipeline, Indexing, Atlas Cloud, Mongoose ODM\n\nUsed in **Streamline**, **The Bus Network**, and this **portfolio site**.`,
      skills: [{ name: "MongoDB", level: 88, icon: "🍃" }],
      type: "skills",
      suggestions: ["MySQL skills?", "AWS?", "Projects?"],
    }),
    aws: () => ({
      text: `## AWS ☁️\n\n**S3 Service** used for secure file storage.\n\n**Use cases:**\n• 🏥 Health card documents (Trillium)\n• 🎬 Media files (Streamline)\n• 📁 Secure document storage\n\nExperienced with IAM policies, bucket configuration, and pre-signed URLs.`,
      skills: [{ name: "AWS S3", level: 80, icon: "☁️" }],
      type: "skills",
      suggestions: ["Cloudinary?", "Show projects", "Firebase?"],
    }),
    nest: () => ({
      text: `## NestJS 🐱\n\nNode.js framework for scalable server-side applications.\n\n**Proficiency:** Advanced\n**Features:** Modules, Guards, Pipes, Interceptors, TypeORM\n\nUsed in **Streamline** for the backend API.`,
      skills: [{ name: "NestJS", level: 82, icon: "🐱" }],
      type: "skills",
      suggestions: ["Node.js?", "Streamline project?"],
    }),
    node: () => ({
      text: `## Node.js 🟢\n\nCore backend runtime for JavaScript/TypeScript projects.\n\n**Proficiency:** Expert\n**Frameworks:** Express, NestJS, Fastify\n**Features:** REST APIs, WebSocket, Worker Threads, Stream Processing`,
      skills: [{ name: "Node.js", level: 90, icon: "🟢" }],
      type: "skills",
      suggestions: ["Express?", "NestJS?", "Show projects"],
    }),
  };

  for (const [key, handler] of Object.entries(techMap)) {
    if (q.includes(key)) return handler();
  }

  return null;
}

// ── Fallback Response ──

function fallbackResponse(): AIResponse {
  return {
    text: `Hmm, I'm not sure about that one 🤔\n\nBut I can help with:\n\n🛠️ **Skills** — "What are your skills?"\n📁 **Projects** — "Show me your projects"\n💼 **Experience** — "Work history?"\n📧 **Contact** — "How to reach you?"\n🎓 **Education** — "Where did you study?"\n😄 **Fun** — "Tell me a joke!"\n\nTry one of these!`,
    type: "text",
    suggestions: ["Show skills", "All projects", "Contact info", "Tell a joke"],
  };
}

// ── Main AI Function ──

export function processQuery(question: string, sessionId?: string): AIResponse {
  const q = question.toLowerCase().trim();
  const tokens = tokenize(q);
  const isShort = q.split(/\s+/).length <= 4;
  const ctx = getContext(sessionId || "default");

  // 1. Exact phrase matching
  for (const intent of intents) {
    for (const pattern of intent.patterns) {
      if (q.includes(pattern)) {
        ctx.lastTopic = intent.id;
        return intent.handler(q, isShort, ctx);
      }
    }
  }

  // 2. Fuzzy token matching
  const allPatterns = intents.flatMap((intent) =>
    intent.patterns.map((p) => ({ pattern: p, intent }))
  );
  const patternStrings = allPatterns.map((p) => p.pattern);

  for (const token of tokens) {
    const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(
      token,
      patternStrings
    );

    if (bestMatch.rating > 0.65) {
      const matched = allPatterns[bestMatchIndex];
      ctx.lastTopic = matched.intent.id;
      return matched.intent.handler(q, isShort, ctx);
    }
  }

  // 3. Full query similarity
  const fullMatch = stringSimilarity.findBestMatch(q, patternStrings);
  if (fullMatch.bestMatch.rating > 0.45) {
    const matched = allPatterns[fullMatch.bestMatchIndex];
    ctx.lastTopic = matched.intent.id;
    return matched.intent.handler(q, isShort, ctx);
  }

  // 4. Context-based follow-up
  if (ctx.lastTopic && (q.includes("more") || q.includes("detail") || q.includes("elaborate") || q.includes("explain"))) {
    const lastIntent = intents.find((i) => i.id === ctx.lastTopic);
    if (lastIntent) {
      return lastIntent.handler(q, false, ctx);
    }
  }

  // 5. Fallback
  return fallbackResponse();
}

export function getSuggestedQuestions(): string[] {
  return [
    "What are your skills?",
    "Show me projects",
    "Work experience?",
    "How to contact?",
    "Tell me about Trillium",
    "Tell a joke 😄",
  ];
}