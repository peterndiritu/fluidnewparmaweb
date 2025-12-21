
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronDown, BookOpen, Cpu, Globe, Coins, Wallet, Code2, 
  Terminal, ShieldCheck, Zap, Database, Layers, Landmark, 
  CreditCard, RefreshCw, Search, Box, Network
} from 'lucide-react';

interface AccordionSectionProps {
  title: string;
  id: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, id, icon: Icon, children, isOpen, onToggle }) => (
  <div id={id} className="mb-4 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm transition-all hover:border-slate-300 dark:hover:border-slate-700 scroll-mt-32">
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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ 'blockchain': true });
  const [openDropdown, setOpenDropdown] = useState<string | null>('core');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Memoize static menu configuration to prevent re-renders
  const sidebarMenu = useMemo(() => [
    { id: 'core', label: 'Core Protocol', icon: Cpu, items: ['Blockchain', 'Fluid Host', 'Tokenomics'] },
    { id: 'apps', label: 'Applications', icon: Wallet, items: ['Wallet App', 'Cards', 'DEX'] },
    { id: 'devs', label: 'Developers', icon: Code2, items: ['CLI', 'SDK', 'RPC'] }
  ], []);

  const filteredMenu = useMemo(() => {
    if (!searchQuery) return sidebarMenu;
    
    return sidebarMenu.map(category => {
      // If category matches, include all items
      if (category.label.toLowerCase().includes(searchQuery.toLowerCase())) {
        return category;
      }
      
      // Otherwise filter items
      const matchingItems = category.items.filter(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (matchingItems.length > 0) {
        return { ...category, items: matchingItems };
      }
      return null;
    }).filter(Boolean) as typeof sidebarMenu;
  }, [searchQuery, sidebarMenu]);

  // Safe effect for auto-expanding dropdowns
  useEffect(() => {
    if (searchQuery && filteredMenu.length > 0) {
      const firstMatchId = filteredMenu[0].id;
      setOpenDropdown(prev => prev === firstMatchId ? prev : firstMatchId);
    }
  }, [searchQuery, filteredMenu]);

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getSectionId = (itemName: string) => {
    const map: Record<string, string> = {
      'Blockchain': 'blockchain',
      'Fluid Host': 'fluid',
      'Tokenomics': 'tokenomics',
      'Wallet App': 'wallet',
      'Cards': 'cards',
      'DEX': 'dex',
      'CLI': 'cli',
      'SDK': 'sdk',
      'RPC': 'rpc'
    };
    return map[itemName] || itemName.toLowerCase().replace(/\s+/g, '-');
  };

  const scrollToSection = (itemName: string) => {
    const id = getSectionId(itemName);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setOpenSections(prev => ({ ...prev, [id]: true }));
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative flex flex-col lg:flex-row max-w-7xl mx-auto px-4 gap-8">
      
      {/* Left Sidebar Dropdown Navigation */}
      <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
        <div className="sticky top-32 w-full">
            <div className="bg-[#0F1115] border border-white/5 rounded-2xl p-2 shadow-2xl overflow-hidden transition-all duration-300">
               <div 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="px-4 py-3 border-b border-white/5 flex items-center justify-between mb-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors"
               >
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Docs</span>
                     <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
               </div>

               <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="px-3 mb-2 relative">
                      <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                         type="text" 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         placeholder="Search docs..." 
                         className="w-full bg-slate-900 border border-white/5 rounded-xl py-2 pl-9 pr-3 text-[10px] font-bold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                      />
                   </div>
                   
                   <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                       {filteredMenu.length === 0 && (
                          <div className="p-4 text-center text-xs text-slate-500">No results found</div>
                       )}
                       {filteredMenu.map((menu) => (
                         <div key={menu.id} className="group">
                            <button 
                              onClick={() => setOpenDropdown(openDropdown === menu.id ? null : menu.id)}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 border ${
                                 openDropdown === menu.id 
                                 ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                                 : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                              }`}
                            >
                               <div className="flex items-center gap-3">
                                  <menu.icon size={16} className={openDropdown === menu.id ? 'text-indigo-500' : 'text-slate-500 group-hover:text-slate-400'} />
                                  <span className="text-xs font-bold tracking-wide">{menu.label}</span>
                               </div>
                               <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === menu.id ? 'rotate-180 text-indigo-500' : 'text-slate-600'}`} />
                            </button>
                            
                            {(openDropdown === menu.id || searchQuery) && (
                               <div className="mt-1 mb-2 ml-3 pl-3 border-l border-white/5 space-y-0.5 animate-fade-in-up">
                                  {menu.items.map((item) => (
                                    <button 
                                      key={item}
                                      onClick={() => scrollToSection(item)}
                                      className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                    >
                                       <div className={`w-1 h-1 rounded-full transition-colors ${openSections[getSectionId(item)] ? 'bg-indigo-500 scale-150' : 'bg-slate-700 group-hover:bg-indigo-500'}`}></div>
                                       {item}
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
        {/* Header */}
        <div className="text-center lg:text-left mb-16 px-4 lg:px-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen size={14} />
            Documentation
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-none">
            Fluid <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Knowledge Base</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">
            Everything you need to know about building on and using the Fluid Protocol ecosystem.
          </p>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          <AccordionSection 
            title="Fluid Blockchain (L1)" 
            id="blockchain"
            icon={Cpu} 
            isOpen={openSections['blockchain']} 
            onToggle={() => toggleSection('blockchain')}
          >
            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              <p>Fluid is a high-performance Layer-1 blockchain architecture designed to support the next generation of financial applications.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2 text-xs uppercase"><Zap size={14} className="text-blue-500" /> Performance</h4>
                  <ul className="text-[11px] space-y-1 font-medium"><li>• 2,000,000+ Peak TPS</li><li>• ~600ms Finality</li></ul>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2 text-xs uppercase"><ShieldCheck size={14} className="text-blue-500" /> Consensus</h4>
                  <ul className="text-[11px] space-y-1 font-medium"><li>• Proof of Fluidity (PoF)</li><li>• Dynamic Sharding</li></ul>
                </div>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Fluid Host" 
            id="fluid"
            icon={Globe} 
            isOpen={openSections['fluid']} 
            onToggle={() => toggleSection('fluid')}
          >
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              <p>A decentralized, censorship-resistant web hosting protocol that ensures your dApps are always accessible.</p>
              <div className="flex gap-4 items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                 <Database size={24} className="text-emerald-500" />
                 <div>
                    <h4 className="font-bold text-white">Permanent Storage</h4>
                    <p className="text-xs">Pay once in FLUID tokens, store forever. Content is distributed across thousands of nodes.</p>
                 </div>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Tokenomics" 
            id="tokenomics"
            icon={Coins} 
            isOpen={openSections['tokenomics']} 
            onToggle={() => toggleSection('tokenomics')}
          >
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              <p>The FLUID token is the native utility currency of the ecosystem, used for gas fees, governance, and hosting payments.</p>
              <ul className="list-disc pl-5 space-y-2">
                 <li><strong>Max Supply:</strong> 10,000,000,000 FLD</li>
                 <li><strong>Deflationary Mechanism:</strong> 50% of storage fees are burned.</li>
                 <li><strong>Staking Yield:</strong> Validator rewards sourced from transaction fees.</li>
              </ul>
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Wallet App" 
            id="wallet"
            icon={Wallet} 
            isOpen={openSections['wallet']} 
            onToggle={() => toggleSection('wallet')}
          >
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              <p>The official non-custodial wallet for the Fluid ecosystem. Available on iOS, Android, and Desktop.</p>
              <div className="flex flex-wrap gap-2">
                 <span className="px-2 py-1 bg-slate-800 rounded text-xs text-white border border-slate-700">Biometric Security</span>
                 <span className="px-2 py-1 bg-slate-800 rounded text-xs text-white border border-slate-700">Hardware Support</span>
                 <span className="px-2 py-1 bg-slate-800 rounded text-xs text-white border border-slate-700">Multi-Chain</span>
              </div>
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Fluid Cards" 
            id="cards"
            icon={CreditCard} 
            isOpen={openSections['cards']} 
            onToggle={() => toggleSection('cards')}
          >
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              <p>Spend your crypto instantly anywhere in the world. Fluid Cards convert your assets to fiat in real-time at the point of sale.</p>
            </div>
          </AccordionSection>

           <AccordionSection 
            title="Fluid DEX" 
            id="dex"
            icon={RefreshCw} 
            isOpen={openSections['dex']} 
            onToggle={() => toggleSection('dex')}
          >
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              <p>A native decentralized exchange embedded in the protocol, enabling high-speed swaps with minimal slippage.</p>
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Command Line Interface (CLI)" 
            id="cli"
            icon={Terminal} 
            isOpen={openSections['cli']} 
            onToggle={() => toggleSection('cli')}
          >
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              <p>Manage your node, deploy contracts, and interact with the network directly from your terminal.</p>
              <div className="p-4 bg-black rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                 $ fluid init my-project<br/>
                 $ fluid deploy --network mainnet
              </div>
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Fluid SDK" 
            id="sdk"
            icon={Box} 
            isOpen={openSections['sdk']} 
            onToggle={() => toggleSection('sdk')}
          >
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              <p>JavaScript and Python SDKs for integrating Fluid Protocol features into your own applications.</p>
            </div>
          </AccordionSection>

          <AccordionSection 
            title="RPC & API" 
            id="rpc"
            icon={Network} 
            isOpen={openSections['rpc']} 
            onToggle={() => toggleSection('rpc')}
          >
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              <p>Public RPC endpoints for connecting to the Fluid Mainnet and Testnet.</p>
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                     <div>
                        <span className="text-slate-500 block mb-1">Mainnet RPC</span>
                        <code className="bg-black px-2 py-1 rounded text-purple-400">https://rpc.fluidchain.org</code>
                     </div>
                     <div>
                        <span className="text-slate-500 block mb-1">Chain ID</span>
                        <code className="text-white">7777</code>
                     </div>
                  </div>
              </div>
            </div>
          </AccordionSection>

        </div>
      </main>
    </div>
  );
};

export default DocsPage;
