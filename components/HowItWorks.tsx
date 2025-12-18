import React from 'react';
import { Upload, Coins, Globe, Shield, Server, Repeat, Infinity as InfinityIcon, Database, Layers, ArrowDown } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-transparent relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white tracking-tighter">Hosting</h2>
          <p className="text-slate-700 dark:text-slate-300 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
            A deep dive into our revolutionary permanent storage architecture
          </p>
        </div>

        {/* Sharding Architecture Visualization (Matching Image 2) */}
        <div className="mb-24 relative scroll-card">
          <div className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
            <h3 className="text-2xl font-black text-center mb-12 text-blue-500 dark:text-cyan-400 tracking-widest uppercase">Sharding Architecture</h3>
            
            <div className="flex flex-col items-center gap-10 max-w-4xl mx-auto">
              
              {/* User Data */}
              <div className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-white/40 dark:bg-slate-900/60 rounded-3xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-2xl mb-4 z-10 relative group-hover:scale-110 transition-transform">
                  <Database size={40} className="text-slate-800 dark:text-white" />
                  <div className="absolute -top-3 -right-3 bg-blue-500 text-[10px] font-black px-2 py-1 rounded text-white tracking-widest">YOUR DATA</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center">
                <div className="h-12 w-px bg-gradient-to-b from-blue-500 to-emerald-500"></div>
                <ArrowDown size={20} className="text-emerald-500 -mt-2" />
              </div>

              {/* Encryption */}
              <div className="bg-emerald-500/10 dark:bg-emerald-950/40 px-12 py-5 rounded-2xl border border-emerald-500/30 flex items-center gap-4 shadow-[0_0_30px_rgba(16,185,129,0.1)] z-10 backdrop-blur-md">
                <Shield className="text-emerald-500 w-6 h-6" />
                <span className="text-emerald-500 dark:text-emerald-300 font-black tracking-[0.2em] text-sm uppercase">ENCRYPTION</span>
              </div>

              {/* Arrow Split */}
              <div className="flex flex-col items-center w-full">
                  <div className="h-12 w-px bg-emerald-500/50"></div>
                  <div className="w-[85%] max-w-[600px] h-px bg-emerald-500/30 relative"></div>
              </div>

              {/* Shards */}
              <div className="grid grid-cols-4 gap-4 md:gap-10 w-full max-w-4xl">
                 {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center relative group">
                       <div className="h-10 w-px bg-emerald-500/30 mb-4"></div>
                       <div className="w-full aspect-[4/3] bg-white/30 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4 group-hover:border-cyan-400 transition-all shadow-xl backdrop-blur-sm">
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 group-hover:text-cyan-400 font-black tracking-widest uppercase transition-colors">SHARD {i}</span>
                       </div>
                       <div className="h-10 w-px bg-gradient-to-b from-slate-400 to-cyan-500 dark:from-slate-700 my-2"></div>
                       
                       {/* Nodes */}
                       <div className="w-full aspect-square bg-slate-900/50 rounded-2xl border border-cyan-500/20 flex flex-col items-center justify-center shadow-2xl group-hover:shadow-cyan-500/20 transition-all border-b-4 border-b-cyan-500">
                          <Server className="w-6 h-6 text-cyan-500 mb-2" />
                          <span className="text-[10px] text-cyan-400 font-black uppercase tracking-tighter">NODE {String.fromCharCode(64 + i)}</span>
                       </div>
                    </div>
                 ))}
              </div>
              
              <div className="mt-12 text-center bg-blue-500/10 px-8 py-3 rounded-full border border-blue-500/30 shadow-2xl backdrop-blur-md">
                 <p className="text-blue-500 dark:text-cyan-400 text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-3 font-black">
                    <Globe size={18} /> Distributed Across Global Network
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Process Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
           {[
             { icon: Upload, title: "Data Upload", desc: "Your data is encrypted and split into multiple redundant shards for maximum durability." },
             { icon: Coins, title: "One-Time Payment", desc: "Pay once using FLUID tokens. Your payment funds an endowment that sustains storage forever." },
             { icon: Globe, title: "Permanent Access", desc: "Your data is distributed globally and remains accessible indefinitely—no renewals needed." }
           ].map((item, idx) => (
             <div key={idx} className="scroll-card bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800/50 hover:border-emerald-500/50 transition-all hover:-translate-y-2 group shadow-xl">
                <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8 text-blue-500 group-hover:scale-110 transition-transform shadow-inner">
                   <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base font-medium">{item.desc}</p>
             </div>
           ))}
        </div>

        {/* Endowment Economics Visualization (Matching Image 2) */}
        <div className="mb-8 scroll-card">
           <h3 className="text-3xl font-black text-center mb-16 text-slate-900 dark:text-white tracking-tighter">Endowment Economics</h3>
           <div className="flex flex-col items-center max-w-4xl mx-auto">
              
              {/* Payment */}
              <div className="bg-emerald-500/10 dark:bg-emerald-900/20 border border-emerald-500/40 px-14 py-7 rounded-[2.5rem] text-center mb-6 relative z-10 backdrop-blur-xl shadow-2xl">
                 <div className="absolute -inset-1 bg-emerald-500/20 blur-xl -z-10 rounded-[2.5rem] animate-pulse"></div>
                 <h4 className="text-emerald-500 dark:text-emerald-400 font-black mb-2 text-xs tracking-[0.4em] uppercase">ONE-TIME PAYMENT</h4>
                 <div className="flex items-center justify-center gap-3 text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                    <Coins size={28} className="text-emerald-500" /> FLUID TOKENS
                 </div>
              </div>

              <div className="h-16 w-px bg-gradient-to-b from-emerald-500 to-blue-500 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1/2 bg-white/50 animate-scroll-down"></div>
              </div>

              {/* Pool */}
              <div className="bg-slate-900 border border-slate-700 px-16 py-8 rounded-[3rem] text-center mb-10 w-full max-w-md shadow-2xl relative z-10 group overflow-hidden">
                 <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors"></div>
                 <h4 className="text-white font-black text-2xl tracking-tighter mb-2 relative z-10">ENDOWMENT POOL</h4>
                 <p className="text-blue-500 text-[10px] uppercase font-black tracking-[0.3em] relative z-10">PROTOCOL TREASURY</p>
              </div>

              {/* Yield Arrows */}
              <div className="flex flex-col items-center w-full mb-4">
                 <div className="h-10 w-px bg-slate-700"></div>
                 <div className="w-[70%] h-px bg-slate-700"></div>
                 <div className="w-[70%] flex justify-between max-w-lg">
                    <div className="h-10 w-px bg-slate-700"></div>
                    <div className="h-10 w-px bg-slate-700"></div>
                    <div className="h-10 w-px bg-slate-700"></div>
                 </div>
              </div>

              {/* Yield Gen */}
              <div className="grid grid-cols-3 gap-6 w-full max-w-2xl mb-12">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl text-center hover:border-cyan-500/50 transition-all shadow-xl backdrop-blur-md group">
                       <Repeat size={24} className="mx-auto mb-3 text-cyan-400 group-hover:rotate-180 transition-transform duration-700" />
                       <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase block">YIELD GEN</span>
                    </div>
                 ))}
              </div>

              {/* Merge arrows */}
               <div className="flex flex-col items-center w-full mb-4">
                 <div className="w-[70%] flex justify-between max-w-lg">
                    <div className="h-6 w-px bg-slate-700"></div>
                    <div className="h-6 w-px bg-slate-700"></div>
                    <div className="h-6 w-px bg-slate-700"></div>
                 </div>
                 <div className="w-[70%] max-w-lg h-px bg-slate-700"></div>
                 <div className="h-10 w-px bg-slate-700"></div>
              </div>
              
              {/* Incentives */}
              <div className="bg-slate-900 border border-cyan-500/30 px-12 py-5 rounded-3xl text-center mb-6 w-full max-w-sm shadow-2xl group transition-all hover:shadow-cyan-500/10">
                 <h4 className="text-cyan-400 font-black tracking-[0.3em] text-sm uppercase">NODE INCENTIVES</h4>
                 <p className="text-slate-500 text-[10px] uppercase font-bold mt-2 tracking-widest">FOREVER REWARDS</p>
              </div>

              <div className="h-10 w-px bg-slate-700 mb-4"></div>

              {/* Permanent Storage Conclusion */}
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-[1px] rounded-[3rem] w-full max-w-md shadow-2xl group hover:scale-105 transition-transform">
                <div className="bg-slate-950 px-16 py-8 rounded-[3rem] text-center relative overflow-hidden flex flex-col items-center gap-4">
                   <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <h4 className="text-white font-black text-3xl tracking-tighter relative z-10">PERMANENT STORAGE</h4>
                   <InfinityIcon className="w-12 h-12 text-cyan-400 relative z-10" />
                </div>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;