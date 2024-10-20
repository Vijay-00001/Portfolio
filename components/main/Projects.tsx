import React from 'react';
import ProjectCard from '../sub/ProjectCard';

const Projects = () => {
   return (
      <div
         className="flex flex-col items-center justify-center py-20"
         id="projects"
      >
         <h1 className="text-[40px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 py-20">
            My Projects
         </h1>
         <div className="h-full w-full flex flex-col md:flex-row gap-10 px-10">
            <ProjectCard
               src="/Image1.png"
               title="Project Title 1"
               description="Project dummy description, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            />
            <ProjectCard
               src="/Image2.png"
               title="Project Title 2"
               description="Project dummy description, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            />
            <ProjectCard
               src="/Image3.png"
               title="Project Title 3"
               description="Project dummy description, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            />
         </div>
      </div>
   );
};

export default React.memo(Projects);