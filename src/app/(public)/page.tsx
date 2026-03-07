// src/app/page.tsx
import { getPortfolioData } from "@/lib/data-service";
import { DataProvider } from "@/components/providers/DataProvider";
import ParticleWrapper from "@/components/ui/ParticleWrapper";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export const revalidate = 60; // Re-fetch data every 60 seconds

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <DataProvider data={data}>
      <ParticleWrapper />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
    </DataProvider>
  );
}