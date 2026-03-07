// src/app/admin/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminLogin from "@/components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuth = await isAdminAuthenticated();
  if (isAuth) redirect("/admin/dashboard");
  return <AdminLogin />;
}