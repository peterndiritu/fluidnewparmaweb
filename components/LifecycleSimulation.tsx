import React, { useState, useEffect, useRef } from 'react';
import { Coins, Landmark, Server, Database, Pickaxe, Zap, ArrowDown } from 'lucide-react';

const LifecycleSimulation: React.FC = () => {
  const [step, setStep] = useState(0); 
  const [treasury, setTreasury] = useState(5000000); 
  const [circulatingSupply, setCirculatingSupply] = useState(10000000);
  const [blockReward, setBlockReward] = useState(50); 
  const [halvingCounter, setHalvingCounter] = useState(0); 
  const [isHalving, setIsHalving] = useState(false);
  
  const cycleRef = useRef<number>(0);

  useEffect(() => {
    const runCycle = async () => {
        setStep(1); 
        await new Promise(r => setTimeout(r, 1500));
        
        setStep(2); 
        setTreasury(prev => prev + 1000); 
        await new Promise(r => setTimeout(r, 1000));
        
        setStep(3); 
        setCirculatingSupply(prev => prev + blockReward); 
        await new Promise(r => setTimeout(r, 1500));

        setStep(4);
        setTreasury(prev => prev + 100); 
        await new Promise(r => setTimeout(r, 1500));

        cycleRef.current += 1;
        if (cycleRef.current >= 3) {
            setIsHalving(true);
            setStep(5);
            await new Promise(r => setTimeout(r, 2000));
            setBlockReward(prev => Math.max(1, Math.floor(prev / 2)));
            setIsHalving(false);
            cycleRef.current = 0;
            setHalvingCounter(0);
        } else {
            setHalvingCounter(cycleRef.current);
        }

        setStep(0); 
    };
    
    const interval = setInterval(runCycle, 8500);
    runCycle(); // Initial run
    
    return () => clearInterval(interval);
  }, [blockReward]); // Only depends on blockReward to re-init if needed, but runCycle handles its own logic

  return (
    <div className="w-full max-w-6xl mx-auto mb-24 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-nebula font-black text-white italic uppercase tracking-tighter">Economic Engine</h2>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Protocol Lifecycle • Real-time Sharding Simulation</p>
            </div>
            
            <div className="flex items-center gap-6 bg-slate-900/50 border border-white/5 rounded-3xl px-6 py-4 backdrop-blur-md">
                <div className="text-right">
                    <div className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Next Halving</div>
                    <div className="flex gap-1.5 justify-end">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${i <= (3 - halvingCounter) ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-slate-800'}`}></div>
                        ))}
                    </div>
                </div>
                <div className="h-8 w-px bg-white/5"></div>
                <div>
                     <div className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Block Reward</div>
                     <div className="text-xl font-nebula font-black text-white italic leading-none">{blockReward} <span className="text-indigo-400">FLD</span></div>
                </div>
            </div>
        </div>

        <div className="bg-slate-900/30 border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl min-h-[450px] flex flex-col justify-center">
            {/* Background Data Stream Track */}
            <div className="absolute top-1/2 left-20 right-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 hidden md:block"></div>

            {/* --- ANIMATED PARTICLES --- */}
            <div className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.5)] z-20 transition-all duration-[1200ms] ease-in-out hidden md:flex items-center justify-center border border-white/20
                ${step === 1 ? 'left-[35%] opacity-100 scale-110' : 'left-16 opacity-0 scale-50'}
            `}><Coins size={18} className="text-white" /></div>

            <div className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] z-20 transition-all duration-[1200ms] ease-in-out hidden md:block border border-white/20
                ${step === 4 ? 'left-[90%] opacity-100' : 'left-[35%] opacity-0'}
            `}></div>

            <div className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-purple-600 rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.5)] z-20 transition-all duration-[1200ms] ease-in-out hidden md:flex items-center justify-center border border-white/20
                ${step === 3 ? 'left-[60%] opacity-100 scale-125 rotate-12' : step === 4 ? 'left-[90%] opacity-0 scale-50' : 'left-[35%] opacity-0 scale-50'}
            `}><Pickaxe size={20} className="text-white" /></div>


            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10 items-center">
                <div className={`p-8 bg-black/40 border border-white/5 rounded-[2.5rem] flex flex-col items-center gap-4 transition-all duration-500 ${step === 1 ? 'border-indigo-500/50 bg-indigo-500/5 scale-105 shadow-2xl shadow-indigo-500/10' : ''}`}>
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                        <Coins size={32} />
                    </div>
                    <div className="text-center">
                        <div className="font-nebula font-black text-white uppercase italic text-sm mb-1">User</div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Entry Fee</div>
                    </div>
                </div>

                <div className={`p-8 bg-black/40 border border-white/5 rounded-[2.5rem] flex flex-col items-center gap-4 transition-all duration-500 ${step === 2 || step === 4 ? 'border-emerald-500/50 bg-emerald-500/5 scale-105 shadow-2xl shadow-emerald-500/10' : ''}`}>
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                        <Landmark size={32} />
                    </div>
                    <div className="text-center">
                        <div className="font-nebula font-black text-white uppercase italic text-sm mb-1">Treasury</div>
                        <div className="text-[10px] text-emerald-400 font-mono mb-1">${treasury.toLocaleString()}</div>
                        <div className={`text-[8px] font-black uppercase text-emerald-500 tracking-widest transition-opacity duration-300 ${step === 2 ? 'opacity-100' : 'opacity-0'}`}>Accumulating...</div>
                    </div>
                </div>

                <div className={`p-8 bg-black/40 border border-white/5 rounded-[2.5rem] flex flex-col items-center gap-4 transition-all duration-500 ${step === 3 ? 'border-purple-500/50 bg-purple-500/5 scale-105 shadow-2xl shadow-purple-500/10' : ''} ${isHalving ? 'ring-2 ring-red-500 ring-offset-4 ring-offset-slate-950' : ''}`}>
                    <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 relative">
                        {isHalving ? <ArrowDown size={32} className="animate-bounce text-red-500" /> : <Zap size={32} />}
                    </div>
                    <div className="text-center">
                        <div className="font-nebula font-black text-white uppercase italic text-sm mb-1">{isHalving ? 'HALVING' : 'Consensus'}</div>
                        <div className="text-[10px] text-slate-400 font-mono mb-1">{circulatingSupply.toLocaleString()} FLD</div>
                        <div className={`text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${step === 3 ? 'opacity-100 text-purple-400' : 'opacity-0'}`}>
                            {isHalving ? 'Slashed' : 'Mining +50'}
                        </div>
                    </div>
                </div>

                <div className={`p-8 bg-black/40 border border-white/5 rounded-[2.5rem] flex flex-col items-center gap-4 transition-all duration-500 ${step === 4 ? 'border-indigo-400/50 bg-indigo-400/5 scale-105 shadow-2xl shadow-indigo-400/10' : ''}`}>
                    <div className="w-16 h-16 bg-indigo-400/10 rounded-2xl flex items-center justify-center text-indigo-300">
                        <div className="flex -space-x-2">
                            <Server size={24} />
                            <Database size={24} />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="font-nebula font-black text-white uppercase italic text-sm mb-1">Nodes</div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Validators</div>
                        <div className={`text-[8px] font-black uppercase text-indigo-400 tracking-widest transition-opacity duration-300 ${step === 4 ? 'opacity-100' : 'opacity-0'}`}>Rewarding...</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default LifecycleSimulation;