import React, { useState } from 'react';
import { 
  FileText, Shield, Zap, Globe, Layers, Cpu, 
  Database, Network, Lock, Workflow, ChevronRight,
  TrendingUp, BarChart, Server, Rocket, Binary,
  Landmark
} from 'lucide-react';

// Add comment to fix Landmark not found error
const SectionHeader = ({ title, icon: Icon, id }: { title: string, icon: any, id: string }) => (
  <div id={id} className="flex items-center gap-4 mb-8 pt-16 -mt-16 scroll-mt-24">
    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg">
      <Icon size={32} />
    </div>
    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{title}</h2>
  </div>
);

const WhitepaperPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('intro');

  const navigation = [
    { id: 'intro', label: '1. Introduction', icon: FileText },
    { id: 'l1', label: '2. Layer-1 Architecture', icon: Layers },
    { id: 'sharding', label: '3. Micro-Sharding', icon: Binary },
    { id: 'hosting', label: '4. Fluid Host Protocol', icon: Globe },
    { id: 'tokenomics', label: '5. Token Economy', icon: BarChart },
    { id: 'security', label: '6. Security & Consensus', icon: Shield },
  ];

  const scrollTo = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-950 flex flex-col lg:flex-row max-w-7xl mx-auto px-4 gap-12 relative">
      {/* Sidebar Navigation */}
      <aside className="lg:w-72 flex-shrink-0 hidden lg:block">
        <div className="sticky top-32 space-y-2 bg-slate-900/50 backdrop-blur-xl border border-white/5 p-4 rounded-[2.5rem] shadow-2xl">
          <div className="px-4 py-2 mb-4 border-b border-white/5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Table of Contents</span>
          </div>
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
                activeTab === item.id 
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
          <div className="mt-8 pt-4 border-t border-white/5">
             <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-950 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
                Download PDF <Rocket size={14} />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl prose dark:prose-invert prose-slate">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-8 backdrop-blur-sm">
             <span className="text-indigo-400 text-xs font-black tracking-[0.2em] uppercase">V 1.0.4 Technical Document</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none italic uppercase">
            Fluid <br/><span className="text-fluid-gradient">Genesis</span>.
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-medium">
            A comprehensive technical study of the first Layer-1 blockchain delivering sharded permanent hosting and sub-second deterministic finality.
          </p>
        </div>

        {/* 1. Introduction */}
        <section id="intro" className="mb-24">
          <SectionHeader title="Introduction" icon={FileText} id="intro" />
          <p className="text-slate-400 leading-relaxed text-lg font-medium">
            Fluid is engineered to bridge the gap between traditional web experiences and decentralized infrastructure. 
            The protocol introduces a novel consensus mechanism, <span className="text-white font-bold italic">Proof-of-Fluidity (PoF)</span>, 
            which combines the efficiency of Proof-of-Stake with the durability of decentralized storage verification.
          </p>
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 my-10 shadow-xl">
             <h4 className="text-white font-black uppercase mb-4 italic flex items-center gap-2">
                <Zap size={18} className="text-indigo-400" /> Executive Summary
             </h4>
             <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex items-start gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                   <span>Peak throughput exceeding 2.4 million transactions per second (TPS).</span>
                </li>
                <li className="flex items-start gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                   <span>Deterministic finality achieved in approximately 600ms.</span>
                </li>
                <li className="flex items-start gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                   <span>Infinite data storage capability via integrated micro-sharding.</span>
                </li>
             </ul>
          </div>
        </section>

        {/* 2. Layer-1 Architecture */}
        <section id="l1" className="mb-24">
          <SectionHeader title="Layer-1 Architecture" icon={Layers} id="l1" />
          <p className="text-slate-400 leading-relaxed text-lg font-medium mb-8">
            The base layer of Fluid is built on a modular framework. Unlike monolithic blockchains, Fluid separates the 
            execution environment from the data availability and settlement layers.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
             <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
                   <Cpu size={20} />
                </div>
                <h5 className="text-white font-black uppercase mb-2 text-xs">Execution Engine</h5>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Parallel processing architecture capable of handling thousands of smart contract calls simultaneously across sharded clusters.</p>
             </div>
             <div className="p-6 bg-slate-900 border border-white/5 rounded-3xl">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
                   <Network size={20} />
                </div>
                <h5 className="text-white font-black uppercase mb-2 text-xs">P2P Mesh Network</h5>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Ultra-low latency gossiping protocol ensuring that block propagation remains consistent across global sharded nodes.</p>
             </div>
          </div>
        </section>

        {/* 3. Micro-Sharding */}
        <section id="sharding" className="mb-24">
          <SectionHeader title="Micro-Sharding" icon={Binary} id="sharding" />
          <p className="text-slate-400 leading-relaxed text-lg font-medium mb-8">
            Fluid utilizes dynamic micro-sharding. As network demand increases, the chain programmatically partitions 
            itself into smaller sub-units, each capable of independently processing transactions and storing data.
          </p>
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]"></div>
             <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="flex-1">
                   <h4 className="text-2xl font-black text-white mb-4 uppercase italic">Horizontal Scaling</h4>
                   <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">
                      Every node in the Fluid network is assigned to a specific shard. 
                      Cross-shard communication is handled through an atomic bridging mechanism that ensures 
                      mathematical consistency between distinct network segments.
                   </p>
                   <div className="flex gap-3">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-400">Atomic Compsability</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-400">State Partitioning</span>
                   </div>
                </div>
                <div className="w-32 h-32 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Workflow size={48} className="text-indigo-500 animate-pulse-slow" />
                </div>
             </div>
          </div>
        </section>

        {/* 4. Fluid Host Protocol */}
        <section id="hosting" className="mb-24">
          <SectionHeader title="Fluid Host Protocol" icon={Globe} id="hosting" />
          <p className="text-slate-400 leading-relaxed text-lg font-medium mb-8">
            Integrated directly into the L1 consensus is the Fluid Host Protocol. 
            By leveraging the network's sharding capabilities, Fluid allows developers to store web assets 
            (HTML, JS, CSS, Media) permanently with zero recurring costs.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
             {[
                { title: 'One-Time Payment', desc: 'Pay once in FLUID to host data indefinitely, fueled by the endowment treasury model.', icon: Landmark },
                { title: 'Censorship Resistance', desc: 'Data is sharded across thousands of nodes, making removal impossible for any central entity.', icon: Lock },
                { title: 'Integrated CDN', desc: 'The network acts as its own content delivery network, serving assets from the nearest node.', icon: Database }
             ].map((feature, i) => (
                <div key={i} className="p-8 bg-slate-900 border border-white/5 rounded-3xl shadow-xl">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 mb-6 shadow-inner">
                      <feature.icon size={24} />
                   </div>
                   <h5 className="text-white font-black uppercase mb-2 text-sm italic">{feature.title}</h5>
                   <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
             ))}
          </div>
        </section>

        {/* 5. Token Economy */}
        <section id="tokenomics" className="mb-24">
          <SectionHeader title="Token Economy" icon={BarChart} id="tokenomics" />
          <p className="text-slate-400 leading-relaxed text-lg font-medium mb-10">
            The FLUID token serves as the primary unit of value for the ecosystem. 
            It is used for transaction fees, staking rewards, and as a prerequisite for network resource allocation.
          </p>
          <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 shadow-2xl">
             <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                <div>
                   <h4 className="text-3xl font-black text-white tracking-tighter uppercase italic">1,000,000,000</h4>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Fixed Supply</span>
                </div>
                <div className="text-right">
                   <h4 className="text-3xl font-black text-emerald-500 tracking-tighter uppercase italic">Deflationary</h4>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Emission Model</span>
                </div>
             </div>
             <div className="space-y-6">
                <div className="flex items-center justify-between text-xs font-black uppercase">
                   <span className="text-slate-400">Genesis Presale</span>
                   <span className="text-white italic">40%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full w-[40%] bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                </div>
                
                <div className="flex items-center justify-between text-xs font-black uppercase">
                   <span className="text-slate-400">Staking & Nodes</span>
                   <span className="text-white italic">30%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full w-[30%] bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>

                <div className="flex items-center justify-between text-xs font-black uppercase">
                   <span className="text-slate-400">Ecosystem Growth</span>
                   <span className="text-white italic">30%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full w-[30%] bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                </div>
             </div>
          </div>
        </section>

        {/* 6. Security & Consensus */}
        <section id="security" className="mb-24">
          <SectionHeader title="Security & Consensus" icon={Shield} id="security" />
          <p className="text-slate-400 leading-relaxed text-lg font-medium">
            Fluid implements <span className="text-white italic font-bold">Mathematical Finality</span>. 
            Once a block is verified by 2/3 of the validator set, it is considered irreversible. 
            The Proof-of-Fluidity mechanism requires nodes to prove they are actively hosting valid shards 
            to remain eligible for rewards, creating a symbiotic link between network utility and security.
          </p>
        </section>

        {/* Final Conclusion */}
        <div className="pt-20 border-t border-white/5 text-center">
           <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter italic">Join the <span className="text-fluid-gradient">Infinite</span> Network.</h3>
           <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-10 py-5 bg-white text-slate-950 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl">
              Back to Start
           </button>
        </div>
      </main>
    </div>
  );
};

export default WhitepaperPage;