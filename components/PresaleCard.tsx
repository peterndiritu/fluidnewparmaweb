import React, { useState, useEffect } from 'react';
import { Coins, Zap, ShieldCheck, Timer, ChevronDown, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';

const PresaleCard: React.FC = () => {
  const [payAmount, setPayAmount] = useState('1.0');
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });
  const [selectedAsset, setSelectedAsset] = useState('ETH');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { h: prev.h, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fldPrice = 0.00025; // 1 FLD = 0.00025 ETH approx
  const receiveAmount = (parseFloat(payAmount) || 0) / fldPrice;

  return (
    <div className="w-full max-w-md bg-slate-900 border border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden animate-fade-in-up">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-nebula font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Current Phase</span>
            <h3 className="text-2xl font-nebula font-black text-white uppercase italic">Genesis <span className="text-fluid-gradient">Sale</span></h3>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-nebula font-black text-emerald-500 uppercase">Live</span>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Timer size={14} className="text-slate-500" />
            <span className="text-[10px] font-nebula font-black text-slate-500 uppercase tracking-widest">Ending In</span>
          </div>
          <div className="flex gap-3 text-white font-nebula font-black text-sm italic">
            <span>{timeLeft.h}H</span>
            <span>{timeLeft.m}M</span>
            <span>{timeLeft.s}S</span>
          </div>
        </div>

        {/* Swap Inputs */}
        <div className="space-y-3 mb-6">
          <div className="bg-black/20 border border-white/10 rounded-[2rem] p-6 focus-within:border-indigo-500/50 transition-colors">
            <div className="flex justify-between mb-2">
              <span className="text-[10px] font-nebula font-black text-slate-500 uppercase tracking-widest">You Pay</span>
              <span className="text-[10px] font-nebula font-black text-slate-500 uppercase tracking-widest">Bal: 0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <input 
                type="number" 
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="bg-transparent text-3xl font-nebula font-black text-white outline-none w-1/2 placeholder:text-slate-800"
              />
              <button className="flex items-center gap-2 bg-slate-800/80 border border-white/10 rounded-2xl px-4 py-2 hover:bg-slate-700 transition-colors">
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white"><Coins size={14}/></div>
                <span className="text-xs font-nebula font-black text-white">{selectedAsset}</span>
                <ChevronDown size={14} className="text-slate-500" />
              </button>
            </div>
          </div>

          <div className="flex justify-center -my-6 relative z-20">
             <div className="w-10 h-10 bg-indigo-600 border-4 border-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
               <ChevronDown size={20} />
             </div>
          </div>

          <div className="bg-black/20 border border-white/10 rounded-[2rem] p-6 focus-within:border-indigo-500/50 transition-colors">
            <div className="flex justify-between mb-2">
              <span className="text-[10px] font-nebula font-black text-slate-500 uppercase tracking-widest">You Receive</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-nebula font-black text-white italic">{receiveAmount.toLocaleString()}</div>
              <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl px-4 py-2">
                <Zap size={16} className="text-indigo-400" />
                <span className="text-xs font-nebula font-black text-indigo-400">FLD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-nebula font-black text-slate-500 uppercase tracking-widest">Allocation Progress</span>
            <span className="text-[10px] font-nebula font-black text-white uppercase tracking-widest">78%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[78%] bg-fluid-gradient rounded-full"></div>
          </div>
        </div>

        {/* Buy Button */}
        <button className="w-full py-5 bg-white text-slate-950 rounded-[1.5rem] font-nebula font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
          Secure Allocation <ArrowRight size={16} />
        </button>

        <div className="mt-6 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest">Audited Genesis</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-indigo-400" />
            <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest">Listing Q1 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresaleCard;