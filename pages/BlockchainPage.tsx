
import React, { useState, useMemo } from 'react';
import { 
  Zap, Shield, Layers, Code2, Globe, Cpu, 
  CheckCircle, Wifi, Copy, Check, Wallet, 
  RefreshCw, Smartphone, ChevronDown, List, Activity, Server, Database,
  LayoutGrid, Search, HardDrive, Construction, FileText
} from 'lucide-react';

const BlockchainPage: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>('overview');
  const [showDevMessage, setShowDevMessage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDevClick = () => {
    setShowDevMessage(true);
    setTimeout(() => setShowDevMessage(false), 3000);
  };

  const menuItems = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: Globe, children: ['Architecture', 'Consensus', 'EVM'] },
    { id: 'nodes', label: 'Network', icon: Server, children: ['Validators', 'Shards', 'State Sync'] },
    { id: 'stats', label: 'Statistics', icon: Activity, children: ['TPS Live', 'Gas History', 'Uptime'] },
    { id: 'dev', label: 'Developer', icon: Code2, children: ['RPC Access', 'Faucet', 'Deploy Tool'] }
  ], []);

  const blockchainFeatures = [
    { 
      icon: Zap, 
      label: "Throughput", 
      value: "2,000,000+", 
      trend: "+∞%", 
      color: "cyan", 
      desc: "Peak transactions per second"
    },
    { 
      icon: Layers, 
      label: "Scalability", 
      value: "Sharded", 
      trend: "Linear", 
      color: "blue", 
      desc: "Horizontal network expansion"
    },
    { 
      icon: RefreshCw, 
      label: "Finality", 
      value: "~1 Second", 
      trend: "Instant", 
      color: "purple", 
      desc: "Time to immutable confirmation"
    },
    { 
      icon: Smartphone, 
      label: "Mobile", 
      value: "Native", 
      trend: "Optimized", 
      color: "orange", 
      desc: "Direct-to-consumer architecture"
    }
  ];

  const scrollTo = (id: string) => {
     const el = document.getElementById(id);
     if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex flex-col lg:flex-row max-w-7xl mx-auto px-4 gap-8 relative">
      
      {/* Dev Toast */}
      {showDevMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-6 py-3 rounded-full backdrop-blur-md shadow-xl flex items-center gap-3 font-bold">
                <Construction size={18} />
                <span>Feature Under Development</span>
            </div>
        </div>
      )}

      {/* Left Sidebar Dropdown Navigation */}
      <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
        <div className="sticky top-32 w-full">
            <div className="bg-[#0F1115] border border-white/5 rounded-2xl p-2 shadow-2xl overflow-hidden transition-all duration-300">
               <div 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="px-4 py-3 border-b border-white/5 flex items-center justify-between mb-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors"
               >
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network</span>
                     <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
               </div>
               
               <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="flex flex-col gap-1">
                       {menuItems.map((item) => (
                         <div key={item.id} className="group">
                            <button 
                              onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 border ${
                                 openDropdown === item.id 
                                 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                                 : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                              }`}
                            >
                               <div className="flex items-center gap-3">
                                  <item.icon size={16} className={openDropdown === item.id ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-400'} />
                                  <span className="text-xs font-bold tracking-wide">{item.label}</span>
                               </div>
                               <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === item.id ? 'rotate-180 text-blue-500' : 'text-slate-600'}`} />
                            </button>
                            
                            {openDropdown === item.id && (
                               <div className="mt-1 mb-2 ml-3 pl-3 border-l border-white/5 space-y-0.5 animate-fade-in-up">
                                  {item.children.map((child) => (
                                    <button 
                                      key={child}
                                      onClick={() => scrollTo(item.id)}
                                      className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                    >
                                       <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-blue-500 transition-colors"></div>
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
      <main className="flex-grow">
        {/* Hero */}
        <section id="overview" className="text-center px-4 mb-24 lg:text-left lg:px-0">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/30 mb-6">
             <span className="text-blue-500 font-bold uppercase tracking-wider text-sm">Layer 1 Protocol</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-none">
             Fluid Chain
          </h1>
          <h2 className="text-2xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 mb-10 tracking-tight">
             The Backbone of the New Internet
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
             Fluid Chain is a high-performance Layer-1 blockchain designed for infinite scalability, sub-second finality, and zero-downtime decentralized hosting.
          </p>
          <div className="flex flex-col sm:flex-row lg:justify-start justify-center gap-4 flex-wrap">
               <button 
                  onClick={handleDevClick}
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
               >
                  <Code2 size={20} /> Start Building
               </button>
               
               <button 
                  onClick={handleDevClick}
                  className="px-8 py-4 bg-slate-800 text-white font-bold rounded-full hover:bg-slate-700 transition-colors border border-slate-700 flex items-center justify-center gap-2"
               >
                  <Search size={20} /> Fluidscan Explorer
               </button>

               <button 
                  onClick={handleDevClick}
                  className="px-8 py-4 bg-slate-800 text-white font-bold rounded-full hover:bg-slate-700 transition-colors border border-slate-700 flex items-center justify-center gap-2"
               >
                  <HardDrive size={20} /> Run Node
               </button>

               <button className="px-8 py-4 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <FileText size={20} /> Read Whitepaper
               </button>
          </div>
        </section>

        {/* Key Stats */}
        <section id="stats" className="mb-24 scroll-card">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blockchainFeatures.map((stat, i) => (
                 <div key={i} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-8 border border-slate-200/50 dark:border-slate-800/50 hover:border-blue-500/50 transition-all group shadow-xl">
                    <div className={`w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform shadow-lg`}>
                        <stat.icon size={28} />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-2 font-black uppercase tracking-widest">{stat.label}</p>
                    <div className="flex items-end justify-between mb-2">
                       <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</span>
                       <span className="text-xs text-emerald-500 font-black mb-1 tracking-widest uppercase">{stat.trend}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{stat.desc}</p>
                 </div>
              ))}
           </div>
        </section>

        {/* Architecture Features */}
        <section id="nodes" className="bg-white dark:bg-slate-900/50 py-16 px-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 mb-24">
           <h2 className="text-3xl font-extrabold text-center mb-16 text-slate-900 dark:text-white">Technical Innovations</h2>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all group">
                 <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                    <Layers size={24} />
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Dynamic Sharding</h3>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    The network automatically partitions into shards based on load, allowing for linear scalability. As more nodes join, the network gets faster.
                 </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all group">
                 <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform">
                    <Code2 size={24} />
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">EVM Compatibility</h3>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    Deploy existing Ethereum smart contracts (Solidity/Vyper) instantly with no code changes. Full support for standard Ethereum tooling.
                 </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all group">
                 <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                    <Shield size={24} />
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Proof of Fluidity</h3>
                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    A novel consensus mechanism combining Proof-of-Stake with Proof-of-History, ensuring fair validator selection and energy efficiency.
                 </p>
              </div>
           </div>
        </section>

        {/* Quick Connect Section */}
        <section id="dev" className="py-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] mb-24">
           <div className="max-w-xl mx-auto px-4">
              <div className="flex items-center gap-2 mb-6">
                 <Wifi className="text-cyan-400" />
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quick Connect</h2>
              </div>
              
              <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative shadow-lg">
                 <div className="absolute top-6 right-6">
                    <span className="px-3 py-1 bg-cyan-500 text-black text-xs font-bold rounded-full">Fluid Chain</span>
                 </div>
                 
                 <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 group cursor-pointer" onClick={() => copyToClipboard('https://rpc.fluidchain.org', 'rpc')}>
                       <span className="text-slate-500 dark:text-slate-400">RPC URL</span>
                       <div className="flex items-center gap-2">
                          <span className="text-cyan-600 dark:text-cyan-400 font-medium">https://rpc.fluidchain.org</span>
                          {copiedField === 'rpc' ? <Check size={14} className="text-emerald-500"/> : <Copy size={14} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white"/>}
                       </div>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                       <span className="text-slate-500 dark:text-slate-400">Chain ID</span>
                       <span className="text-slate-900 dark:text-white font-medium">7777</span>
                    </div>

                    <div className="flex justify-between items-center">
                       <span className="text-slate-500 dark:text-slate-400">Currency Symbol</span>
                       <span className="text-slate-900 dark:text-white font-medium">FLUID</span>
                    </div>
                 </div>

                 <div className="mt-6 flex flex-col gap-3">
                    <button className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-white dark:text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                       <Wallet size={18} /> Connect MetaMask
                    </button>
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default BlockchainPage;
