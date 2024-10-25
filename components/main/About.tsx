'use client';
import React from 'react';
import { ReactTyped } from 'react-typed';
import { motion } from 'framer-motion';
import { slideInFromLeft, slideInFromTop } from '@/utils/motions';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

const iconShadow = 'drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]';

const About = () => {
   const floatingAndPulsingAnimation = {
      animate: {
         y: [0, -10, 0],
         filter: [
            'drop-shadow(0 5px 15px rgba(255, 255, 255, 0.3))',
            'drop-shadow(0 5px 15px rgba(255, 255, 255, 0.7))',
            'drop-shadow(0 5px 15px rgba(255, 255, 255, 0.3))',
         ],
         transition: {
            y: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
            filter: { repeat: Infinity, duration: 5, ease: 'easeInOut' },
         },
      },
   };

   return (
      <section className="flex flex-col md:flex-row justify-between w-full h-full overflow-hidden py-10 md:py-20 relative z-20">
         <div className="relative flex justify-center items-center w-full md:w-1/2 max-w-[90vw] h-[250px] md:h-[500px] mx-auto">
            <motion.div
               variants={floatingAndPulsingAnimation}
               initial="initial"
               animate="animate"
               className="w-[200px] md:w-[350px] h-[200px] md:h-[350px] relative"
            >
               <Image
                  src="/about_profile_picture.png"
                  alt="Vijay's profile"
                  fill
                  priority
                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-lg object-cover"
               />
            </motion.div>
         </div>

         <div className="w-full md:w-1/2 max-w-[90vw] mx-auto md:mx-0 h-[700px] md:h-[500px] flex flex-col justify-start md:justify-center px-4 md:px-6 text-[16px] md:text-[20px] z-40">
            <motion.div
               variants={slideInFromTop(1)}
               className="Welcome-box py-[8px] px-[7px] border border-secondary opacity-[0.9]"
            >
               <SparklesIcon className="text-secondary mr-[10px] h-5 w-5" />
               <h1 className="Welcome-text text-[13px]">About Me</h1>
            </motion.div>

            <motion.div
               variants={slideInFromLeft(0.5)}
               className="flex flex-col gap-2 mt-4 text-2xl md:text-5xl font-bold text-white leading-tight text-center md:text-left"
            >
               <span>
                  Hi there 👋,
                  <br />
                  I&apos;m{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary shadow-lg">
                     Vijay Chauhan
                  </span>
               </span>
               <span>
                  <ReactTyped
                     strings={[
                        'Frontend Developer',
                        'Backend Developer',
                        'Full Stack Developer',
                        'MERN Stack Developer',
                     ]}
                     typeSpeed={70}
                     backSpeed={70}
                     loop
                  />
               </span>
            </motion.div>

            <motion.p
               variants={slideInFromLeft(0.8)}
               className="text-base md:text-lg text-gray-400 my-4 max-w-[600px] text-justify"
            >
               I recently graduated with a B.E. in Information Technology from
               Shantilal Shah Government Engineering College, Bhavnagar. During
               a six-month internship with La Net Team Software Solution Pvt.
               Ltd., I gained valuable experience in full-stack development and
               am now eager to apply my skills in a full-time role.
            </motion.p>

            <motion.div
               variants={slideInFromLeft(1.4)}
               className="flex justify-center md:justify-start items-center gap-4 mt-5 text-gray-300"
            >
               <Link
                  href="https://github.com/yourusername"
                  target="_blank"
                  aria-label="Visit my GitHub"
               >
                  <FaGithub
                     className={`h-8 w-8 text-white hover:text-gray-300 transition duration-200 ${iconShadow}`}
                  />
               </Link>
               <Link
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  aria-label="Visit my LinkedIn"
               >
                  <FaLinkedin
                     className={`h-8 w-8 text-blue-500 hover:text-blue-400 transition duration-200 ${iconShadow}`}
                  />
               </Link>
               <Link
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  aria-label="Visit my Twitter"
               >
                  <FaTwitter
                     className={`h-8 w-8 text-blue-400 hover:text-blue-300 transition duration-200 ${iconShadow}`}
                  />
               </Link>
            </motion.div>

            <motion.div
               variants={slideInFromLeft(1.6)}
               className="flex flex-col md:flex-row gap-4 mt-8 justify-center md:justify-start"
            >
               <button className="px-6 py-2 font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-md hover:scale-105 transition-transform duration-200">
                  View My Projects
               </button>
               <button className="px-6 py-2 font-semibold text-gray-400 border border-gray-400 rounded-md hover:text-white hover:border-white transition-all duration-200">
                  Contact Me
               </button>
            </motion.div>
         </div>

         <div className="absolute inset-0 -z-10 opacity-30 flex justify-center items-center overflow-hidden">
            <video
               className="w-full h-full object-cover"
               loop
               muted
               autoPlay
               playsInline
               src="/about-background-video.mp4"
               aria-label="Background video"
            />
         </div>
      </section>
   );
};

export default React.memo(About);
