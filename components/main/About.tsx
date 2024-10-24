'use client';

import React from 'react';
import {
   Backend_skill,
   Frontend_skill,
   Full_stack,
   Other_skill,
   Skill_data,
} from '@/constants';
import SkillDataProvider from '../sub/SkillDataProvider';
import SkillText from '../sub/SkillText';
import { motion } from 'framer-motion';
import {
   slideInFromLeft,
   slideInFromRight,
   slideInFromTop,
} from '@/utils/motions';
import { SparklesIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

const About = () => {
   return (
      <section
         id="skills"
         className="flex flex-col items-center justify-center gap-3 h-full relative overflow-hidden pb-80 py-20"
         style={{ transform: 'scale(0.9)' }}
      >
         <SkillText />

         <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-row items-center justify-center px-20 mt-40 w-full z-[20]"
         >
            <motion.div
               variants={slideInFromRight(0.8)}
               className="w-full h-full flex justify-center items-center"
            >
               <Image
                  src="/profile-picture.png"
                  alt="work icons"
                  height={650}
                  width={650}
               />
            </motion.div>

            <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-start">
               <motion.div
                  variants={slideInFromTop(0.5)}
                  className="Welcome-box py-[8px] px-[7px] border border-[#7042f88b] opacity-[0.9]"
               >
                  <SparklesIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
                  <h1 className="Welcome-text text-[13px]">
                     Full-stack Software Developer
                  </h1>
               </motion.div>

               <motion.div
                  variants={slideInFromLeft(0.5)}
                  className="flex flex-col gap-6 mt-6 text-6xl font-bold text-white max-w-[600px] w-auto h-auto"
               >
                  <span>
                     Providing
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                        {' '}
                        the best{' '}
                     </span>
                     project exprience
                  </span>
               </motion.div>

               <motion.p
                  variants={slideInFromLeft(0.8)}
                  className="text-lg text-gray-400 my-5 max-w-[600px]"
               >
                  I&apos;m a Full Stack Software Engineer with experience in
                  Website, Mobile, and Software development. Check out my
                  projects and skills.
               </motion.p>
               <motion.a
                  variants={slideInFromLeft(1)}
                  className="py-2 button-primary text-center text-white cursor-pointer rounded-lg max-w-[200px] bg-[linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)]"
               >
                  Learn More!
               </motion.a>
            </div>
         </motion.div>

         <div className="w-full h-full absolute">
            <div className="w-full h-full z-[-10] opacity-30 absolute flex items-center justify-center bg-cover">
               <video
                  className="w-full h-auto"
                  preload="false"
                  playsInline
                  loop
                  muted
                  autoPlay
                  src="/about-background-video.mp4"
               />
            </div>
         </div>
      </section>
   );
};

export default React.memo(About);
