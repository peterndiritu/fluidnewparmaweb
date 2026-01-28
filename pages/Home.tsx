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

    // Added a small timeout to ensure elements are present in DOM
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
    <div className="flex flex-col bg-slate-950 overflow-x-hidden min-h-screen">
      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-[95vh] flex flex-col items-center justify-center pt-32 pb-16">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center flex flex-col items-center mb-20">
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-24 h-24 md:w-32 md:h-32 text-white p-1 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{FLUID_LOGO_SVG}</div>
              <h1 className="text-9xl md:text-[12rem] font-nebula font-black tracking-tighter italic leading-none text-fluid-gradient">Fluid</h1>
            </div>
            
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-6xl md:text-8xl font-nebula font-black tracking-tighter text-white italic leading-tight uppercase">
                Store. spend. host.
              </h2>
              <h3 className="text-8xl md:text-[11rem] font-nebula font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 italic leading-none uppercase">
                Infinitely.
              </h3>
            </div>

            <p className="max-w-2xl text-base md:text-lg font-bold text-slate-500 tracking-tight leading-relaxed mb-16 px-4 uppercase">
              The first sharded Layer-1 delivering <span className="text-white">2.4M+ TPS</span> with <span className="text-fluid-cyan">zero-downtime hosting</span>. <br/> Non-custodial, institutional security at scale.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <a href="#token" className="group px-14 py-6 bg-fluid-gradient text-white font-nebula font-black rounded-full text-[13px] uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                GET STARTED <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#hosting" className="px-14 py-6 bg-white/5 border border-white/10 text-white font-nebula font-black rounded-full text-[13px] uppercase tracking-[0.3em] hover:bg-white/10 active:scale-95 transition-all">
                NETWORK SPECS
              </a>
            </div>
          </div>
        </div>

        {/* Hero Visual Engine */}
        <div className="w-full max-w-5xl px-4 relative animate-fade-in-up">
          <div className="relative rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-3xl p-10 md:p-14 flex flex-row items-center justify-between shadow-2xl">
             <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                   <Layers size={22} className="text-fluid-cyan" />
                   <span className="text-[11px] font-nebula font-black text-slate-400 uppercase tracking-[0.2em]">2.4M TPS / MICRO-SHARDED</span>
                </div>
                <div className="flex items-center gap-4">
                   <Star size={22} className="text-fluid-purple" />
                   <span className="text-[11px] font-nebula font-black text-slate-400 uppercase tracking-[0.2em]">Programmable Dividends</span>
                </div>
             </div>
             <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-dashed border-fluid-cyan/30 rounded-full animate-spin-slow"></div>
                <TrendingUp size={32} className="text-white text-glow-cyan" />
             </div>
             <div className="flex flex-col gap-6 text-right items-end">
                <span className="text-[11px] font-nebula font-black text-slate-400 uppercase tracking-[0.2em]">~600ms DETERMINISTIC FINALITY</span>
                <span className="text-[11px] font-nebula font-black text-slate-400 uppercase tracking-[0.2em]">PROOF-OF-USEFUL-STORAGE</span>
             </div>
          </div>
        </div>
      </section>

      {/* FLUID TOKEN SECTION */}
      <section id="token" className="py-40 bg-slate-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
             <div className="space-y-16">
                <div>
                   <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-nebula font-black uppercase tracking-[0.2em] mb-8">
                     <Coins size={14} /> Utility Fuel
                   </div>
                   <h2 className="text-7xl md:text-9xl font-nebula font-black text-white tracking-tighter uppercase italic leading-none mb-8">
                      Fluid <br/><span className="text-fluid-gradient">Token</span>.
                   </h2>
                   <p className="text-slate-400 text-xl leading-relaxed font-medium max-w-xl">
                      Participate in the genesis of a sharded economy. Own FLUID to govern the network, secure hosting rights, and earn from global transaction fees.
                   </p>
                </div>
                
                <div className="pt-12 border-t border-white/5">
                   <h3 className="text-5xl md:text-6xl font-nebula font-black text-white tracking-tighter uppercase italic leading-none mb-3">
                     Tokenomics
                   </h3>
                   <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-12">
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
      <section id="hosting" className="py-40 bg-slate-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[11px] font-nebula font-black uppercase tracking-[0.2em] mb-8">
              <Rocket size={14} /> Immutable Infrastructure
            </div>
            <h2 className="text-7xl md:text-[8rem] font-nebula font-black text-white tracking-tighter uppercase italic leading-none">
              Host <span className="text-fluid-gradient">Infinitely</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-20">
             <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 md:p-16 relative overflow-hidden shadow-2xl flex flex-col justify-center scroll-card">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <h3 className="text-3xl font-nebula font-black text-white mb-10 uppercase italic tracking-tight leading-none">Register .fluid Domain</h3>
                <form onSubmit={handleDomainSearch} className="relative mb-8">
                    <input 
                        type="text" 
                        value={domainQuery}
                        onChange={(e) => setDomainQuery(e.target.value)}
                        placeholder="search.fluid" 
                        className="w-full bg-black/50 border border-white/10 rounded-full py-7 pl-10 pr-48 text-white font-nebula font-black text-2xl focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-800"
                    />
                    <button type="submit" className="absolute right-3 top-3 bottom-3 bg-indigo-600 rounded-full px-12 text-white font-nebula font-black text-[12px] uppercase tracking-widest hover:bg-indigo-500 active:scale-95 transition-all">Search</button>
                </form>
                {showDomainResults && (
                   <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex justify-between items-center animate-fade-in-up">
                      <div><span className="text-white text-2xl font-nebula font-black">{domainQuery}.fluid</span><span className="ml-5 text-[11px] bg-emerald-500 text-black px-3 py-1.5 rounded font-nebula font-black uppercase tracking-widest">Available</span></div>
                      <button className="text-[14px] font-nebula font-black text-emerald-400 uppercase tracking-widest hover:underline">Claim Now</button>
                   </div>
                )}
             </div>

             <div className="bg-slate-900 border border-slate-800 rounded-[4rem] shadow-2xl overflow-hidden relative min-h-[450px] scroll-card">
                <div className="bg-slate-800/80 px-10 py-5 flex items-center justify-between border-b border-white/5">
                   <div className="flex gap-3">
                     <div className="w-3.5 h-3.5 rounded-full bg-red-500/40"></div>
                     <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/40"></div>
                     <div className="w-3.5 h-3.5 rounded-full bg-green-500/40"></div>
                   </div>
                   <span className="text-slate-500 font-black uppercase tracking-[0.3em] text-[11px]">fluid-sharding-engine v1</span>
                </div>
                <div ref={terminalRef} className="p-12 text-slate-300 h-full flex flex-col gap-3 bg-black/60 overflow-y-auto font-mono text-sm leading-relaxed">
                   {terminalLines.map((line, idx) => <div key={idx}>{line.content}</div>)}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* PROTOCOL INFRASTRUCTURE SECTION */}
      <section id="infrastructure" className="py-40 bg-slate-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-7xl md:text-[7rem] font-nebula font-black text-white tracking-tighter uppercase italic leading-none mb-6">
              Protocol Infrastructure
            </h2>
            <p className="text-slate-500 text-xl font-bold tracking-[0.1em] uppercase max-w-3xl mx-auto opacity-80">
              A deep dive into our revolutionary permanent storage sharding architecture.
            </p>
          </div>

          <div className="mb-32">
            <HowItWorks />
          </div>

          <div className="grid md:grid-cols-3 gap-10 mt-24">
            {[
              { icon: ShieldCheck, title: "Censorship Resistant", desc: "Data stored immutably across a globally sharded network with high redundancy." },
              { icon: Activity, title: "100% Guaranteed Uptime", desc: "Distributed micro-sharding ensures content remains online even during network partitions." },
              { icon: Database, title: "Eternal Asset Storage", desc: "One-time contribution in FLUID stores your protocol assets forever on the sharded layer." }
            ].map((f, i) => (
              <div key={i} className="p-12 bg-slate-900/40 border border-white/5 rounded-[4rem] hover:border-fluid-cyan/40 hover:bg-slate-900/60 transition-all group scroll-card">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-10 text-indigo-400 group-hover:scale-110 transition-transform"><f.icon size={32} /></div>
                  <h4 className="text-2xl font-nebula font-black mb-5 text-white uppercase italic leading-tight">{f.title}</h4>
                  <p className="text-slate-500 text-base leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ECONOMY SECTION */}
      <section id="economy" className="py-40 bg-slate-950 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[11px] font-nebula font-black uppercase tracking-[0.2em] mb-8">
              <Landmark size={14} /> Algorithmic Governance
            </div>
            <h2 className="text-7xl md:text-9xl font-nebula font-black text-white tracking-tighter uppercase italic leading-none mb-8">
              Economic <span className="text-fluid-gradient">Scarcity</span>.
            </h2>
          </div>
          
          <div className="mb-24 scroll-card">
            <LifecycleSimulation />
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Endowment Protocol", desc: "Fees fuel the Protocol Treasury, generating perpetual yield for node operators.", icon: TrendingUp, color: "text-amber-400" },
              { title: "Useful Storage Proofs", desc: "Validators must prove continuous data retention to earn block rewards and fees.", icon: Server, color: "text-indigo-400" },
              { title: "Halving Protocols", desc: "Deflationary 100M supply cap with periodic emission halvings every 4 years.", icon: BarChart, color: "text-purple-400" }
            ].map((p, i) => (
              <div key={i} className="p-12 bg-slate-900/40 border border-white/5 rounded-[4rem] hover:border-amber-500/40 transition-all group scroll-card">
                  <div className={`w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 ${p.color} group-hover:scale-110 transition-transform`}><p.icon size={32} /></div>
                  <h3 className="text-2xl font-nebula font-black mb-5 text-white uppercase italic leading-tight">{p.title}</h3>
                  <p className="text-slate-500 text-base leading-relaxed font-medium">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-52 bg-slate-950 text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-indigo-500/5 rounded-full blur-[200px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <h2 className="text-8xl md:text-[11rem] font-nebula font-black text-white mb-12 tracking-tighter uppercase italic leading-none">
            Secure <br/><span className="text-fluid-gradient">Genesis</span>.
          </h2>
          <p className="text-slate-400 text-2xl mb-16 font-medium leading-relaxed max-w-2xl mx-auto uppercase tracking-widest opacity-80">
            Join the founding ring of the first sharded Layer-1 with integrated profit sharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
            <button onClick={() => onNavigate('wallet')} className="px-16 py-7 bg-white text-slate-950 font-nebula font-black rounded-full text-[15px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Launch Vault</button>
            <button onClick={() => onNavigate('whitepaper')} className="px-16 py-7 bg-transparent border-2 border-white/20 text-white font-nebula font-black rounded-full text-[15px] uppercase tracking-[0.3em] hover:bg-white/10 active:scale-95 transition-all">Whitepaper</button>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .typing-cursor {
          display: inline-block;
          width: 10px;
          height: 20px;
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