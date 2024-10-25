import React from 'react';
import HeroContent from '../sub/HeroContent';

const Hero = () => {
   return (
      <div className="relative flex flex-col w-full h-full">
         <video
            autoPlay
            loop
            muted
            className="rotate-180 absolute top-[-380px] w-full h-full left-0 z-1 object-cover"
         >
            <source src="/public_blackhole.webm" type="video/webm" />
         </video>
         <HeroContent />
      </div>
   );
};

export default React.memo(Hero);
