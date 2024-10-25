'use client';
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { slideInFromTop } from '@/utils/motions';
import Image from 'next/image';
import { Skill_data } from '@/constants';

const getRandomPositionInCircle = (maxRadius: number) => {
   const angle = Math.random() * 2 * Math.PI;
   const radius = Math.sqrt(Math.random()) * maxRadius;
   const x = radius * Math.cos(angle);
   const y = radius * Math.sin(angle);
   return { x, y };
};

const Encryption = () => {
   const controls = useAnimation();
   const [usedPositions, setUsedPositions] = useState(new Map());
   const maxRadius = 400;

   useEffect(() => {
      const startAnimation = () => {
         controls.start(index => {
            let position: ReturnType<typeof getRandomPositionInCircle>;

            if (usedPositions.has(index)) {
               position = usedPositions.get(index);
            } else {
               position = getRandomPositionInCircle(maxRadius);
               setUsedPositions(prev => new Map(prev).set(index, position));
            }

            return {
               opacity: 1,
               scale: [0, 1.3, 0],
               x: position.x,
               y: position.y,
               transition: {
                  duration: 4.5,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: index * 0.2,
               },
            };
         });
      };

      startAnimation();
   }, [controls, usedPositions]);

   return (
      <div className="flex flex-row relative items-center justify-center min-h-screen w-full h-full">
         <div className="absolute w-auto h-auto top-0 z-[5]">
            <motion.div
               variants={slideInFromTop(0.5)}
               className="text-[40px] font-medium text-center text-gray-200"
            >
               Performance
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                  {' '}
                  &{' '}
               </span>
               Security
            </motion.div>
         </div>

         <div className="flex flex-col items-center justify-center absolute z-[20] w-auto h-[501px]">
            <div className="relative flex flex-col items-center group cursor-pointer w-auto h-auto">
               <Image
                  src="/LockTop.png"
                  alt="Lock top"
                  width={50}
                  height={50}
                  className="w-[50px] translate-y-5 transition-all duration-200 group-hover:translate-y-11"
               />
               <Image
                  src="/LockMain.png"
                  alt="Lock Main"
                  width={70}
                  height={70}
                  className="z-10"
               />
            </div>

            <div className="absolute w-full h-full">
               {Skill_data.map((skill, index) => (
                  <motion.div
                     key={skill.skill_name}
                     custom={index}
                     initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                     animate={controls}
                     className="absolute flex items-center justify-center"
                     style={{
                        top: '50%',
                        left: '50%',
                        translate: 'translate(-50%, -50%)',
                     }}
                  >
                     <Image
                        src={skill.Image}
                        alt={skill.skill_name}
                        width={skill.width}
                        height={skill.height}
                        className={`filter ${
                           index % 2 === 0
                              ? 'drop-shadow-[0_0_10px_rgba(255,255,255,1)]'
                              : 'drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]'
                        }`}
                     />
                  </motion.div>
               ))}
            </div>

            <div className="Welcome-box px-[15px] py-[4px] z-[20] border my-[20px] border-[#7042f88b] opacity-[0.9]">
               <h1 className="Welcome-text text-[12px]">Encryption</h1>
            </div>
         </div>

         <div className="absolute z-[20] bottom-[10px] px-[5px]">
            <div className="cursive text-[20px] font-medium text-center text-gray-300">
               Secure your data with end-to-end encryption
            </div>
         </div>

         <div
            className={`absolute w-full h-full flex items-center justify-center`}
         >
            <video
               loop
               muted
               autoPlay
               playsInline
               preload="false"
               className={`w-full h-full object-cover transition-transform duration-500`}
               src="/encryption.webm"
            />
         </div>
      </div>
   );
};

export default React.memo(Encryption);
