
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Wallet, ArrowRightLeft, CreditCard, Globe, 
  Settings, LogOut, Bell, Search, TrendingUp, ArrowUpRight, 
  ArrowDownLeft, RefreshCw, Zap, Plus, Lock, History, ChevronRight,
  Smartphone, ChevronDown, Key, ArrowRight, X,
  ShieldCheck, PieChart, User, AlertTriangle, Copy, CheckCircle2,
  MapPin, Truck, ScanEye, ShieldAlert, Loader2, Check,
  Server, HardDrive, Cloud, Code2, ExternalLink, Activity, Wifi
} from 'lucide-react';
import { analyzeTransactionRisk, TransactionRiskAnalysis } from '../services/geminiService';

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
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Staking Reward', message: 'You received 45.2 FLD', time: '2m ago', type: 'success' },
  { id: 2, title: 'Security Alert', message: 'New login from Mac OS X', time: '1h ago', type: 'warning' },
  { id: 3, title: 'System Update', message: 'Fluid Node v2.1 is live', time: '1d ago', type: 'info' },
];

const HOST_DOMAINS = [
  { id: 1, name: 'alex.fluid', type: 'Handshake', status: 'Active', expires: 'Permanent' },
  { id: 2, name: 'defi-portfolio.app', type: 'DNS', status: 'Active', expires: '2025-12-01' }
];

const HOST_DEPLOYMENTS = [
  { id: 1, name: 'Personal Portfolio', url: 'fluid://alex.fluid', status: 'Online', visitors: '1.2k', storage: '45 MB' },
  { id: 2, name: 'Fluid DEX Interface', url: 'fluid://dex.fluid', status: 'Syncing', visitors: '8.5k', storage: '120 MB' }
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
  const [showBackupNudge, setShowBackupNudge] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  // Dynamic Data
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Send Flow State
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendStep, setSendStep] = useState<'input' | 'scanning' | 'review' | 'processing' | 'success'>('input');
  const [sendData, setSendData] = useState({ address: '', amount: '', assetId: 'eth' });
  const [riskReport, setRiskReport] = useState<TransactionRiskAnalysis | null>(null);

  // Swap Flow State
  const [swapData, setSwapData] = useState({ from: 'eth', to: 'fld', fromAmount: '1.0', toAmount: '' });
  const [isSwapping, setIsSwapping] = useState(false);

  const [showReceiveModal, setShowReceiveModal] = useState(false);
  
  // Host Flow State
  const [domainSearch, setDomainSearch] = useState('');
  const [isSearchingDomain, setIsSearchingDomain] = useState(false);
  const [domainResult, setDomainResult] = useState<boolean | null>(null);

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

  // Derived State
  const totalBalance = assets.reduce((acc, asset) => acc + (asset.balance * asset.price), 0);

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

  // Update swap output whenever input changes
  useEffect(() => {
    const fromAsset = assets.find(a => a.id === swapData.from);
    const toAsset = assets.find(a => a.id === swapData.to);
    if (fromAsset && toAsset && swapData.fromAmount) {
        const val = (parseFloat(swapData.fromAmount) * fromAsset.price) / toAsset.price;
        setSwapData(prev => ({...prev, toAmount: val.toFixed(4)}));
    }
  }, [swapData.fromAmount, swapData.from, swapData.to, assets]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLocked(false);
      setIsLoading(false);
    }, 1500);
  };

  const handleSendAnalyze = async () => {
      if (!sendData.address || !sendData.amount) return;
      setSendStep('scanning');
      
      const asset = assets.find(a => a.id === sendData.assetId);
      
      // Simulate Gemini Analysis
      try {
          const report = await analyzeTransactionRisk(sendData.amount, asset?.symbol || 'ETH', sendData.address, 'Ethereum');
          setRiskReport(report);
          setSendStep('review');
      } catch (e) {
          // Fallback if API fails
          setRiskReport({
              riskLevel: 'MEDIUM',
              score: 75,
              summary: 'Could not complete deep scan. Proceed with caution.',
              warnings: ['Address not in whitelist']
          });
          setSendStep('review');
      }
  };

  const handleSendConfirm = () => {
      setSendStep('processing');
      setTimeout(() => {
          const assetIndex = assets.findIndex(a => a.id === sendData.assetId);
          if (assetIndex > -1) {
              const newAssets = [...assets];
              newAssets[assetIndex].balance -= parseFloat(sendData.amount);
              setAssets(newAssets);
              
              setTransactions(prev => [{
                  id: Date.now(),
                  type: 'Sent',
                  asset: newAssets[assetIndex].symbol,
                  amount: sendData.amount,
                  date: 'Just now',
                  status: 'Completed',
                  icon: ArrowUpRight
              }, ...prev]);
          }
          setSendStep('success');
      }, 2000);
  };

  const handleDomainSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if(!domainSearch) return;
      setIsSearchingDomain(true);
      setDomainResult(null);
      
      setTimeout(() => {
          setIsSearchingDomain(false);
          setDomainResult(true);
      }, 1500);
  };

  const closeSendModal = () => {
      setShowSendModal(false);
      setSendStep('input');
      setSendData({ address: '', amount: '', assetId: 'eth' });
  };

  const handleSwap = () => {
      setIsSwapping(true);
      setTimeout(() => {
          const fromIdx = assets.findIndex(a => a.id === swapData.from);
          const toIdx = assets.findIndex(a => a.id === swapData.to);
          
          if (fromIdx > -1 && toIdx > -1) {
              const newAssets = [...assets];
              newAssets[fromIdx].balance -= parseFloat(swapData.fromAmount);
              newAssets[toIdx].balance += parseFloat(swapData.toAmount);
              setAssets(newAssets);

              setTransactions(prev => [{
                  id: Date.now(),
                  type: 'Swapped',
                  asset: newAssets[fromIdx].symbol,
                  amount: swapData.fromAmount,
                  date: 'Just now',
                  status: 'Completed',
                  icon: RefreshCw
              }, ...prev]);
              
              showToast(`Swapped ${swapData.fromAmount} ${newAssets[fromIdx].symbol} for ${swapData.toAmount} ${newAssets[toIdx].symbol}`);
          }
          setIsSwapping(false);
      }, 2000);
  };

  const clearNotifications = () => {
      setNotifications([]);
      setShowNotifications(false);
  };

  const copyAddress = () => {
      navigator.clipboard.writeText("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
      showToast("Address copied to clipboard");
  };

  return (
      <div className="min-h-screen pt-28 pb-12 px-4 md:px-8">
         {/* Toast Notification */}
         {toast && (
             <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up">
                 <div className={`px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                     {toast.type === 'success' ? <CheckCircle2 size={18}/> : <AlertTriangle size={18}/>}
                     <span className="font-bold text-sm">{toast.msg}</span>
                 </div>
             </div>
         )}

         <div className="max-w-[1600px] mx-auto bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden min-h-[800px] flex flex-col relative ring-1 ring-white/10">
            
            {/* --- SIMULATED DESKTOP HEADER --- */}
            <div className="h-10 bg-slate-900/50 border-b border-white/5 flex items-center justify-between px-4 select-none backdrop-blur-md">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50 hover:bg-red-500 transition-colors cursor-pointer"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500 transition-colors cursor-pointer"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500 transition-colors cursor-pointer"></div>
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 opacity-50">
                    <ShieldCheck size={12} /> Fluid Vault Secure Enclave
                </div>
                <div className="w-16"></div> {/* Spacer for balance */}
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {isLocked ? (
                    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                        
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
                            <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <NavItem id="swap" icon={ArrowRightLeft} label="Swap" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <NavItem id="cards" icon={CreditCard} label="Cards" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <NavItem id="host" icon={Globe} label="Host" activeTab={activeTab} setActiveTab={setActiveTab} />
                            <NavItem id="settings" icon={Settings} label="Settings" activeTab={activeTab} setActiveTab={setActiveTab} />
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
                                    {notifications.length > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>}
                                    </button>
                                    
                                    {showNotifications && (
                                    <div className="absolute right-0 top-12 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 animate-fade-in-up z-50">
                                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                                            <h3 className="font-bold">Notifications</h3>
                                            <span onClick={clearNotifications} className="text-xs text-purple-400 cursor-pointer hover:text-purple-300">Mark all read</span>
                                        </div>
                                        <div className="space-y-3">
                                            {notifications.length === 0 ? (
                                                <p className="text-center text-slate-500 text-xs py-4">No new notifications</p>
                                            ) : (
                                                notifications.map(n => (
                                                    <div key={n.id} className="flex gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer">
                                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'success' ? 'bg-emerald-500' : n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white">{n.title}</div>
                                                        <div className="text-xs text-slate-400">{n.message}</div>
                                                    </div>
                                                    </div>
                                                ))
                                            )}
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
                                            <h2 className="text-5xl font-black text-white tracking-tight">${totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
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
                                        {assets.map((asset, i) => (
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
                                            <div className="w-1/4 text-slate-400 text-sm text-right pr-8">{asset.balance.toLocaleString(undefined, {maximumFractionDigits: 4})}</div>
                                            <div className="w-1/4 text-right">
                                                <div className="font-bold text-white">${(asset.balance * asset.price).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                                                <div className="text-xs text-emerald-500 font-bold">@ ${asset.price}</div>
                                            </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-12 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-8">
                                    <h3 className="font-bold text-xl text-white mb-6">Recent Activity</h3>
                                    <div className="space-y-4">
                                        {transactions.map((tx, i) => (
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
                                        
                                        <div className="flex justify-between items-center mb-8">
                                            <h2 className="text-2xl font-bold text-white">Swap</h2>
                                            <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><Settings size={20}/></button>
                                        </div>

                                        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-2">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-400">You Pay</span>
                                                <span className="text-slate-500 font-bold">
                                                    Balance: {assets.find(a => a.id === swapData.from)?.balance.toFixed(4)} {assets.find(a => a.id === swapData.from)?.symbol}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <input 
                                                    type="number" 
                                                    value={swapData.fromAmount}
                                                    onChange={(e) => setSwapData({...swapData, fromAmount: e.target.value})}
                                                    className="bg-transparent text-4xl font-bold text-white w-1/2 outline-none" 
                                                />
                                                <button className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 hover:border-purple-500 transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                    {assets.find(a => a.id === swapData.from)?.symbol[0]}
                                                </div>
                                                <span className="font-bold text-white">{assets.find(a => a.id === swapData.from)?.symbol}</span>
                                                <ChevronDown size={16} className="text-slate-400" />
                                                </button>
                                            </div>
                                            <div className="text-right text-sm text-slate-500 mt-2">
                                                ~${(parseFloat(swapData.fromAmount || '0') * (assets.find(a => a.id === swapData.from)?.price || 0)).toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="flex justify-center -my-4 relative z-10">
                                            <button 
                                                onClick={() => setSwapData(prev => ({...prev, from: prev.to, to: prev.from}))}
                                                className="w-10 h-10 bg-slate-800 border-4 border-slate-900 rounded-xl flex items-center justify-center text-purple-400 shadow-xl hover:rotate-180 transition-transform duration-300"
                                            >
                                                <ArrowDownLeft size={20} />
                                            </button>
                                        </div>

                                        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mt-2 mb-6">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-400">You Receive</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <input type="text" value={swapData.toAmount} className="bg-transparent text-4xl font-bold text-purple-400 w-1/2 outline-none" readOnly />
                                                <button className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 hover:border-purple-500 transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                    {assets.find(a => a.id === swapData.to)?.symbol[0]}
                                                </div>
                                                <span className="font-bold text-white">{assets.find(a => a.id === swapData.to)?.symbol}</span>
                                                <ChevronDown size={16} className="text-slate-400" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-8">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Rate</span>
                                                <span className="text-white font-medium">1 {assets.find(a => a.id === swapData.from)?.symbol} = {(assets.find(a => a.id === swapData.from)?.price! / assets.find(a => a.id === swapData.to)?.price!).toFixed(4)} {assets.find(a => a.id === swapData.to)?.symbol}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Network Fee</span>
                                                <span className="text-white font-medium flex items-center gap-1"><Zap size={12} className="text-amber-500" /> $4.20</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleSwap}
                                            disabled={isSwapping}
                                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-purple-900/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                                        >
                                            {isSwapping ? <Loader2 className="animate-spin" /> : 'Confirm Swap'}
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
                                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
                                    
                                    {/* Host Header Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-indigo-500/20 transition-colors"></div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                                                    <HardDrive size={24} />
                                                </div>
                                                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider bg-indigo-500/10 px-2 py-1 rounded">Permanent</span>
                                            </div>
                                            <h3 className="text-3xl font-bold text-white mb-1">45.2 MB</h3>
                                            <p className="text-sm text-slate-400">Storage Used</p>
                                        </div>

                                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                                                    <Activity size={24} />
                                                </div>
                                                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded">100% Uptime</span>
                                            </div>
                                            <h3 className="text-3xl font-bold text-white mb-1">2</h3>
                                            <p className="text-sm text-slate-400">Active Deployments</p>
                                        </div>

                                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center gap-4">
                                            <button className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                                                <Plus size={18} /> New Deployment
                                            </button>
                                            <div className="flex gap-2 w-full">
                                                <button className="flex-1 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                                                    <Code2 size={14} /> CLI
                                                </button>
                                                <button className="flex-1 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                                                    <ExternalLink size={14} /> Explorer
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Domain Registrar */}
                                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
                                        
                                        <div className="max-w-2xl mx-auto text-center mb-8">
                                            <h2 className="text-2xl font-bold text-white mb-2">Claim Your Web3 Identity</h2>
                                            <p className="text-slate-400 text-sm">Search and register domains. Get a <strong>.fluid</strong> domain free with hosting.</p>
                                        </div>

                                        <form onSubmit={handleDomainSearch} className="max-w-xl mx-auto relative mb-8">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                            <input 
                                                type="text" 
                                                value={domainSearch}
                                                onChange={(e) => {
                                                    setDomainSearch(e.target.value);
                                                    setDomainResult(null);
                                                }}
                                                placeholder="Search domains (e.g. alex.fluid)" 
                                                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-12 pr-32 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                                            />
                                            <button 
                                                type="submit"
                                                disabled={isSearchingDomain || !domainSearch}
                                                className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg px-6 transition-all disabled:opacity-50"
                                            >
                                                {isSearchingDomain ? <Loader2 className="animate-spin" size={18} /> : 'Search'}
                                            </button>
                                        </form>

                                        {domainResult && (
                                            <div className="max-w-xl mx-auto bg-slate-950 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between animate-fade-in-up relative overflow-hidden">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                        <CheckCircle2 size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-lg">{domainSearch}</h4>
                                                        <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Available</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => showToast(`Claimed ${domainSearch} successfully!`)}
                                                    className="px-6 py-2 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors text-sm"
                                                >
                                                    Claim Free
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid lg:grid-cols-2 gap-8">
                                        {/* Domains List */}
                                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="font-bold text-white flex items-center gap-2"><Globe size={18} className="text-indigo-400"/> My Domains</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {HOST_DOMAINS.map(domain => (
                                                    <div key={domain.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl hover:bg-slate-950 transition-colors border border-transparent hover:border-slate-800 group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-bold group-hover:text-white group-hover:bg-indigo-600 transition-colors">
                                                                {domain.name[0].toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-white text-sm">{domain.name}</div>
                                                                <div className="text-xs text-slate-500">{domain.type} • {domain.expires}</div>
                                                            </div>
                                                        </div>
                                                        <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 uppercase">{domain.status}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Deployments List */}
                                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="font-bold text-white flex items-center gap-2"><Cloud size={18} className="text-blue-400"/> Deployments</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {HOST_DEPLOYMENTS.map(deploy => (
                                                    <div key={deploy.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl hover:bg-slate-950 transition-colors border border-transparent hover:border-slate-800 group cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full ${deploy.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                                            <div>
                                                                <div className="font-bold text-white text-sm">{deploy.name}</div>
                                                                <div className="text-xs text-blue-400 hover:underline">{deploy.url}</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-xs text-slate-400 font-bold">{deploy.visitors} visits</div>
                                                            <div className="text-[10px] text-slate-500">{deploy.storage}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                            </div>

                            {/* SIMULATED WINDOW FOOTER */}
                            {!isLocked && (
                                <div className="h-8 bg-slate-900/80 border-t border-white/5 flex items-center justify-between px-4 text-[10px] font-medium text-slate-500 select-none backdrop-blur-md">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5 text-emerald-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> 
                                            Online
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Wifi size={12} /> Fluid Mainnet
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="hidden sm:inline">v2.4.0-stable</span>
                                        <div className="h-3 w-px bg-slate-800"></div>
                                        <span>Gas: <span className="text-slate-300">12 Gwei</span></span>
                                        <div className="h-3 w-px bg-slate-800"></div>
                                        <span>Block: <span className="text-slate-300">#18,242,910</span></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
         </div>

         {/* SEND MODAL */}
         {showSendModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in-up">
                    {/* ... Send Modal Content ... */}
                    {sendStep === 'input' && (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Send Assets</h3>
                                <button onClick={closeSendModal} className="text-slate-500 hover:text-white"><X size={24}/></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Asset</label>
                                    <div className="flex gap-2 mt-1">
                                        {assets.map(asset => (
                                            <button 
                                                key={asset.id} 
                                                onClick={() => setSendData({...sendData, assetId: asset.id})}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${sendData.assetId === asset.id ? 'bg-slate-800 border-purple-500 text-white' : 'bg-slate-950 border-slate-700 text-slate-400'}`}
                                            >
                                                {asset.symbol}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Recipient Address</label>
                                    <input 
                                        type="text" 
                                        value={sendData.address}
                                        onChange={(e) => setSendData({...sendData, address: e.target.value})}
                                        className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none font-mono text-sm" 
                                        placeholder="0x..." 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Amount</label>
                                    <div className="relative mt-1">
                                    <input 
                                        type="number" 
                                        value={sendData.amount}
                                        onChange={(e) => setSendData({...sendData, amount: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-4 pr-20 text-white focus:border-purple-500 focus:outline-none text-2xl font-bold" 
                                        placeholder="0.00" 
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 px-2 py-1 rounded text-xs font-bold text-white">
                                        {assets.find(a => a.id === sendData.assetId)?.symbol}
                                    </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleSendAnalyze}
                                    className="w-full py-4 bg-purple-600 rounded-xl font-bold text-white hover:bg-purple-500 transition-colors mt-4 flex items-center justify-center gap-2"
                                >
                                    <ScanEye size={20} /> Preview Send
                                </button>
                            </div>
                        </>
                    )}

                    {sendStep === 'scanning' && (
                        <div className="text-center py-8">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping"></div>
                                <div className="absolute inset-0 border-2 border-purple-500 rounded-full animate-spin-slow"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ScanEye size={32} className="text-purple-400" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Analyzing Transaction</h3>
                            <p className="text-slate-400 text-sm">Gemini AI is scanning for risks...</p>
                        </div>
                    )}

                    {sendStep === 'review' && riskReport && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Security Check</h3>
                                <div className={`px-2 py-1 rounded text-xs font-black uppercase ${
                                    riskReport.riskLevel === 'HIGH' ? 'bg-red-500 text-white' : 
                                    riskReport.riskLevel === 'MEDIUM' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-white'
                                }`}>
                                    {riskReport.riskLevel} RISK
                                </div>
                            </div>
                            
                            <div className={`p-4 rounded-xl border ${
                                riskReport.riskLevel === 'HIGH' ? 'bg-red-500/10 border-red-500/30' :
                                'bg-slate-950 border-slate-700'
                            }`}>
                                <p className="text-sm font-medium text-white mb-2">{riskReport.summary}</p>
                                <ul className="text-xs space-y-1 text-slate-400">
                                    {riskReport.warnings.map((w, i) => (
                                        <li key={i} className="flex gap-2">
                                            <ShieldAlert size={12} className="shrink-0 mt-0.5" /> {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Sending</span>
                                    <span className="text-white font-bold">{sendData.amount} {assets.find(a => a.id === sendData.assetId)?.symbol}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">To</span>
                                    <span className="text-white font-mono text-xs">{sendData.address.slice(0, 10)}...{sendData.address.slice(-4)}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setSendStep('input')} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700">Cancel</button>
                                <button onClick={handleSendConfirm} className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500">Confirm Send</button>
                            </div>
                        </div>
                    )}

                    {sendStep === 'processing' && (
                        <div className="text-center py-12">
                            <Loader2 size={48} className="animate-spin text-purple-500 mx-auto mb-4" />
                            <h3 className="text-white font-bold">Broadcasting Transaction...</h3>
                        </div>
                    )}

                    {sendStep === 'success' && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                                <Check size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Sent Successfully!</h3>
                            <button onClick={closeSendModal} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold mt-6">Done</button>
                        </div>
                    )}

                </div>
            </div>
         )}

      </div>
  );
};

export default DesktopWallet;
