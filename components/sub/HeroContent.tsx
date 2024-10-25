'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
   slideInFromLeft,
   slideInFromRight,
   slideInFromTop,
} from '@/utils/motions';
import { SparklesIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

const HeroContent = () => {
   return (
      <motion.div
         initial="hidden"
         animate="visible"
         className="flex flex-col lg:flex-row items-center justify-center lg:px-20 px-6 mt-20 lg:mt-40 w-full z-[20]"
      >
         <div className="h-full w-full flex flex-col gap-4 lg:gap-5 justify-center m-auto text-center lg:text-start">
            {/* Welcome Box */}
            <motion.div
               variants={slideInFromTop(0.5)}
               className="Welcome-box py-[6px] px-[5px] border border-secondary opacity-[0.9] inline-flex items-center justify-center mx-auto lg:mx-0"
            >
               <SparklesIcon className="text-secondary mr-2 lg:mr-[10px] h-4 w-4 lg:h-5 lg:w-5" />
               <h1 className="Welcome-text text-[11px] lg:text-[13px]">
                  Full-stack Software Developer
               </h1>
            </motion.div>

            {/* Main Heading */}
            <motion.div
               variants={slideInFromLeft(0.5)}
               className="flex flex-col gap-4 lg:gap-6 mt-4 lg:mt-6 text-3xl md:text-5xl lg:text-6xl font-bold text-text max-w-[600px] w-auto h-auto"
            >
               <span>
                  Providing
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                     {' '}
                     the best{' '}
                  </span>
                  project experience
               </span>
            </motion.div>

            {/* Description */}
            <motion.p
               variants={slideInFromLeft(0.8)}
               className="text-sm md:text-base lg:text-lg text-gray-400 my-3 lg:my-5 max-w-[400px] lg:max-w-[600px] mx-auto lg:mx-0"
            >
               I&apos;m a Full Stack Software Engineer with experience in
               Website, Mobile, and Software development. Check out my projects
               and skills.
            </motion.p>

            {/* Learn More Button */}
            <motion.a
               variants={slideInFromLeft(1)}
               className="py-2 px-4 text-sm md:text-base lg:text-lg button-primary text-center text-white cursor-pointer rounded-lg max-w-[180px] lg:max-w-[200px] mx-auto lg:mx-0 bg-gradient-to-r from-primary to-accent"
            >
               Learn More!
            </motion.a>
         </div>

         {/* Image Section */}
         <motion.div
            variants={slideInFromRight(0.8)}
            className="w-full h-full flex justify-center items-center mt-8 lg:mt-0"
         >
            <Image
               src="/mainIconsdark.svg"
               alt="work icons"
               height={500}
               width={500}
               className="max-w-[80%] sm:max-w-[60%] md:max-w-[500px]"
            />
         </motion.div>
      </motion.div>
   );
};

export default HeroContent;
