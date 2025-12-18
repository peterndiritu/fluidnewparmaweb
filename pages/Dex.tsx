import React, { useState } from 'react';
import { ArrowDownUp, Settings, ChevronDown, Shield, RefreshCw, Zap, TrendingUp, Play, Apple, Box } from 'lucide-react';

const DexPage: React.FC = () => {
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');

  return (
    <div className="min-h-screen pt-28 pb-16">
      
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-cyan-400 font-bold uppercase tracking-widest text-sm">DEX</span>
        <h1 className="text-5xl font-extrabold text-white mt-2 mb-4">Fluid DEX</h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-8">
          Trade cryptocurrencies anonymously with Fluid DEX. Secure, fast, and transparent trading without intermediaries.
        </p>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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
      </div>

      {/* Swap Interface Mockup */}
      <div className="max-w-md mx-auto px-4 mb-24 relative z-10">
         <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>

            <div className="flex justify-between items-center mb-6">
               <div className="flex gap-4">
                  <button className="text-white font-bold border-b-2 border-cyan-400 pb-1">Swap</button>
                  <button className="text-slate-500 font-bold hover:text-white transition-colors">Buy</button>
               </div>
               <button className="text-slate-400 hover:text-white"><Settings size={20} /></button>
            </div>

            {/* Pay Input */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-2">
               <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">I have 0 ETH</span>
                  <span className="text-slate-500">$0.00</span>
               </div>
               <div className="flex justify-between items-center">
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="bg-transparent text-2xl font-bold text-white outline-none w-1/2 placeholder-slate-600"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                  />
                  <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors border border-slate-700">
                     <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026" className="w-5 h-5 rounded-full" alt="ETH" />
                     <span className="font-bold text-white">ETH</span>
                     <ChevronDown size={14} className="text-slate-400" />
                  </button>
               </div>
            </div>

            {/* Swap Arrow */}
            <div className="flex justify-center -my-3 relative z-10">
               <div className="bg-slate-800 border border-slate-700 p-2 rounded-xl text-cyan-400 cursor-pointer hover:rotate-180 transition-transform duration-300">
                  <ArrowDownUp size={18} />
               </div>
            </div>

            {/* Receive Input */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-6">
               <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">I want USDT</span>
                  <span className="text-slate-500">$0.00</span>
               </div>
               <div className="flex justify-between items-center">
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="bg-transparent text-2xl font-bold text-white outline-none w-1/2 placeholder-slate-600"
                    value={receiveAmount}
                    readOnly
                  />
                  <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors border border-slate-700">
                     <img src="https://cryptologos.cc/logos/tether-usdt-logo.png?v=026" className="w-5 h-5 rounded-full" alt="USDT" />
                     <span className="font-bold text-white">USDT</span>
                     <span className="text-xs bg-slate-700 px-1 rounded text-slate-300">ETH</span>
                     <ChevronDown size={14} className="text-slate-400" />
                  </button>
               </div>
            </div>

            {/* Percentages */}
            <div className="flex justify-between gap-2 mb-6">
               {['Min', 'Half', 'All'].map(label => (
                  <button key={label} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold py-2 rounded-lg border border-slate-700 transition-colors">
                     {label}
                  </button>
               ))}
            </div>

            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all">
               Connect Wallet
            </button>

         </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid md:grid-cols-2 gap-6">
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-cyan-500/30 transition-colors group">
               <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform">
                  <RefreshCw size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">Smooth Ecosystem Integration</h3>
               <p className="text-slate-400">
                  Fluid's proprietary DEX integrates directly into the wallet, creating a unified platform where users can trade tokens without external exchanges.
               </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-cyan-500/30 transition-colors group">
               <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                  <Shield size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">Enhanced Security & Control</h3>
               <p className="text-slate-400">
                  Designed internally with advanced security measures, aligning with our non-custodial philosophy to keep you in control of assets.
               </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-cyan-500/30 transition-colors group">
               <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                  <Zap size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">Continuous Development</h3>
               <p className="text-slate-400">
                  A significant step in Fluid's roadmap, with ongoing enhancements planned to deliver superior performance, liquidity, and efficiency.
               </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:border-cyan-500/30 transition-colors group">
               <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 text-cyan-500 group-hover:scale-110 transition-transform">
                  <TrendingUp size={24} />
               </div>
               <h3 className="text-xl font-bold text-white mb-3">Cost-Effective Trading</h3>
               <p className="text-slate-400">
                  Compares multiple routes and providers in real time to offer the most competitive rates and transaction fees.
               </p>
            </div>

         </div>
      </div>

    </div>
  );
};

export default DexPage;