import React, { useState, useEffect, useRef } from 'react';
import HowItWorks from '../components/HowItWorks';
import Tokenomics from '../components/Tokenomics';
import LifecycleSimulation from '../components/LifecycleSimulation';
import { 
  ArrowRight, Layers, TrendingUp, Star, Landmark, Rocket, 
  ShieldCheck, Activity, Database, Coins, Server, BarChart
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const FLUID_LOGO_SVG = (
  <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
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

  const runTerminalAnimation = async () => {
    setTerminalLines([]);
    setIsTyping(true);
    const prompt = (
      <div className="flex">
        <span className="text-green-400 mr-2 font-bold font-mono">➜</span>
        <span className="text-cyan-400 mr-2 font-mono">~</span>
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
            content: <div className="flex items-center font-mono">{prompt}<span className="text-white ml-2">{typed}</span><span className="typing-cursor"></span></div> 
          };
          return newLines;
        });
      }
      await new Promise(r => setTimeout(r, 200));
      setTerminalLines(prev => {
        const newLines = [...prev];
        newLines[newLines.length - 1] = { 
          type: 'prompt', 
          content: <div className="flex items-center font-mono">{prompt}<span className="text-white ml-2">{typed}</span></div> 
        };
        return newLines;
      });
    };

    await typeCommand("npm install -g fluid-cli");
    addToTerminal({ type: 'output', content: <div className="text-slate-400 font-mono">+ fluid-cli@1.0.4 added in 0.8s</div> });
    await new Promise(r => setTimeout(r, 500));
    await typeCommand("fluid deploy");
    addToTerminal({ type: 'output', content: <div className="text-slate-400 font-mono">Verifying shards...</div> });
    await new Promise(r => setTimeout(r, 800));
    addToTerminal({ type: 'output', content: <div className="text-emerald-400 font-bold font-mono">✔ Success: Site hosted infinitely.</div> });
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
    <div className="flex flex-col bg-slate-950">
      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-8 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <div className="flex flex-col items-center animate-fade-in-up">
            {/* LOGO AND MAIN TITLE */}
            <div className="flex items-center gap-6 mb-4">
              <div className="w-20 h-20 md:w-28 md:h-28 text-white p-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{FLUID_LOGO_SVG}</div>
              <h1 className="text-8xl md:text-[10rem] font-nebula font-black tracking-tighter italic leading-none text-fluid-gradient">Fluid</h1>
            </div>
            
            {/* SUBTITLES */}
            <div className="flex flex-col items-center mb-10">
              <h2 className="text-5xl md:text-7xl font-nebula font-black tracking-tighter text-white italic leading-tight uppercase">
                Store. spend. host.
              </h2>
              <h3 className="text-7xl md:text-9xl font-nebula font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 italic leading-none uppercase">
                Infinitely.
              </h3>
            </div>

            <p className="max-w-xl text-sm md:text-base font-bold text-white/50 tracking-tight leading-relaxed mb-12 px-4 uppercase">
              The first sharded Layer-1 delivering <span className="text-white">2.4M+ TPS</span> with <span className="text-cyan-400">zero-downtime hosting</span>. Non-custodial, institutional security.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <a href="#token" className="group px-10 py-4 bg-fluid-gradient text-white font-nebula font-black rounded-full text-[12px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                EXPLORE ECONOMY <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#hosting" className="px-10 py-4 bg-white/5 border border-white/10 text-white font-nebula font-black rounded-full text-[12px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
                NETWORK SPECS
              </a>
            </div>
          </div>
        </div>

        {/* Hero Visual Engine */}
        <div className="w-full max-w-4xl px-4 relative animate-fade-in-up">
          <div className="relative rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-3xl p-8 flex flex-row items-center justify-between shadow-2xl">
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                   <Layers size={18} className="text-cyan-400" />
                   <span className="text-[10px] font-nebula font-black text-slate-400 uppercase tracking-widest">2.4M TPS / MICRO-SHARDED</span>
                </div>
                <div className="flex items-center gap-3">
                   <Star size={18} className="text-purple-400" />
                   <span className="text-[10px] font-nebula font-black text-slate-400 uppercase tracking-widest">Programmable Dividends</span>
                </div>
             </div>
             <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-dashed border-cyan-500/30 rounded-full animate-spin-slow"></div>
                <TrendingUp size={24} className="text-white text-glow-cyan" />
             </div>
             <div className="flex flex-col gap-4 text-right items-end">
                <span className="text-[10px] font-nebula font-black text-slate-400 uppercase tracking-widest">~600ms DETERMINISTIC FINALITY</span>
                <span className="text-[10px] font-nebula font-black text-slate-400 uppercase tracking-widest">PROOF-OF-USEFUL-STORAGE</span>
             </div>
          </div>
        </div>
      </section>

      {/* FLUID TOKEN SECTION */}
      <section id="token" className="py-24 bg-slate-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-12">
             <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-nebula font-black uppercase tracking-widest mb-6">
                  <Coins size={12} /> Utility Fuel
                </div>
                <h2 className="text-5xl md:text-7xl font-nebula font-black text-white tracking-tighter uppercase italic leading-none mb-6">
                   Fluid <span className="text-fluid-gradient">Token</span>.
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                   Participate in the genesis of a sharded economy. Own FLUID to govern the network, secure hosting rights, and earn from global transaction fees.
                </p>
             </div>
             <div className="w-full max-w-5xl">
                <Tokenomics />
             </div>
          </div>
        </div>
      </section>

      {/* HOSTING SECTION */}
      <section id="hosting" className="py-24 bg-slate-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-nebula font-black uppercase tracking-widest mb-6">
              <Rocket size={12} /> Immutable Infrastructure
            </div>
            <h2 className="text-5xl md:text-7xl font-nebula font-black text-white tracking-tighter uppercase italic leading-none">
              Host <span className="text-fluid-gradient">Infinitely</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
             <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px]"></div>
                <h3 className="text-2xl font-nebula font-black text-white mb-6 uppercase italic">Register .fluid Domain</h3>
                <form onSubmit={handleDomainSearch} className="relative mb-6">
                    <input 
                        type="text" 
                        value={domainQuery}
                        onChange={(e) => setDomainQuery(e.target.value)}
                        placeholder="search.fluid" 
                        className="w-full bg-black/40 border border-white/10 rounded-full py-5 pl-8 pr-36 text-white font-nebula font-black text-xl focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-800"
                    />
                    <button type="submit" className="absolute right-2 top-2 bottom-2 bg-indigo-600 rounded-full px-8 text-white font-nebula font-black text-[12px] uppercase tracking-widest hover:bg-indigo-500 transition-colors">Search</button>
                </form>
                {showDomainResults && (
                   <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex justify-between items-center animate-fade-in-up">
                      <div><span className="text-white text-lg font-nebula font-black">{domainQuery}.fluid</span><span className="ml-3 text-[10px] bg-emerald-500 text-black px-2 py-1 rounded font-nebula font-black uppercase tracking-widest">Available</span></div>
                      <button className="text-[12px] font-nebula font-black text-emerald-400 uppercase tracking-widest hover:underline">Claim</button>
                   </div>
                )}
             </div>

             {/* TERMINAL */}
             <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] shadow-2xl overflow-hidden relative">
                <div className="bg-slate-800/80 px-6 py-3 flex items-center justify-between border-b border-white/5">
                   <div className="flex gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                   </div>
                   <span className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">fluid-sharding-engine v1</span>
                </div>
                <div ref={terminalRef} className="p-8 text-slate-300 min-h-[220px] flex flex-col gap-1.