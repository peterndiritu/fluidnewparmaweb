import React, { useState } from 'react';
import { 
  ChevronDown, BookOpen, Cpu, Globe, Coins, Wallet, Code2, 
  Terminal, ShieldCheck, Zap, Database, Layers, Landmark, 
  CreditCard, SmartphoneNfc, ArrowRight, RefreshCw, FileText, Search
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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>('core');

  const sidebarMenu = [
    { id: 'core', label: 'Core Protocol', icon: Cpu, items: ['Blockchain', 'Fluid Host', 'Tokenomics'] },
    { id: 'apps', label: 'Applications', icon: Wallet, items: ['Wallet App', 'Cards', 'DEX'] },
    { id: 'devs', label: 'Developers', icon: Code2, items: ['CLI', 'SDK', 'RPC'] }
  ];

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpenSections(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen pt-32 pb-24 relative flex flex-col lg:flex-row max-w-7xl mx-auto px-4 gap-8">
      
      {/* Left Sidebar Dropdown Navigation */}
      <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
        <div className="sticky top-32 w-full">
            <div className="bg-[#0F1115] border border-white/5 rounded-2xl p-2 shadow-2xl overflow-hidden">
               <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Docs</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
               </div>

               <div className="px-3 mb-2 relative">
                  <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                     type="text" 
                     placeholder="Search..." 
                     className="w-full bg-slate-900 border border-white/5 rounded-xl py-2 pl-9 pr-3 text-[10px] font-bold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
               </div>
               
               <div className="flex flex-col gap-1">
                   {sidebarMenu.map((menu) => (
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
                        
                        {openDropdown === menu.id && (
                           <div className="mt-1 mb-2 ml-3 pl-3 border-l border-white/5 space-y-0.5 animate-fade-in-up">
                              {menu.items.map((item) => (
                                <button 
                                  key={item}
                                  onClick={() => scrollToSection(item.toLowerCase().split(' ')[0])}
                                  className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                >
                                   <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors"></div>
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
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2 text-xs uppercase"><ShieldCheck size={14} className="text-emerald-500" /> Consensus</h4>
                  <ul className="text-[11px] space-y-1 font-medium"><li>• Proof of Fluidity</li><li>• Energy Efficient</li></ul>
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
            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              <p>Permanent storage layer utilizing an endowment model for one-time hosting payments.</p>
              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
                <Database className="text-indigo-500 shrink-0" size={20} />
                <p className="text-[11px]">Pay once in FLUID tokens to store data eternally across distributed validator nodes.</p>
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
            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              <p>Governance, Staking, and Utility pillars of the ecosystem.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {['Staking', 'Governance', 'Payments'].map(t => (
                   <div key={t} className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                      <span className="text-white font-black block text-xs uppercase mb-1">{t}</span>
                      <div className="h-1 w-8 bg-blue-500 mx-auto rounded-full"></div>
                   </div>
                 ))}
              </div>
            </div>
          </AccordionSection>

          <AccordionSection 
            title="For Developers" 
            id="cli"
            icon={Code2} 
            isOpen={openSections['dev']} 
            onToggle={() => toggleSection('dev')}
          >
            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden font-mono text-[10px]">
                <div className="bg-slate-800 px-4 py-2 flex justify-between items-center"><span className="text-slate-400 font-bold tracking-widest">Fluid CLI</span></div>
                <div className="p-4 space-y-1">
                  <div className="flex gap-2"><span className="text-emerald-500">$</span><span>fluid init --template nextjs</span></div>
                  <div className="flex gap-2"><span className="text-emerald-500">$</span><span>fluid deploy --permanent</span></div>
                </div>
              </div>
              <button className="flex items-center gap-2 text-blue-500 font-bold hover:text-blue-400 transition-all text-xs group">
                Access Dev Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </AccordionSection>
        </div>

        {/* Support CTA */}
        <div className="mt-20 p-10 bg-gradient-to-br from-blue-600/10 to-cyan-500/10 rounded-[3rem] border border-blue-500/20 text-center">
          <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter">Still have questions?</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm font-medium">Our developers are here to help you get started.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://discord.gg/cXes68B3Y" 
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-lg text-xs uppercase tracking-widest flex items-center"
            >
              Join Discord
            </a>
            <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl border border-slate-700 hover:bg-slate-800 transition-all text-xs uppercase tracking-widest">Support</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocsPage;