import React, { useState, useEffect, useRef } from 'react';
import HowItWorks from '../components/HowItWorks';
import Tokenomics from '../components/Tokenomics';
import LifecycleSimulation from '../components/LifecycleSimulation';
import PresaleCard from '../components/PresaleCard';
import { 
  ArrowRight, Layers, TrendingUp, Star, Landmark, Rocket, 
  ShieldCheck, Activity, Database, Coins, Server, BarChart,
  Network, CreditCard, Zap, Globe2, ArrowLeftRight, ShieldAlert,
  Cpu, PieChart, Users, BarChart3, Search, Lock, CheckCircle2,
  Sparkles, Globe, UserCheck, Timer, Banknote, RefreshCw, ShoppingCart,
  Shield, Smartphone, MoveUpRight, ArrowDownLeft, Wallet
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M55 20 H90 A5 5 0 0 1 90 35 H55 A5 5 0 0 1 55 20 Z" transform="skewX(-20)" />
    <path d="M40 42 H85 A5 5 0 0 1 85 57 H40 A5 5 0 0 1 40 42 Z" transform="skewX(-20)" />
    <path d="M25 64 H60 A5 5 0 0 1 60 79 H25 A5 5 0 0 1 25 64 Z" transform="skewX(-20)" />
  </svg>
);

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [terminalLines, setTerminalLines] = useState<Array<{ type: string; content: React.ReactNode }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [domainQuery, setDomainQuery] = useState('');
  const [isSearchingDomain, setIsSearchingDomain] = useState(false);
  const [showDomainResults, setShowDomainResults] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -100px 0px' });

    const timer = setTimeout(() => {
      document.querySelectorAll('.scroll-card').forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const runTerminalAnimation = async () => {
    setTerminalLines([]);
    setIsTyping(true);
    const prompt = (
      <div className="flex">
        <span className="text-green-400 mr-2 font-bold font-mono text-[10px]">➜</span>
        <span className="text-cyan-400 mr-2 font-mono text-[10px]">~</span>
      </div>
    );

    const addToTerminal = (line: { type: string; content: React.ReactNode }) => {
      setTerminalLines(prev => [...prev, line]);
    };

    const typeCommand = async (cmd: string) => {
      addToTerminal({ type: 'prompt', content: <div className="flex items-center font-mono">{prompt}<span className="typing-cursor ml-1"></span></div> });
      let typed = "";
      for (let i = 0; i < cmd.length; i++) {
        await new Promise(r => setTimeout(r, 30));
        typed += cmd[i];
        setTerminalLines(prev => {
          const newLines = [...prev];
          newLines[newLines.length - 1] = { 
            type: 'prompt', 
            content: <div className="flex items-center font-mono">{prompt}<span className="text-white ml-2 text-[11px]">{typed}</span><span className="typing-cursor"></span></div> 
          };
          return newLines;
        });
      }
      await new Promise(r => setTimeout(r, 200));
      setTerminalLines(prev => {
        const newLines = [...prev];
        newLines[newLines.length - 1] = { 
          type: 'prompt', 
          content: <div className="flex items-center font-mono">{prompt}<span className="text-white ml-2 text-[11px]">{typed}</span></div> 
        };
        return newLines;
      });
    };

    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

    await typeCommand("npm install -g @fluid/core");
    addToTerminal({ type: 'output', content: <div className="text-slate-500 font-mono text-[10px] italic">⠋ fetching packages...</div> });
    await wait(800);
    addToTerminal({ type: 'output', content: <div className="text-slate-400 font-mono text-[10px]">+ @fluid/core@1.4.2 added in 1.2s</div> });
    await wait(400);

    await typeCommand("fluid login --genesis");
    addToTerminal({ type: 'output', content: <div className="text-cyan-400 font-mono text-[10px]">? Authenticating via Secure Vault...</div> });
    await wait(600);
    addToTerminal({ type: 'output', content: <div className="text-emerald-400 font-mono text-[10px]">✔ Identity verified: genesis_admin_01</div> });
    await wait(400);

    await typeCommand("fluid deploy --site ./dist");
    addToTerminal({ type: 'output', content: <div className="text-slate-400 font-mono text-[10px] mt-2">📦 Optimizing assets (42 files)...</div> });
    await wait(500);
    addToTerminal({ type: 'output', content: <div className="text-slate-500 font-mono text-[10px] ml-4">↳ Main bundle: 145KB (Gzipped)</div> });
    await wait(400);
    
    addToTerminal({ type: 'output', content: <div className="text-indigo-400 font-mono text-[10px] mt-2">🧩 Partitioning into micro-shards...</div> });
    await wait(700);
    addToTerminal({ type: 'output', content: <div className="text-slate-400 font-mono text-[10px] ml-4">⚄ Generated Shard #01 [Merkle: 0x4f...a2]</div> });
    await wait(500);

    addToTerminal({ type: 'output', content: <div className="text-cyan-400 font-mono text-[10px] mt-2">🚀 Distributing to validator clusters...</div> });
    await wait(600);

    addToTerminal({ type: 'output', content: <div className="text-indigo-300 font-mono text-[10px] mt-2">🛡 Verifying sharding integrity (ZK-STARK)...</div> });
    await wait(1000);
    addToTerminal({ type: 'output', content: <div className="text-emerald-400 font-bold font-mono text-[10px] mt-1">✔ Proof valid. State synchronized across 3,240 nodes.</div> });
    await wait(200);
    
    addToTerminal({ type: 'output', content: <div className="text-white font-black font-mono text-[11px] mt-4 bg-emerald-500/20 px-2 py-1 border border-emerald-500/30 rounded inline-block">DEPLOYMENT COMPLETE</div> });
    addToTerminal({ type: 'output', content: <div className="text-emerald-400 font-mono text-[10px] mt-1">🔗 Site infinitely live at: <span className="underline cursor-pointer">https://genesis.fluid</span></div> });
    
    addToTerminal({ type: 'prompt', content: <div className="flex items-center font-mono mt-4">{prompt}<span className="typing-cursor ml-1"></span></div> });
    setIsTyping(false);
  };

  useEffect(() => {
    runTerminalAnimation();
  }, []);

  const handleDomainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainQuery) return;
    setIsSearchingDomain(true);
    setShowDomainResults(false);
    
    setTimeout(() => {
      setIsSearchingDomain(false);
      setShowDomainResults(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col bg-slate-950 overflow-x-hidden min-h-screen">
      {/* HERO SECTION */}
      <section id="hero" className="relative flex flex-col items-center justify-start pt-16 pb-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center flex flex-col items-center mb-6">
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="flex items-center gap-6 mb-2">
              <div className="w-10 h-10 md:w-14 md:h-14 text-white p-1 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <FluidLogo className="w-full h-full" />
              </div>
              <h1 className="text-4xl md:text-6xl font-nebula font-black tracking-tight leading-none text-fluid-gradient pb-2">Fluid</h1>
            </div>
            
            <div className="flex flex-col items-center mb-4 px-4">
              <h2 className="text-2xl md:text-4xl font-nebula font-black tracking-tight text-white leading-[1.1] uppercase mb-1">
                Store. spend. host.
              </h2>
              <h3 className="text-4xl md:text-6xl font-nebula font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 leading-[1.1] uppercase pb-2">
                Infinitely.
              </h3>
            </div>

            <p className="max-w-md text-[9px] md:text-[10px] font-bold text-slate-500 tracking-widest leading-relaxed mb-6 px-8 uppercase">
              The first sharded Layer-1 delivering <span className="text-white">2.4M+ TPS</span> with <span className="text-fluid-cyan">zero-downtime hosting</span>. <br/> Non-custodial, institutional security at scale.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#token" className="group px-6 py-3 bg-fluid-gradient text-white font-nebula font-black rounded-full text-[9px] uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(99,102,241,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                GET STARTED <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#hosting" className="px-6 py-3 bg-white/5 border border-white/10 text-white font-nebula font-black rounded-full text-[9px] uppercase tracking-[0.2em] hover:bg-white/10 active:scale-95 transition-all">
                NETWORK SPECS
              </a>
            </div>
          </div>
        </div>

        {/* Hero Visual Engine */}
        <div className="w-full max-w-4xl px-4 relative animate-fade-in-up">
          <div className="relative rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl gap-6">
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                   <Layers size={16} className="text-fluid-cyan" />
                   <span className="text-[8px] font-nebula font-black text-slate-400 uppercase tracking-[0.2em]">2.4M TPS / MICRO-SHARDED</span>
                </div>
                <div className="flex items-center gap-3">
                   <Star size={16} className="text-fluid-purple" />
                   <span className="text-[8px] font-nebula font-black text-slate-400 uppercase tracking-[0.2em]">Programmable Dividends</span>
                </div>
             </div>
             <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-dashed border-fluid-cyan/20 rounded-full animate-spin-slow"></div>
                <TrendingUp size={20} className="text-white text-glow-cyan" />
             </div>
             <div className="flex flex-col gap-4 text-center md:text-right items-center md:items-end">
                <span className="text-[8px] font-nebula font-black text-slate-400 uppercase tracking-[0.2em]">~600ms DETERMINISTIC FINALITY</span>
                <span className="text-[8px] font-nebula font-black text-slate-400 uppercase tracking-[0.2em]">PROOF-OF-USEFUL-STORAGE</span>
             </div>
          </div>
        </div>
      </section>

      {/* MULTICHAIN NEXUS SECTION */}
      <section className="py-20 bg-slate-950 relative border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[8px] font-nebula font-black uppercase tracking-[0.2em] mb-4">
              <Network size={10} /> Liquid Connectivity
            </div>
            <h2 className="text-3xl md:text-6xl font-nebula font-black text-white tracking-tight uppercase leading-none mb-6">
              The Multichain <span className="text-fluid-gradient">Nexus</span>.
            </h2>
            <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase max-w-xl mx-auto opacity-70">
              Fluid acts as the foundational settlement layer for all major ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { name: 'Ethereum', icon: 'ETH', desc: 'L2 Liquidity Aggregation' },
              { name: 'Solana', icon: 'SOL', desc: 'Parallel Execution Bridge' },
              { name: 'Bitcoin', icon: 'BTC', desc: 'ZK-Rollup Native Support' },
              { name: 'Polygon', icon: 'POL', desc: 'Cross-Chain Asset Flow' }
            ].map((chain, i) => (
              <div key={i} className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] hover:bg-slate-900/80 transition-all group text-center scroll-card">
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-nebula font-black group-hover:scale-110 transition-transform">
                    {chain.icon}
                 </div>
                 <h4 className="text-sm font-nebula font-black text-white uppercase tracking-widest mb-1">{chain.name}</h4>
                 <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tight">{chain.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 scroll-card">
             <div className="flex items-center gap-6">
                <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
                   <ArrowLeftRight size={32} />
                </div>
                <div>
                   <h3 className="text-xl font-nebula font-black text-white uppercase italic">Fluid Omnibridge</h3>
                   <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Move any asset to Fluid in under 60 seconds with zero slippage.</p>
                </div>
             </div>
             <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-nebula font-black rounded-full text-[10px] uppercase tracking-widest transition-all">Launch Bridge</button>
          </div>
        </div>
      </section>

      {/* FLUID TOKEN SECTION */}
      <section id="token" className="pt-12 pb-24 bg-slate-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
             <div className="space-y-8">
                <div>
                   <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-nebula font-black uppercase tracking-[0.2em] mb-4">
                     <Coins size={10} /> Utility Fuel
                   </div>
                   <h2 className="text-3xl md:text-5xl font-nebula font-black text-white tracking-tight uppercase leading-none mb-4">
                      Fluid Token.
                   </h2>
                   <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-xl">
                      Participate in the genesis of a sharded economy. Own FLUID to govern the network, secure hosting rights, and earn from global transaction fees.
                   </p>
                </div>
                
                <div className="pt-8 border-t border-white/5">
                   <h3 className="text-2xl md:text-3xl font-nebula font-black text-white tracking-tight uppercase leading-none mb-2">
                     Tokenomics
                   </h3>
                   <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest mb-6">
                     A balanced model for long-term protocol sustainability.
                   </p>
                   <Tokenomics />
                </div>
             </div>
             <div className="lg:sticky lg:top-32 flex justify-center">
                <PresaleCard />
             </div>
          </div>
        </div>
      </section>

      {/* HOSTING SECTION */}
      <section id="hosting" className="py-20 bg-slate-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[8px] font-nebula font-black uppercase tracking-[0.2em] mb-4">
              <Rocket size={10} /> Immutable Infrastructure
            </div>
            <h2 className="text-3xl md:text-6xl font-nebula font-black text-white tracking-tight uppercase leading-none mb-6">
              Host <span className="text-fluid-gradient">Infinitely</span>
            </h2>
            <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase max-w-xl mx-auto opacity-70">
              Decentralized hosting for a censorship-resistant internet.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-10">
             <div className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 md:p-14 relative overflow-hidden shadow-2xl flex flex-col scroll-card">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                <div className="relative z-10 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                          <Globe size={18} />
                       </div>
                       <h3 className="text-xl font-nebula font-black text-white uppercase italic tracking-tighter leading-none">Register .fluid Domain</h3>
                    </div>
                    <form onSubmit={handleDomainSearch} className="relative mb-8 group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors">
                            <Search size={22} />
                        </div>
                        <input 
                            type="text" 
                            value={domainQuery}
                            onChange={(e) => setDomainQuery(e.target.value)}
                            placeholder="Enter desired handle..." 
                            className="w-full bg-black/40 border-2 border-white/10 rounded-[2rem] py-5 pl-16 pr-32 text-white font-nebula font-black text-lg focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800 shadow-inner"
                        />
                        <button 
                           type="submit" 
                           disabled={isSearchingDomain || !domainQuery}
                           className="absolute right-3 top-3 bottom-3 bg-indigo-600 rounded-[1.5rem] px-8 text-white font-nebula font-black text-[9px] uppercase tracking-[0.2em] hover:bg-indigo-500 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 min-w-[120px]"
                        >
                           {isSearchingDomain ? <Activity size={12} className="animate-spin" /> : <>CLAIM <ArrowRight size={12} /></>}
                        </button>
                    </form>
                    <div className="min-h-[100px] relative">
                       {showDomainResults && (
                         <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in-up">
                            <div className="flex items-center gap-4">
                               <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-lg"><CheckCircle2 size={28} /></div>
                               <div>
                                  <div className="flex items-center gap-3"><span className="text-white text-2xl font-nebula font-black italic">{domainQuery}.fluid</span><span className="text-[8px] bg-emerald-500 text-slate-950 px-2 py-1 rounded font-nebula font-black uppercase tracking-widest">Available</span></div>
                                  <div className="flex items-center gap-2 mt-1"><Lock size={10} className="text-slate-500" /><span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Immutable Ownership Secured</span></div>
                               </div>
                            </div>
                            <button className="px-6 py-2.5 bg-white text-slate-950 rounded-xl font-nebula font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">CLAIM IDENTITY</button>
                         </div>
                       )}
                    </div>
                </div>
             </div>
             <div className="bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden relative min-h-[450px] scroll-card flex flex-col">
                <div className="bg-slate-800/80 px-8 py-4 flex items-center justify-between border-b border-white/5">
                   <div className="flex gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div><div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div></div>
                   <span className="text-slate-500 font-black uppercase tracking-[0.3em] text-[8px]">fluid-node-operator v1.4.2</span>
                </div>
                <div ref={terminalRef} className="p-8 text-slate-300 flex-grow flex flex-col gap-1.5 bg-black/80 overflow-y-auto font-mono text-[10px] leading-relaxed custom-scrollbar">
                   {terminalLines.map((line, idx) => <div key={idx}>{line.content}</div>)}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ENHANCED: FLUID SUPER-APP ECOSYSTEM / SPEND SECTION */}
      <section id="spend" className="py-24 bg-slate-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[8px] font-nebula font-black uppercase tracking-[0.2em] mb-4">
                 <Smartphone size={10} /> The Fluid Super-App
              </div>
              <h2 className="text-4xl md:text-7xl font-nebula font-black text-white tracking-tight uppercase leading-none italic mb-6">
                 Spend Fluid <span className="text-fluid-gradient">Anywhere</span>.
              </h2>
              <p className="text-slate-500 text-[11px] font-bold tracking-[0.3em] uppercase max-w-2xl mx-auto opacity-70">
                 A seamless bridge between sharded liquidity and real-world utility.
              </p>
           </div>

           <div className="grid lg:grid-cols-12 gap-8 items-stretch mb-12">
              {/* Feature Showcase Grid - LEFT COL */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                 {/* Fiat Module */}
                 <div className="p-10 bg-slate-900 border border-white/5 rounded-[3rem] hover:border-orange-500/30 transition-all group scroll-card">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform shadow-inner">
                       <Banknote size={24} />
                    </div>
                    <h4 className="text-xl font-nebula font-black text-white uppercase italic mb-3">Fiat On-Chain</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">
                       Integrated bank rails for instant SEPA, Swift, and ACH transfers directly into your non-custodial vault.
                    </p>
                 </div>
                 {/* Atomic DEX Module */}
                 <div className="p-10 bg-slate-900 border border-white/5 rounded-[3rem] hover:border-blue-500/30 transition-all group scroll-card">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform shadow-inner">
                       <RefreshCw size={24} />
                    </div>
                    <h4 className="text-xl font-nebula font-black text-white uppercase italic mb-3">Atomic DEX</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">
                       Zero-slippage swaps between FLUID and 1,000+ multichain assets using the sharded settlement engine.
                    </p>
                 </div>
              </div>

              {/* CARD PREVIEW - MIDDLE COL */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center relative scroll-card">
                 <div className="absolute inset-0 bg-fluid-gradient blur-[150px] opacity-10"></div>
                 <div className="relative w-full aspect-[0.6/1] bg-slate-900 border border-white/10 rounded-[4rem] p-1 overflow-hidden shadow-2xl">
                    <div className="h-full w-full bg-slate-950 rounded-[3.8rem] flex flex-col p-8 pt-12 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                       <div className="flex justify-between items-center mb-10">
                          <FluidLogo className="w-10 h-10 text-white" />
                          <div className="flex gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div><div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div></div>
                       </div>
                       <div className="mb-10">
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-1">Combined Portfolio</span>
                          <h4 className="text-3xl font-nebula font-black text-white">$42,593.10</h4>
                          <span className="text-[8px] font-bold text-emerald-500 uppercase">+4.2% (24H)</span>
                       </div>
                       <div className="grid grid-cols-2 gap-3 mb-10">
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1 items-center">
                             <MoveUpRight size={14} className="text-indigo-400" />
                             <span className="text-[8px] font-black text-slate-500 uppercase">Send</span>
                          </div>
                          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-1 items-center">
                             <ArrowDownLeft size={14} className="text-emerald-400" />
                             <span className="text-[8px] font-black text-slate-500 uppercase">Receive</span>
                          </div>
                       </div>
                       {/* The Card Element Inside Phone */}
                       <div className="flex-grow flex flex-col justify-end">
                          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all">
                             <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
                             <div className="flex justify-between items-start mb-12 relative z-10">
                                <span className="text-[10px] font-nebula font-black text-white italic tracking-tighter">Fluid Genesis</span>
                                <div className="p-2 bg-white/10 rounded-lg"><CreditCard size={12} className="text-white" /></div>
                             </div>
                             <div className="relative z-10">
                                <div className="text-base font-nebula font-black text-white tracking-[0.2em] mb-4">**** 4829</div>
                                <div className="flex justify-between items-end">
                                   <div className="text-[8px] font-black text-slate-500 uppercase">Alex Fluid</div>
                                   <div className="text-[8px] font-black text-white">12/28</div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* RIGHT COL */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                 {/* Payments Module */}
                 <div className="p-10 bg-slate-900 border border-white/5 rounded-[3rem] hover:border-emerald-500/30 transition-all group scroll-card">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform shadow-inner">
                       <ShoppingCart size={24} />
                    </div>
                    <h4 className="text-xl font-nebula font-black text-white uppercase italic mb-3">Merchant Gateway</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">
                       Bridge crypto to the real world. Spend at 60M+ merchants globally with instant fiat settlement at the POS.
                    </p>
                 </div>
                 {/* Vault Module */}
                 <div className="p-10 bg-slate-900 border border-white/5 rounded-[3rem] hover:border-purple-500/30 transition-all group scroll-card">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform shadow-inner">
                       <Shield size={24} />
                    </div>
                    <h4 className="text-xl font-nebula font-black text-white uppercase italic mb-3">Non-Custodial Vault</h4>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">
                       Total sovereignty. Your keys never leave your device secure enclave. Not even Fluid can access your assets.
                    </p>
                 </div>
              </div>
           </div>

           {/* Value Props Row */}
           <div className="grid md:grid-cols-2 gap-8 scroll-card">
              <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8">
                 <div className="p-6 bg-indigo-500/10 rounded-[2rem] text-indigo-400"><ShieldAlert size={40} /></div>
                 <div>
                    <h5 className="text-xl font-nebula font-black text-white uppercase italic mb-2">Immutable Security</h5>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">Your keys, your card, your control. Experience institutional-grade security with no compromise on usability.</p>
                 </div>
              </div>
              <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8">
                 <div className="p-6 bg-emerald-500/10 rounded-[2rem] text-emerald-400"><Zap size={40} /></div>
                 <div>
                    <h5 className="text-xl font-nebula font-black text-white uppercase italic mb-2">Instant Settlement</h5>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">No 3-day waiting periods for bank transfers. All transactions are settled instantly on the sharded layer.</p>
                 </div>
              </div>
           </div>

           <div className="mt-16 flex justify-center">
              <button onClick={() => onNavigate('wallet')} className="px-12 py-6 bg-white text-slate-950 font-nebula font-black rounded-[2rem] text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all flex items-center gap-4 group">
                 Request Genesis Card <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
           </div>
        </div>
      </section>

      {/* PERFORMANCE COMPARISON SECTION */}
      <section id="benchmarks" className="py-24 bg-slate-950 relative border-t border-white/5">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-nebula font-black text-white tracking-tight uppercase leading-none mb-4">
                  Network <span className="text-fluid-gradient">Benchmarks</span>.
               </h2>
               <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase max-w-3xl mx-auto opacity-70">
                  Quantitative analysis of Fluid's performance vs. legacy monolithic chains.
               </p>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse scroll-card">
                  <thead>
                     <tr className="border-b border-white/10">
                        <th className="py-6 px-4 text-slate-500 text-[10px] font-nebula font-black uppercase tracking-[0.2em]">Metric</th>
                        <th className="py-6 px-4 text-slate-500 text-[10px] font-nebula font-black uppercase tracking-[0.2em]">Ethereum</th>
                        <th className="py-6 px-4 text-slate-500 text-[10px] font-nebula font-black uppercase tracking-[0.2em]">Solana</th>
                        <th className="py-6 px-4 text-fluid-cyan text-[12px] font-nebula font-black uppercase tracking-[0.2em]">Fluid Chain</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     <tr>
                        <td className="py-8 px-4 text-white font-nebula font-black uppercase text-xs">Peak Throughput</td>
                        <td className="py-8 px-4 text-slate-500 text-xs">15-30 TPS</td>
                        <td className="py-8 px-4 text-slate-500 text-xs">65,000 TPS</td>
                        <td className="py-8 px-4 text-emerald-400 font-nebula font-black text-sm italic">2,400,000+ TPS</td>
                     </tr>
                     <tr>
                        <td className="py-8 px-4 text-white font-nebula font-black uppercase text-xs">Block Finality</td>
                        <td className="py-8 px-4 text-slate-500 text-xs">~12 Minutes</td>
                        <td className="py-8 px-4 text-slate-500 text-xs">~2.5 Seconds</td>
                        <td className="py-8 px-4 text-emerald-400 font-nebula font-black text-sm italic">~600 Milliseconds</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </section>

      {/* PROTOCOL INFRASTRUCTURE SECTION */}
      <section id="infrastructure" className="py-20 bg-slate-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-nebula font-black text-white tracking-tight uppercase leading-none mb-4">
              Protocol Infrastructure
            </h2>
            <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase max-w-3xl mx-auto opacity-70">
              A deep dive into our revolutionary permanent storage sharding architecture.
            </p>
          </div>
          <div className="mb-12"><HowItWorks /></div>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              { icon: ShieldCheck, title: "Censorship Resistant", desc: "Data stored immutably across a globally sharded network with high redundancy." },
              { icon: Activity, title: "100% Guaranteed Uptime", desc: "Distributed micro-sharding ensures content remains online even during network partitions." },
              { icon: Database, title: "Eternal Asset Storage", desc: "One-time contribution in FLUID stores your protocol assets forever on the sharded layer." }
            ].map((f, i) => (
              <div key={i} className="p-10 bg-slate-900/40 border border-white/5 rounded-[3rem] hover:border-fluid-cyan/30 hover:bg-slate-900/60 transition-all group scroll-card">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform"><f.icon size={20} /></div>
                  <h4 className="text-lg font-nebula font-black mb-3 text-white uppercase leading-tight">{f.title}</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ECONOMY SECTION */}
      <section id="economy" className="py-20 bg-slate-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[8px] font-nebula font-black uppercase tracking-[0.2em] mb-4">
              <Landmark size={10} /> Algorithmic Governance
            </div>
            <h2 className="text-3xl md:text-6xl font-nebula font-black text-white tracking-tight uppercase leading-none mb-4">
              Economic <span className="text-fluid-gradient">Scarcity</span>.
            </h2>
          </div>
          <div className="mb-10 scroll-card"><LifecycleSimulation /></div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Endowment Protocol", desc: "Fees fuel the Protocol Treasury, generating perpetual yield for node operators.", icon: TrendingUp, color: "text-amber-400" },
              { title: "Useful Storage Proofs", desc: "Validators must prove continuous data retention to earn block rewards and fees.", icon: Server, color: "text-indigo-400" },
              { title: "Halving Protocols", desc: "Deflationary 100M supply cap with periodic emission halvings every 4 years.", icon: BarChart, color: "text-purple-400" }
            ].map((p, i) => (
              <div key={i} className="p-10 bg-slate-900/40 border border-white/5 rounded-[3rem] hover:border-amber-500/30 transition-all group scroll-card">
                  <div className={`w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center mb-6 ${p.color} group-hover:scale-110 transition-transform`}><p.icon size={20} /></div>
                  <h3 className="text-lg font-nebula font-black mb-3 text-white uppercase leading-tight">{p.title}</h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-medium">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DAO GOVERNANCE SECTION */}
      <section id="governance" className="py-24 bg-slate-950 relative border-t border-white/5">
         <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="relative scroll-card">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-4 pt-12">
                        <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-[2.5rem] text-center">
                           <Users size={32} className="text-indigo-400 mx-auto mb-4" />
                           <h4 className="text-white font-nebula font-black uppercase text-xs">Community Led</h4>
                        </div>
                        <div className="p-8 bg-purple-500/10 border border-purple-500/20 rounded-[2.5rem] text-center">
                           <PieChart size={32} className="text-purple-400 mx-auto mb-4" />
                           <h4 className="text-white font-nebula font-black uppercase text-xs">Yield Sharing</h4>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] text-center">
                           <BarChart3 size={32} className="text-emerald-400 mx-auto mb-4" />
                           <h4 className="text-white font-nebula font-black uppercase text-xs">Proposal Power</h4>
                        </div>
                        <div className="p-8 bg-blue-500/10 border border-blue-500/20 rounded-[2.5rem] text-center">
                           <ShieldCheck size={32} className="text-blue-400 mx-auto mb-4" />
                           <h4 className="text-white font-nebula font-black uppercase text-xs">Verified Voting</h4>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="space-y-8 animate-fade-in-up">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[8px] font-nebula font-black uppercase tracking-[0.2em]">
                     <Landmark size={10} /> Democratic Protocol
                  </div>
                  <h2 className="text-3xl md:text-6xl font-nebula font-black text-white tracking-tight uppercase leading-none">
                     Founding <br/> <span className="text-fluid-gradient">Governance</span>.
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                     FLUID is more than a token; it's your seat at the table. Participate in the Fluid DAO to vote on protocol upgrades, treasury allocations, and shard configurations.
                  </p>
                  <button onClick={() => onNavigate('whitepaper')} className="px-8 py-4 bg-transparent border-2 border-white/10 text-white font-nebula font-black rounded-full text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all">Read Governance Specs</button>
               </div>
            </div>
         </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-slate-950 text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-indigo-500/5 rounded-full blur-[200px] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-7xl font-nebula font-black text-white mb-6 tracking-tight uppercase leading-none">
            Secure <br/><span className="text-fluid-gradient">Genesis</span>.
          </h2>
          <p className="text-slate-400 text-base mb-8 font-medium leading-relaxed max-w-2xl mx-auto uppercase tracking-widest opacity-70">
            Join the founding ring of the first sharded Layer-1 with integrated profit sharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button onClick={() => onNavigate('wallet')} className="px-10 py-4 bg-white text-slate-950 font-nebula font-black rounded-full text-[9px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Launch Vault</button>
            <button onClick={() => onNavigate('whitepaper')} className="px-10 py-4 bg-transparent border-2 border-white/20 text-white font-nebula font-black rounded-full text-[9px] uppercase tracking-[0.3em] hover:bg-white/10 active:scale-95 transition-all">Whitepaper</button>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .typing-cursor {
          display: inline-block;
          width: 5px;
          height: 12px;
          background-color: #22d3ee;
          animation: terminal-blink 1s infinite;
          vertical-align: middle;
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.9);
        }
        @keyframes terminal-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default Home;