import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, Wallet, ArrowRightLeft, CreditCard, Globe, 
  Send, Plus, LogOut, Search, Bell, X 
} from 'lucide-react';

interface FluidWalletAppProps {
  onNavigate: (page: string) => void;
  initialView?: string;
}

const FluidWalletApp: React.FC<FluidWalletAppProps> = ({ onNavigate, initialView = 'assets' }) => {
  const [view, setView] = useState(initialView);
  const [showFiatModal, setShowFiatModal] = useState(false);

  useEffect(() => {
    if (initialView) setView(initialView);
  }, [initialView]);

  const assets = [
    { symbol: 'ETH', name: 'Ethereum', balance: '1.45', value: '$2,650.45', change: '+2.4%' },
    { symbol: 'FLD', name: 'Fluid', balance: '15,000', value: '$1,200.00', change: '+12.5%' },
    { symbol: 'USDT', name: 'Tether', balance: '450.00', value: '$450.00', change: '0.0%' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center">
       <div className="w-full max-w-6xl h-[800px] bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl flex overflow-hidden relative">
          
          {/* Sidebar */}
          <div className="w-64 bg-slate-950/50 border-r border-slate-800 p-6 flex flex-col hidden md:flex">
             <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
                <span className="font-bold text-white text-lg">Fluid App</span>
             </div>

             <nav className="space-y-2 flex-grow">
                {[
                  { id: 'assets', label: 'Assets', icon: Wallet },
                  { id: 'dex', label: 'Swap (DEX)', icon: ArrowRightLeft },
                  { id: 'cards', label: 'Cards', icon: CreditCard },
                  { id: 'hosting', label: 'dApps', icon: Globe },
                ].map((item) => (
                   <button 
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                         view === item.id 
                         ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                         : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }`}
                   >
                      <item.icon size={18} />
                      {item.label}
                   </button>
                ))}
             </nav>

             <button onClick={() => onNavigate('home')} className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white transition-colors font-bold text-sm mt-auto">
                <LogOut size={18} /> Exit App
             </button>
          </div>

          {/* Main Content */}
          <div className="flex-grow flex flex-col overflow-hidden relative">
             {/* Top Bar */}
             <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md z-10">
                <div className="flex items-center gap-4">
                    <button className="md:hidden text-slate-400" onClick={() => onNavigate('home')}><LogOut size={20}/></button>
                    <h2 className="text-xl font-bold text-white capitalize">{view === 'hosting' ? 'dApps' : view}</h2>
                </div>
                <div className="flex items-center gap-4">
                   <div className="hidden sm:flex items-center relative">
                      <Search size={16} className="absolute left-3 text-slate-500" />
                      <input type="text" placeholder="Search..." className="bg-slate-800 border-none rounded-full py-2 pl-9 pr-4 text-sm text-white focus:ring-1 focus:ring-blue-500 w-48" />
                   </div>
                   <button className="p-2 text-slate-400 hover:text-white relative">
                      <Bell size={20} />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                   </button>
                   <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full border-2 border-slate-900"></div>
                </div>
             </header>

             {/* Scrollable Content */}
             <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar">
                
                {view === 'assets' && (
                   <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
                      {/* Total Balance Card */}
                      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-32 blur-3xl"></div>
                         <div className="relative z-10">
                            <span className="text-blue-100 font-medium text-sm">Total Balance</span>
                            <div className="text-4xl font-black mt-2 mb-6">$4,300.45</div>
                            <div className="flex gap-4">
                               <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-md py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                  <Send size={16} /> Send
                               </button>
                               <button 
                                  onClick={() => setShowFiatModal(true)}
                                  className="flex-1 bg-white text-blue-600 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg hover:bg-slate-100"
                               >
                                  <Plus size={16} /> Add Funds
                               </button>
                            </div>
                         </div>
                      </div>

                      {/* Crypto List */}
                      <div>
                         <h3 className="text-lg font-bold text-white mb-4">Your Assets</h3>
                         <div className="space-y-3">
                            {assets.map((asset, index) => (
                               <div key={asset.symbol} className="relative overflow-hidden flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer group">
                                  {/* Shimmer Overlay */}
                                  <div 
                                      className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent z-0 pointer-events-none" 
                                      style={{ animationDelay: `${index * 0.2}s` }}
                                  ></div>

                                  <div className="flex items-center gap-4 relative z-10">
                                     <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs">{asset.symbol}</div>
                                     <div>
                                        <div className="font-bold text-white">{asset.name}</div>
                                        <div className="text-xs text-slate-400">{asset.balance} {asset.symbol}</div>
                                     </div>
                                  </div>
                                  <div className="text-right relative z-10">
                                     <div className="font-bold text-white">{asset.value}</div>
                                     <div className="text-xs text-emerald-400">{asset.change}</div>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>
                )}

                {view === 'dex' && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-fade-in-up">
                        <ArrowRightLeft size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-white mb-2">Decentralized Exchange</h3>
                        <p className="max-w-md text-center">Swap tokens instantly with low fees directly from your wallet. Coming soon to the web interface.</p>
                    </div>
                )}

                {view === 'cards' && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-fade-in-up">
                        <CreditCard size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-white mb-2">Fluid Cards</h3>
                        <p className="max-w-md text-center">Manage your physical and virtual debit cards. Freeze, unfreeze, and set spending limits.</p>
                    </div>
                )}

                {view === 'hosting' && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-fade-in-up">
                        <Globe size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-white mb-2">dApps & Hosting</h3>
                        <p className="max-w-md text-center">Deploy and manage your decentralized applications on the Fluid permanent storage network.</p>
                    </div>
                )}
             </div>

             {/* Fiat On-ramp Modal */}
             {showFiatModal && (
                <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
                   <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                      <button 
                         onClick={() => setShowFiatModal(false)}
                         className="absolute top-4 right-4 text-slate-500 hover:text-white"
                      >
                         <X size={20} />
                      </button>
                      
                      <h3 className="text-xl font-bold text-white mb-6">Add Funds</h3>
                      
                      <div className="space-y-5">
                           <div>
                              <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-1 block">Phone Number / Email</label>
                              <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" placeholder="+1 555 000 0000 or user@example.com" />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-1 block">Provider</label>
                              <div className="relative">
                                 <select className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none transition-all">
                                    <option>PayPal</option>
                                    <option>Venmo</option>
                                    <option>Cash App</option>
                                    <option>Revolut</option>
                                    <option>M-Pesa</option>
                                    <option>MTN Mobile Money</option>
                                    <option>Airtel Money</option>
                                    <option>Orange Money</option>
                                 </select>
                                 <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                              </div>
                           </div>
                           
                           <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl mt-2 transition-colors shadow-lg shadow-blue-500/20">
                              Continue to Payment
                           </button>
                      </div>
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default FluidWalletApp;