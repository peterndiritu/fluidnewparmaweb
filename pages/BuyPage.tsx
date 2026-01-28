import React from 'react';

const BuyPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-12 relative overflow-hidden flex flex-col items-center">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
         <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
         <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900/50 border border-slate-700/50 mb-8 backdrop-blur-sm animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-indigo-400 text-xs font-nebula font-black tracking-widest uppercase">Genesis Events Pending</span>
         </div>
         
         <h1 className="text-5xl md:text-8xl font-nebula font-black text-white mb-8 animate-fade-in-up delay-100 uppercase italic tracking-tighter">
            Secure Your <br/> <span className="text-fluid-gradient">Allocation</span>
         </h1>
         
         <div className="max-w-2xl mx-auto bg-slate-900/40 border border-white/5 rounded-[3rem] p-12 backdrop-blur-xl animate-fade-in-up delay-200">
            <p className="text-slate-400 text-lg mb-8 font-medium leading-relaxed">
               The official Fluid Genesis events are temporarily locked. Our team is finalizing the secure audit of the sharded settlement layer. 
            </p>
            <div className="flex flex-col items-center gap-4">
                <span className="text-[10px] font-nebula font-black text-slate-500 uppercase tracking-[0.3em]">Status: Synchronizing</span>
                <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-fluid-gradient rounded-full animate-pulse"></div>
                </div>
            </div>
         </div>

         <p className="mt-12 text-slate-500 text-sm font-medium animate-fade-in-up delay-300">
            Follow our official channels for the next entry window.
         </p>
      </div>
    </div>
  );
};

export default BuyPage;