'use client';
import React, { useEffect, useRef, useState } from 'react';

import { motion, useAnimation } from 'framer-motion';
import { slideInFromTop } from '@/utils/motions';
import Image from 'next/image';
import { Skill_data } from '@/constants';

// const getPosition = (index: number) => {
//    const radius = [200, 250, 300, 350, 400]; // Define radii for each layer
//    const angles = [35, 20, 5]; // Define angles

//    // Determine the layer based on the index
//    const layerCount = radius.length;
//    const layerIndex = Math.floor(index / (Skill_data.length / layerCount));
//    const layerRadius = radius[layerIndex];

//    // Calculate positions based on the angle
//    const angleIndex = index % angles.length; // Index for angles
//    const angle = angles[angleIndex] * (Math.PI / 180); // Convert to radians

//    // Calculate positions for the right and left sides
//    const positions = [
//       { x: layerRadius * Math.cos(angle), y: layerRadius * Math.sin(angle) }, // Right side above
//       { x: layerRadius * Math.cos(-angle), y: layerRadius * Math.sin(-angle) }, // Right side below
//       {
//          x: layerRadius * Math.cos(angle + Math.PI),
//          y: layerRadius * Math.sin(angle + Math.PI),
//       }, // Left side above
//       {
//          x: layerRadius * Math.cos(-angle + Math.PI),
//          y: layerRadius * Math.sin(-angle + Math.PI),
//       }, // Left side below
//    ];

//    return positions[index % positions.length]; // Return the position based on the index
// };

const getRandomPositionInCircle = (maxRadius: number) => {
   const angle = Math.random() * 2 * Math.PI; // Random angle (0 to 360 degrees)
   const radius = Math.sqrt(Math.random()) * maxRadius; // Random radius, ensuring uniform distribution
   const x = radius * Math.cos(angle); // X position based on angle and radius
   const y = radius * Math.sin(angle); // Y position based on angle and radius
   return { x, y };
};

const Encryption = () => {
   const controls = useAnimation();
   const [usedPositions, setUsedPositions] = useState(
      new Map<number, { x: number; y: number }>()
   ); // To track used positions
   const maxRadius = 400; // Max radius in cm

   useEffect(() => {
      const startAnimation = () => {
         controls.start(index => {
            let position;

            // Check if a position has been assigned to the current index
            if (usedPositions.has(index)) {
               // Re-use the previously stored position
               position = usedPositions.get(index);
            } else {
               // Generate a new random position
               position = getRandomPositionInCircle(maxRadius);

               // Store the position to ensure the index gets a unique spot
               setUsedPositions(prev => new Map(prev).set(index, position!));
            }

            return {
               opacity: 1,
               scale: [0, 1.3, 0], // Image appears and then disappears
               x: position!.x,
               y: position!.y,
               transition: {
                  duration: 4.5, // Duration of the animation
                  ease: 'easeInOut',
                  repeat: Infinity, // Infinite loop
                  repeatType: 'loop',
                  delay: index * 0.2, // Slight delay for staggered effect
               },
            };
         });
      };

      startAnimation(); // Trigger the animation
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
                  className=" z-10"
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
                        top: '50%', // Center Y position
                        left: '50%', // Center X position
                        translate: 'translate(-50%, -50%)', // Center the icon
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

            <div className="Welcome-box px-[15px] py-[4px] z-[20] brder my-[20px] border-[#7042f88b] opacity-[0.9]">
               <h1 className="Welcome-text text-[12px]">Encryption</h1>
            </div>
         </div>
         <div className="absolute z-[20] bottom-[10px] px-[5px]">
            <div className="cursive text-[20px] font-medium text-center text-gray-300">
               Secure your data with end-to-end encryption
            </div>
         </div>

         <div className="w-full flex items-start justify-center absolute">
            <video
               loop
               muted
               autoPlay
               playsInline
               preload="false"
               className="w-full h-auto"
               src="/encryption.webm/"
            />
         </div>
      </div>
   );
};

export default React.memo(Encryption);
