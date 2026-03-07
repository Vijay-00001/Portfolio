// src/components/ui/AIChatWidget.tsx
"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FormEvent,
  type CSSProperties,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageCircle,
  FiX,
  FiSend,
  FiLoader,
  FiCpu,
  FiExternalLink,
  FiChevronRight,
} from "react-icons/fi";
import { getSuggestedQuestions } from "@/lib/ai-engine";
import type {
  SkillBar,
  ProjectCard,
  LinkItem,
} from "@/lib/ai-engine";

// ── Message Type ──

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  skills?: SkillBar[];
  projectCards?: ProjectCard[];
  links?: LinkItem[];
  suggestions?: string[];
  timestamp: Date;
}

// ── Styles ──

const colors = {
  accent: "var(--color-accent)",
  accentFg: "var(--color-accent-foreground)",
  bg: "var(--color-background)",
  card: "var(--color-card)",
  fg: "var(--color-foreground)",
  muted: "var(--color-muted)",
  mutedFg: "var(--color-muted-foreground)",
  border: "var(--color-border)",
};

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36)
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          text: `Hey! 👋 I'm the **AI assistant** for this portfolio.\n\nAsk me anything about skills, projects, experience, or just say hi!`,
          suggestions: getSuggestedQuestions(),
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), sessionId }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: data.text || "Hmm, couldn't process that. Try again!",
        skills: data.skills,
        projectCards: data.projectCards,
        links: data.links,
        suggestions: data.suggestions,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Connection error! Please try again. 😅",
          timestamp: new Date(),
        },
      ]);
    }

    setLoading(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // ── Panel Styles ──

  const panelStyle: CSSProperties = {
    position: "fixed",
    bottom: isMobile ? "0" : "24px",
    right: isMobile ? "0" : "24px",
    zIndex: 91,
    width: isMobile ? "100vw" : "min(420px, calc(100vw - 32px))",
    height: isMobile ? "100vh" : "min(640px, calc(100vh - 80px))",
    borderRadius: isMobile ? "0" : "20px",
    background: colors.card,
    border: isMobile ? "none" : `1px solid ${colors.border}`,
    boxShadow: "0 12px 48px -8px rgb(0 0 0 / 0.18)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Chat"
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              zIndex: 90,
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: colors.accent,
              color: colors.accentFg,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 24px -4px color-mix(in srgb, ${colors.accent} 50%, transparent)`,
            }}
          >
            <FiMessageCircle style={{ width: "24px", height: "24px" }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={panelStyle}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderBottom: `1px solid ${colors.border}`,
                background: `color-mix(in srgb, ${colors.accent} 4%, ${colors.card})`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: `color-mix(in srgb, ${colors.accent} 15%, transparent)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiCpu style={{ width: "18px", height: "18px", color: colors.accent }} />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: colors.fg }}>AI Assistant</p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: colors.mutedFg,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#10b981",
                        display: "inline-block",
                      }}
                    />
                    Online — Ask me anything
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: colors.mutedFg,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = colors.muted)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <FiX style={{ width: "18px", height: "18px" }} />
              </button>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div style={{ maxWidth: "90%" }}>
                    {/* Message Bubble */}
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius:
                          msg.role === "user"
                            ? "14px 14px 4px 14px"
                            : "14px 14px 14px 4px",
                        background:
                          msg.role === "user" ? colors.accent : colors.muted,
                        color:
                          msg.role === "user" ? colors.accentFg : colors.fg,
                        fontSize: "13px",
                        lineHeight: "1.65",
                      }}
                    >
                      <RichText text={msg.text} isUser={msg.role === "user"} />
                    </div>

                    {/* Skill Bars */}
                    {msg.skills && msg.skills.length > 0 && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "12px",
                          borderRadius: "12px",
                          background: colors.muted,
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {msg.skills.map((skill) => (
                          <SkillBarComponent key={skill.name} skill={skill} />
                        ))}
                      </div>
                    )}

                    {/* Project Cards */}
                    {msg.projectCards && msg.projectCards.length > 0 && (
                      <div
                        style={{
                          marginTop: "8px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        {msg.projectCards.map((card) => (
                          <ProjectCardComponent key={card.title} card={card} />
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    {msg.links && msg.links.length > 0 && (
                      <div
                        style={{
                          marginTop: "8px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                        }}
                      >
                        {msg.links.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target={link.url.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              background: `color-mix(in srgb, ${colors.accent} 10%, transparent)`,
                              border: `1px solid color-mix(in srgb, ${colors.accent} 25%, transparent)`,
                              color: colors.accent,
                              fontSize: "12px",
                              fontWeight: 600,
                              textDecoration: "none",
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = `color-mix(in srgb, ${colors.accent} 18%, transparent)`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = `color-mix(in srgb, ${colors.accent} 10%, transparent)`;
                            }}
                          >
                            <span>{link.icon}</span>
                            {link.label}
                            <FiExternalLink style={{ width: "10px", height: "10px" }} />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div
                        style={{
                          marginTop: "8px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "5px",
                        }}
                      >
                        {msg.suggestions.map((s) => (
                          <button
                            key={s}
                            onClick={() => sendMessage(s)}
                            style={{
                              padding: "5px 10px",
                              borderRadius: "16px",
                              border: `1px solid ${colors.border}`,
                              background: "transparent",
                              color: colors.fg,
                              fontSize: "11px",
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 0.15s",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = colors.accent;
                              e.currentTarget.style.color = colors.accent;
                              e.currentTarget.style.background = `color-mix(in srgb, ${colors.accent} 5%, transparent)`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = colors.border;
                              e.currentTarget.style.color = colors.fg;
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <FiChevronRight style={{ width: "10px", height: "10px" }} />
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <div
                    style={{
                      padding: "10px 16px",
                      borderRadius: "14px 14px 14px 4px",
                      background: colors.muted,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "4px" }}>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: colors.mutedFg,
                          }}
                        />
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: colors.mutedFg,
                        fontStyle: "italic",
                      }}
                    >
                      Thinking...
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div
              style={{
                padding: "12px 14px",
                borderTop: `1px solid ${colors.border}`,
                background: colors.card,
              }}
            >
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  maxLength={500}
                  disabled={loading}
                  style={{
                    flex: 1,
                    height: "42px",
                    padding: "0 14px",
                    borderRadius: "12px",
                    border: `1px solid ${colors.border}`,
                    background: colors.bg,
                    color: colors.fg,
                    fontSize: isMobile ? "16px" : "13px",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = colors.accent)}
                  onBlur={(e) => (e.target.style.borderColor = colors.border)}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send"
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background:
                      input.trim() && !loading ? colors.accent : colors.muted,
                    color:
                      input.trim() && !loading
                        ? colors.accentFg
                        : colors.mutedFg,
                    border: "none",
                    cursor:
                      input.trim() && !loading ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  {loading ? (
                    <FiLoader
                      style={{
                        width: "16px",
                        height: "16px",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                  ) : (
                    <FiSend style={{ width: "16px", height: "16px" }} />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ──── Rich Text Renderer ────

function RichText({ text, isUser }: { text: string; isUser: boolean }) {
  if (isUser) return <span>{text}</span>;

  const lines = text.split("\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Heading ##
        if (trimmed.startsWith("## ")) {
          return (
            <p
              key={i}
              style={{
                fontSize: "15px",
                fontWeight: 800,
                marginTop: i > 0 ? "6px" : "0",
                marginBottom: "2px",
                letterSpacing: "-0.02em",
              }}
            >
              {renderInline(trimmed.replace("## ", ""))}
            </p>
          );
        }

        // Heading ###
        if (trimmed.startsWith("### ")) {
          return (
            <p
              key={i}
              style={{
                fontSize: "13px",
                fontWeight: 700,
                marginTop: i > 0 ? "6px" : "0",
              }}
            >
              {renderInline(trimmed.replace("### ", ""))}
            </p>
          );
        }

        // Horizontal rule
        if (trimmed === "---") {
          return (
            <hr
              key={i}
              style={{
                border: "none",
                borderTop: "1px solid var(--color-border)",
                margin: "6px 0",
              }}
            />
          );
        }

        // Bullet point
        if (trimmed.startsWith("• ") || trimmed.startsWith("- ")) {
          return (
            <p
              key={i}
              style={{
                fontSize: "12px",
                paddingLeft: "8px",
                display: "flex",
                gap: "6px",
              }}
            >
              <span style={{ color: "var(--color-accent)", flexShrink: 0 }}>
                •
              </span>
              <span>{renderInline(trimmed.replace(/^[•\-]\s*/, ""))}</span>
            </p>
          );
        }

        // Empty line
        if (trimmed === "") {
          return <div key={i} style={{ height: "4px" }} />;
        }

        // Regular text
        return (
          <p key={i} style={{ fontSize: "13px" }}>
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// ── Inline Markdown ──

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Italic _text_
    const italicMatch = remaining.match(/_(.+?)_/);

    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(
          <span key={key++}>{remaining.slice(0, boldMatch.index)}</span>
        );
      }
      parts.push(
        <strong key={key++} style={{ fontWeight: 700 }}>
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
    } else if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) {
        parts.push(
          <span key={key++}>{remaining.slice(0, italicMatch.index)}</span>
        );
      }
      parts.push(
        <em key={key++} style={{ fontStyle: "italic", opacity: 0.85 }}>
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
    } else {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }
  }

  return <>{parts}</>;
}

// ──── Skill Bar Component ────

function SkillBarComponent({ skill }: { skill: SkillBar }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "3px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "var(--color-foreground)",
          }}
        >
          <span>{skill.icon}</span>
          {skill.name}
        </span>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--color-accent)",
          }}
        >
          {skill.level}%
        </span>
      </div>
      <div
        style={{
          height: "6px",
          borderRadius: "3px",
          background: "var(--color-border)",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          style={{
            height: "100%",
            borderRadius: "3px",
            background: `linear-gradient(90deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 70%, #a855f7))`,
          }}
        />
      </div>
    </div>
  );
}

// ──── Project Card Component ────

function ProjectCardComponent({ card }: { card: ProjectCard }) {
  return (
    <div
      style={{
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid var(--color-border)",
        background: "var(--color-card)",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor =
          "color-mix(in srgb, var(--color-accent) 40%, transparent)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--color-border)")
      }
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "6px",
        }}
      >
        <h4
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--color-foreground)",
          }}
        >
          📁 {card.title}
        </h4>
        {card.period && (
          <span
            style={{
              fontSize: "10px",
              color: "var(--color-muted-foreground)",
              whiteSpace: "nowrap",
              flexShrink: 0,
              marginLeft: "8px",
            }}
          >
            {card.period}
          </span>
        )}
      </div>

      <p
        style={{
          fontSize: "11px",
          color: "var(--color-muted-foreground)",
          lineHeight: 1.5,
          marginBottom: "8px",
        }}
      >
        {card.description}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "3px",
          marginBottom: card.liveUrl || card.githubUrl ? "8px" : "0",
        }}
      >
        {card.techStack.map((tech) => (
          <span
            key={tech}
            style={{
              padding: "2px 7px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: 600,
              background:
                "color-mix(in srgb, var(--color-accent) 10%, transparent)",
              color: "var(--color-accent)",
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {(card.liveUrl || card.githubUrl) && (
        <div style={{ display: "flex", gap: "6px" }}>
          {card.liveUrl && (
            <a
              href={card.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "11px",
                color: "var(--color-accent)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              🔗 Live
            </a>
          )}
          {card.githubUrl && (
            <a
              href={card.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "11px",
                color: "var(--color-muted-foreground)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              💻 GitHub
            </a>
          )}
        </div>
      )}
    </div>
  );
}