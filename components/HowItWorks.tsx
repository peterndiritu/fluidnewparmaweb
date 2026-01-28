import React, { useState, useEffect } from 'react';
import { Globe, Shield, Server, Database, ArrowDown } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="sharding-architecture" className="relative scroll-card w-full">
      <div className="bg-slate-900/40 border border-white/5 rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none"></div>
        
        <h3 className="text-4xl md:text-5xl font-nebula font-black text-center mb-20 text-white tracking-tighter uppercase italic leading-none">
          Micro-Sharding <span className="text-fluid-gradient">Dynamics</span>
        </h3>
        
        <div className="flex flex-col items-center gap-12 max-w-5xl mx-auto relative min-h-[600px]">
          
          {/* Animated Particles */}
          <div className="absolute inset-0 pointer-events-none z-50">
             <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-fluid-cyan rounded-full shadow-[0_0_20px_rgba(34,211,238,1)] transition-all duration-[1800ms] ease-in-out
                ${step === 0 ? 'top-10 opacity-100 scale-100' : 'top-52 opacity-0 scale-50'}
             `}></div>

             {[0, 1, 2, 3].map((i) => {
                const leftPositions = ['12.5%', '37.5%', '62.5%', '87.5%'];
                return (
                    <div key={`shard-pkt-${i}`} 
                         className={`absolute w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(129,140,248,1)] transition-all duration-[1800ms] ease-in-out
                         ${step < 1 ? 'opacity-0 top-52 left-1/2 scale-0' : ''}
                         ${step === 1 ? `opacity-100 top-52 left-1/2 scale-100` : ''} 
                         ${step === 2 ? `opacity-100 top-[70%] ${leftPositions[i]} scale-110` : ''}
                         ${step === 3 ? `opacity-0 top-[95%] ${leftPositions[i]} scale-50` : ''}
                    `} style={{ left: step === 1 ? '50%' : step >= 2 ? leftPositions[i] : '50%' }}></div>
                )
             })}
          </div>

          {/* User Data Node */}
          <div className="flex flex-col items-center group relative z-20">
            <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center border-2 transition-all duration-700 shadow-2xl mb-4
                ${step === 0 ? 'bg-indigo-500/20 border-indigo-400 scale-110 shadow-indigo-500/30' : 'bg-slate-900/60 border-white/10'}
            `}>
              <Database size={48} className={`transition-colors duration-700 ${step === 0 ? 'text-indigo-400' : 'text-slate-500'}`} />
              <div className={`absolute -top-6 px-4 py-2 rounded-xl text-[10px] font-nebula font-black tracking-widest uppercase transition-all duration-700
                  ${step === 0 ? 'bg-indigo-500 text-white shadow-xl translate-y-0' : 'bg-slate-800 text-slate-500 translate-y-2'}
              `}>Original Data</div>
            </div>
          </div>

          {/* Connectors */}
          <div className="flex flex-col items-center relative">
            <div className={`h-16 w-1 transition-all duration-1000 ${step === 0 ? 'bg-gradient-to-b from-indigo-400 to-indigo-600' : 'bg-white/5'}`}></div>
            <ArrowDown size={24} className={`-mt-3 transition-colors duration-700 ${step === 0 ? 'text-indigo-400' : 'text-slate-800'}`} />
          </div>

          {/* Encryption & Sharding Layer */}
          <div className={`px-16 py-8 rounded-[3rem] border-2 flex items-center gap-8 shadow-2xl z-20 backdrop-blur-xl transition-all duration-700
              ${step === 1 ? 'bg-indigo-500/10 border-indigo-500 scale-105 shadow-indigo-500/20' : 'bg-slate-900 border-white/5'}
          `}>
            <Shield className={`w-10 h-10 transition-colors duration-700 ${step === 1 ? 'text-indigo-400' : 'text-slate-700'}`} />
            <div className="text-left">
                <span className={`block font-nebula font-black tracking-[0.2em] text-sm uppercase italic transition-colors duration-700 ${step === 1 ? 'text-white' : 'text-slate-700'}`}>
                    Partition Engine
                </span>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Shard Allocation System</span>
            </div>
          </div>

          {/* Split Paths */}
          <div className="flex flex-col items-center w-full relative">
              <div className={`h-16 w-1 transition-colors duration-700 ${step === 1 ? 'bg-indigo-500' : 'bg-white/5'}`}></div>
              <div className={`w-[80%] max-w-[800px] h-1.5 relative transition-colors duration-700 ${step === 2 ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/5'}`}>
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-lg rotate-45 ${step === 2 ? 'bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,1)]' : 'bg-slate-800'}`}></div>
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-lg rotate-45 ${step === 2 ? 'bg-indigo-400 shadow-[0_0_15px_rgba(129,140,248,1)]' : 'bg-slate-800'}`}></div>
              </div>
          </div>

          {/* Shards Cluster */}
          <div className="grid grid-cols-4 gap-6 md:gap-12 w-full max-w-6xl relative z-20">
             {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center relative group">
                   <div className={`h-12 w-0.5 mb-4 transition-colors duration-700 ${step === 2 ? 'bg-indigo-500' : 'bg-white/5'}`}></div>
                   <div className={`w-full aspect-video rounded-[2rem] border-2 flex items-center justify-center mb-8 transition-all duration-700 backdrop-blur-md
                       ${step === 2 ? 'bg-indigo-500/5 border-indigo-400 shadow-2xl scale-110' : 'bg-slate-900 border-white/5'}
                   `}>
                      <span className={`text-[11px] font-nebula font-black tracking-widest uppercase italic transition-colors duration-700 ${step === 2 ? 'text-white' : 'text-slate-700'}`}>
                          Shard_{i}
                      </span>
                   </div>
                   <div className={`h-16 w-0.5 my-2 transition-all duration-700 ${step === 3 ? 'bg-fluid-cyan h-full shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-white/5 opacity-20'}`}></div>
                   <div className={`w-full aspect-square rounded-[2rem] border-2 flex flex-col items-center justify-center shadow-2xl transition-all duration-700
                       ${step === 3 
                         ? 'bg-indigo-900/20 border-indigo-400 scale-110 shadow-indigo-500/10' 
                         : 'bg-slate-900 border-white/5 text-slate-700'}
                   `}>
                      <Server className={`w-10 h-10 mb-2 transition-colors duration-700 ${step === 3 ? 'text-indigo-400' : 'text-slate-800'}`} />
                      <span className={`text-[9px] font-nebula font-black uppercase tracking-tighter transition-colors duration-700 ${step === 3 ? 'text-white' : 'text-slate-800'}`}>
                          Node_0{i}
                      </span>
                   </div>
                </div>
             ))}
          </div>
          
          <div className="mt-20 text-center bg-white/5 px-12 py-5 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-xl">
             <p className="text-slate-400 text-xs tracking-[0.4em] uppercase flex items-center justify-center gap-6 font-nebula font-black italic">
                <Globe size={24} className="text-fluid-indigo animate-pulse" /> Distributed Immutable Hosting
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;