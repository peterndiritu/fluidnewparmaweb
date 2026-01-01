import React, { useState } from 'react';
import { 
  Loader2, Lock, LayoutDashboard, Wallet, CreditCard, 
  Globe, Settings, LogOut, ChevronRight, Bell, Search, 
  TrendingUp, ArrowUpRight, ArrowDownLeft, Copy, Server,
  Activity, HardDrive, ShieldCheck, Eye, EyeOff, Snowflake, 
  ScanEye, Trash2, Plus
} from 'lucide-react';

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="currentColor" />
    <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="currentColor" />
    <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 83.3137 82 60 82H10L15 66Z" fill="currentColor" />
  </svg>
);

interface NavItemProps {
    id: string;
    icon: React.ElementType;
    label: string;
    activeTab: string;
    setActiveTab: (id: string) => void;
}
const NavItem = ({ id, icon: Icon, label, activeTab, setActiveTab }: NavItemProps) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeTab === id 
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </button>
);

interface DesktopWalletProps {
  onNavigate: (page: string) => void;
}

const DesktopWallet: React.FC<DesktopWalletProps> = ({ onNavigate }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  
  // Card Deletion State
  const [isDeletingCard, setIsDeletingCard] = useState(false);
  const [isCardDeleted, setIsCardDeleted] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setIsLocked(false);
    }, 1500);
  };

  const handleDeleteCard = () => {
    if (window.confirm("Are you sure you want to delete this card? This action cannot be undone.")) {
        setIsDeletingCard(true);
        setTimeout(() => {
            setIsCardDeleted(true);
            setIsDeletingCard(false);
        }, 1500);
    }
  };

  const assets = [
    { name: 'Bitcoin', symbol: 'BTC', price: 64230, balance: 0.45, change: 2.4, color: 'bg-orange-500' },
    { name: 'Ethereum', symbol: 'ETH', price: 3450, balance: 4.2, change: -1.2, color: 'bg-indigo-500' },
    { name: 'Fluid', symbol: 'FLD', price: 0.85, balance: 15000, change: 5.7, color: 'bg-emerald-500' },
    { name: 'Solana', symbol: 'SOL', price: 145, balance: 120, change: 0.8, color: 'bg-purple-500' },
  ];

  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-slate-950 to-slate-950"></div>
        <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 relative z-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-900/30">
              <FluidLogo className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">Enter your password to access Fluid Dapp</p>
          </div>

          <div className="space-y-4">
             <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" 
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
             </div>
             <button 
                onClick={handleLogin}
                disabled={isLoading || !password}
                className="w-full bg-white text-slate-900 font-bold rounded-xl py-3.5 hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
             >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                Unlock Dapp
             </button>
             <div className="flex justify-between items-center mt-6">
                <button className="text-sm text-slate-500 hover:text-white transition-colors">Forgot Password?</button>
                <button onClick={() => onNavigate('home')} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Exit</button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
         <div className="p-6 border-b border-slate-800 flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <FluidLogo className="w-6 h-6 text-white" />
             </div>
             <span className="text-xl font-bold tracking-tight">Fluid Dapp</span>
         </div>

         <nav className="flex-grow p-4 space-y-2">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem id="assets" icon={Wallet} label="Assets" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem id="cards" icon={CreditCard} label="Cards" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem id="host" icon={Globe} label="Fluid Host" activeTab={activeTab} setActiveTab={setActiveTab} />
            <NavItem id="settings" icon={Settings} label="Settings" activeTab={activeTab} setActiveTab={setActiveTab} />
         </nav>

         <div className="p-4 border-t border-slate-800">
             <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                <LogOut size={20} />
                <span className="font-medium">Lock Wallet</span>
             </button>
         </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-grow flex flex-col bg-slate-950">
          {/* Header */}
          <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-full max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                         type="text" 
                         placeholder="Search assets, transactions, or settings..." 
                         className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 transition-all text-white placeholder-slate-500"
                      />
                  </div>
              </div>
              
              <div className="flex items-center gap-4">
                   <button className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all relative">
                      <Bell size={20} />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                   </button>
                   <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                      <div className="text-right">
                          <div className="text-sm font-bold text-white">Alexander Fluid</div>
                          <div className="text-xs text-slate-500">Tier 1 • Verified</div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-500 p-0.5">
                         <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" className="w-full h-full rounded-[10px] object-cover bg-slate-900" alt="Avatar" />
                      </div>
                   </div>
              </div>
          </header>

          {/* View Container */}
          <div className="flex-grow overflow-y-auto p-8">
             <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
                
                {/* --- DASHBOARD & ASSETS VIEW --- */}
                {(activeTab === 'dashboard' || activeTab === 'assets') && (
                    <>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-800 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div><p className="text-indigo-200 font-medium mb-1">Total Balance</p><h2 className="text-5xl font-black text-white tracking-tight">$42,593.45</h2></div>
                                    <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-lg flex items-center gap-1.5 text-white font-bold text-sm"><TrendingUp size={16} /> +5.2%</div>
                                </div>
                                <div className="flex gap-4 relative z-10">
                                    <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"><ArrowDownLeft size={18} /> Deposit</button>
                                    <button className="px-6 py-3 bg-indigo-500/50 hover:bg-indigo-500/70 text-white border border-white/20 rounded-xl font-bold transition-all flex items-center gap-2"><ArrowUpRight size={18} /> Send</button>
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-white">Your Card</h3><button onClick={() => setActiveTab('cards')} className="text-purple-400 text-sm font-medium hover:text-purple-300">Manage</button></div>
                                <div className="flex-grow bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700/50 relative overflow-hidden group">
                                    <div className="absolute bottom-4 left-5 z-10"><div className="text-xs text-slate-400 mb-1">Fluid Black</div><div className="font-mono text-white text-lg tracking-widest">**** 4289</div></div>
                                    <FluidLogo className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-800 group-hover:text-purple-900/20 transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center"><h3 className="font-bold text-white text-lg">Assets</h3></div>
                            <table className="w-full text-left">
                                <thead><tr className="border-b border-slate-800/50 text-slate-500 text-sm"><th className="px-6 py-4 font-medium">Asset</th><th className="px-6 py-4 font-medium">Price</th><th className="px-6 py-4 font-medium">Balance</th><th className="px-6 py-4 font-medium">Value</th><th className="px-6 py-4 font-medium text-right">Change (24h)</th></tr></thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {assets.map((asset, i) => (
                                        <tr key={i} className="hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl ${asset.color} flex items-center justify-center text-white font-bold`}>{asset.symbol[0]}</div><div><div className="font-bold text-white">{asset.name}</div><div className="text-xs text-slate-500">{asset.symbol}</div></div></div></td>
                                            <td className="px-6 py-4 text-white font-medium">${asset.price.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-white font-medium">{asset.balance.toLocaleString()} {asset.symbol}</td>
                                            <td className="px-6 py-4 text-white font-bold">${(asset.balance * asset.price).toLocaleString()}</td>
                                            <td className={`px-6 py-4 text-right font-bold ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{asset.change > 0 ? '+' : ''}{asset.change}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* --- CARDS VIEW --- */}
                {activeTab === 'cards' && (
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Your Cards</h2>
                            
                            {isCardDeleted ? (
                                <div className="aspect-[1.58/1] rounded-3xl bg-slate-900 border border-slate-800 border-dashed flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500">
                                        <CreditCard size={32} />
                                    </div>
                                    <h3 className="text-white font-bold mb-2">No Active Cards</h3>
                                    <p className="text-slate-500 text-sm mb-6">You have no active cards. Issue a new one to start spending.</p>
                                    <button 
                                        onClick={() => setIsCardDeleted(false)}
                                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                                    >
                                        <Plus size={18} /> Issue New Card
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="aspect-[1.58/1] rounded-3xl bg-slate-900 border border-slate-800 relative overflow-hidden p-8 shadow-2xl">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                        <div className="relative z-10 flex flex-col justify-between h-full">
                                            <div className="flex justify-between items-start"><div className="flex items-center gap-2"><FluidLogo className="w-8 h-8 text-white" /><span className="font-bold text-2xl italic tracking-tight">Fluid</span></div><span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Virtual</span></div>
                                            <div>
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="font-mono text-3xl tracking-widest text-white">{showCardNumber ? '4829 1029 4829 4829' : '**** **** **** 4829'}</div>
                                                    <button onClick={() => setShowCardNumber(!showCardNumber)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">{showCardNumber ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <div className="text-xs uppercase text-slate-400 mb-1 font-bold">Card Holder</div>
                                                        <div className="font-bold text-lg text-white">ALEXANDER FLUID</div>
                                                    </div>
                                                    <div className="text-right flex gap-6">
                                                        <div>
                                                            <div className="text-xs uppercase text-slate-400 mb-1 font-bold text-right">Expires</div>
                                                            <div className="font-bold text-lg text-white">12/28</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs uppercase text-slate-400 mb-1 font-bold text-right">CVV</div>
                                                            <div className="font-bold text-lg text-white">{showCvv ? '123' : '•••'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center gap-2 transition-all"><Snowflake size={18}/> Freeze Card</button>
                                        <button onClick={() => setShowCvv(!showCvv)} className="py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center gap-2 transition-all">
                                            {showCvv ? <EyeOff size={18}/> : <ScanEye size={18}/>} 
                                            {showCvv ? 'Hide' : 'Show CVV'}
                                        </button>
                                        <button className="py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center gap-2 transition-all"><Settings size={18}/> Settings</button>
                                        <button 
                                            onClick={handleDeleteCard}
                                            disabled={isDeletingCard}
                                            className="py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/30 flex items-center justify-center gap-2 transition-all"
                                        >
                                            {isDeletingCard ? <Loader2 size={18} className="animate-spin"/> : <Trash2 size={18}/>} 
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                            <h3 className="font-bold text-white mb-6">Transaction History</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Uber Trip', date: 'Today, 2:30 PM', amount: -24.50 },
                                    { name: 'Starbucks', date: 'Today, 9:15 AM', amount: -5.40 },
                                    { name: 'Apple Store', date: 'Oct 20', amount: -1299.00 },
                                    { name: 'Netflix', date: 'Oct 15', amount: -14.99 },
                                ].map((tx, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400"><CreditCard size={18}/></div>
                                            <div><div className="font-bold text-white text-sm">{tx.name}</div><div className="text-xs text-slate-500">{tx.date}</div></div>
                                        </div>
                                        <div className="font-bold text-white">{tx.amount.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- HOST VIEW --- */}
                {activeTab === 'host' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl"><div className="flex items-center gap-3 mb-2 text-indigo-400"><HardDrive size={24}/><span className="font-bold">Storage Used</span></div><div className="text-4xl font-black text-white">45.2 MB</div><div className="text-xs text-slate-500 mt-2">of Unlimited</div></div>
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl"><div className="flex items-center gap-3 mb-2 text-emerald-400"><Activity size={24}/><span className="font-bold">Uptime</span></div><div className="text-4xl font-black text-white">100%</div><div className="text-xs text-slate-500 mt-2">Last 30 days</div></div>
                            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl"><div className="flex items-center gap-3 mb-2 text-blue-400"><Globe size={24}/><span className="font-bold">Visitors</span></div><div className="text-4xl font-black text-white">12.5k</div><div className="text-xs text-slate-500 mt-2">+12% vs last month</div></div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center"><h3 className="font-bold text-white text-lg">Active Deployments</h3><button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">New Deployment</button></div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500"><Server size={20}/></div>
                                        <div><div className="font-bold text-white">Personal Portfolio</div><div className="text-xs text-blue-400 hover:underline cursor-pointer">fluid://alex.fluid</div></div>
                                    </div>
                                    <div className="flex items-center gap-4"><span className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Online</span><ChevronRight size={18} className="text-slate-500"/></div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500"><Server size={20}/></div>
                                        <div><div className="font-bold text-white">Fluid DEX Interface</div><div className="text-xs text-blue-400 hover:underline cursor-pointer">fluid://dex.fluid</div></div>
                                    </div>
                                    <div className="flex items-center gap-4"><span className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded"><div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div> Syncing</span><ChevronRight size={18} className="text-slate-500"/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

             </div>
          </div>
      </main>
    </div>
  );
};

export default DesktopWallet;