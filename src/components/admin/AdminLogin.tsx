// src/components/admin/AdminLogin.tsx
"use client";

import { useState, type FormEvent, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiLock, FiLoader, FiAlertCircle, FiEye, FiEyeOff, FiShield } from "react-icons/fi";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid password");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  // ── Inline Styles (immune to Tailwind v4 issues) ──

  const pageStyle: CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    background: "var(--color-background)",
    position: "relative",
    overflow: "hidden",
  };

  const bgOrb1: CSSProperties = {
    position: "absolute",
    top: "-120px",
    right: "-120px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "color-mix(in srgb, var(--color-accent) 8%, transparent)",
    filter: "blur(80px)",
    pointerEvents: "none",
  };

  const bgOrb2: CSSProperties = {
    position: "absolute",
    bottom: "-120px",
    left: "-120px",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background: "color-mix(in srgb, #a855f7 6%, transparent)",
    filter: "blur(80px)",
    pointerEvents: "none",
  };

  const wrapperStyle: CSSProperties = {
    width: "100%",
    maxWidth: "420px",
    position: "relative",
    zIndex: 1,
  };

  const iconWrapperStyle: CSSProperties = {
    width: "80px",
    height: "80px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 15%, transparent), color-mix(in srgb, #a855f7 10%, transparent))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    border: "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)",
  };

  const titleStyle: CSSProperties = {
    fontSize: "30px",
    fontWeight: 800,
    color: "var(--color-foreground)",
    letterSpacing: "-0.03em",
    lineHeight: 1.2,
    fontFamily: "var(--font-display)",
  };

  const subtitleStyle: CSSProperties = {
    fontSize: "15px",
    color: "var(--color-muted-foreground)",
    marginTop: "8px",
    lineHeight: 1.5,
  };

  const cardStyle: CSSProperties = {
    marginTop: "36px",
    padding: "32px",
    borderRadius: "20px",
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.02), 0 12px 40px -8px rgb(0 0 0 / 0.08)",
  };

  const labelStyle: CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--color-foreground)",
    marginBottom: "8px",
    letterSpacing: "0.01em",
  };

  const inputWrapperStyle: CSSProperties = {
    position: "relative",
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    height: "52px",
    padding: "0 48px 0 16px",
    borderRadius: "14px",
    border: "1.5px solid var(--color-border)",
    background: "var(--color-background)",
    color: "var(--color-foreground)",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s ease",
  };

  const eyeBtnStyle: CSSProperties = {
    position: "absolute",
    right: "4px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "var(--color-muted-foreground)",
    transition: "all 0.15s ease",
  };

  const errorStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    borderRadius: "12px",
    background: "color-mix(in srgb, #ef4444 6%, transparent)",
    border: "1px solid color-mix(in srgb, #ef4444 20%, transparent)",
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: 500,
    marginTop: "16px",
  };

  const submitBtnStyle: CSSProperties = {
    width: "100%",
    height: "52px",
    borderRadius: "14px",
    background: "var(--color-accent)",
    color: "var(--color-accent-foreground)",
    fontSize: "15px",
    fontWeight: 700,
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
    transition: "all 0.2s ease",
    opacity: loading || !password.trim() ? 0.6 : 1,
    letterSpacing: "0.01em",
  };

  const securityBadgeStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    marginTop: "20px",
    padding: "10px",
    borderRadius: "10px",
    background: "color-mix(in srgb, #10b981 6%, transparent)",
    border: "1px solid color-mix(in srgb, #10b981 15%, transparent)",
    fontSize: "12px",
    fontWeight: 500,
    color: "#059669",
  };

  const backLinkStyle: CSSProperties = {
    display: "block",
    textAlign: "center",
    marginTop: "32px",
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--color-muted-foreground)",
    textDecoration: "none",
    transition: "color 0.2s ease",
  };

  return (
    <div style={pageStyle}>
      {/* Background orbs */}
      <div style={bgOrb1} />
      <div style={bgOrb2} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        style={wrapperStyle}
      >
        {/* Header */}
        <div style={{ textAlign: "center" }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={iconWrapperStyle}
          >
            <FiLock style={{ width: "32px", height: "32px", color: "var(--color-accent)" }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={titleStyle}
          >
            Admin Panel
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={subtitleStyle}
          >
            Enter your credentials to manage the portfolio
          </motion.p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={cardStyle}
        >
          <form onSubmit={handleSubmit}>
            {/* Password Field */}
            <div>
              <label htmlFor="admin-password" style={labelStyle}>
                Password
              </label>
              <div style={inputWrapperStyle}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="admin-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your admin password"
                  autoFocus
                  autoComplete="current-password"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-accent)";
                    e.target.style.boxShadow = "0 0 0 4px color-mix(in srgb, var(--color-accent) 12%, transparent)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeBtnStyle}
                  tabIndex={-1}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-muted)";
                    e.currentTarget.style.color = "var(--color-foreground)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--color-muted-foreground)";
                  }}
                >
                  {showPassword ? (
                    <FiEyeOff style={{ width: "18px", height: "18px" }} />
                  ) : (
                    <FiEye style={{ width: "18px", height: "18px" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={errorStyle}
              >
                <FiAlertCircle style={{ width: "16px", height: "16px", flexShrink: 0 }} />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !password.trim()}
              style={submitBtnStyle}
              onMouseEnter={(e) => {
                if (!loading && password.trim()) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 20px -4px color-mix(in srgb, var(--color-accent) 40%, transparent)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {loading ? (
                <>
                  <FiLoader style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }} />
                  Verifying...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Security Badge */}
            <div style={securityBadgeStyle}>
              <FiShield style={{ width: "14px", height: "14px" }} />
              Secured with HMAC-SHA256 authentication
            </div>
          </form>
        </motion.div>

        {/* Back Link */}
        <a
          href="/"
          style={backLinkStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted-foreground)")}
        >
          ← Back to website
        </a>
      </motion.div>
    </div>
  );
}