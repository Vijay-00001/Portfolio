'use client';

import { Socials } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
   const [menuOpen, setMenuOpen] = useState(false);
   const menuRef = useRef<HTMLDivElement | null>(null);

   const toggleMenu = () => {
      setMenuOpen(!menuOpen);
   };

   // Close menu if clicked outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
         if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
         ) {
            setMenuOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
         document.removeEventListener('touchstart', handleClickOutside);
      };
   }, [menuRef]);

   return (
      <header className="w-full h-[65px] fixed top-0 shadow-lg shadow-var(--shadow-primary) bg-var(--navbar-bg) backdrop-blur-md z-50 px-4 md:px-10">
         <nav className="w-full h-full flex items-center justify-between m-auto px-2 lg:px-4">
            {/* Logo Section */}
            <Link
               href="#about-me"
               aria-label="Navigate to about me section"
               className="flex items-center"
            >
               <Image
                  src="/NavbarLogo.png"
                  alt="Vijay Chauhan logo"
                  width={50}
                  height={50}
                  className="cursor-pointer hover:animate-slowspin"
               />
               <h1 className="text-xl md:text-3xl font-bold ml-2 hidden md:block text-transparent bg-clip-text bg-gradient-to-r from-var(--primary-color) to-var(--secondary-color)">
                  Vijay Chauhan
               </h1>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex w-auto h-full flex-row items-center md:mr-8 lg:mr-20">
               <div className="flex items-center w-auto h-auto bg-var(--link-bg) border border-var(--border-color) px-4 py-2 rounded-full text-gray-200 space-x-4 md:space-x-6">
                  <Link
                     href="#about-me"
                     className="text-sm md:text-base hover:text-var(--hover-color)"
                  >
                     About me
                  </Link>
                  <Link
                     href="#skills"
                     className="text-sm md:text-base hover:text-var(--hover-color)"
                  >
                     Skills
                  </Link>
                  <Link
                     href="#projects"
                     className="text-sm md:text-base hover:text-var(--hover-color)"
                  >
                     Projects
                  </Link>
               </div>
            </div>

            {/* Menu Icon for Mobile */}
            <button onClick={toggleMenu} className="sm:hidden text-white">
               {menuOpen ? (
                  <XMarkIcon className="h-6 w-6 text-gray-200" />
               ) : (
                  <Bars3Icon className="h-6 w-6 text-gray-200" />
               )}
            </button>

            {/* Mobile Dropdown Menu with Blur Background */}
            {menuOpen && (
               <>
                  {/* Blurred Background Overlay */}
                  <div
                     className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                     onClick={toggleMenu} // Close when clicking the overlay
                  ></div>

                  {/* Dropdown Menu */}
                  <div
                     ref={menuRef} // Attach ref to the dropdown
                     className="fixed top-[65px] left-0 w-full bg-var(--navbar-bg) z-50 flex flex-col items-center py-6 animate-slide-down transition-transform duration-300"
                  >
                     {/* Links */}
                     <Link
                        href="#about-me"
                        onClick={toggleMenu}
                        className="text-gray-200 py-2 text-lg hover:text-var(--hover-color)"
                     >
                        About me
                     </Link>
                     <Link
                        href="#skills"
                        onClick={toggleMenu}
                        className="text-gray-200 py-2 text-lg hover:text-var(--hover-color)"
                     >
                        Skills
                     </Link>
                     <Link
                        href="#projects"
                        onClick={toggleMenu}
                        className="text-gray-200 py-2 text-lg hover:text-var(--hover-color)"
                     >
                        Projects
                     </Link>

                     {/* Social Media Icons */}
                     <div className="flex flex-row gap-4 mt-4">
                        {Socials.map(social => (
                           <Link
                              href={social.src}
                              key={social.name}
                              aria-label={`Link to ${social.name}`}
                           >
                              <Image
                                 src={social.src}
                                 alt={social.name}
                                 width={24}
                                 height={24}
                                 className="cursor-pointer hover:animate-slowspin"
                              />
                           </Link>
                        ))}
                     </div>
                  </div>
               </>
            )}
         </nav>
      </header>
   );
};

export default Navbar;
