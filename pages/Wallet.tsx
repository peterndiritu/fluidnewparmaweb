import React, { useState } from 'react';
import { Play, Apple, Box, ArrowDownUp, ChevronDown, RefreshCw, Wallet as WalletIcon, Layers } from 'lucide-react';

const WalletPage: React.FC = () => {
  const [mockupView, setMockupView] = useState<'assets' | 'swap'>('assets');

  const coins = [
    { name: 'Bitcoin', symbol: 'BTC', amount: '0.45', value: '$29,000', color: 'bg-orange-500' },
    { name: 'Ethereum', symbol: 'ETH', amount: '4.20', value: '$8,100', color: 'bg-indigo-500' },
    { name: 'Fluid', symbol: 'FLD', amount: '15,000', value: '$15,000', color: 'bg-emerald-500' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
         <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6 animate-fade-in-up">
            <span className="text-emerald-500 font-bold uppercase tracking-wider text-sm">Beta Access Now Live</span>
         </div>
         <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6">
            One Wallet. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Infinite Possibilities.</span>
         </h1>
         <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-medium">
            The only non-custodial wallet you'll ever need. Swap, stake, and spend crypto with zero fees on Fluid Chain.
         </p>
         
         <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
             <button className="flex items-center gap-3 bg-slate-900 text-white border border-slate-700 rounded-xl px-5 py-3 hover:bg-slate-800 transition-colors">
                <Play size={24} className="fill-white" />
                <div className="text-left">
                   <div className="text-[10px] uppercase font-bold text-slate-400">Get it on</div>
                   <div className="text-lg font-bold leading-none">Google Play</div>
                </div>
             </button>
             <button className="flex items-center gap-3 bg-slate-900 text-white border border-slate-700 rounded-xl px-5 py-3 hover:bg-slate-800 transition-colors">
                <Apple size={24} className="fill-white" />
                <div className="text-left">
                   <div className="text-[10px] uppercase font-bold text-slate-400">Download on the</div>
                   <div className="text-lg font-bold leading-none">App Store</div>
                </div>
             </button>
             <button className="flex items-center gap-3 bg-slate-900 text-white border border-slate-700 rounded-xl px-5 py-3 hover:bg-slate-800 transition-colors">
                <Box size={24} />
                <div className="text-left">
                   <div className="text-[10px] uppercase font-bold text-slate-400">Direct Download</div>
                   <div className="text-lg font-bold leading-none">.APK File</div>
                </div>
             </button>
         </div>
      </section>

      {/* Interface Mockup */}
      <section className="max-w-md mx-auto px-4 mb-24 relative z-10">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative min-h-[600px] flex flex-col">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-800/50 flex items-center justify-center gap-2 z-20">
                 <div className="w-20 h-4 bg-black rounded-full"></div>
              </div>

              {/* Header Content */}
              <div className="p-6 pt-12">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                       <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Balance</div>
                       <div className="text-3xl font-bold text-white tracking-tight">$12,458.00</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                       <span className="text-white font-black text-xl">F</span>
                    </div>
                 </div>
                 
                 {/* Main Action Toggles */}
                 <div className="flex gap-4 mb-8 bg-black/20 p-1.5 rounded-2xl border border-white/5">
                    <button 
                      onClick={() => setMockupView('assets')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${mockupView === 'assets' ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <Layers size={14} /> Assets
                    </button>
                    <button 
                      onClick={() => setMockupView('swap')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${mockupView === 'swap' ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <RefreshCw size={14} /> Swap (DEX)
                    </button>
                 </div>
                 
                 {/* View Container */}
                 <div className="flex-grow transition-all duration-300">
                    {mockupView === 'assets' ? (
                      <div className="space-y-4 animate-fade-in-up">
                        <div className="flex gap-4 mb-8">
                           {['Send', 'Receive', 'Buy'].map(action => (
                              <button key={action} className="flex-1 flex flex-col items-center gap-2 group">
                                 <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                                    <div className="w-5 h-5 bg-current rounded-sm opacity-50"></div>
                                 </div>
                                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{action}</span>
                              </button>
                           ))}
                        </div>
                        {coins.map(coin => (
                           <div key={coin.symbol} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                              <div className="flex items-center gap-3">
                                 <div className={`w-10 h-10 rounded-xl ${coin.color} flex items-center justify-center text-white font-bold shadow-lg transition-transform group-hover:scale-110`}>
                                    {coin.symbol[0]}
                                 </div>
                                 <div>
                                    <div className="text-sm font-bold text-white">{coin.name}</div>
                                    <div className="text-[10px] text-slate-500 font-bold">{coin.amount} {coin.symbol}</div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-sm font-bold text-white">{coin.value}</div>
                                 <div className="text-[10px] text-emerald-500 font-bold">+2.4%</div>
                              </div>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4 animate-fade-in-up">
                         {/* Pay Section */}
                         <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">You Pay</label>
                            <div className="flex justify-between items-center">
                               <input type="text" defaultValue="1.50" className="bg-transparent text-xl font-bold text-white outline-none w-1/2" />
                               <div className="flex items-center gap-2 bg-slate-800 px-2 py-1.5 rounded-lg border border-white/10">
                                  <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-[8px] font-bold">ETH</div>
                                  <span className="text-xs font-bold text-white">ETH</span>
                                  <ChevronDown size={12} className="text-slate-500" />
                               </div>
                            </div>
                         </div>

                         {/* Arrow */}
                         <div className="flex justify-center -my-4 relative z-10">
                            <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 text-emerald-400 shadow-xl">
                               <ArrowDownUp size={16} />
                            </div>
                         </div>

                         {/* Receive Section */}
                         <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">You Receive</label>
                            <div className="flex justify-between items-center">
                               <div className="text-xl font-bold text-emerald-400">8,420</div>
                               <div className="flex items-center gap-2 bg-slate-800 px-2 py-1.5 rounded-lg border border-white/10">
                                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] font-bold">F</div>
                                  <span className="text-xs font-bold text-white">FLUID</span>
                                  <ChevronDown size={12} className="text-slate-500" />
                               </div>
                            </div>
                         </div>

                         {/* Swap Info */}
                         <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-center">
                            <p className="text-[10px] text-slate-400 font-medium">1 ETH = 5,613 FLUID</p>
                            <p className="text-[10px] text-emerald-500/70 font-bold mt-1">Slippage: 0.5% • Price Impact: 0.01%</p>
                         </div>

                         <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-black rounded-2xl shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all uppercase tracking-widest text-sm">
                            Confirm Swap
                         </button>
                      </div>
                    )}
                 </div>
              </div>
              
              {/* Bottom Nav Bar */}
              <div className="mt-auto border-t border-white/5 bg-slate-900 p-4 flex justify-between items-center px-10">
                 <div className="text-emerald-500"><WalletIcon size={20} /></div>
                 <div className="text-slate-600 hover:text-slate-400 transition-colors"><ArrowDownUp size={20} /></div>
                 <div className="text-slate-600 hover:text-slate-400 transition-colors"><Layers size={20} /></div>
              </div>
          </div>

          {/* Device Glow */}
          <div className="absolute inset-x-10 bottom-10 h-32 bg-emerald-500/20 blur-[100px] -z-10 rounded-full"></div>
      </section>

    </div>
  );
};

export default WalletPage;