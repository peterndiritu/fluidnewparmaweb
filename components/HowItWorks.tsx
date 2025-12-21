
import React, { useState, useEffect } from 'react';
import { Upload, Globe, Shield, Server, Database, ArrowDown, Cloud, FileKey, Lock } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4);
    }, 1500); // 1.5s per step
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="how-it-works" className="py-24 bg-transparent relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white tracking-tighter uppercase">Protocol Infrastructure</h2>
          <p className="text-slate-700 dark:text-slate-300 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
            A deep dive into our revolutionary permanent storage sharding architecture.
          </p>
        </div>

        {/* Sharding Architecture Visualization */}
        <div className="mb-24 relative scroll-card">
          <div className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
            <h3 className="text-2xl font-black text-center mb-12 text-blue-500 dark:text-cyan-400 tracking-widest uppercase">Sharding Architecture</h3>
            
            {/* Simulation Overlay Container */}
            <div className="flex flex-col items-center gap-10 max-w-4xl mx-auto relative">
              
              {/* --- Animated Packets Layer --- */}
              <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
                 {/* Phase 1: Data to Encryption */}
                 <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,1)] transition-all duration-[1500ms] ease-in-out
                    ${step === 0 ? 'top-12 opacity-100' : 'top-48 opacity-0'}
                 `}></div>

                 {/* Phase 2: Split to Shards */}
                 {[0, 1, 2, 3].map((i) => {
                    // Calculate approximate left positions for the 4 columns
                    const leftPositions = ['12%', '37%', '62%', '87%']; // Approximate centers of the 4 grid columns
                    return (
                        <div key={`shard-packet-${i}`} 
                             className={`absolute w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,1)] transition-all duration-[1500ms] ease-in-out
                             ${step < 1 ? 'opacity-0 top-48 left-1/2' : ''}
                             ${step === 1 ? `opacity-100 top-48 left-1/2` : ''} 
                             ${step === 2 ? `opacity-100 top-[65%] ${leftPositions[i]}` : ''}
                             ${step === 3 ? `opacity-0 top-[90%] ${leftPositions[i]}` : ''}
                        `} style={{ left: step === 1 ? '50%' : step === 2 || step === 3 ? leftPositions[i] : '50%' }}></div>
                    )
                 })}
              </div>

              {/* User Data Node */}
              <div className="flex flex-col items-center group relative z-20">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center border transition-all duration-500 shadow-2xl mb-4
                    ${step === 0 ? 'bg-cyan-500/20 border-cyan-500 scale-110 shadow-cyan-500/30' : 'bg-white/40 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700'}
                `}>
                  <Database size={40} className={`transition-colors duration-500 ${step === 0 ? 'text-cyan-400' : 'text-slate-800 dark:text-white'}`} />
                  <div className={`absolute -top-3 -right-3 px-2 py-1 rounded text-[10px] font-black tracking-widest uppercase transition-colors duration-500
                      ${step === 0 ? 'bg-cyan-500 text-black' : 'bg-blue-500 text-white'}
                  `}>YOUR DATA</div>
                </div>
              </div>

              {/* Path 1: Down to Encryption */}
              <div className="flex flex-col items-center relative">
                <div className={`h-12 w-1 transition-all duration-1000 ${step === 0 ? 'bg-gradient-to-b from-cyan-500 to-emerald-500 h-12' : 'bg-slate-700/30'}`}></div>
                <ArrowDown size={20} className={`-mt-2 transition-colors duration-500 ${step === 0 ? 'text-cyan-500' : 'text-slate-600'}`} />
              </div>

              {/* Encryption Layer */}
              <div className={`px-12 py-5 rounded-2xl border flex items-center gap-4 shadow-xl z-20 backdrop-blur-md transition-all duration-500
                  ${step === 1 ? 'bg-emerald-500/20 border-emerald-400 scale-105 shadow-emerald-500/20' : 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/30'}
              `}>
                <Shield className={`w-6 h-6 transition-colors duration-500 ${step === 1 ? 'text-emerald-400' : 'text-emerald-500'}`} />
                <span className={`font-black tracking-[0.2em] text-sm uppercase transition-colors duration-500 ${step === 1 ? 'text-emerald-400' : 'text-emerald-500 dark:text-emerald-300'}`}>
                    {step === 1 ? 'ENCRYPTING...' : 'ENCRYPTION LAYER'}
                </span>
              </div>

              {/* Path 2: Split */}
              <div className="flex flex-col items-center w-full relative">
                  <div className={`h-12 w-1 transition-colors duration-500 ${step === 1 ? 'bg-emerald-500' : 'bg-slate-700/30'}`}></div>
                  <div className={`w-[85%] max-w-[600px] h-1 relative transition-colors duration-500 ${step === 2 ? 'bg-emerald-500' : 'bg-slate-700/30'}`}>
                      {/* Decorative dots on the line */}
                      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${step === 2 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]' : 'bg-slate-700'}`}></div>
                      <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${step === 2 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]' : 'bg-slate-700'}`}></div>
                  </div>
              </div>

              {/* Shards & Nodes Grid */}
              <div className="grid grid-cols-4 gap-4 md:gap-10 w-full max-w-4xl relative z-20">
                 {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center relative group">
                       
                       {/* Connection Line */}
                       <div className={`h-10 w-1 mb-4 transition-colors duration-500 ${step === 2 ? 'bg-emerald-500' : 'bg-slate-700/30'}`}></div>
                       
                       {/* Shard Box */}
                       <div className={`w-full aspect-[4/3] rounded-2xl border flex items-center justify-center mb-4 transition-all duration-500 backdrop-blur-sm
                           ${step === 2 ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10 scale-105' : 'bg-white/30 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700'}
                       `}>
                          <span className={`text-[10px] font-black tracking-widest uppercase transition-colors duration-500 ${step === 2 ? 'text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                              SHARD {i}
                          </span>
                       </div>
                       
                       {/* Node Connection */}
                       <div className={`h-10 w-1 my-2 transition-all duration-500 ${step === 3 ? 'bg-cyan-500 h-full' : 'bg-gradient-to-b from-slate-400 to-slate-600 dark:from-slate-700 opacity-30'}`}></div>
                       
                       {/* Node Box */}
                       <div className={`w-full aspect-square rounded-2xl border flex flex-col items-center justify-center shadow-2xl transition-all duration-500 border-b-4
                           ${step === 3 
                             ? 'bg-cyan-900/40 border-cyan-400 border-b-cyan-400 scale-110 shadow-cyan-500/30' 
                             : 'bg-slate-900/50 border-cyan-900/20 border-b-cyan-900 text-slate-600'}
                       `}>
                          <Server className={`w-6 h-6 mb-2 transition-colors duration-500 ${step === 3 ? 'text-cyan-300' : 'text-slate-600'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors duration-500 ${step === 3 ? 'text-cyan-300' : 'text-slate-600'}`}>
                              NODE {String.fromCharCode(64 + i)}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
              
              <div className="mt-12 text-center bg-blue-500/10 px-8 py-3 rounded-full border border-blue-500/30 shadow-2xl backdrop-blur-md">
                 <p className="text-blue-500 dark:text-cyan-400 text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-3 font-black">
                    <Globe size={18} /> Distributed Across Global Grid
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Process Cards */}
        <div className="grid md:grid-cols-3 gap-8">
           {[
             { icon: Upload, title: "Data Upload", desc: "Your data is encrypted and split into multiple redundant shards for maximum durability." },
             { icon: Globe, title: "Permanent Access", desc: "Your data is distributed globally and remains accessible indefinitely—no renewals needed." },
             { icon: Cloud, title: "Decentralized CDN", desc: "Built-in content delivery ensures your site loads instantly from the nearest validator node." }
           ].map((item, idx) => (
             <div key={idx} className="scroll-card bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800/50 hover:border-emerald-500/50 transition-all hover:-translate-y-2 group shadow-xl">
                <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 text-blue-500 group-hover:scale-110 transition-transform shadow-inner">
                   <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base font-medium">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
