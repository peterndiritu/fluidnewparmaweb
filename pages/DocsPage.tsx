
import React, { useState } from 'react';
import { 
  ChevronDown, BookOpen, Cpu, Globe, Coins, Wallet, Code2, 
  Terminal, ShieldCheck, Zap, Database, Layers, Landmark, 
  CreditCard, SmartphoneNfc, ArrowRight, RefreshCw
} from 'lucide-react';

interface AccordionSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, icon: Icon, children, isOpen, onToggle }) => (
  <div className="mb-4 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
    <button 
      onClick={onToggle}
      className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
    >
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
      </div>
      <ChevronDown 
        size={20} 
        className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
      />
    </button>
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
      <div className="p-6 pt-0 border-t border-slate-200 dark:border-slate-800/50">
        {children}
      </div>
    </div>
  </div>
);

const DocsPage: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    blockchain: true,
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen size={14} />
            Documentation
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Fluid <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Knowledge Base</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Everything you need to know about building on and using the Fluid Protocol ecosystem.
          </p>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          
          {/* Blockchain Section */}
          <AccordionSection 
            title="Fluid Blockchain (L1)" 
            icon={Cpu} 
            isOpen={openSections['blockchain']} 
            onToggle={() => toggleSection('blockchain')}
          >
            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Fluid is a high-performance Layer-1 blockchain architecture designed to support the next generation of financial applications and permanent web infrastructure.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Zap size={16} className="text-blue-500" /> Performance
                  </h4>
                  <ul className="text-sm space-y-1 font-medium">
                    <li>• 2,000,000+ Peak TPS</li>
                    <li>• ~600ms Block Finality</li>
                    <li>• Linear Scalability via Sharding</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-500" /> Consensus
                  </h4>
                  <ul className="text-sm space-y-1 font-medium">
                    <li>• Proof of Fluidity (PoF)</li>
                    <li>• Energy Efficient Architecture</li>
                    <li>• Byzantine Fault Tolerant State Sync</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm italic">
                Fluid Chain utilizes dynamic sharding to partition the network state, allowing transaction throughput to increase proportionally as more nodes join the validator set.
              </p>
            </div>
          </AccordionSection>

          {/* Parmaweb Hosting Section */}
          <AccordionSection 
            title="Parmaweb Hosting" 
            icon={Globe} 
            isOpen={openSections['hosting']} 
            onToggle={() => toggleSection('hosting')}
          >
            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Parmaweb is the decentralized storage and hosting layer of Fluid. It provides a way to host websites and data permanently on the blockchain without recurring costs.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                  <Database className="text-indigo-500 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Permanent Storage Model</h4>
                    <p className="text-sm">Unlike traditional hosting, Parmaweb uses an endowment model. A one-time payment in FLUID tokens funds the perpetual storage of your data across the distributed node network.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                  <Layers className="text-purple-500 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Decentralized Content Delivery</h4>
                    <p className="text-sm">Websites are sharded and distributed globally. This ensures 100% uptime and complete censorship resistance. Your site lives as long as the Fluid network exists.</p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* Tokenomics Section */}
          <AccordionSection 
            title="Tokenomics & Economy" 
            icon={Coins} 
            isOpen={openSections['tokenomics']} 
            onToggle={() => toggleSection('tokenomics')}
          >
            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                The FLUID token is the native utility asset powering all protocol interactions, from network fees and staking to hosting payments.
              </p>
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Landmark size={18} className="text-amber-500" /> Utility Pillars
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <span className="text-amber-500 font-bold block text-lg">Staking</span>
                    <p className="text-xs mt-1">Secure the network and earn protocol rewards through PoF validation.</p>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-bold block text-lg">Governance</span>
                    <p className="text-xs mt-1">Vote on protocol upgrades and the allocation of the Endowment Treasury.</p>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold block text-lg">Payments</span>
                    <p className="text-xs mt-1">Universal currency for DEX swaps, hosting fees, and global card spending.</p>
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium">
                Total Supply: <span className="text-white">10,000,000 FLUID</span>
              </p>
            </div>
          </AccordionSection>

          {/* Super Wallet, DEX, Card, Fiat Section */}
          <AccordionSection 
            title="Wallet, DEX, Card & Fiat" 
            icon={Wallet} 
            isOpen={openSections['wallet']} 
            onToggle={() => toggleSection('wallet')}
          >
            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                The Super Wallet is the unified user interface for the Fluid ecosystem, bringing together non-custodial asset management and traditional financial rails.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 border border-white/5 bg-white/5 rounded-2xl hover:border-blue-500/20 transition-all">
                  <CreditCard className="text-blue-500 mb-3" size={24} />
                  <h4 className="font-bold text-white mb-2">Fluid Cards</h4>
                  <p className="text-sm">Physical and virtual cards that bridge your crypto holdings to millions of merchants worldwide with instant USD settlement.</p>
                </div>
                <div className="p-5 border border-white/5 bg-white/5 rounded-2xl hover:border-cyan-500/20 transition-all">
                  {/* Fixed missing RefreshCw import */}
                  <RefreshCw className="text-cyan-500 mb-3" size={24} />
                  <h4 className="font-bold text-white mb-2">Internal DEX</h4>
                  <p className="text-sm">Deep-liquidity trading protocol integrated directly into the wallet. Swap assets across chains with sub-cent fees.</p>
                </div>
                <div className="p-5 border border-white/5 bg-white/5 rounded-2xl hover:border-emerald-500/20 transition-all">
                  <Landmark className="text-emerald-500 mb-3" size={24} />
                  <h4 className="font-bold text-white mb-2">USD Banking Rails</h4>
                  <p className="text-sm">Seamlessly connect your bank account via global IBAN standards for instant fiat-to-crypto bridging.</p>
                </div>
                <div className="p-5 border border-white/5 bg-white/5 rounded-2xl hover:border-amber-500/20 transition-all">
                  <SmartphoneNfc className="text-amber-500 mb-3" size={24} />
                  <h4 className="font-bold text-white mb-2">Mobile Money</h4>
                  <p className="text-sm">Native support for regional mobile wallet settlement, ensuring access for emerging markets worldwide.</p>
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* Developers Section */}
          <AccordionSection 
            title="For Developers" 
            icon={Code2} 
            isOpen={openSections['dev']} 
            onToggle={() => toggleSection('dev')}
          >
            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                Fluid is designed to be developer-first with full EVM compatibility and advanced CLI tools for rapid deployment.
              </p>
              
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                  <span className="text-slate-400 uppercase font-bold tracking-widest">Fluid CLI</span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex gap-2"><span className="text-emerald-500">$</span><span>npm install -g @fluid/cli</span></div>
                  <div className="flex gap-2"><span className="text-emerald-500">$</span><span>fluid init --template nextjs</span></div>
                  <div className="flex gap-2"><span className="text-emerald-500">$</span><span>fluid deploy --permanent</span></div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-bold text-white flex items-center gap-2">
                    <Terminal size={14} className="text-blue-500" /> SDK & APIs
                  </h5>
                  <ul className="text-xs space-y-2">
                    <li className="flex items-start gap-2">• Web3.js / Ethers.js Support</li>
                    <li className="flex items-start gap-2">• Native Fluid SDK for React/TS</li>
                    <li className="flex items-start gap-2">• WebSocket State Streams</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h5 className="font-bold text-white flex items-center gap-2">
                    <Layers size={14} className="text-emerald-500" /> Infrastructure
                  </h5>
                  <ul className="text-xs space-y-2">
                    <li className="flex items-start gap-2">• Dedicated RPC Endpoints</li>
                    <li className="flex items-start gap-2">• Indexing Services (Subgraph)</li>
                    <li className="flex items-start gap-2">• Testnet Faucet Access</li>
                  </ul>
                </div>
              </div>

              <button className="flex items-center gap-2 text-blue-500 font-bold hover:text-blue-400 transition-all text-sm group">
                Access Developer Portal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </AccordionSection>

        </div>

        {/* Support CTA */}
        <div className="mt-20 p-10 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 rounded-[3rem] border border-blue-500/20 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Our community and developers are here to help you get started with the Fluid Protocol.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-lg">
              Join Discord
            </button>
            <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl border border-slate-700 hover:bg-slate-800 transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
