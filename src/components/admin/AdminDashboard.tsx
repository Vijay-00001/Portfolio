// src/components/admin/AdminDashboard.tsx
"use client";

import { useState, useEffect, useCallback, type FormEvent, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLogOut, FiFolder, FiMessageSquare, FiSettings, FiDatabase,
  FiPlus, FiEdit2, FiTrash2, FiLoader, FiExternalLink, FiCheckCircle,
  FiAlertCircle, FiMail, FiClock, FiSave, FiX, FiHome,
  FiChevronDown, FiChevronUp, FiGithub, FiMessageCircle,
} from "react-icons/fi";
import type { Project, ContactMessage, PersonalInfo } from "@/types";

type Tab = "projects" | "messages" | "settings" | "seed" | "chatLogs";

interface Notification {
  message: string;
  type: "success" | "error";
}

// ── Responsive helper ──
function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

// ── Shared Focus Handlers ──
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "var(--color-accent)";
  e.target.style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--color-accent) 12%, transparent)";
};

const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = "var(--color-border)";
  e.target.style.boxShadow = "none";
};

// ── Responsive Styles ──
function inputStyle(isMobile: boolean): CSSProperties {
  return {
    width: "100%",
    height: isMobile ? "44px" : "40px",
    padding: "0 12px",
    borderRadius: "10px",
    border: "1px solid var(--color-border)",
    background: "var(--color-background)",
    color: "var(--color-foreground)",
    fontSize: isMobile ? "16px" : "14px", // 16px prevents iOS zoom
    outline: "none",
    transition: "all 0.2s ease",
  };
}

function textareaStyle(isMobile: boolean): CSSProperties {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid var(--color-border)",
    background: "var(--color-background)",
    color: "var(--color-foreground)",
    fontSize: isMobile ? "16px" : "14px",
    outline: "none",
    resize: "none" as const,
    transition: "all 0.2s ease",
  };
}

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--color-foreground)",
  marginBottom: "6px",
};

function cardStyle(): CSSProperties {
  return {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: "14px",
  };
}

function btnPrimary(isMobile: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    height: isMobile ? "44px" : "40px",
    padding: isMobile ? "0 16px" : "0 18px",
    borderRadius: "10px",
    background: "var(--color-accent)",
    color: "var(--color-accent-foreground)",
    fontSize: "14px",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap" as const,
  };
}

const btnGhost: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  height: "36px",
  padding: "0 12px",
  borderRadius: "8px",
  background: "transparent",
  color: "var(--color-muted-foreground)",
  fontSize: "13px",
  fontWeight: 500,
  border: "none",
  cursor: "pointer",
  transition: "all 0.15s ease",
};

const btnIcon: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "34px",
  height: "34px",
  borderRadius: "8px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "var(--color-muted-foreground)",
  transition: "all 0.15s ease",
};

function gridCols(isMobile: boolean, cols = 2): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : `repeat(${cols}, 1fr)`,
    gap: "14px",
  };
}

// ── Spinner & Empty ──

function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
      <FiLoader className="animate-spin" style={{ width: "28px", height: "28px", color: "var(--color-accent)" }} />
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 20px", color: "var(--color-muted-foreground)" }}>
      <div style={{ opacity: 0.3, marginBottom: "12px" }}>{icon}</div>
      <p style={{ fontSize: "14px", textAlign: "center" }}>{text}</p>
    </div>
  );
}

// ──────── Main Dashboard ────────

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [notification, setNotification] = useState<Notification | null>(null);
  const router = useRouter();
  const isMobile = useIsMobile();

  const showNotification = useCallback(
    (message: string, type: "success" | "error") => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 4000);
    },
    []
  );

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "projects", label: "Projects", icon: <FiFolder className="w-4 h-4" /> },
    { id: "messages", label: "Messages", icon: <FiMessageSquare className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <FiSettings className="w-4 h-4" /> },
    { id: "chatLogs", label: "Chat Logs", icon: <FiMessageCircle className="w-4 h-4" /> },
    { id: "seed", label: "Seed", icon: <FiDatabase className="w-4 h-4" /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background)" }}>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: "fixed",
              top: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 600,
              maxWidth: "calc(100vw - 32px)",
              boxShadow: "0 8px 32px -4px rgb(0 0 0 / 0.12)",
              background: notification.type === "success"
                ? "color-mix(in srgb, #10b981 12%, var(--color-card))"
                : "color-mix(in srgb, #ef4444 12%, var(--color-card))",
              border: `1px solid ${notification.type === "success"
                ? "color-mix(in srgb, #10b981 30%, transparent)"
                : "color-mix(in srgb, #ef4444 30%, transparent)"}`,
              color: notification.type === "success" ? "#059669" : "#dc2626",
            }}
          >
            {notification.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "color-mix(in srgb, var(--color-card) 85%, transparent)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "0 16px" : "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: isMobile ? "56px" : "64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <a
              href="/"
              style={{ ...btnIcon }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-muted)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <FiHome className="w-[18px] h-[18px]" />
            </a>
            <div style={{ width: "1px", height: "20px", background: "var(--color-border)" }} />
            <h1 style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: 700, color: "var(--color-foreground)" }}>
              Dashboard
            </h1>
          </div>

          <button
            onClick={handleLogout}
            style={btnGhost}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-muted)"; e.currentTarget.style.color = "#dc2626"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-muted-foreground)"; }}
          >
            <FiLogOut className="w-4 h-4" />
            {!isMobile && <span>Logout</span>}
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "20px 16px" : "32px 24px" }}>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            marginBottom: isMobile ? "20px" : "32px",
            padding: "4px",
            borderRadius: "12px",
            background: "var(--color-muted)",
            overflowX: "auto" as const,
            WebkitOverflowScrolling: "touch" as const,
            scrollbarWidth: "none" as const,
            msOverflowStyle: "none" as const,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                height: isMobile ? "38px" : "36px",
                padding: isMobile ? "0 14px" : "0 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: activeTab === tab.id ? 600 : 500,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap" as const,
                flexShrink: 0,
                background: activeTab === tab.id ? "var(--color-accent)" : "transparent",
                color: activeTab === tab.id ? "var(--color-accent-foreground)" : "var(--color-muted-foreground)",
              }}
            >
              {tab.icon}
              {(!isMobile || activeTab === tab.id) && tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "projects" && <ProjectsTab showNotification={showNotification} isMobile={isMobile} />}
            {activeTab === "messages" && <MessagesTab showNotification={showNotification} isMobile={isMobile} />}
            {activeTab === "settings" && <SettingsTab showNotification={showNotification} isMobile={isMobile} />}
            {activeTab === "chatLogs" && <ChatLogsTab isMobile={isMobile} />}
            {activeTab === "seed" && <SeedTab showNotification={showNotification} isMobile={isMobile} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ──────── Section Header ────────

function SectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap" as const, gap: "12px" }}>
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--color-foreground)", letterSpacing: "-0.02em" }}>{title}</h2>
        <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", marginTop: "2px" }}>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

// ──────── Projects Tab ────────

function ProjectsTab({ showNotification, isMobile }: { showNotification: (m: string, t: "success" | "error") => void; isMobile: boolean }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", longDescription: "", image: "", techStack: "", githubUrl: "", liveUrl: "", featured: true, period: "" });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/admin/projects"); if (res.ok) setProjects(await res.json()); }
    catch { showNotification("Failed to load projects", "error"); }
    setLoading(false);
  }, [showNotification]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const resetForm = () => { setFormData({ title: "", description: "", longDescription: "", image: "", techStack: "", githubUrl: "", liveUrl: "", featured: true, period: "" }); setEditingId(null); setShowForm(false); };

  const openEdit = (p: Project) => { setFormData({ title: p.title, description: p.description, longDescription: p.longDescription, image: p.image, techStack: p.techStack.join(", "), githubUrl: p.githubUrl || "", liveUrl: p.liveUrl || "", featured: p.featured, period: p.period || "" }); setEditingId(p.id); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setSaving(true);
    const body = { ...formData, techStack: formData.techStack.split(",").map((t) => t.trim()).filter(Boolean) };
    try {
      const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
      const res = await fetch(url, { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { showNotification(editingId ? "Updated!" : "Created!", "success"); resetForm(); fetchProjects(); }
      else { const d = await res.json(); showNotification(d.error || "Failed", "error"); }
    } catch { showNotification("Network error", "error"); }
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try { const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" }); if (res.ok) { showNotification("Deleted", "success"); fetchProjects(); } }
    catch { showNotification("Failed", "error"); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""}`}
        action={
          <button onClick={() => { resetForm(); setShowForm(true); }} style={btnPrimary(isMobile)}>
            <FiPlus className="w-4 h-4" /> Add
          </button>
        }
      />

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden", marginBottom: "20px" }}>
            <form onSubmit={handleSubmit} style={{ ...cardStyle(), padding: isMobile ? "20px" : "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", paddingBottom: "14px", borderBottom: "1px solid var(--color-border)" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-foreground)" }}>{editingId ? "Edit Project" : "New Project"}</h3>
                <button type="button" onClick={resetForm} style={btnIcon}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-muted)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <FiX className="w-[16px] h-[16px]" />
                </button>
              </div>

              <div style={gridCols(isMobile)}>
                <div><label style={labelStyle}>Title *</label><input value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} required placeholder="Project Name" style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
                <div><label style={labelStyle}>Period</label><input value={formData.period} onChange={(e) => setFormData((p) => ({ ...p, period: e.target.value }))} placeholder="Jan 2025 — Present" style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
              </div>

              <div style={{ marginTop: "14px" }}><label style={labelStyle}>Short Description *</label><textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} required rows={2} placeholder="Brief overview..." style={textareaStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>

              <div style={{ marginTop: "14px" }}><label style={labelStyle}>Long Description</label><textarea value={formData.longDescription} onChange={(e) => setFormData((p) => ({ ...p, longDescription: e.target.value }))} rows={3} placeholder="Details..." style={textareaStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>

              <div style={{ ...gridCols(isMobile), marginTop: "14px" }}>
                <div><label style={labelStyle}>Image URL</label><input value={formData.image} onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))} placeholder="https://..." style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
                <div><label style={labelStyle}>Tech Stack (comma)</label><input value={formData.techStack} onChange={(e) => setFormData((p) => ({ ...p, techStack: e.target.value }))} placeholder="React, Node.js" style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
              </div>

              <div style={{ ...gridCols(isMobile), marginTop: "14px" }}>
                <div><label style={labelStyle}>GitHub URL</label><input value={formData.githubUrl} onChange={(e) => setFormData((p) => ({ ...p, githubUrl: e.target.value }))} style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
                <div><label style={labelStyle}>Live URL</label><input value={formData.liveUrl} onChange={(e) => setFormData((p) => ({ ...p, liveUrl: e.target.value }))} style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
              </div>

              <div style={{ marginTop: "14px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", color: "var(--color-foreground)" }}>
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))} style={{ width: "18px", height: "18px", accentColor: "var(--color-accent)" }} />
                  Featured project
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--color-border)", flexWrap: "wrap" as const }}>
                <button type="submit" disabled={saving} style={{ ...btnPrimary(isMobile), opacity: saving ? 0.6 : 1 }}>
                  {saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />}
                  {editingId ? "Update" : "Create"}
                </button>
                <button type="button" onClick={resetForm} style={{ ...btnPrimary(isMobile), background: "transparent", color: "var(--color-foreground)", border: "1px solid var(--color-border)" }}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {projects.length === 0 ? <EmptyState icon={<FiFolder style={{ width: "40px", height: "40px" }} />} text='No projects yet.' /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {projects.map((p) => (
            <div key={p.id} style={{ ...cardStyle(), padding: isMobile ? "14px" : "14px 18px", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-accent) 40%, transparent)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}>
              <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", gap: "12px", flexDirection: isMobile ? "column" : "row" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" as const }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-foreground)" }}>{p.title}</span>
                    {p.featured && <span style={{ padding: "1px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: 600, background: "color-mix(in srgb, var(--color-accent) 12%, transparent)", color: "var(--color-accent)" }}>Featured</span>}
                    {p.period && <span style={{ fontSize: "11px", color: "var(--color-muted-foreground)" }}>{p.period}</span>}
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)", marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: isMobile ? "normal" : "nowrap" as const }}>{p.description}</p>
                </div>
                <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={btnIcon}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-muted)"; e.currentTarget.style.color = "var(--color-accent)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-muted-foreground)"; }}><FiExternalLink className="w-4 h-4" /></a>}
                  {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" style={btnIcon}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-muted)"; e.currentTarget.style.color = "var(--color-foreground)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-muted-foreground)"; }}><FiGithub className="w-4 h-4" /></a>}
                  <button onClick={() => openEdit(p)} style={btnIcon}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-muted)"; e.currentTarget.style.color = "var(--color-accent)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-muted-foreground)"; }}><FiEdit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id, p.title)} style={btnIcon}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, #ef4444 8%, transparent)"; e.currentTarget.style.color = "#ef4444"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-muted-foreground)"; }}><FiTrash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────── Messages Tab ────────

function MessagesTab({ showNotification, isMobile }: { showNotification: (m: string, t: "success" | "error") => void; isMobile: boolean }) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/admin/messages"); if (res.ok) setMessages(await res.json()); }
    catch { showNotification("Failed to load", "error"); }
    setLoading(false);
  }, [showNotification]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" }); if (res.ok) { showNotification("Deleted", "success"); setMessages((p) => p.filter((m) => m._id !== id)); } }
    catch { showNotification("Failed", "error"); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Messages" subtitle={`${messages.length} received`} />
      {messages.length === 0 ? <EmptyState icon={<FiMessageSquare style={{ width: "40px", height: "40px" }} />} text="No messages yet." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {messages.map((msg) => (
            <div key={msg._id} style={{ ...cardStyle(), overflow: "hidden" }}>
              <button onClick={() => setExpandedId(expandedId === msg._id ? null : (msg._id ?? null))}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: isMobile ? "14px" : "14px 18px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" as const, transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-muted)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "color-mix(in srgb, var(--color-accent) 12%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FiMail style={{ width: "16px", height: "16px", color: "var(--color-accent)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" as const }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)" }}>{msg.name}</span>
                    {!isMobile && <span style={{ fontSize: "12px", color: "var(--color-muted-foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{msg.email}</span>}
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{msg.message}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  <span style={{ fontSize: "11px", color: "var(--color-muted-foreground)", display: "flex", alignItems: "center", gap: "3px" }}>
                    <FiClock style={{ width: "10px", height: "10px" }} />
                    {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  {expandedId === msg._id ? <FiChevronUp style={{ width: "14px", height: "14px", color: "var(--color-muted-foreground)" }} /> : <FiChevronDown style={{ width: "14px", height: "14px", color: "var(--color-muted-foreground)" }} />}
                </div>
              </button>

              <AnimatePresence>
                {expandedId === msg._id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
                    <div style={{ padding: isMobile ? "0 14px 14px" : "0 18px 18px", borderTop: "1px solid var(--color-border)", paddingTop: "14px" }}>
                      {isMobile && <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)", marginBottom: "8px" }}>{msg.email}</p>}
                      <div style={{ padding: "14px", borderRadius: "10px", background: "var(--color-muted)", fontSize: "13px", lineHeight: 1.7, whiteSpace: "pre-wrap" as const, marginBottom: "12px", color: "var(--color-foreground)" }}>{msg.message}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "8px" }}>
                        <span style={{ fontSize: "11px", color: "var(--color-muted-foreground)" }}>{new Date(msg.createdAt).toLocaleString()}</span>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <a href={`mailto:${msg.email}`} style={{ ...btnGhost, color: "var(--color-accent)", fontSize: "12px" }}><FiMail className="w-3.5 h-3.5" /> Reply</a>
                          <button onClick={() => handleDelete(msg._id!)} style={{ ...btnGhost, color: "#ef4444", fontSize: "12px" }}><FiTrash2 className="w-3.5 h-3.5" /> Delete</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────── Settings Tab ────────

function SettingsTab({ showNotification, isMobile }: { showNotification: (m: string, t: "success" | "error") => void; isMobile: boolean }) {
  const [settings, setSettings] = useState<PersonalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try { const res = await fetch("/api/admin/settings"); if (res.ok) setSettings(await res.json()); }
      catch { showNotification("Failed to load", "error"); }
      setLoading(false);
    })();
  }, [showNotification]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault(); if (!settings) return; setSaving(true);
    try { const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) }); if (res.ok) showNotification("Saved!", "success"); else showNotification("Failed", "error"); }
    catch { showNotification("Error", "error"); }
    setSaving(false);
  };

  const u = (f: keyof PersonalInfo, v: string) => setSettings((p) => (p ? { ...p, [f]: v } : p));

  if (loading || !settings) return <Spinner />;

  return (
    <form onSubmit={handleSave}>
      <SectionHeader title="Settings" subtitle="Update personal information"
        action={<button type="submit" disabled={saving} style={{ ...btnPrimary(isMobile), opacity: saving ? 0.6 : 1 }}>{saving ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSave className="w-4 h-4" />} Save</button>} />

      {/* Basic */}
      <div style={{ ...cardStyle(), padding: isMobile ? "20px" : "24px", marginBottom: "12px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-muted-foreground)", marginBottom: "16px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Basic Info</p>
        <div style={gridCols(isMobile)}>
          <div><label style={labelStyle}>Name</label><input value={settings.name} onChange={(e) => u("name", e.target.value)} style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
          <div><label style={labelStyle}>Title</label><input value={settings.title} onChange={(e) => u("title", e.target.value)} style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
        </div>
        <div style={{ marginTop: "14px" }}><label style={labelStyle}>Description</label><textarea value={settings.description} onChange={(e) => u("description", e.target.value)} rows={2} style={textareaStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
        <div style={{ marginTop: "14px" }}><label style={labelStyle}>Full Bio</label><textarea value={settings.longBio} onChange={(e) => u("longBio", e.target.value)} rows={4} style={textareaStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
      </div>

      {/* Contact */}
      <div style={{ ...cardStyle(), padding: isMobile ? "20px" : "24px", marginBottom: "12px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-muted-foreground)", marginBottom: "16px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>Contact</p>
        <div style={gridCols(isMobile)}>
          <div><label style={labelStyle}>Email</label><input value={settings.email} onChange={(e) => u("email", e.target.value)} style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
          <div><label style={labelStyle}>Location</label><input value={settings.location} onChange={(e) => u("location", e.target.value)} style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
        </div>
      </div>

      {/* URLs */}
      <div style={{ ...cardStyle(), padding: isMobile ? "20px" : "24px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-muted-foreground)", marginBottom: "16px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>URLs</p>
        <div style={gridCols(isMobile)}>
          <div><label style={labelStyle}>Avatar</label><input value={settings.avatarUrl} onChange={(e) => u("avatarUrl", e.target.value)} style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
          <div><label style={labelStyle}>Resume</label><input value={settings.resumeUrl} onChange={(e) => u("resumeUrl", e.target.value)} style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
        </div>
        <div style={{ ...gridCols(isMobile, isMobile ? 1 : 3), marginTop: "14px" }}>
          <div><label style={labelStyle}>GitHub</label><input value={settings.githubUrl} onChange={(e) => u("githubUrl", e.target.value)} style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
          <div><label style={labelStyle}>LinkedIn</label><input value={settings.linkedinUrl} onChange={(e) => u("linkedinUrl", e.target.value)} style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
          <div><label style={labelStyle}>Twitter</label><input value={settings.twitterUrl || ""} onChange={(e) => u("twitterUrl", e.target.value)} style={inputStyle(isMobile)} onFocus={onFocus} onBlur={onBlur} /></div>
        </div>
      </div>
    </form>
  );
}

// ──────── Chat Logs Tab ────────

function ChatLogsTab({ isMobile }: { isMobile: boolean }) {
  const [logs, setLogs] = useState<Array<{ question: string; answer: string; category: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const res = await fetch("/api/admin/chat-logs"); if (res.ok) setLogs(await res.json()); }
      catch { /* silently fail */ }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Chat Logs" subtitle={`${logs.length} conversation${logs.length !== 1 ? "s" : ""}`} />
      {logs.length === 0 ? <EmptyState icon={<FiMessageCircle style={{ width: "40px", height: "40px" }} />} text="No chat logs yet." /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {logs.map((log, i) => (
            <div key={i} style={{ ...cardStyle(), padding: isMobile ? "14px" : "14px 18px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flexDirection: isMobile ? "column" : "row" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-foreground)", marginBottom: "4px" }}>Q: {log.question}</p>
                  <p style={{ fontSize: "12px", color: "var(--color-muted-foreground)", lineHeight: 1.5 }}>A: {log.answer.slice(0, 150)}{log.answer.length > 150 ? "..." : ""}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <span style={{ padding: "2px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: 600, background: "color-mix(in srgb, var(--color-accent) 12%, transparent)", color: "var(--color-accent)" }}>{log.category}</span>
                  <span style={{ fontSize: "11px", color: "var(--color-muted-foreground)" }}>
                    {new Date(log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────── Seed Tab ────────

function SeedTab({ showNotification, isMobile }: { showNotification: (m: string, t: "success" | "error") => void; isMobile: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    if (!confirm("Replace all DB data with static file? Contact messages won't be affected.")) return;
    setLoading(true);
    try { const res = await fetch("/api/admin/seed", { method: "POST" }); const d = await res.json(); if (res.ok) showNotification(d.message || "Seeded!", "success"); else showNotification(d.error || "Failed", "error"); }
    catch { showNotification("Error", "error"); }
    setLoading(false);
  };

  return (
    <div>
      <SectionHeader title="Seed Database" subtitle="Populate from static data file" />
      <div style={{ ...cardStyle(), padding: isMobile ? "20px" : "24px" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "color-mix(in srgb, var(--color-accent) 12%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FiDatabase style={{ width: "20px", height: "20px", color: "var(--color-accent)" }} />
          </div>
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-foreground)", marginBottom: "6px" }}>Populate from Static File</h3>
            <p style={{ fontSize: "13px", color: "var(--color-muted-foreground)", lineHeight: 1.6 }}>
              Reads data from <code style={{ padding: "1px 6px", borderRadius: "5px", background: "var(--color-muted)", fontSize: "11px", fontFamily: "monospace" }}>src/data/portfolio.ts</code> and inserts into MongoDB.
            </p>
          </div>
        </div>

        <div style={{ marginTop: "16px", padding: "12px 14px", borderRadius: "10px", background: "color-mix(in srgb, #f59e0b 6%, transparent)", border: "1px solid color-mix(in srgb, #f59e0b 20%, transparent)", fontSize: "12px", fontWeight: 500, color: "#b45309", display: "flex", alignItems: "center", gap: "8px" }}>
          <FiAlertCircle style={{ width: "16px", height: "16px", flexShrink: 0 }} />
          Contact messages and chat logs will NOT be affected.
        </div>

        <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--color-border)" }}>
          <button onClick={handleSeed} disabled={loading} style={{ ...btnPrimary(isMobile), height: "46px", padding: "0 24px", opacity: loading ? 0.6 : 1 }}>
            {loading ? <><FiLoader className="w-4 h-4 animate-spin" /> Seeding...</> : <><FiDatabase className="w-4 h-4" /> Seed All Data</>}
          </button>
        </div>
      </div>
    </div>
  );
}