// src/components/layout/Footer.tsx
import { personalInfo } from "@/data/portfolio";
import { FiGithub, FiLinkedin, FiMail, FiHeart } from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border bg-muted/30"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <p className="font-display text-2xl font-bold gradient-text">
              Vijay Chauhan<span className="text-accent">.</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Building the web, one pixel at a time.
            </p>
          </div>

          <nav className="flex justify-center gap-4" aria-label="Social links">
            <a
              href={personalInfo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-card border border-border hover:border-accent/50 hover:text-accent transition-all duration-300"
              aria-label="GitHub profile"
            >
              <FiGithub className="w-5 h-5" />
            </a>
            <a
              href={personalInfo.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-card border border-border hover:border-accent/50 hover:text-accent transition-all duration-300"
              aria-label="LinkedIn profile"
            >
              <FiLinkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="p-3 rounded-xl bg-card border border-border hover:border-accent/50 hover:text-accent transition-all duration-300"
              aria-label="Send email"
            >
              <FiMail className="w-5 h-5" />
            </a>
          </nav>

          <p className="text-sm text-muted-foreground text-center md:text-right flex items-center justify-center md:justify-end gap-1">
            © {currentYear} {personalInfo.name}. Made with{" "}
            <FiHeart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}