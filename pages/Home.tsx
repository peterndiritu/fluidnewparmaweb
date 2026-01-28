
import React, { useState, useEffect, useRef } from 'react';
import HowItWorks from '../components/HowItWorks';
import Tokenomics from '../components/Tokenomics';
import LifecycleSimulation from '../components/LifecycleSimulation';
import PresaleCard from '../components/PresaleCard';
import { 
  ArrowRight, Layers, TrendingUp, Star, Landmark, Rocket, 
  ShieldCheck, Activity, Database, Coins, Server, BarChart,
  Network, CreditCard, Zap, Globe2, ArrowLeftRight, ShieldAlert,
  Cpu, PieChart, Users, BarChart3
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

// Add comment to fix FluidLogo component definition
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
        await new Promise(r => setTimeout(r, 40));
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

    await typeCommand("npm install -g fluid-cli");
    addToTerminal({ type: 'output', content: <div className="text-slate-400 font-mono text-[10px]">+ fluid-cli@1.0.4 added in 0.8s</div> });
    await new Promise(r => setTimeout(r, 500));
    await typeCommand("fluid deploy");
    addToTerminal({ type: 'output', content: <div className="text-slate-400 font-mono text-[10px]">Verifying shards...</div> });
    await new Promise(r => setTimeout(r, 800));
    addToTerminal({ type: 'output', content: <div className="text-emerald-400 font-bold font-mono text-[10px]">✔ Success: Site hosted infinitely.</div> });
    setIsTyping(false);
  };

  useEffect(() => {
    runTerminalAnimation();
  }, []);

  const handleDomainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainQuery) return;
    setShowDomainResults(true);
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

      {/* NEW: MULTICHAIN NEXUS SECTION */}
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
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[8px] font-nebula font-black uppercase tracking-[0.2em] mb-4">
              <Rocket size={10} /> Immutable Infrastructure
            </div>
            <h2 className="text-3xl md:text-6xl font-nebula font-black text-white tracking-tight uppercase leading-none">
              Host <span className="text-fluid-gradient">Infinitely</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-10">
             <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-14 relative overflow-hidden shadow-2xl flex flex-col justify-center scroll-card">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <h3 className="text-lg font-nebula font-black text-white mb-6 uppercase tracking-tight leading-none">Register .fluid Domain</h3>
                <form onSubmit={handleDomainSearch} className="relative mb-6">
                    <input 
                        type="text" 
                        value={domainQuery}
                        onChange={(e) => setDomainQuery(e.target.value)}
                        placeholder="search.fluid" 
                        className="w-full bg-black/50 border border-white/10 rounded-full py-4 pl-6 pr-32 text-white font-nebula font-black text-base focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-800"
                    />
                    <button type="submit" className="absolute right-2 top-2 bottom-2 bg-indigo-600 rounded-full px-6 text-white font-nebula font-black text-[8px] uppercase tracking-widest hover:bg-indigo-500 active:scale-95 transition-all">Search</button>
                </form>
                {showDomainResults && (
                   <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex justify-between items-center animate-fade-in-up">
                      <div><span className="text-white text-base font-nebula font-black">{domainQuery}.fluid</span><span className="ml-3 text-[7px] bg-emerald-500 text-black px-1.5 py-1 rounded font-nebula font-black uppercase tracking-widest">Available</span></div>
                      <button className="text-[9px] font-nebula font-black text-emerald-400 uppercase tracking-widest hover:underline">Claim Now</button>
                   </div>
                )}
             </div>

             <div className="bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden relative min-h-[350px] scroll-card flex flex-col">
                <div className="bg-slate-800/80 px-8 py-4 flex items-center justify-between border-b border-white/5">
                   <div className="flex gap-2">
                     <div className="w-2 h-2 rounded-full bg-red-500/30"></div>
                     <div className="w-2 h-2 rounded-full bg-yellow-500/30"></div>
                     <div className="w-2 h-2 rounded-full bg-green-500/30"></div>
                   </div>
                   <span className="text-slate-500 font-black uppercase tracking-[0.3em] text-[8px]">fluid-sharding-engine v1</span>
                </div>
                <div ref={terminalRef} className="p-8 text-slate-300 flex-grow flex flex-col gap-2 bg-black/60 overflow-y-auto font-mono text-[10px] leading-relaxed">
                   {terminalLines.map((line, idx) => <div key={idx}>{line.content}</div>)}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* NEW: FLUID PAY / SPEND SECTION */}
      <section id="spend" className="py-24 bg-slate-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 space-y-8 animate-fade-in-up">
                 <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[8px] font-nebula font-black uppercase tracking-[0.2em]">
                    <CreditCard size={10} /> Fiat On-Chain
                 </div>
                 <h2 className="text-3xl md:text-6xl font-nebula font-black text-white tracking-tight uppercase leading-none">
                    Spend Fluid <br/> <span className="text-fluid-gradient">Anywhere</span>.
                 </h2>
                 <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    Bridge your crypto to the real world. Fluid Cards allow you to spend your digital assets at over 60 million merchants worldwide with instant fiat conversion.
                 </p>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl">
                       <ShieldAlert size={20} className="text-indigo-400 mb-4" />
                       <h4 className="text-white font-nebula font-black uppercase text-[10px] tracking-widest mb-1">Non-Custodial</h4>
                       <p className="text-slate-500 text-[9px] font-bold uppercase tracking-tighter">Your keys, your card, your control.</p>
                    </div>
                    <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl">
                       <Zap size={20} className="text-emerald-400 mb-4" />
                       <h4 className="text-white font-nebula font-black uppercase text-[10px] tracking-widest mb-1">Instant Settlement</h4>
                       <p className="text-slate-500 text-[9px] font-bold uppercase tracking-tighter">No 3-day waiting periods for transfers.</p>
                    </div>
                 </div>
                 <button onClick={() => onNavigate('wallet')} className="px-8 py-4 bg-white text-slate-950 font-nebula font-black rounded-full text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Request Genesis Card</button>
              </div>
              <div className="flex-1 relative group scroll-card">
                 <div className="absolute inset-0 bg-fluid-gradient blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                 <div className="relative aspect-[1.6/1] bg-slate-900 border-2 border-white/10 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-700">
                    <div className="flex justify-between items-start mb-20">
                       <div className="flex items-center gap-3">
                          <FluidLogo className="w-10 h-10 text-white" />
                          <span className="text-2xl font-nebula font-black text-white uppercase italic">Fluid</span>
                       </div>
                       <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-nebula font-black text-white uppercase">Genesis Black</div>
                    </div>
                    <div>
                       <div className="text-2xl font-nebula font-black text-white tracking-[0.3em] mb-4">**** **** **** 4829</div>
                       <div className="flex justify-between items-end">
                          <div>
                             <div className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest mb-1">Card Holder</div>
                             <div className="text-xs font-nebula font-black text-white uppercase">Alexander Fluid</div>
                          </div>
                          <div className="text-right">
                             <div className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest mb-1">Expires</div>
                             <div className="text-xs font-nebula font-black text-white uppercase">12/28</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* NEW: PERFORMANCE COMPARISON SECTION */}
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
                     <tr>
                        <td className="py-8 px-4 text-white font-nebula font-black uppercase text-xs">Avg. Transaction Fee</td>
                        <td className="py-8 px-4 text-slate-500 text-xs">$5.00 - $50.00</td>
                        <td className="py-8 px-4 text-slate-500 text-xs">$0.00025</td>
                        <td className="py-8 px-4 text-emerald-400 font-nebula font-black text-sm italic">$0.000001 (Static)</td>
                     </tr>
                     <tr>
                        <td className="py-8 px-4 text-white font-nebula font-black uppercase text-xs">Hosting Architecture</td>
                        <td className="py-8 px-4 text-slate-500 text-xs">Off-chain (IPFS)</td>
                        <td className="py-8 px-4 text-slate-500 text-xs">Centralized Cloud</td>
                        <td className="py-8 px-4 text-emerald-400 font-nebula font-black text-sm italic">Integrated Shards</td>
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

          <div className="mb-12">
            <HowItWorks />
          </div>

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
          
          <div className="mb-10 scroll-card">
            <LifecycleSimulation />
          </div>

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

      {/* NEW: DAO GOVERNANCE SECTION */}
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
                  <ul className="space-y-4">
                     <li className="flex items-center gap-4 text-xs font-nebula font-black text-white uppercase tracking-widest italic">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> 1 Token = 1 Vote
                     </li>
                     <li className="flex items-center gap-4 text-xs font-nebula font-black text-white uppercase tracking-widest italic">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> On-Chain Execution
                     </li>
                     <li className="flex items-center gap-4 text-xs font-nebula font-black text-white uppercase tracking-widest italic">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Quadratic Funding Support
                     </li>
                  </ul>
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
