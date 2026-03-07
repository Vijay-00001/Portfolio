// src/app/admin/dashboard/page.tsx
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) redirect("/admin");
  return <AdminDashboard />;
}