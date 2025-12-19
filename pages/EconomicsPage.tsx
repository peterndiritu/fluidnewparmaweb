import React, { useState } from 'react';
import { Coins, Repeat, Landmark, Infinity as InfinityIcon, ShieldCheck, TrendingUp, PieChart, ArrowUpRight, ChevronDown, BarChart, Eye, Layout } from 'lucide-react';

const EconomicsPage: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>('principles');

  const menuItems = [
    { id: 'principles', label: 'Core Principles', icon: BarChart, children: ['Sustainability', 'Yield Model', 'One-Time Cost'] },
    { id: 'model', label: 'Endowment Model', icon: InfinityIcon, children: ['Lifecycle', 'Yield Gen', 'Treasury'] },
    { id: 'stats', label: 'Governance', icon: Landmark, children: ['Voting', 'Proposals', 'Audit'] },
    { id: 'tokens', label: 'Tokenomics', icon: Coins, children: ['Distribution', 'Supply', 'Burn Rate'] }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const principles = [
    {
      title: "Sustainable Yield",
      desc: "Protocol treasury assets are deployed in low-risk automated yield strategies to fund storage maintenance cost indefinitely.",
      icon: TrendingUp
    },
    {
      title: "One-Time Cost",
      desc: "Users pay a single upfront fee. No monthly renewals or credit cards. The protocol manages the perpetual liability.",
      icon: Coins
    },
    {
      title: "Deflationary Pressure",
      desc: "A portion of every storage payment is burnt, reducing total supply as the ecosystem grows.",
      icon: PieChart
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-16 flex flex-col lg:flex-row max-w-7xl mx-auto px-4 gap-8">
      
      {/* Left Sidebar Dropdown Navigation */}
      <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
        <div className="sticky top-32 w-full">
            <div className="bg-[#0F1115] border border-white/5 rounded-2xl p-2 shadow-2xl overflow-hidden">
               <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Economy</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
               </div>
               
               <div className="flex flex-col gap-1">
                   {menuItems.map((item) => (
                     <div key={item.id} className="group">
                        <button 
                          onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 border ${
                             openDropdown === item.id 
                             ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                             : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                          }`}
                        >
                           <div className="flex items-center gap-3">
                              <item.icon size={16} className={openDropdown === item.id ? 'text-amber-500' : 'text-slate-500 group-hover:text-slate-400'} />
                              <span className="text-xs font-bold tracking-wide">{item.label}</span>
                           </div>
                           <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === item.id ? 'rotate-180 text-amber-500' : 'text-slate-600'}`} />
                        </button>
                        
                        {openDropdown === item.id && (
                           <div className="mt-1 mb-2 ml-3 pl-3 border-l border-white/5 space-y-0.5 animate-fade-in-up">
                              {item.children.map((child) => (
                                <button 
                                  key={child}
                                  onClick={() => scrollTo(item.id)}
                                  className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                >
                                   <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-amber-500 transition-colors"></div>
                                   {child}
                                </button>
                              ))}
                           </div>
                        )}
                     </div>
                   ))}
               </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Hero */}
        <section className="max-w-full text-center lg:text-left mb-24">
           <div className="inline-block px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6 animate-fade-in-up">
              <span className="text-amber-500 font-black uppercase tracking-widest text-xs">Endowment Economy V2.0</span>
           </div>
           <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-none">
              Economic <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500">Freedom Rails.</span>
           </h1>
           <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 font-medium">
              Fluid uses a revolutionary endowment model to sustain global infrastructure indefinitely without monthly fees.
           </p>
        </section>

        {/* Endowment Lifecycle */}
        <section id="model" className="mb-32 scroll-card">
           <div className="bg-slate-950/40 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-12 lg:p-16 relative overflow-hidden shadow-2xl">
              <div className="text-center mb-16">
                 <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">Lifecycle</h3>
                 <p className="text-slate-500 font-medium max-w-xl mx-auto">One-time payment transforms into perpetual incentives.</p>
              </div>

              <div className="flex flex-col items-center">
                  <div className="bg-emerald-500/10 border border-emerald-500/40 px-10 py-6 rounded-[2.5rem] text-center mb-8 relative z-10">
                     <h4 className="text-emerald-500 dark:text-emerald-400 font-black mb-3 text-[10px] tracking-[0.4em] uppercase">Initial Entry</h4>
                     <div className="flex items-center justify-center gap-3 text-xl font-black text-white">
                        <Coins size={24} className="text-emerald-500" /> FLUID TOKENS
                     </div>
                  </div>

                  <div className="h-12 w-px bg-gradient-to-b from-emerald-500 to-blue-500"></div>

                  <div className="bg-slate-900 border border-slate-700 px-12 py-8 rounded-[3rem] text-center mb-8 w-full max-w-md shadow-2xl">
                     <h4 className="text-white font-black text-xl tracking-tighter mb-1 uppercase">Endowment Treasury</h4>
                     <p className="text-blue-500 text-[8px] uppercase font-black tracking-[0.3em]">Governance Managed</p>
                  </div>

                  <div className="h-12 w-px bg-slate-700"></div>
                  
                  <div className="bg-gradient-to-br from-blue-600 to-emerald-500 p-[1px] rounded-[3.5rem] w-full max-w-md shadow-2xl">
                    <div className="bg-slate-950 px-10 py-8 rounded-[3.5rem] text-center flex flex-col items-center gap-4">
                       <h4 className="text-white font-black text-2xl tracking-tighter uppercase">Permanent Storage</h4>
                       <InfinityIcon className="w-12 h-12 text-cyan-400 animate-pulse" />
                    </div>
                  </div>
              </div>
           </div>
        </section>

        {/* Principles Grid */}
        <section id="principles" className="mb-24">
           <div className="grid md:grid-cols-3 gap-6">
              {principles.map((p, i) => (
                 <div key={i} className="p-8 bg-white/5 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-[2.5rem] hover:border-amber-500/30 transition-all group shadow-xl">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 text-amber-500 group-hover:scale-110 transition-transform">
                       <p.icon size={24} />
                    </div>
                    <h3 className="text-lg font-black mb-3 text-slate-900 dark:text-white uppercase tracking-tight">{p.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
                       {p.desc}
                    </p>
                 </div>
              ))}
           </div>
        </section>

        {/* CTA */}
        <section id="stats" className="text-center">
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-[3rem] p-12 shadow-2xl group">
               <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Decades, Not Days</h2>
               <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
                  The endowment economy is the final piece of the puzzle for a truly permanent and decentralized web. Build with freedom.
               </p>
               <button className="px-12 py-5 bg-white text-orange-600 font-black rounded-full hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-3 mx-auto uppercase tracking-widest text-sm">
                  Join the Economy <ArrowUpRight size={20} />
               </button>
            </div>
        </section>
      </main>
    </div>
  );
};

export default EconomicsPage;