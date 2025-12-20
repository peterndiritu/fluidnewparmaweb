import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Wallet, ArrowRightLeft, CreditCard, Globe, 
  Settings, LogOut, Bell, Search, TrendingUp, ArrowUpRight, 
  ArrowDownLeft, RefreshCw, Zap, Plus, Lock, History, ChevronRight,
  Smartphone, ChevronDown, Key, ArrowRight, X,
  ShieldCheck, PieChart, User, AlertTriangle, Copy, CheckCircle2,
  MapPin, Truck
} from 'lucide-react';

interface DesktopWalletProps {
  onNavigate: (page: string) => void;
}

// Mock Data
const ASSETS = [
  { id: 'fld', symbol: 'FLD', name: 'Fluid', balance: '45,200', value: '$22,600.00', change: '+12.5%', color: 'text-purple-400' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', balance: '4.20', value: '$10,240.50', change: '+2.4%', color: 'text-blue-400' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', balance: '145.5', value: '$21,825.00', change: '+5.1%', color: 'text-emerald-400' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', balance: '5,000', value: '$5,000.00', change: '0.0%', color: 'text-slate-400' },
];

const RECENT_TRANSACTIONS = [
  { type: 'Sent', asset: 'USDT', amount: '200.00', date: 'Today, 14:30', status: 'Completed', icon: ArrowUpRight },
  { type: 'Received', asset: 'ETH', amount: '1.5', date: 'Yesterday, 09:15', status: 'Completed', icon: ArrowDownLeft },
  { type: 'Swapped', asset: 'FLD', amount: '5000', date: 'Oct 24, 2023', status: 'Completed', icon: RefreshCw },
];

const NOTIFICATIONS = [
  { id: 1, title: 'Staking Reward', message: 'You received 45.2 FLD', time: '2m ago', type: 'success' },
  { id: 2, title: 'Security Alert', message: 'New login from Mac OS X', time: '1h ago', type: 'warning' },
  { id: 3, title: 'System Update', message: 'Fluid Node v2.1 is live', time: '1d ago', type: 'info' },
];

const CARD_TIERS = [
  { id: 'black', name: 'Fluid Black', bg: 'bg-slate-950', border: 'border-slate-800', text: 'text-white' },
  { id: 'steel', name: 'Fluid Steel', bg: 'bg-slate-600', border: 'border-slate-500', text: 'text-white' },
  { id: 'silver', name: 'Fluid Silver', bg: 'bg-slate-300', border: 'border-slate-400', text: 'text-slate-900' },
  { id: 'bronze', name: 'Fluid Bronze', bg: 'bg-amber-700', border: 'border-amber-600', text: 'text-white' },
  { id: 'platinum', name: 'Fluid Platinum', bg: 'bg-slate-400', border: 'border-slate-300', text: 'text-white' },
  { id: 'gold', name: 'Fluid Gold', bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-white' },
];

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 20 H78 C83.5 20 88 24.5 88 30 C88 35.5 83.5 40 78 40 H38 L48 20 Z" fill="currentColor" />
    <path d="M35 45 H65 C70.5 45 75 49.5 75 55 C75 60.5 70.5 65 65 65 H25 L35 45 Z" fill="currentColor" />
    <path d="M22 70 H52 C57.5 70 62 74.5 62 80 C62 85.5 57.5 90 52 90 H12 L22 70 Z" fill="currentColor" />
  </svg>
);

const DesktopWallet: React.FC<DesktopWalletProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBackupNudge, setShowBackupNudge] = useState(true);

  // Modals
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  
  // Card Order Flow
  const [cardOrderStep, setCardOrderStep] = useState<'list' | 'type' | 'design' | 'details' | 'success'>('list');
  const [selectedCardType, setSelectedCardType] = useState<'virtual' | 'physical'>('virtual');
  const [selectedCardTier, setSelectedCardTier] = useState(CARD_TIERS[0]);
  const [shippingDetails, setShippingDetails] = useState({ address: '', city: '', zip: '', country: '' });

  // Dropdown States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLocked(false);
      setIsLoading(false);
    }, 1500);
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
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

  return (
      <div className="min-h-screen pt-28 pb-12 px-4 md:px-8">
         <div className="max-w-[1600px] mx-auto bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden min-h-[800px] flex relative">
            
            {isLocked ? (
                <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden min-h-[800px]">
                    
                    {/* Custom Background Visualization for 'FLUID DAPP' */}
                    <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-b from-purple-800/10 to-transparent pointer-events-none"></div>
                    
                    {/* FLUID DAPP Box Visual */}
                    <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[350px] h-[250px] border border-blue-400/20 rounded-lg flex items-end justify-end p-4 pointer-events-none">
                        <span className="text-white/40 font-bold tracking-widest text-xs">FLUID DAPP</span>
                    </div>
                    
                    <div className="relative z-10 w-full max-w-[360px] p-8 bg-[#0B0E14] border border-slate-800/60 rounded-[2rem] shadow-2xl shadow-purple-900/10">
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20">
                                <Wallet className="text-white" size={24} />
                            </div>
                            <h1 className="text-xl font-bold text-white mb-2">Welcome Back</h1>
                            <p className="text-slate-500 text-sm">Enter your password to access Fluid Vault</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="w-full bg-[#05060A] border border-slate-800/60 rounded-xl py-3.5 px-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 text-sm"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Unlock Wallet <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-950 text-white flex h-full w-full relative overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 border-r border-slate-800 flex flex-col p-6 hidden md:flex bg-slate-950 z-20">
                        <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                            <Wallet size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Fluid Vault</span>
                        </div>

                        <div className="space-y-1 flex-grow">
                        <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <NavItem id="swap" icon={ArrowRightLeft} label="Swap" />
                        <NavItem id="cards" icon={CreditCard} label="Cards" />
                        <NavItem id="host" icon={Globe} label="Host" />
                        <NavItem id="settings" icon={Settings} label="Settings" />
                        </div>

                        <div className="mt-auto pt-6 border-t border-slate-800">
                        <button 
                            onClick={() => setIsLocked(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors"
                            >
                            <LogOut size={20} /> Lock Wallet
                        </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-8 overflow-y-auto h-full custom-scrollbar relative">
                        {/* Top Bar */}
                        <div className="flex justify-between items-center mb-8 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-30 py-4 -mt-4">
                        <div>
                            <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
                            <p className="text-slate-400 text-sm">Non-custodial session active</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {/* Notification Bell */}
                            <div className="relative" ref={notifRef}>
                                <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative"
                                >
                                <Bell size={18} />
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                                </button>
                                
                                {showNotifications && (
                                <div className="absolute right-0 top-12 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 animate-fade-in-up z-50">
                                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                                        <h3 className="font-bold">Notifications</h3>
                                        <span className="text-xs text-purple-400 cursor-pointer">Mark all read</span>
                                    </div>
                                    <div className="space-y-3">
                                        {NOTIFICATIONS.map(n => (
                                            <div key={n.id} className="flex gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer">
                                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'success' ? 'bg-emerald-500' : n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{n.title}</div>
                                                <div className="text-xs text-slate-400">{n.message}</div>
                                            </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                )}
                            </div>

                            {/* Profile Menu */}
                            <div className="relative" ref={profileRef}>
                                <button 
                                onClick={() => setShowProfile(!showProfile)}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5"
                                >
                                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                        <User size={20} className="text-slate-200" />
                                    </div>
                                </button>
                                
                                {showProfile && (
                                <div className="absolute right-0 top-12 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 animate-fade-in-up z-50">
                                    <div className="p-4 border-b border-slate-800 mb-2">
                                        <div className="font-bold text-white text-lg">Alexander</div>
                                        <div className="text-xs text-slate-400 mb-3">alex.fluid</div>
                                        <button onClick={() => setIsLocked(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                                            <LogOut size={16} /> Lock Wallet
                                        </button>
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                        </div>

                        {/* Content Area */}
                        <div className="animate-fade-in-up">
                        
                        {/* DASHBOARD VIEW */}
                        {activeTab === 'dashboard' && (
                            <div className="grid grid-cols-12 gap-6">
                            {/* ... Dashboard Content ... */}
                            {showBackupNudge && (
                                <div className="col-span-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between animate-fade-in-up gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg">
                                            <AlertTriangle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">Action Required: Back up your wallet</h4>
                                            <p className="text-xs text-amber-200/80">Your funds are currently at risk if you lose this device.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button className="flex-1 sm:flex-none px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-lg hover:bg-amber-400 transition-colors">
                                            Backup Now
                                        </button>
                                        <button onClick={() => setShowBackupNudge(false)} className="text-slate-400 hover:text-white transition-colors">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/30 transition-colors duration-500"></div>
                                
                                <div className="relative z-10 flex justify-between items-start mb-8">
                                    <div>
                                        <span className="text-purple-200 font-medium mb-1 block flex items-center gap-2"><ShieldCheck size={16}/> Vault Balance</span>
                                        <h2 className="text-5xl font-black text-white tracking-tight">$59,645.50</h2>
                                        <div className="flex items-center gap-2 mt-2">
                                        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-sm font-bold flex items-center gap-1">
                                            <TrendingUp size={14} /> +4.2%
                                        </span>
                                        <span className="text-purple-200/60 text-sm">vs last 24h</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 flex gap-4">
                                    <button 
                                    onClick={() => setShowSendModal(true)}
                                    className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg"
                                    >
                                        <ArrowUpRight size={18} /> Send
                                    </button>
                                    <button 
                                    onClick={() => setShowReceiveModal(true)}
                                    className="px-6 py-3 bg-slate-800/50 backdrop-blur-md text-white border border-white/10 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                                    >
                                        <ArrowDownLeft size={18} /> Receive
                                    </button>
                                    <button 
                                    onClick={() => setActiveTab('swap')}
                                    className="px-6 py-3 bg-slate-800/50 backdrop-blur-md text-white border border-white/10 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                                    >
                                        <RefreshCw size={18} /> Swap
                                    </button>
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-white mb-6">Asset Allocation</h3>
                                    <div className="flex items-center gap-6">
                                        <div className="w-32 h-32 rounded-full border-[12px] border-slate-800 border-t-purple-500 border-r-indigo-500 border-b-blue-500 relative flex items-center justify-center">
                                        <PieChart size={24} className="text-slate-500" />
                                        </div>
                                        <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                            <span className="text-sm text-slate-300">Fluid (45%)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                            <span className="text-sm text-slate-300">Ethereum (30%)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="text-sm text-slate-300">Solana (25%)</span>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-xl text-white">Your Assets</h3>
                                </div>
                                
                                <div className="space-y-4">
                                    {ASSETS.map((asset, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl hover:bg-slate-800/50 transition-colors group cursor-pointer border border-transparent hover:border-slate-700">
                                        <div className="flex items-center gap-4 w-1/4">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 group-hover:text-white group-hover:bg-purple-500 transition-colors">
                                                {asset.symbol[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{asset.name}</div>
                                                <div className="text-xs text-slate-500">{asset.symbol}</div>
                                            </div>
                                        </div>
                                        <div className="w-1/4 text-slate-400 text-sm text-right pr-8">{asset.balance}</div>
                                        <div className="w-1/4 text-right">
                                            <div className="font-bold text-white">{asset.value}</div>
                                            <div className="text-xs text-emerald-500 font-bold">{asset.change}</div>
                                        </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-12 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-8">
                                <h3 className="font-bold text-xl text-white mb-6">Recent Activity</h3>
                                <div className="space-y-4">
                                    {RECENT_TRANSACTIONS.map((tx, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                                                <tx.icon size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{tx.type} {tx.asset}</div>
                                                <div className="text-xs text-slate-500">{tx.date}</div>
                                            </div>
                                            </div>
                                            <div className="text-sm font-bold text-white">{tx.type === 'Sent' ? '-' : '+'}{tx.amount}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            </div>
                        )}

                        {/* SWAP VIEW */}
                        {activeTab === 'swap' && (
                            <div className="flex justify-center items-start pt-10">
                                <div className="w-full max-w-lg">
                                <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 relative shadow-2xl">
                                    {/* ... Swap UI ... */}
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl font-bold text-white">Swap</h2>
                                        <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><Settings size={20}/></button>
                                    </div>

                                    <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-2">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400">You Pay</span>
                                            <span className="text-slate-500 font-bold">Balance: 1.45 ETH</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <input type="text" defaultValue="1.0" className="bg-transparent text-4xl font-bold text-white w-1/2 outline-none" />
                                            <button className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 hover:border-purple-500 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">E</div>
                                            <span className="font-bold text-white">ETH</span>
                                            <ChevronDown size={16} className="text-slate-400" />
                                            </button>
                                        </div>
                                        <div className="text-right text-sm text-slate-500 mt-2">~$2,450.00</div>
                                    </div>

                                    <div className="flex justify-center -my-4 relative z-10">
                                        <button className="w-10 h-10 bg-slate-800 border-4 border-slate-900 rounded-xl flex items-center justify-center text-purple-400 shadow-xl hover:rotate-180 transition-transform duration-300">
                                            <ArrowDownLeft size={20} />
                                        </button>
                                    </div>

                                    <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mt-2 mb-6">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400">You Receive</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <input type="text" defaultValue="3,240.50" className="bg-transparent text-4xl font-bold text-purple-400 w-1/2 outline-none" readOnly />
                                            <button className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 hover:border-purple-500 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white">F</div>
                                            <span className="font-bold text-white">FLD</span>
                                            <ChevronDown size={16} className="text-slate-400" />
                                            </button>
                                        </div>
                                        <div className="text-right text-sm text-slate-500 mt-2">~$2,450.00</div>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Rate</span>
                                            <span className="text-white font-medium">1 ETH = 3,240.50 FLD</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Network Fee</span>
                                            <span className="text-white font-medium flex items-center gap-1"><Zap size={12} className="text-amber-500" /> $4.20</span>
                                        </div>
                                    </div>

                                    <button className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-purple-900/20 hover:scale-[1.02] transition-transform">
                                        Confirm Swap
                                    </button>
                                </div>
                                </div>
                            </div>
                        )}

                        {/* CARDS VIEW */}
                        {activeTab === 'cards' && (
                            <div className="max-w-6xl mx-auto">
                                {cardOrderStep === 'list' ? (
                                <>
                                    <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-bold text-white">My Cards</h2>
                                    <button 
                                        onClick={() => setCardOrderStep('type')}
                                        className="px-4 py-2 bg-purple-600 rounded-xl text-white font-bold flex items-center gap-2 hover:bg-purple-500 transition-colors"
                                    >
                                        <Plus size={18} /> Request New Card
                                    </button>
                                    </div>

                                    {/* Concurrent Cards Display */}
                                    <div className="grid md:grid-cols-2 gap-8 mb-10">
                                    {/* Virtual Card */}
                                    <div className="relative aspect-[1.58/1] rounded-3xl bg-slate-900 overflow-hidden border border-slate-800 shadow-2xl group hover:scale-[1.02] transition-transform duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black opacity-90"></div>
                                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full"></div>
                                            
                                            {/* Watermark Logo */}
                                            <div className="absolute -bottom-10 -left-10 text-white/5 opacity-10">
                                            <FluidLogo className="w-64 h-64" />
                                            </div>

                                            <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                                                <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <FluidLogo className="w-8 h-8" />
                                                    <span className="font-black text-2xl text-white tracking-widest italic">Fluid</span>
                                                </div>
                                                <Smartphone size={24} className="text-slate-400" />
                                                </div>
                                                <div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-12 h-8 bg-amber-200/20 rounded-md border border-amber-200/30"></div>
                                                    <span className="text-sm text-slate-500 font-mono">((( )))</span>
                                                </div>
                                                <div className="font-mono text-white text-2xl tracking-widest mb-2">**** **** **** 4829</div>
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs text-slate-400 uppercase">Alexander Fluid</span>
                                                    <span className="text-xs text-purple-400 font-bold uppercase">Virtual</span>
                                                </div>
                                                </div>
                                            </div>
                                    </div>

                                    {/* Physical Card (Steel/Metal Style) */}
                                    <div className="relative aspect-[1.58/1] rounded-3xl bg-gradient-to-br from-slate-700 to-slate-600 overflow-hidden border border-slate-500 shadow-2xl group hover:scale-[1.02] transition-transform duration-500">
                                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
                                            <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>
                                            
                                            {/* Watermark Logo */}
                                            <div className="absolute -bottom-10 -right-10 text-white/10 opacity-20 rotate-180">
                                            <FluidLogo className="w-64 h-64" />
                                            </div>

                                            <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                                                <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <FluidLogo className="w-8 h-8 text-white" />
                                                    <span className="font-black text-2xl text-white tracking-widest italic">Fluid</span>
                                                </div>
                                                <CreditCard size={24} className="text-slate-300" />
                                                </div>
                                                <div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-12 h-8 bg-amber-300/30 rounded-md border border-amber-300/40"></div>
                                                    <span className="text-sm text-slate-300 font-mono">((( )))</span>
                                                </div>
                                                <div className="font-mono text-white text-2xl tracking-widest mb-2 text-shadow-sm">**** **** **** 9921</div>
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs text-slate-300 uppercase">Alexander Fluid</span>
                                                    <span className="text-xs text-cyan-300 font-bold uppercase border border-cyan-300 px-2 py-0.5 rounded">Physical</span>
                                                </div>
                                                </div>
                                            </div>
                                    </div>
                                    </div>

                                    {/* Card Controls */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between hover:border-slate-700 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Lock size={20} /></div>
                                            <div>
                                                <div className="font-bold text-white">Freeze All</div>
                                                <div className="text-xs text-slate-500">Security lock</div>
                                            </div>
                                        </div>
                                        <div className="w-12 h-7 bg-slate-800 rounded-full relative cursor-pointer border border-slate-700">
                                            <div className="absolute left-1 top-1 w-5 h-5 bg-slate-500 rounded-full transition-all"></div>
                                        </div>
                                        </div>

                                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between cursor-pointer hover:border-purple-500/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><History size={20} /></div>
                                            <div>
                                                <div className="font-bold text-white">Transactions</div>
                                                <div className="text-xs text-slate-500">View statement</div>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-slate-500" />
                                        </div>

                                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><Settings size={20} /></div>
                                            <div>
                                                <div className="font-bold text-white">Card Settings</div>
                                                <div className="text-xs text-slate-500">Limits & PIN</div>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-slate-500" />
                                        </div>
                                    </div>
                                </>
                                ) : (
                                <div className="max-w-2xl mx-auto">
                                    <div className="flex items-center mb-8 gap-4">
                                        <button onClick={() => setCardOrderStep(cardOrderStep === 'type' ? 'list' : 'type')} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                                        <ArrowRight size={24} className="rotate-180" />
                                        </button>
                                        <h2 className="text-2xl font-bold text-white">Request Card</h2>
                                    </div>
                                    
                                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                                        {/* ... Wizard Content ... */}
                                        {cardOrderStep === 'type' && (
                                            <div className="space-y-6">
                                            <h3 className="text-xl font-bold text-white">Choose Card Type</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div 
                                                    onClick={() => { setSelectedCardType('virtual'); setCardOrderStep('design'); }}
                                                    className="border border-slate-700 rounded-2xl p-6 cursor-pointer hover:border-purple-500 hover:bg-slate-800 transition-all text-center"
                                                >
                                                    <Smartphone size={40} className="mx-auto mb-4 text-purple-400" />
                                                    <div className="font-bold text-white mb-1">Virtual Card</div>
                                                    <div className="text-xs text-slate-400">Instant activation. Online use.</div>
                                                </div>
                                                <div 
                                                    onClick={() => { setSelectedCardType('physical'); setCardOrderStep('design'); }}
                                                    className="border border-slate-700 rounded-2xl p-6 cursor-pointer hover:border-purple-500 hover:bg-slate-800 transition-all text-center"
                                                >
                                                    <CreditCard size={40} className="mx-auto mb-4 text-purple-400" />
                                                    <div className="font-bold text-white mb-1">Physical Card</div>
                                                    <div className="text-xs text-slate-400">Premium metal. Worldwide delivery.</div>
                                                </div>
                                            </div>
                                            </div>
                                        )}

                                        {cardOrderStep === 'design' && (
                                            <div className="space-y-8">
                                                <div>
                                                <h3 className="text-xl font-bold text-white mb-4">Select Your Design</h3>
                                                <div className="flex justify-center mb-8">
                                                    <div className={`relative w-80 h-48 rounded-2xl ${selectedCardTier.bg} ${selectedCardTier.border} border shadow-2xl p-6 flex flex-col justify-between transition-colors duration-500 overflow-hidden`}>
                                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                                        {/* Watermark */}
                                                        <div className="absolute -bottom-10 -left-10 text-white/10 opacity-20">
                                                            <FluidLogo className="w-48 h-48" />
                                                        </div>
                                                        
                                                        <div className={`relative z-10 flex justify-between items-start ${selectedCardTier.text}`}>
                                                            <div className="flex items-center gap-2">
                                                            <FluidLogo className="w-6 h-6" />
                                                            <span className="font-black text-xl tracking-widest italic">Fluid</span>
                                                            </div>
                                                            {selectedCardType === 'virtual' ? <Smartphone size={20}/> : <CreditCard size={20}/>}
                                                        </div>
                                                        <div className={`relative z-10 ${selectedCardTier.text}`}>
                                                            <div className="text-lg tracking-widest mb-1">**** **** **** 0000</div>
                                                            <div className="text-xs opacity-70 uppercase">Alexander Fluid</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-3">
                                                    {CARD_TIERS.map(tier => (
                                                        <button 
                                                            key={tier.id}
                                                            onClick={() => setSelectedCardTier(tier)}
                                                            className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                                                            selectedCardTier.id === tier.id 
                                                            ? 'border-purple-500 bg-slate-800 text-white' 
                                                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900'
                                                            }`}
                                                        >
                                                            {tier.name}
                                                        </button>
                                                    ))}
                                                </div>
                                                </div>
                                                <button 
                                                onClick={() => setCardOrderStep(selectedCardType === 'physical' ? 'details' : 'success')}
                                                className="w-full py-4 bg-purple-600 rounded-xl font-bold text-white hover:bg-purple-500 transition-colors"
                                                >
                                                Continue
                                                </button>
                                            </div>
                                        )}

                                        {cardOrderStep === 'details' && (
                                            <div className="space-y-6">
                                                <h3 className="text-xl font-bold text-white">Shipping Address</h3>
                                                <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Address</label>
                                                    <div className="relative mt-1">
                                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                                        <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:border-purple-500 focus:outline-none" placeholder="123 Blockchain Blvd" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">City</label>
                                                        <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none mt-1" placeholder="Crypto City" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">ZIP Code</label>
                                                        <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none mt-1" placeholder="10101" />
                                                    </div>
                                                </div>
                                                </div>
                                                <button 
                                                onClick={() => setCardOrderStep('success')}
                                                className="w-full py-4 bg-purple-600 rounded-xl font-bold text-white hover:bg-purple-500 transition-colors flex items-center justify-center gap-2"
                                                >
                                                <Truck size={20} /> Confirm Order
                                                </button>
                                            </div>
                                        )}

                                        {cardOrderStep === 'success' && (
                                            <div className="text-center py-8">
                                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                                                <CheckCircle2 size={40} />
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h3>
                                                <p className="text-slate-400 mb-8">
                                                Your {selectedCardTier.name} ({selectedCardType}) has been successfully ordered. 
                                                {selectedCardType === 'physical' ? ' It will arrive in 5-7 business days.' : ' It is now available in your wallet.'}
                                                </p>
                                                <button 
                                                onClick={() => setCardOrderStep('list')}
                                                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                                >
                                                Return to Cards
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                )}
                            </div>
                        )}

                        {/* HOST VIEW */}
                        {activeTab === 'host' && (
                            <div className="max-w-5xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {/* ... Host Content (Unchanged) ... */}
                                </div>
                            </div>
                        )}

                        </div>

                        {/* SEND MODAL */}
                        {showSendModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in-up">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white">Send Assets</h3>
                                    <button onClick={() => setShowSendModal(false)} className="text-slate-500 hover:text-white"><X size={24}/></button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Recipient Address</label>
                                        <input type="text" className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none font-mono text-sm" placeholder="0x..." />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Amount</label>
                                        <div className="relative mt-1">
                                        <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-4 pr-20 text-white focus:border-purple-500 focus:outline-none text-2xl font-bold" placeholder="0.00" />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 px-2 py-1 rounded text-xs font-bold text-white">ETH</div>
                                        </div>
                                    </div>
                                    <button className="w-full py-4 bg-purple-600 rounded-xl font-bold text-white hover:bg-purple-500 transition-colors mt-4">
                                        Confirm Send
                                    </button>
                                </div>
                            </div>
                        </div>
                        )}

                        {/* RECEIVE MODAL */}
                        {showReceiveModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-fade-in-up text-center">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white">Receive ETH</h3>
                                    <button onClick={() => setShowReceiveModal(false)} className="text-slate-500 hover:text-white"><X size={24}/></button>
                                </div>
                                
                                <div className="bg-white p-4 rounded-xl inline-block mb-6">
                                    {/* QR Code Placeholder using API */}
                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x71C7656EC7ab88b098defB751B7401B5f6d8976F" alt="QR" className="w-32 h-32" />
                                </div>
                                
                                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-6 flex items-center justify-between gap-2">
                                    <span className="font-mono text-xs text-slate-400 truncate">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</span>
                                    <button className="text-purple-400 hover:text-white"><Copy size={16}/></button>
                                </div>

                                <p className="text-xs text-slate-500">Only send Ethereum (ERC-20) assets to this address.</p>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            )}
         </div>
      </div>
  );
};

export default DesktopWallet;