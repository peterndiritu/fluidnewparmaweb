import React, { useState, useEffect } from 'react';
import { 
  Shield, Zap, Layers, Code2, Globe, Smartphone, Wallet as WalletIcon, 
  Play, Gitlab, Flame, Box, Blocks, ShieldCheck, 
  Coins, Triangle, Cloud, Infinity as InfinityIcon,
  ChevronRight, Network, RefreshCw, ArrowUpRight,
  TrendingUp, CreditCard, Database, ArrowDown, Repeat, Server,
  Landmark, Globe2, Compass, ArrowRightLeft, CreditCard as CardIcon,
  Search, Cpu, Activity, Hexagon
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="currentColor" />
    <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="currentColor" />
    <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 83.3137 82 60 82H10L15 66Z" fill="currentColor" />
  </svg>
);

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const fullDescription = "The foundation for consensual computation—combining decentralized infrastructure, private messaging, and a high-performance Layer-1 blockchain built for open, serverless, and permissionless applications & a secure multichain non-custodial wallet.";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  
  // Dynamic Wallet Snippet State
  const [walletView, setWalletView] = useState(0); // 0: Crypto, 1: Card, 2: Fiat, 3: dApps

  // Blockchain Live Block State
  const [blocks, setBlocks] = useState<{id: string, time: string, tx: number}[]>([]);
  const [blockCount, setBlockCount] = useState(8429012);

  useEffect(() => {
    if (index < fullDescription.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + fullDescription[index]);
        setIndex((prev) => prev + 1);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [index, fullDescription]);

  // Cycle the wallet snippet view
  useEffect(() => {
    const timer = setInterval(() => {
      setWalletView((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Simulate Live Block Feed for Blockchain Snippet
  useEffect(() => {
    const addBlock = () => {
      const newBlock = {
        id: Math.random().toString(16).substring(2, 8).toUpperCase(),
        time: 'Just now',
        tx: Math.floor(Math.random() * 500) + 100
      };
      setBlocks(prev => [newBlock, ...prev].slice(0, 3));
      setBlockCount(prev => prev + 1);
    };

    const timer = setInterval(addBlock, 2500);
    addBlock(); // Initial block
    return () => clearInterval(timer);
  }, []);

  const revolutionaryFeatures = [
    {
      title: "Ultra-Fast Processing",
      desc: "Revolutionary architecture enabling 1M+ billion transactions per second with sub-millisecond finality.",
      badge: "1M+ TPS",
      icon: Zap,
      color: "blue"
    },
    {
      title: "Quantum-Safe Military-Grade Security",
      desc: "Advanced cryptographic protocols ensure maximum security for hosting and assets.",
      badge: "Quantum-Safe",
      icon: Shield,
      color: "emerald"
    },
    {
      title: "100% Compatible Full EVM Compatibility",
      desc: "Seamlessly deploy existing Ethereum smart contracts without any modifications.",
      badge: "100% Compatible",
      icon: Code2,
      color: "cyan"
    }
  ];

  const blockchainFeatures = [
    { icon: Zap, label: "Throughput", value: "2,000,000+", trend: "+∞%", color: "cyan" },
    { icon: Layers, label: "Scalability", value: "Sharded", trend: "Linear", color: "blue" },
    { icon: RefreshCw, label: "Finality", value: "~1 Second", trend: "Instant", color: "purple" },
    { icon: Smartphone, label: "Mobile", value: "Native", trend: "Native", color: "orange" }
  ];

  return (
    <div className="overflow-hidden pb-12">
        {/* Compact Hero Section */}
        <section id="presale" className="relative pt-20 pb-4 overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
            <button 
              onClick={() => onNavigate('buy')}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700/50 mb-4 animate-fade-in-up backdrop-blur-md hover:bg-slate-800/80 transition-all group cursor-pointer"
            >
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 text-[9px] font-black tracking-widest uppercase">Live Presale</span>
              <ChevronRight size={10} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <h1 className="text-4xl lg:text-6xl font-black leading-tight mb-2 text-slate-900 dark:text-white tracking-tighter">
              Fluid <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400">Store. Spend. Host.</span>
            </h1>
            
            <div className="min-h-[4rem] flex items-center justify-center">
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-3xl mx-auto leading-relaxed font-medium">
                {displayedText}
                <span className={`inline-block w-1 h-4 ml-0.5 bg-blue-500 align-middle ${index < fullDescription.length ? 'animate-pulse' : 'hidden'}`}></span>
              </p>
            </div>

            <div className="mb-6">
               <button 
                  onClick={() => onNavigate('buy')}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-base rounded-xl shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 active:scale-95 uppercase tracking-wider"
                >
                  Get Started
                </button>
            </div>
          </div>
        </section>

        {/* Compact Pillar Sections - Reordered to: Hosting, Economy, Wallet, Blockchain */}
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            
            {/* 1. Hosting Snippet */}
            <div onClick={() => onNavigate('host')} className="group cursor-pointer bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-xl hover:scale-[1.01] transition-all overflow-hidden flex flex-col relative">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Permanent Hosting</h3>
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500"><Cloud size={14}/></div>
                </div>
                
                {/* Micro Sharding Visual */}
                <div className="flex-grow flex flex-col items-center justify-center py-4 bg-black/5 dark:bg-black/20 rounded-2xl relative">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg border border-white/10 flex items-center justify-center text-blue-500 shadow-lg">
                            <Database size={16} />
                        </div>
                        <ArrowDown size={12} className="text-blue-500" />
                        <div className="flex gap-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <div className="w-8 h-6 bg-blue-500/20 border border-blue-500/30 rounded flex items-center justify-center">
                                        <span className="text-[6px] font-black text-blue-400 uppercase">S{i}</span>
                                    </div>
                                    <div className="w-8 h-8 bg-slate-900 border border-blue-500/10 rounded flex items-center justify-center">
                                        <Server size={10} className="text-cyan-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-2 text-center text-[7px] font-black text-slate-500 tracking-widest uppercase">Distributed Grid</div>
                </div>
                
                <p className="text-[10px] mt-4 text-slate-500 font-bold leading-relaxed">Immutable decentralized storage across a global node network. One-time payment, host forever.</p>
                <button className="mt-4 flex items-center gap-1.5 text-blue-600 dark:text-cyan-400 font-black text-[9px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  Protocol Docs <ArrowUpRight size={12} />
                </button>
            </div>

            {/* 2. Endowment Economy Snippet */}
            <div onClick={() => onNavigate('economics')} className="group cursor-pointer bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-xl hover:scale-[1.01] transition-all overflow-hidden flex flex-col relative">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Endowment Economy</h3>
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500"><Coins size={14}/></div>
                </div>

                {/* Micro Economy Visual */}
                <div className="flex-grow flex flex-col items-center justify-center py-4 bg-black/5 dark:bg-black/20 rounded-2xl relative">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full"></div>
                        <div className="w-12 h-12 bg-slate-900 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-500 relative z-10">
                            <Repeat size={20} className="animate-spin duration-[6s]" />
                        </div>
                        
                        {/* Orbitals */}
                        <div className="absolute w-20 h-20 border border-white/5 rounded-full animate-pulse"></div>
                        <div className="absolute -top-1 left-1/2 w-4 h-4 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-500">
                            <InfinityIcon size={8} />
                        </div>
                    </div>
                    <div className="mt-4 text-[7px] font-black text-amber-500 uppercase tracking-widest">Sustainability Engine</div>
                </div>

                <p className="text-[10px] mt-4 text-slate-500 font-bold leading-relaxed">Protocol treasury generates sustainable yield to maintain infrastructure indefinitely without monthly fees.</p>
                <button className="mt-4 flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-black text-[9px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  View Treasury <ArrowUpRight size={12} />
                </button>
            </div>

            {/* 3. Wallet Snippet */}
            <div onClick={() => onNavigate('wallet')} className="group cursor-pointer bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-xl hover:scale-[1.01] transition-all overflow-hidden flex flex-col relative">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Fluid Wallet App</h3>
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500"><WalletIcon size={14}/></div>
                </div>

                {/* Dynamic App Mockup */}
                <div className="flex-grow bg-slate-950 rounded-2xl p-4 border border-white/10 shadow-2xl flex flex-col relative overflow-hidden h-[160px]">
                  
                  {/* Crypto Assets View */}
                  <div className={`absolute inset-0 p-4 transition-all duration-700 flex flex-col gap-2 ${walletView === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="flex justify-between items-center">
                      <p className="text-[6px] text-slate-500 font-black uppercase tracking-widest">Crypto Portfolio</p>
                      <span className="text-[8px] font-black text-emerald-400">+$120.40</span>
                    </div>
                    <span className="text-lg font-black text-white">$12,458.20</span>
                    <div className="space-y-1.5 mt-1">
                       <div className="flex justify-between items-center bg-white/5 p-1.5 rounded-lg">
                         <div className="flex items-center gap-1.5">
                           <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-[6px] font-black italic">F</div>
                           <span className="text-[7px] text-white font-bold">FLD</span>
                         </div>
                         <span className="text-[7px] text-white font-bold">14.5K</span>
                       </div>
                       <div className="flex justify-between items-center bg-white/5 p-1.5 rounded-lg">
                         <div className="flex items-center gap-1.5">
                           <div className="w-4 h-4 rounded bg-indigo-500 flex items-center justify-center text-[6px] font-black italic">E</div>
                           <span className="text-[7px] text-white font-bold">ETH</span>
                         </div>
                         <span className="text-[7px] text-white font-bold">2.41</span>
                       </div>
                    </div>
                  </div>

                  {/* Card View */}
                  <div className={`absolute inset-0 p-4 transition-all duration-700 flex flex-col gap-3 justify-center ${walletView === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <p className="text-[6px] text-slate-500 font-black uppercase tracking-widest mb-1">Native Cards</p>
                    <div className="aspect-[1.58/1] bg-gradient-to-br from-indigo-700 to-purple-800 rounded-lg p-2 flex flex-col justify-between shadow-lg border border-white/10">
                        <div className="flex justify-between items-start">
                          <FluidLogo className="w-3 h-3 text-white" />
                          <div className="w-2.5 h-1.5 bg-yellow-500/50 rounded-[1px]"></div>
                        </div>
                        <div className="text-[6px] text-white font-mono tracking-widest">**** **** **** 8842</div>
                    </div>
                    <div className="flex justify-between items-center text-[7px] font-bold text-slate-400">
                      <span className="flex items-center gap-1"><Smartphone size={8}/> Virtual</span>
                      <span className="flex items-center gap-1"><CardIcon size={8}/> Physical</span>
                    </div>
                  </div>

                  {/* Fiat Integration View */}
                  <div className={`absolute inset-0 p-4 transition-all duration-700 flex flex-col gap-3 justify-center ${walletView === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <p className="text-[6px] text-slate-500 font-black uppercase tracking-widest">Fiat Banking</p>
                    <div className="bg-slate-900 border border-white/5 rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="p-1 bg-emerald-500/20 text-emerald-500 rounded"><Landmark size={10}/></div>
                          <span className="text-[8px] font-black text-white">Bank Linked</span>
                        </div>
                        <span className="text-[6px] font-black text-emerald-500 uppercase tracking-widest">Verified</span>
                      </div>
                      <div className="flex justify-between items-end border-t border-white/5 pt-2">
                        <div>
                          <p className="text-[5px] text-slate-500 font-black uppercase tracking-widest">IBAN</p>
                          <p className="text-[7px] font-mono text-slate-300">GB82 FLUD 1002 4492</p>
                        </div>
                        <ArrowRightLeft size={8} className="text-slate-500" />
                      </div>
                    </div>
                  </div>

                  {/* Parmaweb dApp View */}
                  <div className={`absolute inset-0 p-4 transition-all duration-700 flex flex-col gap-2 ${walletView === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="flex items-center gap-1.5 bg-white/5 p-1.5 rounded-full border border-white/5">
                      <Compass size={8} className="text-cyan-500" />
                      <span className="text-[6px] text-slate-300 font-mono flex-grow">parma://fluid.link/dapp</span>
                    </div>
                    <div className="flex-grow bg-slate-900 rounded-xl overflow-hidden border border-white/5 p-3 flex flex-col gap-2">
                       <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-blue-600/20 rounded flex items-center justify-center text-blue-500"><Globe size={12}/></div>
                         <div className="flex flex-col">
                           <span className="text-[7px] text-white font-black">Fluid Exchange</span>
                           <span className="text-[5px] text-slate-500 uppercase font-black">Decentralized Platform</span>
                         </div>
                       </div>
                       <div className="h-6 bg-white/5 rounded-lg animate-pulse"></div>
                    </div>
                  </div>

                  {/* App Tab Bar Mockup */}
                  <div className="mt-auto flex justify-between items-center pt-2 border-t border-white/5">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-grow mx-1 rounded-full transition-all duration-500 ${walletView === i ? 'bg-cyan-500 scale-x-110' : 'bg-slate-800'}`}></div>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] mt-4 text-slate-500 font-bold leading-relaxed">Multichain non-custodial gateway. Seamlessly bridge crypto, manage native debit cards, link bank accounts, and browse decentralized Parmaweb apps.</p>
                <button className="mt-4 flex items-center gap-1.5 text-emerald-600 dark:text-cyan-400 font-black text-[9px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  Launch Wallet App <ArrowUpRight size={12} />
                </button>
            </div>

            {/* 4. Fluid Blockchain Snippet - ENHANCED with Live Blocks */}
            <div onClick={() => onNavigate('blockchain')} className="group cursor-pointer bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-[2rem] p-6 shadow-xl hover:scale-[1.01] transition-all overflow-hidden flex flex-col relative">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Fluid Blockchain</h3>
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500"><Cpu size={14}/></div>
                </div>

                {/* Live Block Visualization Area */}
                <div className="flex-grow bg-slate-950 rounded-2xl border border-white/5 p-3 flex flex-col relative overflow-hidden h-[160px]">
                   <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                         <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Live Network</span>
                      </div>
                      <span className="text-[9px] font-mono text-blue-400 font-bold">#{blockCount.toLocaleString()}</span>
                   </div>

                   {/* Vertical Block Feed */}
                   <div className="flex-grow flex flex-col gap-2 overflow-hidden relative">
                      {blocks.map((block, i) => (
                        <div key={i} className={`flex items-center gap-3 bg-white/5 border border-white/5 p-2 rounded-xl transform transition-all duration-1000 ${i === 0 ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-50 translate-y-1'}`}>
                           <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500">
                              <Hexagon size={16} className={i === 0 ? 'animate-spin duration-[4s]' : ''} />
                           </div>
                           <div className="flex-grow">
                              <div className="flex justify-between items-center mb-0.5">
                                 <span className="text-[8px] font-mono text-white font-black">0x{block.id}...</span>
                                 <span className="text-[6px] font-black text-slate-600 uppercase">Validated</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <div className="h-0.5 flex-grow bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-full animate-progress-fast"></div>
                                 </div>
                                 <span className="text-[6px] font-black text-blue-500">{block.tx} TX</span>
                              </div>
                           </div>
                        </div>
                      ))}
                      
                      {/* Connection Lines */}
                      <div className="absolute left-7 top-8 bottom-0 w-[1px] border-l border-dashed border-blue-500/20 z-0"></div>
                   </div>

                   {/* Terminal Style Stats Overlay */}
                   <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <Activity size={10} className="text-blue-500" />
                         <span className="text-[7px] font-black text-slate-500">Latency: 12ms</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <Network size={10} className="text-emerald-500" />
                         <span className="text-[7px] font-black text-emerald-500">2.4M TPS Active</span>
                      </div>
                   </div>
                </div>

                <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2">
                        <Zap size={10} className="text-blue-500 mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                          <p className="text-[9px] font-black text-slate-900 dark:text-white leading-none uppercase tracking-tight">Ultra-Fast Throughput</p>
                          <p className="text-[8px] font-bold text-slate-500 leading-tight">Consensual computation architecture with sub-millisecond finality.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Code2 size={10} className="text-cyan-500 mt-0.5 shrink-0" />
                        <div className="flex flex-col">
                          <p className="text-[9px] font-black text-slate-900 dark:text-white leading-none uppercase tracking-tight">EVM Native Ecosystem</p>
                          <p className="text-[8px] font-bold text-slate-500 leading-tight">Full compatibility for Ethereum dApps with zero migration overhead.</p>
                        </div>
                    </div>
                </div>

                <button className="mt-4 flex items-center gap-1.5 text-blue-600 dark:text-cyan-400 font-black text-[9px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  Network Explorer <ArrowUpRight size={12} />
                </button>
            </div>
        </div>

        {/* Core Tech Grid */}
        <section className="py-4 bg-transparent relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {revolutionaryFeatures.map((feature, idx) => (
                <div key={idx} className="scroll-card p-5 bg-slate-50/30 dark:bg-slate-900/20 backdrop-blur-xl rounded-[1.5rem] border border-slate-200 dark:border-slate-800/50 hover:border-blue-500/20 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[7px] font-black uppercase text-blue-500 dark:text-cyan-400 border border-blue-500/10">
                      {feature.badge}
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-500 group-hover:scale-105 transition-transform">
                    <feature.icon size={20} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1 tracking-tight uppercase">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compact Blockchain Features Stats */}
        <section className="py-4 bg-transparent relative mb-4">
           <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                 {blockchainFeatures.map((stat, i) => (
                    <div key={i} className="scroll-card bg-white/20 dark:bg-slate-900/20 backdrop-blur-xl rounded-[1rem] p-4 border border-slate-200/50 dark:border-slate-800/50 hover:border-blue-500/30 transition-all group shadow-sm">
                        <p className="text-slate-500 dark:text-slate-400 text-[8px] mb-1 font-black uppercase tracking-widest">{stat.label}</p>
                        <div className="flex items-end justify-between">
                           <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</span>
                           <span className="text-[8px] text-emerald-500 font-black mb-0.5 uppercase">{stat.trend}</span>
                        </div>
                    </div>
                 ))}
              </div>
           </div>
        </section>
    </div>
  );
};

export default Home;