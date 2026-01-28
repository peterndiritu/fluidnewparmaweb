
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
    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{title}</h2>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <FileText size={14} /> Whitepaper v1.0
          </div>
          <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tight italic">Technical <span className="text-fluid-gradient">Manifesto</span></h1>
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            An in-depth analysis of the Fluid Protocol: A sharded Layer-1 blockchain with integrated permanent hosting.
          </p>
        </div>

        <SectionHeader id="intro" title="Introduction" icon={FileText} />
        <p>The Fluid Protocol represents a paradigm shift in decentralized infrastructure. By combining high-throughput sharded transaction processing with permanent, censorship-resistant web hosting, Fluid provides a complete stack for the next generation of the internet.</p>

        <SectionHeader id="l1" title="Layer-1 Architecture" icon={Layers} />
        <p>Fluid utilizes a hybrid consensus mechanism known as Proof-of-Fluidity, which optimizes for both security and deterministic finality.</p>

        <SectionHeader id="sharding" title="Micro-Sharding" icon={Binary} />
        <p>Our micro-sharding approach allows for linear scalability, enabling the network to process millions of transactions per second as more nodes join the network.</p>

        <SectionHeader id="hosting" title="Fluid Host Protocol" icon={Globe} />
        <p>Fluid Host is a decentralized storage layer that ensures permanent data availability through a one-time endowment payment model.</p>

        <SectionHeader id="tokenomics" title="Token Economy" icon={BarChart} />
        <p>The FLD token facilitates governance, secures the network through staking, and serves as the utility currency for the hosting protocol.</p>

        <SectionHeader id="security" title="Security & Consensus" icon={Shield} />
        <p>The protocol employs ZK-STARK proofs to verify state transitions across shards without compromising on decentralization.</p>
      </main>
    </div>
  );
};

export default WhitepaperPage;
