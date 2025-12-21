
import React, { useState, useMemo } from 'react';
import { Coins, Landmark, Infinity as InfinityIcon, TrendingUp, PieChart, ArrowUpRight, ChevronDown, BarChart } from 'lucide-react';
import LifecycleSimulation from '../components/LifecycleSimulation';

// Simple Icon wrapper for Server (since Server is imported as ServerIcon in array but Server in import)
import { Server as ServerIcon } from 'lucide-react';

interface EconomicsPageProps {
  onNavigate?: (page: string) => void;
}

const EconomicsPage: React.FC<EconomicsPageProps> = ({ onNavigate }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>('principles');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = useMemo(() => [
    { id: 'principles', label: 'Core Principles', icon: BarChart, children: ['Endowment', 'Proof of Storage', 'Proof of Stake'] },
    { id: 'model', label: 'Endowment Model', icon: InfinityIcon, children: ['Lifecycle', 'Yield Gen', 'Treasury'] },
    { id: 'stats', label: 'Governance', icon: Landmark, children: ['Voting', 'Proposals', 'Audit'] },
    { id: 'tokens', label: 'Tokenomics', icon: Coins, children: ['Supply', 'Halving', 'Emission'] }
  ], []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
        const offset = 100; // Account for sticky header
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
  };

  const principles = [
    {
      title: "Endowment Yield",
      desc: "Users pay a one-time fee for hosting. This fee enters the Endowment Treasury, generating perpetual yield to fund storage nodes forever.",
      icon: TrendingUp
    },
    {
      title: "Proof of Storage & Stake",
      desc: "Validators secure the network (PoS) and prove data retention (PoStorage) to earn block rewards and treasury yield.",
      icon: ServerIcon
    },
    {
      title: "Bitcoin-like Halving",
      desc: "100M Max Supply. Inflationary block rewards are generated infinitely but cut in half periodically, creating long-term scarcity.",
      icon: PieChart
    }
  ];

  return (
    <div className="w-full pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative">
        
        {/* Background Gradients - Positioned absolutely within the container */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-500/5 to-transparent -z-10 pointer-events-none"></div>

        {/* Left Sidebar Dropdown Navigation */}
        <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-32 w-full">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xl overflow-hidden transition-all duration-300">
                <div 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between mb-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group"
                >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300 uppercase tracking-widest transition-colors">Economy</span>
                      <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                </div>
                
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col gap-1">
                        {menuItems.map((item) => (
                          <div key={item.id} className="group">
                              <button 
                                onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 border ${
                                  openDropdown === item.id 
                                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-500' 
                                  : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                    <item.icon size={16} className={openDropdown === item.id ? 'text-amber-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                                    <span className="text-xs font-bold tracking-wide">{item.label}</span>
                                </div>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === item.id ? 'rotate-180 text-amber-500' : 'text-slate-400'}`} />
                              </button>
                              
                              {openDropdown === item.id && (
                                <div className="mt-1 mb-2 ml-3 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-0.5 animate-fade-in-up">
                                    {item.children.map((child) => (
                                      <button 
                                        key={child}
                                        onClick={() => scrollTo(item.id)}
                                        className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center gap-2 group/child"
                                      >
                                        <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700 group-hover/child:bg-amber-500 transition-colors"></div>
                                        {child}
                                      </button>
                                    ))}
                                </div>
                              )}
                          </div>
                        ))}
                    </div>
                </div>
              </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow min-w-0">
          
          {/* Hero */}
          <section className="mb-24 relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none opacity-50"></div>
            
            <div className="inline-block px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6 animate-fade-in-up backdrop-blur-sm">
                <span className="text-amber-600 dark:text-amber-500 font-black uppercase tracking-widest text-xs">Endowment & Halving Model</span>
            </div>
            <h1 className="text-5xl md:text-7xl xl:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-none relative z-10">
                Economic <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500">Sustainability.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 font-medium max-w-3xl leading-relaxed">
                A hybrid model combining one-time hosting payments with a deflationary Proof-of-Stake consensus mechanism designed for eternity.
            </p>
          </section>

          {/* Endowment Lifecycle Simulation */}
          <section id="model" className="mb-24 scroll-card">
            <LifecycleSimulation />
          </section>

          {/* Principles Grid */}
          <section id="principles" className="mb-24">
            <div className="grid md:grid-cols-3 gap-6">
                {principles.map((p, i) => (
                  <div key={i} className="p-8 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] hover:border-amber-500/30 hover:shadow-lg transition-all group shadow-sm">
                      <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform">
                        <p.icon size={24} />
                      </div>
                      <h3 className="text-lg font-black mb-3 text-slate-900 dark:text-white uppercase tracking-tight">{p.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                        {p.desc}
                      </p>
                  </div>
                ))}
            </div>
          </section>

          {/* CTA */}
          <section id="stats" className="text-center">
              <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 rounded-[3rem] p-12 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 blur-3xl rounded-full"></div>
                
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">100M Supply. Infinite Uptime.</h2>
                    <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
                        The endowment economy aligns incentives between users, validators, and stakers for a truly permanent web.
                    </p>
                    <button 
                        onClick={() => onNavigate && onNavigate('host')}
                        className="px-12 py-5 bg-white text-orange-600 font-black rounded-full hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-3 mx-auto uppercase tracking-widest text-sm"
                    >
                        Join the Economy <ArrowUpRight size={20} />
                    </button>
                </div>
              </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EconomicsPage;
