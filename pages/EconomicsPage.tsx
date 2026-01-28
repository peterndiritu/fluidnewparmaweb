import React, { useState, useMemo } from 'react';
import { Coins, Landmark, Infinity as InfinityIcon, TrendingUp, PieChart, ArrowUpRight, ChevronDown, BarChart } from 'lucide-react';
import LifecycleSimulation from '../components/LifecycleSimulation';
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
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full pt-32 pb-16 px-4 bg-slate-950">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 relative">
        
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-32 w-full">
              <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-2 shadow-2xl overflow-hidden">
                <div 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="px-5 py-4 border-b border-white/5 flex items-center justify-between mb-2 cursor-pointer hover:bg-white/5 rounded-2xl transition-colors group"
                >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-nebula font-black text-slate-500 group-hover:text-white uppercase tracking-widest transition-colors">Economics</span>
                      <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]"></div>
                </div>
                
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col gap-1 p-1">
                        {menuItems.map((item) => (
                          <div key={item.id} className="group">
                              <button 
                                onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 border ${
                                  openDropdown === item.id 
                                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
                                  : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                    <item.icon size={16} className={openDropdown === item.id ? 'text-amber-500' : 'text-slate-500'} />
                                    <span className="text-[10px] font-nebula font-black tracking-widest uppercase">{item.label}</span>
                                </div>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === item.id ? 'rotate-180' : ''}`} />
                              </button>
                              
                              {openDropdown === item.id && (
                                <div className="mt-1 mb-2 ml-4 pl-4 border-l border-white/5 space-y-1 animate-fade-in-up">
                                    {item.children.map((child) => (
                                      <button 
                                        key={child}
                                        onClick={() => scrollTo(item.id)}
                                        className="w-full text-left px-3 py-2 rounded-lg text-[9px] font-nebula font-black text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 uppercase tracking-widest"
                                      >
                                        <div className="w-1 h-1 rounded-full bg-slate-800"></div>
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

        {/* Main Content */}
        <div className="flex-grow min-w-0">
          <section className="mb-24 relative">
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8 backdrop-blur-sm">
                <span className="text-amber-500 font-nebula font-black uppercase tracking-[0.2em] text-[10px]">Endowment Emission Model</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-nebula font-black text-white mb-8 tracking-tighter leading-none italic uppercase">
                Economic <br/>
                <span className="text-fluid-gradient">Sustainability.</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 font-medium max-w-3xl leading-relaxed">
                A hybrid system where one-time hosting payments fuel a perpetual treasury, coupled with a deflationary supply cap designed for longevity.
            </p>
          </section>

          <section id="model" className="mb-24 scroll-card">
            <LifecycleSimulation />
          </section>

          <section id="principles" className="mb-24">
            <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: "Endowment Yield", desc: "Hosting fees enter the Treasury, generating yield to fund nodes indefinitely.", icon: TrendingUp, color: "text-amber-400" },
                  { title: "Storage Proofs", desc: "Validators earn rewards by proving continuous data retention for the network.", icon: ServerIcon, color: "text-blue-400" },
                  { title: "Periodic Halving", desc: "100M Max Supply with scheduled reward halvings to ensure long-term value.", icon: PieChart, color: "text-purple-400" }
                ].map((p, i) => (
                  <div key={i} className="p-10 bg-slate-900/50 border border-white/10 rounded-[3rem] hover:border-amber-500/30 transition-all group">
                      <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 ${p.color} group-hover:scale-110 transition-transform shadow-inner`}>
                        <p.icon size={28} />
                      </div>
                      <h3 className="text-lg font-nebula font-black mb-4 text-white uppercase italic tracking-tight">{p.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed font-medium">
                        {p.desc}
                      </p>
                  </div>
                ))}
            </div>
          </section>

          <section className="text-center">
              <div className="relative bg-gradient-to-r from-amber-600 to-orange-700 rounded-[4rem] p-16 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="relative z-10">
                    <h2 className="text-5xl md:text-7xl font-nebula font-black text-white mb-8 uppercase tracking-tighter italic">100M Fixed Supply.</h2>
                    <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-medium uppercase tracking-wide">
                        Join the economy that aligns users, validators, and stakers for a truly permanent internet.
                    </p>
                    <button 
                        onClick={() => onNavigate && onNavigate('home')}
                        className="px-14 py-6 bg-white text-orange-700 font-nebula font-black rounded-full hover:scale-105 transition-all shadow-2xl uppercase tracking-[0.2em] text-[12px]"
                    >
                        Enter Protocol <ArrowUpRight size={20} className="inline ml-2" />
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