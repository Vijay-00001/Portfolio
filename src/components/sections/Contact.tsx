// src/components/sections/Contact.tsx
"use client";

import { useState, type FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useToast } from "@/components/providers/ToastProvider";
import { usePortfolioData } from "@/components/providers/DataProvider";
import { FiSend, FiMail, FiMapPin, FiLoader } from "react-icons/fi";

export default function Contact() {
  const { personalInfo } = usePortfolioData();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors([]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrors([]);

    const clientErrors: string[] = [];
    if (formData.name.trim().length < 2) clientErrors.push("Name must be at least 2 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) clientErrors.push("Please enter a valid email.");
    if (formData.message.trim().length < 10) clientErrors.push("Message must be at least 10 characters.");

    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.join(", ") || "Something went wrong.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      addToast("Message sent successfully! I'll get back to you soon.", "success");
    } catch (err) {
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : "Failed to send message.";
      addToast(errorMessage, "error");
      setErrors([errorMessage]);
    }
  };

  const inputClasses =
    "w-full px-4 py-3.5 rounded-2xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300 text-sm";

  return (
    <section id="contact" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <SectionHeading title="Get In Touch" subtitle="Contact Me" />

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <h3 className="font-display text-2xl font-bold">
              Let&apos;s work together
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Have a project in mind or just want to say hello? Fill out the form
              and I&apos;ll get back to you within 24 hours.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-3 rounded-xl bg-accent/10 text-accent">
                  <FiMail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="font-medium hover:text-accent transition-colors"
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-3 rounded-xl bg-accent/10 text-accent">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Location</p>
                  <p className="font-medium">{personalInfo.location}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 p-6 md:p-8 rounded-3xl bg-card border border-border luxury-shadow"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required maxLength={100} className={inputClasses} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required maxLength={254} className={inputClasses} />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about your project..." required rows={5} maxLength={5000} className={`${inputClasses} resize-none`} />
              </div>

              {errors.length > 0 && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800">
                  {errors.map((error) => (
                    <p key={error} className="text-xs text-red-600 dark:text-red-400">{error}</p>
                  ))}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-accent text-accent-foreground font-semibold text-sm shadow-lg shadow-accent/25 hover:shadow-accent/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
              >
                {status === "loading" ? (
                  <><FiLoader className="w-4 h-4 animate-spin" />Sending...</>
                ) : (
                  <><FiSend className="w-4 h-4" />Send Message</>
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}