import Encryption from '@/components/main/Encryption';
import Footer from '@/components/main/Footer';
import Hero from '@/components/main/Hero';
import Projects from '@/components/main/Projects';
import Skills from '@/components/main/Skills';

export default function Home() {
   return (
      <main className="w-full h-full">
         <div className="flex flex-col h-[850px] gap-20">
            <Hero />
         </div>
         <Skills />
         <Encryption />
         <Projects />
         <Footer />
      </main>
   );
}
