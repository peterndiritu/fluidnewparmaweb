import React, { useState, useEffect } from 'react';
import { 
  Play, Apple, Box, ArrowDownUp, ChevronDown, RefreshCw, 
  Wallet as WalletIcon, Layers, Shield, Globe, Zap, 
  Lock, Smartphone, CreditCard, Check, X, ArrowRight,
  Fingerprint, Eye, Activity, Key, ChevronRight, Landmark
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
         
         <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-fade-in-up delay-100">
             <button className="flex items-center gap-3 bg-white text-slate-900 font-bold rounded-2xl px-6 py-4 hover:scale-105 transition-transform shadow-xl shadow-white/10">
                <Apple size={24} />
                <div className="text-left">
                   <div className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Download on</div>
                   <div className="text-lg font-black leading-none tracking-tight">App Store</div>
                </div>
             </button>
             <button className="flex items-center gap-3 bg-slate-900 text-white border border-slate-700 rounded-2xl px-6 py-4 hover:scale-105 transition-transform shadow-xl">
                <Play size={24} className="fill-white" />
                <div className="text-left">
                   <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Get it on</div>
                   <div className="text-lg font-black leading-none tracking-tight">Google Play</div>
                </div>
             </button>
         </div>

         {/* Hero Visual */}
         <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-slate-950 to-transparent z-20 h-full w-full pointer-events-none"></div>
            <img 
              src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop" 
              alt="App Interface" 
              className="rounded-[3rem] border-8 border-slate-900/50 shadow-2xl mx-auto opacity-80"
            />
         </div>
      </section>

      {/* Deep Dive Section 1: The Interface */}
      <section className="max-w-7xl mx-auto px-4 mb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Interactive Phone Mockup */}
          <div className="relative order-2 lg:order-1">
             <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 to-blue-600/30 rounded-[3rem] blur-3xl opacity-50"></div>
             <div className="bg-slate-900 border-4 border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col z-10 max-w-sm mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                
                {/* Dynamic Notch */}
                <div className="absolute top-0 inset-x-0 h-7 bg-black z-20 flex justify-center pt-2">
                   <div className="w-20 h-4 bg-slate-900 rounded-full"></div>
                </div>

                {/* Mockup Header */}
                <div className="p-6 pt-12 bg-slate-900">
                   <div className="flex justify-between items-center mb-6">
                      <div>
                         <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Balance</div>
                         <div className="text-3xl font-black text-white tracking-tight">$12,458.00</div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                         <span className="text-white font-black text-xl">F</span>
                      </div>
                   </div>
                   
                   {/* Toggles */}
                   <div className="flex gap-4 mb-4 bg-black/40 p-1 rounded-xl border border-white/5">
                      <button 
                        onClick={() => setMockupView('assets')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${mockupView === 'assets' ? 'bg-white/10 text-white shadow' : 'text-slate-500'}`}
                      >
                        Assets
                      </button>
                      <button 
                        onClick={() => setMockupView('swap')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${mockupView === 'swap' ? 'bg-white/10 text-white shadow' : 'text-slate-500'}`}
                      >
                        DEX
                      </button>
                   </div>
                </div>
                
                {/* Mockup Body */}
                <div className="flex-grow bg-[#020617] p-4 overflow-y-auto no-scrollbar">
                  {mockupView === 'assets' ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-2 mb-6">
                         {['Send', 'Receive', 'Buy', 'Swap'].map(action => (
                            <div key={action} className="flex flex-col items-center gap-1">
                               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white border border-white/5">
                                  <div className="w-4 h-4 bg-current opacity-50 rounded-sm"></div>
                               </div>
                               <span className="text-[8px] font-bold text-slate-500 uppercase">{action}</span>
                            </div>
                         ))}
                      </div>
                      {coins.map(coin => (
                         <div key={coin.symbol} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded-lg ${coin.color} flex items-center justify-center text-white font-bold`}>
                                  {coin.symbol[0]}
                               </div>
                               <div>
                                  <div className="text-xs font-bold text-white">{coin.name}</div>
                                  <div className="text-[9px] text-slate-500 font-bold">{coin.amount} {coin.symbol}</div>
                               </div>
                            </div>
                            <div className="text-right">
                               <div className="text-xs font-bold text-white">{coin.value}</div>
                               <div className="text-[9px] text-emerald-500 font-bold">+2.4%</div>
                            </div>
                         </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 pt-4">
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase mb-2 block">You Pay</label>
                          <div className="flex justify-between items-center">
                             <div className="text-xl font-bold text-white">1.50</div>
                             <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded border border-white/10">
                                <span className="text-[10px] font-bold text-white">ETH</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex justify-center -my-3 relative z-10">
                          <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-emerald-400">
                             <ArrowDownUp size={14} />
                          </div>
                       </div>
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase mb-2 block">You Receive</label>
                          <div className="flex justify-between items-center">
                             <div className="text-xl font-bold text-emerald-400">8,420</div>
                             <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded border border-white/10">
                                <span className="text-[10px] font-bold text-white">FLD</span>
                             </div>
                          </div>
                       </div>
                       <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-black rounded-xl uppercase tracking-wider text-xs">
                          Confirm Swap
                       </button>
                    </div>
                  )}
                </div>
             </div>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2">
             <div className="inline-block px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 font-bold text-xs uppercase tracking-widest mb-6 border border-blue-500/20">
                User Experience
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                Complex Tech. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">Simple Feel.</span>
             </h2>
             <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                We abstracted away the complexities of blockchain. No more confusing gas fees, hex addresses, or network switching. Fluid Wallet handles the routing, bridging, and security in the background.
             </p>
             
             <div className="space-y-6">
                {features.map((feature, idx) => (
                   <div 
                      key={idx} 
                      className={`p-6 rounded-2xl border transition-all duration-500 ${activeFeature === idx ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-xl scale-105' : 'bg-transparent border-transparent opacity-60'}`}
                   >
                      <div className="flex items-start gap-4">
                         <div className={`p-3 rounded-xl ${activeFeature === idx ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                            <feature.icon size={24} />
                         </div>
                         <div>
                            <h3 className={`text-lg font-bold mb-1 ${activeFeature === idx ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{feature.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                               {feature.desc}
                            </p>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

        </div>
      </section>

      {/* Security Architecture (Bento Grid) */}
      <section className="max-w-7xl mx-auto px-4 mb-32">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Fort Knox in Your Pocket</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Our multi-layered security approach ensures your assets are protected against every vector of attack.</p>
         </div>

         <div className="grid md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Card 1: Non-Custodial */}
            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all"></div>
               <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 mb-4">
                     <Shield size={24} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-white mb-2">True Non-Custodial Architecture</h3>
                     <p className="text-slate-400 max-w-md">Your private keys are encrypted locally on your device's Secure Enclave. We cannot freeze your funds, reverse transactions, or access your wallet.</p>
                  </div>
               </div>
            </div>

            {/* Card 2: Biometrics */}
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden hover:scale-[1.02] transition-transform">
               <Fingerprint size={64} className="text-blue-500 mb-4 opacity-80" />
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Bio-Auth</h3>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">FaceID & TouchID Ready</p>
            </div>

            {/* Card 3: Privacy */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between group">
               <div className="flex justify-between items-start">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white"><Eye size={24} /></div>
                  <div className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase rounded">No KYC</div>
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Anonymous</h3>
                  <p className="text-sm text-slate-500">No account required. No email. No phone number.</p>
               </div>
            </div>

            {/* Card 4: Audit */}
            <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full">
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-4 opacity-80">
                        <Check className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Audited by CertiK</span>
                     </div>
                     <h3 className="text-3xl font-black mb-2">Open Source</h3>
                     <p className="text-blue-100">Our codebase is public and verifiable. Trust, but verify.</p>
                  </div>
                  <div className="h-32 w-32 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 rotate-6">
                     <Lock size={40} className="text-white" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Fiat Rails Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-24 border-y border-slate-200 dark:border-slate-800">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
               <div className="flex-1">
                  <span className="text-emerald-500 font-bold uppercase tracking-widest text-sm mb-2 block">Fiat Gateway</span>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                     Your Bank Account <br/>
                     <span className="text-slate-400">Just Got Upgraded.</span>
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                     Directly link your bank account to buy crypto instantly with 0% fees on your first $1,000. Sell crypto back to fiat and withdraw to your bank in seconds.
                  </p>
                  
                  <ul className="space-y-4 mb-8">
                     {[
                        'Instant ACH & SEPA Transfers',
                        'Apple Pay & Google Pay Integration',
                        'Virtual Debit Cards for Online Spending',
                        'Auto-DCA (Dollar Cost Averaging)'
                     ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                              <Check size={14} />
                           </div>
                           <span className="text-slate-700 dark:text-slate-300 font-bold">{item}</span>
                        </li>
                     ))}
                  </ul>

                  <button className="flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest hover:gap-4 transition-all">
                     View Limits & Fees <ArrowRight size={18} />
                  </button>
               </div>
               
               <div className="flex-1 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full blur-[80px]"></div>
                  <div className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
                     <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Buying Power</h3>
                        <Landmark className="text-slate-400" />
                     </div>
                     <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                           <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">C</div>
                           <div className="flex-1">
                              <div className="text-sm font-bold text-slate-900 dark:text-white">Chase Bank</div>
                              <div className="text-xs text-slate-500">**** 4492</div>
                           </div>
                           <span className="text-emerald-500 text-xs font-bold uppercase bg-emerald-500/10 px-2 py-1 rounded">Linked</span>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                           <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold"><Apple size={16}/></div>
                           <div className="flex-1">
                              <div className="text-sm font-bold text-slate-900 dark:text-white">Apple Pay</div>
                              <div className="text-xs text-slate-500">Instant</div>
                           </div>
                           <ChevronRight size={16} className="text-slate-400" />
                        </div>
                     </div>
                     <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                        <div>
                           <span className="text-xs text-slate-500 font-bold uppercase">Weekly Limit</span>
                           <div className="text-2xl font-black text-slate-900 dark:text-white">$50,000</div>
                        </div>
                        <button className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20">Increase</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-5xl mx-auto px-4 mt-24">
         <h2 className="text-3xl font-black text-center text-slate-900 dark:text-white mb-16">The Fluid Advantage</h2>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr>
                     <th className="p-4 text-sm text-slate-500 font-bold uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">Feature</th>
                     <th className="p-4 text-center border-b border-slate-200 dark:border-slate-800 bg-emerald-500/5 rounded-t-2xl">
                        <div className="flex flex-col items-center">
                           <FluidLogo className="w-8 h-8 text-emerald-500 mb-2" />
                           <span className="font-black text-slate-900 dark:text-white">Fluid</span>
                        </div>
                     </th>
                     <th className="p-4 text-center border-b border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-slate-500">Metamask</span>
                     </th>
                     <th className="p-4 text-center border-b border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-slate-500">Coinbase</span>
                     </th>
                  </tr>
               </thead>
               <tbody className="text-sm font-medium">
                  {[
                     { feature: 'Non-Custodial', fluid: true, mm: true, cb: false },
                     { feature: 'Cross-Chain Swaps', fluid: true, mm: false, cb: false },
                     { feature: 'Gas-Less Mode', fluid: true, mm: false, cb: false },
                     { feature: 'Fiat Off-Ramp', fluid: true, mm: true, cb: true },
                     { feature: 'Debit Card', fluid: true, mm: true, cb: true },
                     { feature: 'Privacy Focused', fluid: true, mm: false, cb: false },
                  ].map((row, i) => (
                     <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="p-4 border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">{row.feature}</td>
                        <td className="p-4 border-b border-slate-100 dark:border-slate-800 text-center bg-emerald-500/5">
                           {row.fluid ? <Check size={20} className="mx-auto text-emerald-500" /> : <X size={20} className="mx-auto text-slate-300" />}
                        </td>
                        <td className="p-4 border-b border-slate-100 dark:border-slate-800 text-center">
                           {row.mm ? <Check size={20} className="mx-auto text-slate-500" /> : <X size={20} className="mx-auto text-slate-300" />}
                        </td>
                        <td className="p-4 border-b border-slate-100 dark:border-slate-800 text-center">
                           {row.cb ? <Check size={20} className="mx-auto text-slate-500" /> : <X size={20} className="mx-auto text-slate-300" />}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* CTA Footer */}
      <section className="text-center mt-32 px-4">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden max-w-6xl mx-auto shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
             
             <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to take control?</h2>
                <button className="bg-white text-slate-900 px-10 py-5 rounded-full font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-white/20">
                   Get Started Free
                </button>
                <p className="mt-6 text-slate-500 text-sm font-bold uppercase tracking-widest">No credit card required • Setup in 30s</p>
             </div>
          </div>
      </section>

    </div>
  );
};

export default WalletPage;