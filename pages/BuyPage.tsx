import React from 'react';
import PresaleCard from '../components/PresaleCard';

const BuyPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden flex flex-col items-center">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
         <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 mb-8 backdrop-blur-sm animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-xs font-bold tracking-wide uppercase">Presale Stage 1 Live</span>
         </div>
         
         <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-8 animate-fade-in-up delay-100">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">Fluid Revolution</span>
         </h1>
         
         <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Secure your FLUID tokens at the best possible price before the public launch. Early adopters get exclusive benefits and lower entry rates.
         </p>

         <div className="flex justify-center animate-fade-in-up delay-300">
            <PresaleCard />
         </div>
      </div>
    </div>
  );
};

export default BuyPage;