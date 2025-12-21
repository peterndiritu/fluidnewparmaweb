
import React, { useState, useEffect } from 'react';
import { Coins, Landmark, Server, Database, Pickaxe, Zap, TrendingUp, ArrowDown } from 'lucide-react';

const LifecycleSimulation: React.FC = () => {
  // Steps: 0:Idle, 1:UserPay, 2:EndowmentGrow, 3:BlockMining(Mint), 4:Distribution, 5:HalvingCheck
  const [step, setStep] = useState(0); 
  
  // Economy States
  const [treasury, setTreasury] = useState(5000000); // Endowment Pool
  const [circulatingSupply, setCirculatingSupply] = useState(10000000);
  const [blockReward, setBlockReward] = useState(50); // Starts high, halves
  const [halvingCounter, setHalvingCounter] = useState(0); // Counts cycles until halving
  const [isHalving, setIsHalving] = useState(false);

  useEffect(() => {
    const runCycle = async () => {
        // Step 1: User pays One-Time Fee
        setStep(1); 
        await new Promise(r => setTimeout(r, 1500));
        
        // Step 2: Payment enters Endowment (Yield Source)
        setStep(2); 
        setTreasury(prev => prev + 1000); 
        await new Promise(r => setTimeout(r, 1000));
        
        // Step 3: Block Generation (PoS + PoStorage)
        setStep(3); 
        setCirculatingSupply(prev => prev + blockReward); // Minting new tokens
        await new Promise(r => setTimeout(r, 1500));

        // Step 4: Distribution (Yield + Reward) -> Nodes
        setStep(4);
        setTreasury(prev => prev + 100); // Yield generated from Endowment
        await new Promise(r => setTimeout(r, 1500));

        // Step 5: Halving Logic (Every 3 cycles for demo purposes)
        setHalvingCounter(prev => {
            const next = prev + 1;
            if (next >= 3) {
                setIsHalving(true);
                setTimeout(() => {
                    setBlockReward(r => Math.max(1, Math.floor(r / 2)));
                    setIsHalving(false);
                }, 2000);
                return 0;
            }
            return next;
        });

        if (halvingCounter >= 2) {
             setStep(5); // Show Halving Visual
             await new Promise(r => setTimeout(r, 2000));
        }

        setStep(0); // Reset
    };
    
    runCycle();
    const interval = setInterval(runCycle, 8000); // Loop
    
    return () => clearInterval(interval);
  }, [halvingCounter, blockReward]);

  return (
    <div className="w-full max-w-6xl mx-auto mb-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-4">
            <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Endowment & Halving Engine</h2>
                <p className="text-slate-600 dark:text-slate-400">PoS Consensus • Proof of Storage • Deflationary Emission</p>
            </div>
            
            {/* Halving Indicator */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 shadow-sm">
                <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Next Halving</div>
                    <div className="flex gap-1 justify-end mt-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i <= (3 - halvingCounter) ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                        ))}
                    </div>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                <div>
                     <div className="text-[10px] text-slate-500 font-bold uppercase">Block Reward</div>
                     <div className="text-xl font-bold text-slate-900 dark:text-white leading-none">{blockReward} FLD</div>
                </div>
            </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-950/50 backdrop-blur-sm rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 relative overflow-hidden shadow-2xl md:min-h-[400px]">
            {/* Background Track */}
            <div className="absolute top-1/2 left-16 right-16 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 rounded-full hidden md:block"></div>

            {/* --- ANIMATED PARTICLES (Desktop Only) --- */}

            {/* 1. User Fee (Blue) */}
            <div 
                className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] z-20 transition-all duration-[1500ms] ease-in-out hidden md:flex items-center justify-center text-[10px] text-white font-bold border-2 border-white dark:border-slate-900
                ${step === 0 ? 'left-16 opacity-0' : ''}
                ${step === 1 ? 'left-[35%] opacity-100' : ''}
                ${step >= 2 ? 'left-[35%] opacity-0 scale-50' : ''} 
                `} 
            ><Coins size={14} /></div>

            {/* 2. Endowment Yield (Green) */}
             <div 
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full shadow-lg z-20 transition-all duration-[1500ms] ease-in-out hidden md:block border-2 border-white dark:border-slate-900
                ${step < 4 ? 'left-[35%] opacity-0' : ''}
                ${step === 4 ? 'left-[90%] opacity-100' : ''}
                ${step > 4 ? 'opacity-0' : ''}
                `}
            ></div>

            {/* 3. Block Reward Minted (Orange) */}
             <div 
                className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.6)] z-20 transition-all duration-[1500ms] ease-in-out hidden md:flex items-center justify-center border-2 border-white dark:border-slate-900
                ${step < 3 ? 'left-[60%] opacity-0 scale-0' : ''}
                ${step === 3 ? 'left-[60%] opacity-100 scale-125' : ''}
                ${step === 4 ? 'left-[90%] opacity-0 scale-50' : ''}
                `}
            ><Pickaxe size={18} className="text-white" /></div>


            {/* --- NODES GRID --- */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10 h-full items-center">
                
                {/* 1. User */}
                <div className={`relative p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center gap-4 transition-all duration-500 ${step === 1 ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)] scale-105' : ''}`}>
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                        <Coins size={32} />
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-slate-900 dark:text-white text-lg">User</div>
                        <div className="text-xs text-slate-500">One-Time Payment</div>
                    </div>
                </div>

                {/* 2. Endowment */}
                <div className={`relative p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center gap-4 transition-all duration-500 ${step === 2 || step === 4 ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-105' : ''}`}>
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                        <Landmark size={32} />
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-slate-900 dark:text-white text-lg">Endowment</div>
                        <div className="text-xs text-slate-500 font-mono text-emerald-600 dark:text-emerald-400">${treasury.toLocaleString()}</div>
                        <div className={`text-[10px] font-bold mt-1 transition-opacity ${step === 2 ? 'text-emerald-500 opacity-100' : 'opacity-0'}`}>Generating Yield...</div>
                    </div>
                </div>

                {/* 3. Consensus (PoS / Mining) */}
                <div className={`relative p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center gap-4 transition-all duration-500 
                    ${step === 3 ? 'border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.2)] scale-105' : ''}
                    ${isHalving ? 'ring-4 ring-red-500 ring-opacity-50' : ''}
                `}>
                    <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 relative">
                        {isHalving ? <ArrowDown size={32} className="animate-bounce text-red-500" /> : <Zap size={32} />}
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-slate-900 dark:text-white text-lg">{isHalving ? 'HALVING!' : 'PoS Consensus'}</div>
                        <div className="text-xs text-slate-500 font-mono">{circulatingSupply.toLocaleString()} FLD</div>
                        <div className={`text-[10px] font-bold mt-1 transition-opacity ${step === 3 ? 'text-orange-500 opacity-100' : 'opacity-0'}`}>
                            {isHalving ? 'Rewards Slashed' : `Minting +${blockReward}`}
                        </div>
                    </div>
                </div>

                {/* 4. Nodes (Storage) */}
                <div className={`relative p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center gap-4 transition-all duration-500 ${step === 4 ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)] scale-105' : ''}`}>
                    <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
                        <div className="flex -space-x-2">
                            <Server size={24} />
                            <Database size={24} />
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-slate-900 dark:text-white text-lg">Nodes</div>
                        <div className="text-xs text-slate-500">PoS + PoStorage</div>
                        <div className={`text-[10px] font-bold mt-1 transition-opacity ${step === 4 ? 'text-purple-500 opacity-100' : 'opacity-0'}`}>Earns Yield + Rewards</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default LifecycleSimulation;
