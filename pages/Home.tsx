import React from 'react';
import { 
  Shield, Zap, Layers, Code2, Globe, Smartphone, Wallet, 
  Play, Gitlab, Flame, Box, Blocks, ShieldCheck, 
  Coins, Triangle, Cloud, Infinity as InfinityIcon,
  ChevronRight, Network, RefreshCw, ArrowUpRight,
  TrendingUp, CreditCard
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const partners = [
    { name: 'Google Play', icon: Play },
    { name: 'GitLab', icon: Gitlab },
    { name: 'Firebase', icon: Flame },
    { name: 'WalletConnect', icon: Wallet },
    { name: 'Android', icon: Smartphone },
    { name: 'INFURA', icon: Box },
    { name: 'NEXT.js', icon: Blocks },
    { name: 'CertiK', icon: ShieldCheck },
    { name: 'Ether', icon: Coins },
    { name: 'Vercel', icon: Triangle },
    { name: 'AWS', icon: Cloud },
  ];

  const revolutionaryFeatures = [
    {
      title: "Ultra-Fast Processing",
      desc: "Revolutionary architecture enabling 1M+ billion transactions per second with sub-millisecond finality.",
      badge: "1M+ TPS",
      icon: Zap,
      color: "blue"
    },
    {
      title: "Military-Grade Security",
      desc: "Advanced cryptographic protocols ensure maximum security for hosting and assets.",
      badge: "Quantum-Safe",
      icon: Shield,
      color: "emerald"
    },
    {
      title: "Full EVM Compatibility",
      desc: "Seamlessly deploy existing Ethereum smart contracts without any modifications.",
      badge: "100% Compatible",
      icon: Code2,
      color: "cyan"
    },
    {
      title: "Infinite Scalability",
      desc: "Dynamic sharding and parallel processing scale automatically with network demand.",
      badge: "Auto-Scale",
      icon: Layers,
      color: "indigo"
    },
    {
      title: "Universal Wallet Support",
      desc: "Works with MetaMask, WalletConnect, and all major EVM-compatible wallets.",
      badge: "All Wallets",
      icon: Wallet,
      color: "purple"
    },
    {
      title: "Global Infrastructure",
      desc: "Distributed node network spanning 150+ countries for censorship resistance.",
      badge: "150+ Countries",
      icon: Globe,
      color: "orange"
    }
  ];

  const blockchainFeatures = [
    { icon: Zap, label: "Throughput", value: "2,000,000+", trend: "+∞%", color: "cyan" },
    { icon: Layers, label: "Scalability", value: "Sharded", trend: "Linear", color: "blue" },
    { icon: RefreshCw, label: "Finality", value: "~1 Second", trend: "Instant", color: "purple" },
    { icon: Smartphone, label: "Mobile", value: "Native", trend: "Optimized", color: "orange" }
  ];

  return (
    <div className="overflow-hidden">
        {/* Hero Section - Compacted */}
        <section id="presale" className="relative pt-24 pb-4 overflow-hidden min-h-[70vh] flex flex-col justify-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
            <button 
              onClick={() => onNavigate('buy')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/50 mb-6 animate-fade-in-up backdrop-blur-md hover:bg-slate-800/80 transition-all group cursor-pointer shadow-xl"
            >
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 text-[10px] font-black tracking-widest uppercase">Presale Stage 1 Live</span>
              <ChevronRight size={12} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-4 text-slate-900 dark:text-white tracking-tighter">
              Fluid <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400">Store. Spend. Host <br/> Infinitely.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
              Layer-1 blockchain delivering <strong>2M+ TPS</strong> with zero-downtime hosting and a secure multichain non-custodial wallet.
            </p>

            <div className="mb-10">
               <button 
                  onClick={() => onNavigate('buy')}
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/30 transition-all transform hover:-translate-y-1 active:scale-95"
                >
                  Buy FLUID
                </button>
            </div>
            
            {/* Partners Marquee - Compacted */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/50 w-full overflow-hidden">
              <p className="text-[9px] text-center text-slate-500 uppercase font-black tracking-[0.3em] mb-4">Powered By</p>
              <div className="relative flex overflow-x-hidden group max-w-[100vw]">
                  <div className="animate-marquee-reverse flex items-center gap-12 whitespace-nowrap opacity-40 grayscale hover:grayscale-0 transition-all duration-700 hover:opacity-100 pr-12">
                      {partners.map((p, i) => (
                          <div key={`p1-${i}`} className="flex items-center gap-3">
                              <p.icon size={20} className="text-slate-800 dark:text-white" />
                              <span className="font-black text-xl tracking-tighter text-slate-800 dark:text-white">{p.name}</span>
                          </div>
                      ))}
                      {partners.map((p, i) => (
                          <div key={`p2-${i}`} className="flex items-center gap-3">
                              <p.icon size={20} className="text-slate-800 dark:text-white" />
                              <span className="font-black text-xl tracking-tighter text-slate-800 dark:text-white">{p.name}</span>
                          </div>
                      ))}
                  </div>
                  <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-gray-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-gray-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Wallet Snippet Section - NEW */}
        <section className="py-8 bg-transparent relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              onClick={() => onNavigate('wallet')}
              className="group cursor-pointer relative max-w-4xl mx-auto"
            >
              {/* Card Decoration Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative flex flex-col md:flex-row items-center gap-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-[2.5rem] p-6 md:p-8 shadow-2xl transition-all hover:scale-[1.01]">
                
                {/* Simulated Modern Wallet UI */}
                <div className="w-full md:w-72 bg-slate-950 rounded-3xl p-5 border border-white/10 shadow-2xl flex flex-col gap-4 overflow-hidden relative shrink-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white italic">F</div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Fluid Wallet</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Available Balance</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">$12,458</span>
                      <span className="text-xs text-slate-500 font-bold">.20</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1 h-8 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase tracking-tighter">Send</div>
                    <div className="flex-1 h-8 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase tracking-tighter">Receive</div>
                    <div className="flex-1 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-[8px] font-black text-white uppercase tracking-tighter">Swap</div>
                  </div>

                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-[10px] font-black text-white">E</div>
                        <span className="text-[10px] font-black text-white">ETH</span>
                      </div>
                      <span className="text-[10px] font-black text-white">$4,280</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white italic">F</div>
                        <span className="text-[10px] font-black text-white">FLD</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-400">$6,170</span>
                    </div>
                  </div>
                  
                  {/* Glass Card Hover Indicator */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>

                {/* Snippet Text Content */}
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">Manage your life in one Super App</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium text-sm leading-relaxed max-w-md">
                    Non-custodial, high-performance, and ready for the future. Swap assets, manage your Fluid card, and host data on Parmaweb directly from your pocket.
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <button className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                      Open Super Wallet <ArrowUpRight size={16} />
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <CreditCard size={12} className="text-emerald-500" />
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Card Ready</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Revolutionary Features Section - Compacted */}
        <section className="py-12 bg-transparent relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-5xl font-black mb-3 text-slate-900 dark:text-white tracking-tighter">Revolutionary Features</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-medium text-base">
                Redefining blockchain technology with groundbreaking innovations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {revolutionaryFeatures.map((feature, idx) => (
                <div key={idx} className="scroll-card p-6 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-slate-800/50 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[8px] font-black uppercase tracking-[0.2em] text-blue-500 dark:text-cyan-400 border border-blue-500/10 dark:border-cyan-400/10">
                      {feature.badge}
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blockchain Features Section - Compacted */}
        <section className="py-8 bg-transparent relative">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                 <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">Blockchain features</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 {blockchainFeatures.map((stat, i) => (
                    <div key={i} className="scroll-card bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[1.5rem] p-6 border border-slate-200/50 dark:border-slate-800/50 hover:border-blue-500/50 transition-all group shadow-lg">
                        <div className={`w-10 h-10 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center mb-4 text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={20} />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-[10px] mb-1 font-black uppercase tracking-widest">{stat.label}</p>
                        <div className="flex items-end justify-between">
                           <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</span>
                           <span className="text-[10px] text-emerald-500 font-black mb-1 uppercase">{stat.trend}</span>
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