// src/lib/sanitize.ts
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#96;",
};

const ENTITY_REGEX = /[&<>"'`/]/g;

export function escapeHtml(str: string): string {
  return str.replace(ENTITY_REGEX, (char) => HTML_ENTITIES[char] || char);
}

export function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

export function sanitizeInput(input: string, maxLength = 1000): string {
  let sanitized = input.trim();
  sanitized = stripHtmlTags(sanitized);
  sanitized = escapeHtml(sanitized);
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validateContactForm(data: {
  name: string;
  email: string;
  message: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters.");
  }
  if (data.name && data.name.length > 100) {
    errors.push("Name must be under 100 characters.");
  }
  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Please provide a valid email address.");
  }
  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters.");
  }
  if (data.message && data.message.length > 5000) {
    errors.push("Message must be under 5000 characters.");
  }

  return { valid: errors.length === 0, errors };
}