
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Wallet, ArrowRightLeft, CreditCard, Globe, 
  Settings, LogOut, Bell, Search, TrendingUp, ArrowUpRight, 
  ArrowDownLeft, RefreshCw, Zap, Plus, Lock, History, ChevronRight,
  Smartphone, ChevronDown, Key, ArrowRight, X,
  ShieldCheck, PieChart, User, AlertTriangle, Copy, CheckCircle2,
  MapPin, Truck, ScanEye, ShieldAlert, Loader2, Check,
  Server, HardDrive, Cloud, Code2, ExternalLink, Activity, Wifi,
  Landmark, Phone, Banknote
} from 'lucide-react';

interface DesktopWalletProps {
  onNavigate: (page: string) => void;
}

// Initial Mock Data
const INITIAL_ASSETS = [
  { id: 'fld', symbol: 'FLD', name: 'Fluid', balance: 45200, price: 0.5, color: 'text-purple-400' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', balance: 4.20, price: 2450.00, color: 'text-blue-400' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', balance: 145.5, price: 150.00, color: 'text-emerald-400' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', balance: 5000, price: 1.00, color: 'text-slate-400' },
];

const INITIAL_TRANSACTIONS = [
  { id: 1, type: 'Sent', asset: 'USDT', amount: '200.00', date: 'Today, 14:30', status: 'Completed', icon: ArrowUpRight },
  { id: 2, type: 'Received', asset: 'ETH', amount: '1.5', date: 'Yesterday, 09:15', status: 'Completed', icon: ArrowDownLeft },
  { id: 3, type: 'Swapped', asset: 'FLD', amount: '5000', date: 'Oct 24, 2023', status: 'Completed', icon: RefreshCw },
  { id: 4, type: 'Deposit', asset: 'USD', amount: '1,000.00', date: 'Yesterday, 18:20', status: 'Completed', icon: Landmark },
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Staking Reward', message: 'You received 45.2 FLD', time: '2m ago', type: 'success' },
  { id: 2, title: 'Security Alert', message: 'New login from Mac OS X', time: '1h ago', type: 'warning' },
  { id: 3, title: 'System Update', message: 'Fluid Node v2.1 is live', time: '1d ago', type: 'info' },
];

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 20 H78 C83.5 20 88 24.5 88 30 C88 35.5 83.5 40 78 40 H38 L48 20 Z" fill="currentColor" />
    <path d="M35 45 H65 C70.5 45 75 49.5 75 55 C75 60.5 70.5 65 65 65 H25 L35 45 Z" fill="currentColor" />
    <path d="M22 70 H52 C57.5 70 62 74.5 62 80 C62 85.5 57.5 90 52 90 H12 L22 70 Z" fill="currentColor" />
  </svg>
);

const MOCK_CARDS = [
    { id: 1, type: 'Virtual', name: 'Fluid Black', number: '**** 4829', balance: 5000, color: 'bg-slate-900', border: 'border-slate-800' },
    { id: 2, type: 'Physical', name: 'Fluid Steel', number: '**** 9921', balance: 1200, color: 'bg-slate-700', border: 'border-slate-600' }
];

const NavItem: React.FC<{ id: string; icon: any; label: string; activeTab: string; setActiveTab: (id: string) => void }> = ({ id, icon: Icon, label, activeTab, setActiveTab }) => (
  <button 
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
      activeTab === id 
      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
      : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const DesktopWallet: React.FC<DesktopWalletProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const totalBalance = INITIAL_ASSETS.reduce((acc, asset) => acc + (asset.balance * asset.price), 0);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLocked(false);
      setIsLoading(false);
    }, 1000);
  };

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
            <p className="text-slate-400">Enter your password to access Fluid Vault</p>
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
                Unlock Vault
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
             <span className="text-xl font-bold tracking-tight">Fluid Vault</span>
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
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
         {/* Top Bar */}
         <header className="h-16 border-b border-slate-800 flex justify-between items-center px-8 bg-slate-900/50 backdrop-blur-sm">
             <h2 className="text-xl font-bold text-white capitalize">{activeTab}</h2>
             <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-full px-4 py-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-300">Mainnet</span>
                 </div>
                 <div className="relative">
                    <Bell size={20} className="text-slate-400 hover:text-white cursor-pointer" />
                    {notifications.length > 0 && <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>}
                 </div>
                 <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <User size={16} className="text-slate-400" />
                 </div>
             </div>
         </header>

         {/* Scrollable Area */}
         <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
            
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 p-8 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
                           <div className="absolute top-0 right-0 p-12 opacity-10"><Wallet size={200} /></div>
                           <h3 className="text-slate-300 font-medium mb-2">Total Balance</h3>
                           <div className="text-5xl font-black text-white mb-6">${totalBalance.toLocaleString()}</div>
                           <div className="flex gap-4">
                               <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors">Deposit</button>
                               <button className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-colors">Send</button>
                           </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                           <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                           <div className="grid grid-cols-2 gap-4">
                              <button onClick={() => setActiveTab('cards')} className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-purple-500/50 transition-all flex flex-col items-center gap-2">
                                  <CreditCard className="text-purple-400" />
                                  <span className="text-sm font-bold">Cards</span>
                              </button>
                              <button onClick={() => setActiveTab('host')} className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500/50 transition-all flex flex-col items-center gap-2">
                                  <Globe className="text-blue-400" />
                                  <span className="text-sm font-bold">Host</span>
                              </button>
                           </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CARDS TAB - Simple Grid */}
            {activeTab === 'cards' && (
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-white">Your Cards</h2>
                        <button className="px-6 py-2 bg-purple-600 rounded-xl text-white font-bold hover:bg-purple-500 transition-colors flex items-center gap-2">
                            <Plus size={18} /> Add New
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_CARDS.map(card => (
                            <div key={card.id} className={`aspect-[1.58/1] rounded-3xl ${card.color} border ${card.border} p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl`}>
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                <div className="absolute -bottom-10 -left-10 opacity-10">
                                    <FluidLogo className="w-48 h-48" />
                                </div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <FluidLogo className="w-8 h-8 text-white" />
                                    <span className="text-xs font-bold uppercase border px-2 py-1 rounded border-white/20">{card.type}</span>
                                </div>
                                <div className="relative z-10 text-white">
                                    <div className="font-mono text-xl tracking-widest mb-2">{card.number}</div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm opacity-80">{card.name}</span>
                                        <span className="font-bold">${card.balance}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
         </div>
      </main>
    </div>
  );
};

export default DesktopWallet;
