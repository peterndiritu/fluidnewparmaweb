import React, { useState, useEffect, useRef } from 'react';
import HowItWorks from '../components/HowItWorks';
import Tokenomics from '../components/Tokenomics';
import LifecycleSimulation from '../components/LifecycleSimulation';
import PresaleCard from '../components/PresaleCard';
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
              <div className="w-10 h-10 md:w-14 md:h-14 text-white p-1 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{FLUID_LOGO_SVG}</div>
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