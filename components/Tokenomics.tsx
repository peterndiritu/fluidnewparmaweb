import React from 'react';
import { Lock, Clock, Coins, Users, Landmark, Wallet, Rocket, PieChart } from 'lucide-react';

const data = [
  { 
    name: 'Presale', 
    value: 30, 
    color: '#10b981', 
    amount: '3,000,000', 
    icon: Rocket,
    desc: 'Public sale allocation',
    vesting: null
  },
  { 
    name: 'Incentives', 
    value: 30, 
    color: '#06b6d4', 
    amount: '3,000,000', 
    icon: Users,
    desc: 'Rewards & Airdrops',
    vesting: '10 Year Vesting'
  },
  { 
    name: 'Liquidity', 
    value: 10, 
    color: '#3b82f6', 
    amount: '1,000,000', 
    icon: Wallet,
    desc: 'CEX/DEX Liquidity',
    vesting: null 
  },
  { 
    name: 'Team', 
    value: 10, 
    color: '#a855f7', 
    amount: '1,000,000', 
    icon: Lock,
    desc: 'Core Developers',
    vesting: '10 Year Vesting' 
  },
  { 
    name: 'Treasury', 
    value: 10, 
    color: '#f97316', 
    amount: '1,000,000', 
    icon: Landmark,
    desc: 'Protocol Reserve',
    vesting: '10 Year Vesting' 
  },
  { 
    name: 'Growth', 
    value: 10, 
    color: '#f43f5e', 
    amount: '1,000,000', 
    icon: PieChart,
    desc: 'Strategic Partnerships',
    vesting: null 
  },
];

const Tokenomics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((item, index) => (
            <div 
              key={item.name} 
              className={`bg-white/5 dark:bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all group shadow-sm`}
            >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-opacity-10 text-white" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                            <item.icon size={18} />
                        </div>
                        <div>
                            <h4 className="text-white font-nebula font-black text-[12px] uppercase leading-none mb-1">{item.name}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{item.desc}</p>
                        </div>
                    </div>
                    <span className="text-lg font-nebula font-black" style={{ color: item.color }}>{item.value}%</span>
                </div>
                
                <div className="space-y-1.5">
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-nebula font-black uppercase">{item.amount} FLD</span>
                        {item.vesting && (
                            <span className="flex items-center gap-1 text-slate-500 bg-white/5 px-2 py-0.5 rounded text-[8px] font-bold uppercase">
                                <Clock size={8} /> {item.vesting}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        ))}
    </div>
  );
};

export default Tokenomics;