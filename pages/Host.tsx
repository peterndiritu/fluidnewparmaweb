import React, { useState } from 'react';
import HowItWorks from '../components/HowItWorks';
import { Server, Database, Cloud, Lock, Terminal, Cpu, Globe, ArrowRight, ChevronDown, Rocket, Layers, Code2, Search, CheckCircle2, ShoppingCart } from 'lucide-react';

const HostPage: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>('start');
  const [domainQuery, setDomainQuery] = useState('');
  const [isSearchingDomains, setIsSearchingDomains] = useState(false);
  const [showDomainResults, setShowDomainResults] = useState(false);

  const menuItems = [
    { id: 'domains', label: 'Domains', icon: Globe, children: ['Search', '.fluid Handle', 'DNS Bridge'] },
    { id: 'start', label: 'Getting Started', icon: Rocket, children: ['CLI Setup', 'Initialization', 'Deployment'] },
    { id: 'tech', label: 'Technical Specs', icon: Layers, children: ['Micro-Sharding', 'Security', 'Performance'] },
    { id: 'api', label: 'API Reference', icon: Code2, children: ['End points', 'Webhooks', 'SDKs'] }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleDomainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainQuery) return;
    setIsSearchingDomains(true);
    setShowDomainResults(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsSearchingDomains(false);
      setShowDomainResults(true);
    }, 1500);
  };

  const baseName = domainQuery.split('.')[0] || 'example';

  return (
    <div className="min-h-screen pt-28 pb-16 flex flex-col lg:flex-row max-w-7xl mx-auto px-4 gap-8">
      
      {/* Left Sidebar Dropdown Navigation */}
      <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
        <div className="sticky top-32 w-full">
            <div className="bg-[#0F1115] border border-white/5 rounded-2xl p-2 shadow-2xl overflow-hidden">
               <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hosting</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
               </div>
               
               <div className="flex flex-col gap-1">
                   {menuItems.map((item) => (
                     <div key={item.id} className="group">
                        <button 
                          onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 border ${
                             openDropdown === item.id 
                             ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                             : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                          }`}
                        >
                           <div className="flex items-center gap-3">
                              <item.icon size={16} className={openDropdown === item.id ? 'text-indigo-500' : 'text-slate-500 group-hover:text-slate-400'} />
                              <span className="text-xs font-bold tracking-wide">{item.label}</span>
                           </div>
                           <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === item.id ? 'rotate-180 text-indigo-500' : 'text-slate-600'}`} />
                        </button>
                        
                        {openDropdown === item.id && (
                           <div className="mt-1 mb-2 ml-3 pl-3 border-l border-white/5 space-y-0.5 animate-fade-in-up">
                              {item.children.map((child) => (
                                <button 
                                  key={child}
                                  onClick={() => scrollTo(item.id)}
                                  className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                >
                                   <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors"></div>
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
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Hero */}
        <section className="max-w-full text-center lg:text-left mb-24 px-4 lg:px-0">
           <div className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-6 animate-pulse">
              <span className="text-indigo-500 font-bold uppercase tracking-wider text-sm">Fluid Host Protocol V1</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6">
              The Permanent Web. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Unstoppable Hosting.</span>
           </h1>
           <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-10 font-medium leading-relaxed">
              Deploy full-stack applications to the Fluid Blockchain. Censorship-resistant, 100% uptime, and one-time payment for eternal storage.
           </p>
           <div className="flex flex-col sm:flex-row lg:justify-start justify-center gap-4">
               <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25">
                  <Terminal size={20} /> Start Deploying
               </button>
               <button className="px-8 py-4 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  Read Documentation
               </button>
           </div>
        </section>

        {/* DOMAIN SEARCH SECTION */}
        <section id="domains" className="max-w-5xl mx-auto px-4 mb-24 lg:px-0">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold uppercase tracking-wider mb-4">
                   <Globe size={12} /> Domain Registrar
                </div>
                <h2 className="text-3xl font-black text-white mb-4">Claim Your Web3 Identity</h2>
                <p className="text-slate-400 text-sm max-w-lg mx-auto">Search and register domains directly on Fluid. Get a .fluid domain free with your hosting plan, or purchase traditional TLDs.</p>
            </div>

            {/* Search Box */}
            <form onSubmit={handleDomainSearch} className="relative max-w-2xl mx-auto mb-12 z-10">
                <div className="relative flex items-center group">
                    <Search className="absolute left-6 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={24} />
                    <input 
                        type="text" 
                        value={domainQuery}
                        onChange={(e) => setDomainQuery(e.target.value)}
                        placeholder="Search for your perfect domain..." 
                        className="w-full bg-black/40 border border-white/10 rounded-full py-5 pl-16 pr-36 text-xl font-bold text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <button 
                      type="submit" 
                      disabled={isSearchingDomains}
                      className="absolute right-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full px-8 py-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSearchingDomains ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Checking
                          </>
                        ) : 'Search'}
                    </button>
                </div>
            </form>

            {/* Results */}
            {showDomainResults && (
                <div className="max-w-3xl mx-auto space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                    {/* .fluid Result (Hero) */}
                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl relative overflow-hidden group cursor-pointer hover:border-indigo-500/50 transition-all">
                        <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-black text-white">{baseName}<span className="text-indigo-400">.fluid</span></span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-wide">Available</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                                  <Lock size={10} /> Permanent decentralized ownership
                                </p>
                            </div>
                        </div>
                        <div className="text-right relative z-10">
                            <div className="text-2xl font-black text-emerald-400">FREE</div>
                            <p className="text-[10px] text-slate-500 line-through font-bold uppercase tracking-wider">$500/yr value</p>
                        </div>
                        <button className="absolute inset-0 z-20 focus:outline-none" onClick={() => alert('Redirecting to claim flow...')}></button>
                    </div>

                    <div className="h-px bg-white/5 my-4 mx-4"></div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">Traditional Domains</p>

                    {/* Other TLDs */}
                    {[
                        { tld: '.com', price: '$12.99', old: '$15.99', popular: true },
                        { tld: '.ai', price: '$65.00', old: '$80.00', popular: false },
                        { tld: '.xyz', price: '$1.99', old: '$9.99', popular: false },
                        { tld: '.io', price: '$35.00', old: '$45.00', popular: false }
                    ].map((domain) => (
                        <div key={domain.tld} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-slate-600 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
                                    <Globe size={18} />
                                </div>
                                <div>
                                  <span className="text-lg font-bold text-slate-300">{baseName}<span className="text-slate-500">{domain.tld}</span></span>
                                  {domain.popular && <span className="ml-2 text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase">Popular</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 sm:gap-6">
                                <div className="text-right">
                                    <div className="text-sm font-bold text-white">{domain.price}<span className="text-[10px] text-slate-500 font-normal">/yr</span></div>
                                    <div className="text-[10px] text-slate-600 line-through font-bold">{domain.old}</div>
                                </div>
                                <button className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors">
                                    <ShoppingCart size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </section>

        {/* HOW HOSTING WORKS - Deep Dive Architecture Section */}
        <HowItWorks />

        {/* Terminal Visual */}
        <section id="start" className="max-w-5xl mx-auto px-4 mb-24 lg:px-0">
           <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm">
              <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 <div className="ml-4 text-slate-400">user@dev:~/my-fluid-app</div>
              </div>
              <div className="p-6 text-slate-300 space-y-2">
                 <div className="flex">
                    <span className="text-green-400 mr-2">$</span>
                    <span>npm install -g fluid-cli</span>
                 </div>
                 <div className="text-slate-500">
                    + fluid-cli@1.0.4 <br/>
                    added 12 packages in 2s
                 </div>
                 <div className="flex">
                    <span className="text-green-400 mr-2">$</span>
                    <span>fluid init</span>
                 </div>
                 <div className="text-blue-400">
                    ? Project name: <span className="text-white">awesome-dapp</span> <br/>
                    ? Framework: <span className="text-white">React / Next.js</span> <br/>
                    ? Storage: <span className="text-white">Permanent (Fluid Host)</span>
                 </div>
                 <div className="flex">
                    <span className="text-green-400 mr-2">$</span>
                    <span>fluid deploy</span>
                 </div>
                 <div className="text-slate-300">
                    {'>'} Building project... <br/>
                    {'>'} Uploading assets to Shard 1... <br/>
                    {'>'} Uploading assets to Shard 2... <br/>
                    {'>'} Verifying integrity...
                 </div>
                 <div className="text-emerald-400 font-bold mt-4">
                    ✔ Deployment Successful! <br/>
                    Access your app at: <a href="#" className="underline">https://fluid.link/awesome-dapp</a>
                 </div>
                 <div className="flex animate-pulse">
                    <span className="text-green-400 mr-2">$</span>
                    <span className="w-3 h-5 bg-slate-500 block"></span>
                 </div>
              </div>
           </div>
        </section>

        {/* Features Grid */}
        <section id="tech" className="bg-white dark:bg-slate-900/50 py-24 border-y border-slate-200 dark:border-slate-800 rounded-[3rem] px-8">
           <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-extrabold text-center mb-16 text-slate-900 dark:text-white uppercase tracking-tighter">Why Host on Fluid?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 
                 <div className="p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 text-indigo-500 group-hover:scale-110 transition-transform">
                       <Lock size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white uppercase tracking-tight">Censorship Resistant</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                       Data is stored immutably across a distributed network of nodes. No central authority can take your site down.
                    </p>
                 </div>

                 <div className="p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                       <Cloud size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white uppercase tracking-tight">100% Uptime</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                       Redundant sharding ensures your content is always available, even if multiple nodes go offline simultaneously.
                    </p>
                 </div>

                 <div className="p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform">
                       <Database size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white uppercase tracking-tight">One-Time Payment</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                       Pay once in FLUID tokens to store data forever. No monthly subscription fees for storage.
                    </p>
                 </div>

                 <div className="p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                       <Globe size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white uppercase tracking-tight">Global CDN</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                       Built-in content delivery network serves your dApp from the node closest to the user for blazing fast speeds.
                    </p>
                 </div>

                 <div className="p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform">
                       <Cpu size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white uppercase tracking-tight">Serverless Compute</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                       Run serverless functions directly on-chain for dynamic applications and backend logic.
                    </p>
                 </div>

                 <div className="p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6 text-pink-500 group-hover:scale-110 transition-transform">
                       <ArrowRight size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white uppercase tracking-tight">GitHub Deploy</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                       CI/CD integration allows you to deploy from GitHub automatically with every commit.
                    </p>
                 </div>

              </div>
           </div>
        </section>
      </main>
    </div>
  );
};

export default HostPage;