import React, { useState, useEffect } from 'react';
import { 
  Play, Apple, Box, ArrowDownUp, ChevronDown, RefreshCw, 
  Wallet as WalletIcon, Layers, Shield, Globe, Zap, 
  Lock, Smartphone, CreditCard, Check, X, ArrowRight,
  Fingerprint, Eye, Activity, Key, ChevronRight, Landmark,
  Coins, Monitor, Terminal, Command
} from 'lucide-react';

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="currentColor" />
    <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="currentColor" />
    <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 83.3137 82 60 82H10L15 66Z" fill="currentColor" />
  </svg>
);

const WalletPage: React.FC = () => {
  const [mockupView, setMockupView] = useState<'assets' | 'swap'>('assets');
  const [activeFeature, setActiveFeature] = useState(0);

  const coins = [
    { name: 'Bitcoin', symbol: 'BTC', amount: '0.45', value: '$29,000', color: 'bg-orange-500' },
    { name: 'Ethereum', symbol: 'ETH', amount: '4.20', value: '$8,100', color: 'bg-indigo-500' },
    { name: 'Fluid', symbol: 'FLD', amount: '15,000', value: '$15,000', color: 'bg-emerald-500' }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Zero-Knowledge Privacy",
      desc: "We don't know who you are, and we don't want to. Your keys never leave your device.",
      icon: Eye
    },
    {
      title: "Biometric Fortification",
      desc: "Hardware-level security using Secure Enclave FaceID and TouchID integration.",
      icon: Fingerprint
    },
    {
      title: "Gas-Less Mode",
      desc: "Pay transaction fees in any token, not just the native chain currency.",
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 overflow-hidden">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 mb-8 backdrop-blur-sm animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">V2.0 Public Beta Live</span>
         </div>

         <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.9]">
            The Last Wallet <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500">You Will Ever Need.</span>
         </h1>
         
         <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Non-custodial by design. Institutional-grade security. <br className="hidden md:block"/>
            Seamlessly bridge the gap between DeFi, Fiat, and the Real World.
         </p>
         
         <div className="flex flex-col items-center animate-fade-in-up delay-100">
             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                 <button className="flex items-center gap-3 bg-white text-slate-900 font-bold rounded-2xl px-6 py-4 hover:scale-105 transition-transform shadow-xl shadow-white/10 group">
                    <Apple size={24} className="group-hover:fill-current transition-all" />
                    <div className="text-left">
                       <div className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Download on</div>
                       <div className="text-lg font-black leading-none tracking-tight">App Store</div>
                    </div>
                 </button>
                 <button className="flex items-center gap-3 bg-slate-900 text-white border border-slate-700 rounded-2xl px-6 py-4 hover:scale-105 transition-transform shadow-xl group">
                    <Play size={24} className="fill-white group-hover:fill-emerald-400 transition-colors" />
                    <div className="text-left">
                       <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Get it on</div>
                       <div className="text-lg font-black leading-none tracking-tight">Google Play</div>
                    </div>
                 </button>
             </div>

             <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Monitor size={12} /> Also Available on Desktop
                </span>
                <div className="flex flex-wrap justify-center gap-4">
                   <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800 hover:border-blue-500/50 transition-all group">
                      <Monitor size={18} className="text-blue-500" />
                      <span className="text-sm font-bold text-white">Windows</span>
                   </button>
                   <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800 hover:border-slate-200/50 transition-all group">
                      <Command size={18} className="text-white" />
                      <span className="text-sm font-bold text-white">macOS</span>
                   </button>
                   <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-800 hover:border-orange-500/50 transition-all group">
                      <Terminal size={18} className="text-orange-500" />
                      <span className="text-sm font-bold text-white">Linux</span>
                   </button>
                </div>
             </div>
         </div>

         {/* Hero Visual */}
         <div className="relative max-w-5xl mx-auto mt-24 flex flex-col items-center">
            
            {/* Description Above */}
            <div className="mb-10 text-center animate-fade-in-up delay-200">
                <span className="text-blue-500 font-bold uppercase tracking-[0.2em] text-xs mb-3 block">Interactive Live Demo</span>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Explore the actual Fluid Wallet interface below.</p>
                <div className="mx-auto w-px h-12 bg-gradient-to-b from-blue-500/50 to-transparent mt-6"></div>
            </div>

            <div className="relative w-full">
               <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-slate-950 to-transparent z-10 h-full w-full pointer-events-none"></div>
               
               {/* Main App Mockup */}
               <div className="relative z-0 mx-auto w-full max-w-[320px] sm:max-w-[380px]">
                  <div className="aspect-[9/19.5] bg-slate-950 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden relative ring-1 ring-white/10">
                     <div className="absolute top-0 inset-x-0 h-7 bg-black z-20 flex justify-center">
                        <div className="w-32 h-6 bg-black rounded-b-2xl"></div>
                     </div>
                     
                     {/* Internal App Content Simulation */}
                     <div className="h-full bg-slate-900 flex flex-col pt-12 p-6">
                        <div className="flex justify-between items-center mb-8">
                           <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500"></div>
                              <span className="font-bold text-white">Hello, Alex</span>
                           </div>
                           <div className="p-2 bg-slate-800 rounded-full text-slate-400"><Activity size={20}/></div>
                        </div>

                        <div className="mb-8">
                           <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Balance</span>
                           <div className="text-4xl font-black text-white mt-1">$42,593.00</div>
                           <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg mt-2">
                              <Activity size={12} className="text-emerald-500" />
                              <span className="text-xs font-bold text-emerald-500">+2.4% today</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-8">
                           {['Send', 'Receive', 'Buy', 'Swap'].map((action, i) => (
                              <div key={action} className="flex flex-col items-center gap-2">
                                 <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-white border border-slate-700 shadow-lg">
                                    {i === 0 && <ArrowRight size={20} className="-rotate-45" />}
                                    {i === 1 && <ArrowRight size={20} className="rotate-[135deg]" />}
                                    {i === 2 && <CreditCard size={20} />}
                                    {i === 3 && <RefreshCw size={20} />}
                                 </div>
                                 <span className="text-[10px] font-bold text-slate-400">{action}</span>
                              </div>
                           ))}
                        </div>

                        <div className="flex-grow space-y-4">
                           <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-white">Assets</span>
                              <span className="text-xs font-bold text-blue-500">See All</span>
                           </div>
                           {coins.map((coin) => (
                              <div key={coin.symbol} className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${coin.color} flex items-center justify-center text-white font-bold`}>
                                       {coin.symbol === 'FLD' ? <FluidLogo className="w-6 h-6" /> : <Coins size={20} />}
                                    </div>
                                    <div>
                                       <div className="font-bold text-white text-sm">{coin.name}</div>
                                       <div className="text-xs text-slate-500">{coin.amount} {coin.symbol}</div>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <div className="font-bold text-white text-sm">{coin.value}</div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-1/4 -right-12 p-4 bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-xl z-20 animate-bounce-slow">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-xl"><Check size={20} /></div>
                        <div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase">Received</div>
                           <div className="text-sm font-black text-white">+ 4.20 ETH</div>
                        </div>
                     </div>
                  </div>

                  <div className="absolute bottom-1/4 -left-12 p-4 bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-xl z-20 animate-bounce-slow delay-700">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 text-blue-500 rounded-xl"><Globe size={20} /></div>
                        <div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase">Connected</div>
                           <div className="text-sm font-black text-white">Fluid DEX</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Description Below */}
            <div className="mt-12 text-center relative z-20">
                <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800"><Lock size={12} className="text-emerald-500" /> Non-Custodial</span>
                    <span className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800"><Shield size={12} className="text-blue-500" /> Biometric Secured</span>
                    <span className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800"><Zap size={12} className="text-orange-500" /> Zero-Knowledge</span>
                </div>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
               <div 
                  key={i} 
                  className={`p-8 rounded-[2rem] border transition-all duration-500 cursor-default ${
                     activeFeature === i 
                     ? 'bg-slate-900 border-blue-500/50 shadow-2xl scale-105' 
                     : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                  }`}
                  onMouseEnter={() => setActiveFeature(i)}
               >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                     activeFeature === i ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                     <feature.icon size={28} />
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${activeFeature === i ? 'text-white' : 'text-slate-300'}`}>
                     {feature.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed text-sm font-medium">
                     {feature.desc}
                  </p>
               </div>
            ))}
         </div>
      </section>

      {/* CTA */}
      <section className="text-center px-4">
         <h2 className="text-3xl font-black text-white mb-8">Ready to ditch your bank?</h2>
         <button className="px-12 py-5 bg-white text-slate-900 font-black rounded-full hover:scale-105 transition-transform shadow-lg">
            Create Free Wallet
         </button>
      </section>

    </div>
  );
};

export default WalletPage;