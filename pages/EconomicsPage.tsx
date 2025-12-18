import React from 'react';
import { Coins, Repeat, Landmark, Infinity as InfinityIcon, ShieldCheck, TrendingUp, PieChart, ArrowUpRight } from 'lucide-react';

const EconomicsPage: React.FC = () => {
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
    <div className="min-h-screen pt-28 pb-16">
      
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
         <div className="inline-block px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
            <span className="text-amber-500 font-bold uppercase tracking-wider text-sm">Protocol Economics</span>
         </div>
         <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6">
            The Endowment <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 text-cyan-400">Sustainable Engine.</span>
         </h1>
         <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Fluid uses an endowment model similar to university funds to ensure that once data is stored, it stays stored without further payments.
         </p>
      </section>

      {/* Visual Model */}
      <section className="max-w-4xl mx-auto px-4 mb-24">
         <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]"></div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white">How it Scales</h2>
                  <p className="text-slate-400 leading-relaxed">
                     When a user pays for storage, the FLUID tokens enter the protocol's <strong>Endowment Pool</strong>. This pool is governed by smart contracts that stake or lend assets to generate the <strong>"Storage Yield"</strong>.
                  </p>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-slate-300 font-medium">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center"><ShieldCheck size={14}/></div>
                        <span>Fully Audited Treasury Management</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-300 font-medium">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center"><ShieldCheck size={14}/></div>
                        <span>Transparent On-Chain Allocation</span>
                     </div>
                  </div>
               </div>

               <div className="relative">
                  {/* Decorative Logic Flow */}
                  <div className="flex flex-col items-center gap-4">
                     <div className="w-20 h-20 bg-amber-500/20 rounded-2xl border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg">
                        <Coins size={32} />
                     </div>
                     <div className="h-10 w-px bg-gradient-to-b from-amber-500 to-cyan-500"></div>
                     <div className="bg-slate-800 border border-slate-700 px-6 py-4 rounded-xl text-center shadow-xl">
                        <span className="text-white font-bold block">ENDOWMENT</span>
                        <span className="text-xs text-slate-500 font-bold uppercase">TREASURY</span>
                     </div>
                     <div className="h-10 w-px bg-gradient-to-b from-cyan-500 to-emerald-500"></div>
                     <div className="w-20 h-20 bg-emerald-500/20 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-lg">
                        <InfinityIcon size={32} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <div className="grid md:grid-cols-3 gap-8">
            {principles.map((p, i) => (
               <div key={i} className="p-8 bg-white/5 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-3xl hover:border-amber-500/30 transition-all group">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 text-amber-500 group-hover:scale-110 transition-transform">
                     <p.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{p.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                     {p.desc}
                  </p>
               </div>
            ))}
         </div>
      </section>

      {/* CTA */}
      <section className="text-center px-4">
          <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-3xl p-12 max-w-4xl mx-auto shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Built for Decades, Not Days</h2>
             <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                The endowment economy is the final piece of the puzzle for a truly permanent and decentralized web.
             </p>
             <button className="px-10 py-4 bg-white text-orange-600 font-bold rounded-full hover:bg-orange-50 transition-colors shadow-lg flex items-center justify-center gap-2 mx-auto">
                Join the Community <ArrowUpRight size={20} />
             </button>
          </div>
      </section>

    </div>
  );
};

export default EconomicsPage;