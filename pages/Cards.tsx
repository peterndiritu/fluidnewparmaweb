import React from 'react';
import { CreditCard, Globe, Lock, Sliders, Smartphone } from 'lucide-react';

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 20 H78 C83.5 20 88 24.5 88 30 C88 35.5 83.5 40 78 40 H38 L48 20 Z" fill="white" />
    <path d="M35 45 H65 C70.5 45 75 49.5 75 55 C75 60.5 70.5 65 65 65 H25 L35 45 Z" fill="white" />
    <path d="M22 70 H52 C57.5 70 62 74.5 62 80 C62 85.5 57.5 90 52 90 H12 L22 70 Z" fill="white" />
  </svg>
);

const CardsPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-16">
      
      {/* Hero Section */}
      <section className="text-center mb-20 px-4">
        <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Fluid Cards</span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-4 mb-6 leading-tight">
           Spend Crypto like <br/> you Spend Fiat
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-12">
           Experience the convenience of spending your crypto anywhere with Fluid Cards. Link your digital assets and enjoy fast, secure transactions without traditional banking bottlenecks.
        </p>

        {/* Card Visual */}
        <div className="relative max-w-md mx-auto perspective-1000 group">
           {/* Glow */}
           <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
           
           {/* Card Object */}
           <div className="relative aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-500 group-hover:rotate-y-6 group-hover:rotate-x-6 overflow-hidden">
               
               {/* Decorative patterns */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
               <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

               <div className="flex justify-between items-start z-10 text-white">
                  <span className="font-bold text-2xl tracking-tighter">Fluid</span>
                  <FluidLogo className="w-10 h-10 opacity-90" />
               </div>

               <div className="z-10">
                   <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-6 bg-amber-200/20 rounded border border-amber-200/40"></div>
                      <div className="text-white/50 text-xs font-mono">((( )))</div>
                   </div>
                   <div className="font-mono text-xl text-white tracking-widest mb-2">**** **** **** 4289</div>
                   <div className="flex justify-between items-end">
                      <div>
                         <span className="text-[10px] text-slate-400 uppercase block">Card Holder</span>
                         <span className="text-sm text-white font-bold">ALEXANDER FLUID</span>
                      </div>
                      <span className="text-cyan-400 font-bold flex items-center gap-1"><CreditCard size={14} /> Fluid Native Card</span>
                   </div>
               </div>
           </div>
        </div>
      </section>

      {/* Main Feature Box */}
      <section className="max-w-4xl mx-auto px-4 mb-24">
         <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
                  <CreditCard size={32} />
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">Multichain Fluid Payments</h2>
               <p className="text-slate-400 leading-relaxed max-w-2xl mb-8">
                  Use your native Fluid card to make instant payments across multiple blockchain networks. Whether you're spending Bitcoin, Ethereum, or stablecoins, Fluid ensures smooth transaction processing with automatic currency conversion and zero hidden fees.
               </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8 border-t border-slate-800 pt-8">
               <div className="flex gap-4 items-start">
                   <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 mt-1"><Globe size={20} /></div>
                   <div>
                      <h4 className="text-white font-bold mb-1">Global Access</h4>
                      <p className="text-sm text-slate-400">Accepted anywhere major merchant networks are supported worldwide, powered by Fluid settlement.</p>
                   </div>
               </div>
               <div className="flex gap-4 items-start">
                   <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 mt-1"><Sliders size={20} /></div>
                   <div>
                      <h4 className="text-white font-bold mb-1">Total Control</h4>
                      <p className="text-sm text-slate-400">Set spending limits, approve transactions, and freeze card instantly from your non-custodial wallet.</p>
                   </div>
               </div>
            </div>
         </div>
      </section>
      
      {/* CTA */}
      <section className="text-center">
          <button className="px-10 py-4 bg-white text-slate-900 font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
             Order Your Fluid Card
          </button>
      </section>

    </div>
  );
};

export default CardsPage;