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
    <div className="min-h-screen pt-32 pb-16 flex flex-col lg:flex-row max-w-7xl mx-auto px-4 gap-8 relative">
      
      {/* Dev Toast */}
      {showDevMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-6 py-3 rounded-full backdrop-blur-md shadow-xl flex items-center gap-3 font-nebula font-bold">
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
                     <span className="text-[10px] font-nebula font-bold text-slate-500 uppercase tracking-widest">Network</span>
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
                                 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 font-nebula' 
                                 : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 font-nebula'
                              }`}
                            >
                               <div className="flex items-center gap-3">
                                  <item.icon size={16} className={openDropdown === item.id ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-400'} />
                                  <span className="text-[10px] font-black tracking-wide uppercase tracking-widest">{item.label}</span>
                               </div>
                               <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === item.id ? 'rotate-180 text-blue-500' : 'text-slate-600'}`} />
                            </button>
                            
                            {openDropdown === item.id && (
                               <div className="mt-1 mb-2 ml-3 pl-3 border-l border-white/5 space-y-0.5 animate-fade-in-up">
                                  {item.children.map((child) => (
                                    <button 
                                      key={child}
                                      onClick={() => scrollTo(item.id)}
                                      className="w-full text-left px-3 py-2 rounded-lg text-[9px] font-nebula font-black text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 uppercase tracking-widest"
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
          <div className="inline-block px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/30 mb-6 backdrop-blur-md">
             <span className="text-blue-500 font-nebula font-bold uppercase tracking-wider text-[10px]">Layer 1 Protocol v1.0.4</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-nebula font-black text-white mb-4 tracking-tighter leading-none text-fluid-gradient uppercase italic">
             Fluid Chain
          </h1>
          <h2 className="text-2xl md:text-5xl font-nebula font-black text-white/50 mb-10 tracking-tight uppercase italic">
             The Backbone of the New Internet
          </h2>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium max-w-2xl">
             High-performance sharded architecture designed for infinite scalability and zero-downtime decentralized hosting.
          </p>
          <div className="flex flex-col sm:flex-row lg:justify-start justify-center gap-6 flex-wrap">
               <button 
                  onClick={handleDevClick}
                  className="px-10 py-5 bg-blue-600 text-white font-nebula font-black rounded-full hover:bg-blue-500 transition-colors shadow-2xl shadow-blue-500/25 flex items-center justify-center gap-3 uppercase tracking-widest text-[12px]"
               >
                  <Code2 size={20} /> Build Now
               </button>
               
               <button 
                  onClick={handleDevClick}
                  className="px-10 py-5 bg-slate-900 text-white font-nebula font-black rounded-full hover:bg-slate-800 transition-colors border border-white/10 flex items-center justify-center gap-3 uppercase tracking-widest text-[12px]"
               >
                  <Search size={20} /> Explorer
               </button>
          </div>
        </section>

        {/* Key Stats */}
        <section id="stats" className="mb-24 scroll-card">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blockchainFeatures.map((stat, i) => (
                 <div key={i} className="bg-slate-900/50 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 hover:border-blue-500/50 transition-all group shadow-2xl">
                    <div className={`w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 text-blue-500 group-hover:scale-110 transition-transform shadow-inner`}>
                        <stat.icon size={32} />
                    </div>
                    <p className="text-slate-500 text-[10px] mb-3 font-nebula font-black uppercase tracking-widest">{stat.label}</p>
                    <div className="flex items-end justify-between mb-4">
                       <span className="text-4xl font-nebula font-black text-white tracking-tight text-glow-cyan uppercase italic">{stat.value}</span>
                       <span className="text-[10px] text-emerald-500 font-nebula font-black mb-2 tracking-widest uppercase">{stat.trend}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest opacity-60">{stat.desc}</p>
                 </div>
              ))}
           </div>
        </section>

        {/* Innovations */}
        <section id="nodes" className="bg-slate-900/40 py-20 px-8 rounded-[4rem] border border-white/10 mb-24 backdrop-blur-md">
           <h2 className="text-4xl font-nebula font-black text-center mb-16 text-white uppercase italic tracking-tighter">Protocol <span className="text-fluid-gradient">Innovations</span></h2>
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Layers, title: "Dynamic Sharding", desc: "Network partitions based on real-time load for linear horizontal scaling.", color: "text-blue-500" },
                { icon: Code2, title: "EVM Genesis", desc: "Native Solidity support with sharded parallel execution environment.", color: "text-emerald-400" },
                { icon: Shield, title: "Proof of Fluidity", desc: "Hybrid PoS + PoH consensus for sub-second deterministic finality.", color: "text-purple-400" }
              ].map((item, idx) => (
                <div key={idx} className="p-10 rounded-[2.5rem] bg-black/40 border border-white/5 hover:border-blue-500/30 transition-all group">
                   <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 ${item.color} group-hover:scale-110 transition-transform shadow-inner`}>
                      <item.icon size={28} />
                   </div>
                   <h3 className="text-lg font-nebula font-black mb-4 text-white uppercase italic tracking-tight">{item.title}</h3>
                   <p className="text-slate-500 leading-relaxed text-xs font-medium">
                      {item.desc}
                   </p>
                </div>
              ))}
           </div>
        </section>
      </main>
    </div>
  );
};

export default BlockchainPage;