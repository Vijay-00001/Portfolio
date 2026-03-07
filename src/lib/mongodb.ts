// src/lib/mongodb.ts
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import type {
  ContactMessage,
  Project,
  PersonalInfo,
  SkillCategory,
  ExperienceItem,
  Testimonial,
} from "@/types";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || "portfolio";

interface MongoConnection {
  client: MongoClient;
  db: Db;
}

let cached: MongoConnection | null = null;

export async function connectToDatabase(): Promise<MongoConnection> {
  if (cached) return cached;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  const client = await MongoClient.connect(MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 60000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  const db = client.db(MONGODB_DB);
  cached = { client, db };
  return cached;
}

// ──────────── Contact Messages ────────────

export async function getContactCollection(): Promise<Collection<ContactMessage>> {
  const { db } = await connectToDatabase();
  return db.collection<ContactMessage>("contact_messages");
}

export async function insertContactMessage(
  message: Omit<ContactMessage, "createdAt" | "read">
): Promise<string> {
  const collection = await getContactCollection();
  const result = await collection.insertOne({
    ...message,
    createdAt: new Date(),
    read: false,
  });
  return result.insertedId.toString();
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const collection = await getContactCollection();
  const docs = await collection.find().sort({ createdAt: -1 }).toArray();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const collection = await getContactCollection();
  const result = await collection.deleteOne({ _id: id });
  return result.deletedCount === 1;
}

// ──────────── Projects ────────────

async function getProjectsCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection("projects");
}

export async function getProjects(): Promise<Project[]> {
  const col = await getProjectsCollection();
  const docs = await col.find().sort({ featured: -1 }).toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    title: d.title,
    description: d.description,
    longDescription: d.longDescription,
    image: d.image,
    techStack: d.techStack,
    githubUrl: d.githubUrl || "",
    liveUrl: d.liveUrl || "",
    featured: d.featured,
    period: d.period || "",
  }));
}

export async function createProject(
  project: Omit<Project, "id">
): Promise<string> {
  const col = await getProjectsCollection();
  const result = await col.insertOne({ ...project, createdAt: new Date() });
  return result.insertedId.toString();
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<boolean> {
  const col = await getProjectsCollection();
  const { id: _id, ...update } = data;
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...update, updatedAt: new Date() } }
  );
  return result.modifiedCount === 1;
}

export async function deleteProject(id: string): Promise<boolean> {
  const col = await getProjectsCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

// ──────────── Settings (Personal Info) ────────────

async function getSettingsCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection("site_settings");
}

export async function getSettings(): Promise<PersonalInfo | null> {
  const col = await getSettingsCollection();
  const doc = await col.findOne({ type: "personal_info" });
  if (!doc) return null;
  const { _id, type, ...rest } = doc;
  return rest as unknown as PersonalInfo;
}

export async function upsertSettings(data: PersonalInfo): Promise<boolean> {
  const col = await getSettingsCollection();
  const result = await col.updateOne(
    { type: "personal_info" },
    { $set: { ...data, type: "personal_info", updatedAt: new Date() } },
    { upsert: true }
  );
  return result.acknowledged;
}

// ──────────── Skills ────────────

async function getSkillsCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection("skill_categories");
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const col = await getSkillsCollection();
  const docs = await col.find().toArray();
  return docs.map((d) => ({
    title: d.title,
    icon: d.icon,
    skills: d.skills,
  }));
}

export async function upsertSkills(categories: SkillCategory[]): Promise<boolean> {
  const col = await getSkillsCollection();
  await col.deleteMany({});
  if (categories.length > 0) {
    await col.insertMany(categories.map((c) => ({ ...c })));
  }
  return true;
}

// ──────────── Experiences ────────────

async function getExperiencesCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection("experiences");
}

export async function getExperiences(): Promise<ExperienceItem[]> {
  const col = await getExperiencesCollection();
  const docs = await col.find().toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    type: d.type || "work",
    company: d.company,
    role: d.role,
    period: d.period,
    description: d.description,
    technologies: d.technologies,
    companyUrl: d.companyUrl || "",
  }));
}

// ──────────── Testimonials ────────────

async function getTestimonialsCollection(): Promise<Collection> {
  const { db } = await connectToDatabase();
  return db.collection("testimonials");
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const col = await getTestimonialsCollection();
  const docs = await col.find().toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    name: d.name,
    role: d.role,
    company: d.company,
    avatar: d.avatar,
    content: d.content,
    rating: d.rating,
  }));
}

// ──────────── Seed All Data ────────────

export async function seedAllData(data: {
  personalInfo: PersonalInfo;
  projects: Project[];
  skillCategories: SkillCategory[];
  experiences: ExperienceItem[];
  testimonials: Testimonial[];
}): Promise<void> {
  const { db } = await connectToDatabase();

  // Settings
  await db.collection("site_settings").deleteMany({});
  await db.collection("site_settings").insertOne({
    type: "personal_info",
    ...data.personalInfo,
  });

  // Projects
  await db.collection("projects").deleteMany({});
  if (data.projects.length > 0) {
    await db.collection("projects").insertMany(
      data.projects.map(({ id, ...rest }) => ({ ...rest }))
    );
  }

  // Skills
  await db.collection("skill_categories").deleteMany({});
  if (data.skillCategories.length > 0) {
    await db.collection("skill_categories").insertMany(
      data.skillCategories.map((c) => ({ ...c }))
    );
  }

  // Experiences
  await db.collection("experiences").deleteMany({});
  if (data.experiences.length > 0) {
    await db.collection("experiences").insertMany(
      data.experiences.map(({ id, ...rest }) => ({ ...rest }))
    );
  }

  // Testimonials
  await db.collection("testimonials").deleteMany({});
  if (data.testimonials.length > 0) {
    await db.collection("testimonials").insertMany(
      data.testimonials.map(({ id, ...rest }) => ({ ...rest }))
    );
  }
}

export async function saveChatLog(data: {
  sessionId: string;
  question: string;
  answer: string;
  category: string;
}): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    await db.collection("chat_logs").insertOne({
      ...data,
      createdAt: new Date(),
    });
  } catch {
    // Don't break chat if logging fails — silently skip
  }
}

export async function getChatLogs(): Promise<
  Array<{
    question: string;
    answer: string;
    category: string;
    createdAt: string;
  }>
> {
  try {
    const { db } = await connectToDatabase();
    const logs = await db
      .collection("chat_logs")
      .find()
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return logs.map((l) => ({
      question: l.question,
      answer: l.answer,
      category: l.category,
      createdAt: l.createdAt?.toISOString?.() || String(l.createdAt),
    }));
  } catch {
    return [];
  }
}