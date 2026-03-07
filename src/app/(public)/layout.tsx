// src/app/(public)/layout.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AIChatWidget from "@/components/ui/AIChatWidget";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="relative min-h-screen">{children}</main>
      <Footer />
      <AIChatWidget />
    </>
  );
}