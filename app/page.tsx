import About from '@/components/main/About';
import Encryption from '@/components/main/Encryption';
import Footer from '@/components/main/Footer';
import Hero from '@/components/main/Hero';
import Projects from '@/components/main/Projects';
import Skills from '@/components/main/Skills';

export default function Home() {
   return (
      <main className="w-full h-full bg-var(--color-background) text-var(--color-text)">
         <div className="flex flex-col h-[850px] gap-20">
            <Hero />
         </div>
         <div className="flex flex-col h-[1101px] lg:h-[751px]  gap-7 lg:gap-20">
            <About />
         </div>
         <Skills />
         <Encryption />
         <Projects />
         <Footer />
      </main>
   );
}
