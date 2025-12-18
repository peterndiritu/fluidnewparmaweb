import React from 'react';
import Roadmap from '../components/Roadmap';

const RoadmapPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="text-center mb-16 px-4">
         <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Roadmap</span>
         <h1 className="text-5xl font-extrabold text-white mt-2 mb-4">Fluid Roadmap</h1>
         <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Explore Fluid's journey and vision for the future. Discover upcoming features, key milestones, and strategic initiatives.
         </p>
      </div>
      <Roadmap />
    </div>
  );
};

export default RoadmapPage;