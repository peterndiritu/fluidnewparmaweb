import React from 'react';
import { Lock, Clock, Coins, Users, Landmark, Wallet, Rocket } from 'lucide-react';

const data = [
  { 
    name: 'Presale', 
    value: 40, 
    color: '#10b981', 
    amount: '4,000,000', 
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
    desc: 'Ecosystem Growth',
    vesting: '10 Year Vesting' 
  },
];

const Tokenomics: React.FC = () => {
  return (
    <section id="tokenomics" className="py-8 bg-transparent relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900 dark:text-white">Tokenomics</h2>
          <p className="text-slate-700 dark:text-slate-300 max-w-2xl mx-auto text-lg font-medium">
            A balanced model for long-term sustainability.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.map((item, index) => (
                  <div 
                    key={item.name} 
                    className={`scroll-card bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 hover:border-opacity-50 transition-all hover:-translate-y-1 duration-300 group shadow-sm dark:shadow-none ${index === 0 ? 'sm:col-span-2' : ''}`}
                    style={{ borderColor: `${item.color}40` }}
                  >
                      <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                              <div className="p-2.5 rounded-xl bg-opacity-20 text-white" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                                  <item.icon size={20} />
                              </div>
                              <div>
                                  <h4 className="text-slate-900 dark:text-white font-bold text-lg">{item.name}</h4>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.desc}</p>
                              </div>
                          </div>
                          <span className="text-xl font-bold" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                      
                      <div className="space-y-2">
                          <div className="w-full h-1.5 bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                              <span className="text-slate-700 dark:text-slate-200 font-bold">{item.amount} FLUID</span>
                              {item.vesting && (
                                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800/50 px-2 py-0.5 rounded text-[10px] font-bold">
                                      <Clock size={10} /> {item.vesting}
                                  </span>
                              )}
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;