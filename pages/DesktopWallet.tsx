import React, { useState, useEffect } from 'react';
import { 
  Loader2, Lock, LayoutDashboard, Wallet, CreditCard, 
  Globe, Settings, LogOut, ChevronRight, Bell, Search, 
  TrendingUp, ArrowUpRight, ArrowDownLeft, Copy, Server,
  Activity, HardDrive, ShieldCheck, Eye, EyeOff, Snowflake, 
  ScanEye, Trash2, Plus, ArrowRightLeft, ArrowDown, RefreshCw,
  Fingerprint, Zap, Smartphone, Monitor, CheckCircle2, X, ChevronDown
} from 'lucide-react';

// --- Shared Data & Constants (Synced with SuperWallet) ---

const INITIAL_ASSETS = [
  { id: 'fld', symbol: 'FLD', name: 'Fluid', balance: 45200, price: 0.5, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', type: 'crypto', visible: true },
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', balance: 0, price: 64200.00, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', type: 'crypto', visible: true },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', balance: 4.20, price: 2450.00, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', type: 'crypto', visible: true },
  { id: 'sol', symbol: 'SOL', name: 'Solana', balance: 145.5, price: 150.00, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', type: 'crypto', visible: true },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', balance: 5000, price: 1.00, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', type: 'crypto', visible: true },
  { id: 'xrp', symbol: 'XRP', name: 'Ripple', balance: 0, price: 0.60, color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/20', type: 'crypto', visible: false },
  { id: 'ada', symbol: 'ADA', name: 'Cardano', balance: 0, price: 0.35, color: 'text-blue-600', bg: 'bg-blue-600/10', border: 'border-blue-600/20', type: 'crypto', visible: false },
  { id: 'doge', symbol: 'DOGE', name: 'Dogecoin', balance: 0, price: 0.10, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', type: 'crypto', visible: false },
];

const CARD_TIERS = [
  { id: 'black', name: 'Fluid Black', bg: 'bg-slate-950', border: 'border-slate-800', text: 'text-white', watermark: 'text-white/5' },
  { id: 'steel', name: 'Fluid Steel', bg: 'bg-gradient-to-br from-slate-700 to-slate-900', border: 'border-slate-600', text: 'text-white', watermark: 'text-white/10' },
  { id: 'silver', name: 'Fluid Silver', bg: 'bg-gradient-to-br from-gray-100 via-gray-300 to-gray-400', border: 'border-gray-400', text: 'text-slate-900', watermark: 'text-slate-900/10' },
  { id: 'bronze', name: 'Fluid Bronze', bg: 'bg-gradient-to-br from-amber-800 to-amber-950', border: 'border-amber-700', text: 'text-amber-50', watermark: 'text-white/10' },
];

const MOCK_CARDS_INITIAL = [
    { id: 1, type: 'Virtual', name: 'Fluid Black', number: '**** 4829', realNumber: '4829 1029 4829 4829', balance: 5000, color: 'bg-slate-900', border: 'border-slate-800', text: 'text-white', watermark: 'text-white/5', expiry: '12/28', cvv: '123', isFrozen: false },
    { id: 2, type: 'Physical', name: 'Fluid Steel', number: '**** 9921', realNumber: '9921 5521 8832 9921', balance: 1200, color: 'bg-gradient-to-br from-slate-700 to-slate-900', border: 'border-slate-600', text: 'text-white', watermark: 'text-white/10', expiry: '09/27', cvv: '456', isFrozen: true }
];

const HOST_DEPLOYMENTS = [
  { id: 1, name: 'Personal Portfolio', url: 'fluid://alex.fluid', status: 'Online', visitors: '1.2k', storage: '45 MB' },
  { id: 2, name: 'Fluid DEX Interface', url: 'fluid://dex.fluid', status: 'Syncing', visitors: '8.5k', storage: '120 MB' }
];

// --- Components ---

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
  
  // App State (Synced with SuperWallet)
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [cards, setCards] = useState(MOCK_CARDS_INITIAL);
  const [selectedCard, setSelectedCard] = useState<any>(MOCK_CARDS_INITIAL[0]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Security State
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [gaslessMode, setGaslessMode] = useState(false);
  const [devices, setDevices] = useState([
      { id: 1, name: 'MacBook Pro', type: 'desktop', lastActive: 'Active Now', location: 'New York, US', current: true },
      { id: 2, name: 'iPhone 15 Pro', type: 'mobile', lastActive: '2m ago', location: 'New York, US', current: false },
      { id: 3, name: 'Chrome (Windows)', type: 'web', lastActive: '1d ago', location: 'London, UK', current: false },
  ]);

  // Swap State
  const [swapFrom, setSwapFrom] = useState(INITIAL_ASSETS[2]); // ETH
  const [swapTo, setSwapTo] = useState(INITIAL_ASSETS[0]); // FLD
  const [swapAmount, setSwapAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  // Card Management State
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [cvvTimer, setCvvTimer] = useState(0);
  const [tempCvv, setTempCvv] = useState('***');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Host State
  const [domainSearch, setDomainSearch] = useState('');

  const totalBalance = assets.filter(a => a.visible).reduce((acc, asset) => acc + (asset.balance * (asset.price || 0)), 0);

  // Derived Swap values
  const swapExchangeRate = (swapFrom.price || 0) / (swapTo.price || 1);
  const swapOutputAmount = swapAmount ? (parseFloat(swapAmount) * swapExchangeRate).toFixed(6) : '0.0';

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setIsLocked(false);
    }, 1500);
  };

  // --- Actions ---

  const handleSwap = () => {
      const amount = parseFloat(swapAmount);
      if (!amount || amount <= 0) return;
      if (amount > swapFrom.balance) {
          alert('Insufficient balance');
          return;
      }

      setIsSwapping(true);
      setTimeout(() => {
          const output = parseFloat(swapOutputAmount);
          setAssets(prev => prev.map(a => {
              if (a.id === swapFrom.id) return { ...a, balance: a.balance - amount };
              if (a.id === swapTo.id) return { ...a, balance: a.balance + output };
              return a;
          }));
          // Update ref for current view
          if(swapFrom.id === swapFrom.id) setSwapFrom(prev => ({...prev, balance: prev.balance - amount}));
          if(swapTo.id === swapTo.id) setSwapTo(prev => ({...prev, balance: prev.balance + output}));

          setIsSwapping(false);
          setSwapAmount('');
          alert("Swap successful!");
      }, 2000);
  };

  const handleAddCard = () => {
      setIsAddingCard(true);
      setTimeout(() => {
          const newCard = {
              id: Date.now(),
              type: 'Virtual',
              name: 'Fluid Black',
              number: '**** ' + Math.floor(1000 + Math.random() * 9000),
              realNumber: Array(4).fill(0).map(() => Math.floor(1000 + Math.random() * 9000)).join(' '),
              balance: 0,
              color: 'bg-slate-900',
              border: 'border-slate-800',
              text: 'text-white',
              watermark: 'text-white/5',
              expiry: '12/29',
              cvv: Math.floor(100 + Math.random() * 900).toString(),
              isFrozen: false
          };
          setCards(prev => [...prev, newCard]);
          setSelectedCard(newCard);
          setIsAddingCard(false);
      }, 1500);
  };

  const handleDeleteCard = (cardId: number) => {
      if (window.confirm("Are you sure you want to delete this card?")) {
          setIsDeleting(true);
          setTimeout(() => {
              setCards(prev => prev.filter(c => c.id !== cardId));
              if (selectedCard?.id === cardId) setSelectedCard(null);
              setIsDeleting(false);
          }, 1000);
      }
  };

  const handleRevokeDevice = (id: number) => {
      if(window.confirm('Revoke access for this device?')) {
          setDevices(prev => prev.filter(d => d.id !== id));
      }
  };

  const toggleAssetVisibility = (id: string) => {
      setAssets(prev => prev.map(a => a.id === id ? { ...a, visible: !a.visible } : a));
  };

  // CVV Timer Logic (Ported from SuperWallet)
  useEffect(() => {
    if (cvvTimer > 0) {
      const interval = setInterval(() => setCvvTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setShowCvv(false);
      setTempCvv('***');
    }
  }, [cvvTimer]);

  const handleToggleCvv = () => {
      if (selectedCard?.isFrozen) return alert("Unfreeze card first");
      if (showCvv) {
          setShowCvv(false);
          setCvvTimer(0);
      } else {
          setTempCvv(selectedCard.cvv || '123');
          setShowCvv(true);
          setCvvTimer(30);
      }
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
            <NavItem id="swap" icon={ArrowRightLeft} label="Swap" activeTab={activeTab} setActiveTab={setActiveTab} />
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
                      {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>}
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
                
                {/* --- DASHBOARD VIEW --- */}
                {activeTab === 'dashboard' && (
                    <>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-800 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div><p className="text-indigo-200 font-medium mb-1">Total Balance</p><h2 className="text-5xl font-black text-white tracking-tight">${totalBalance.toLocaleString(undefined, {maximumFractionDigits: 2})}</h2></div>
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
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                                <h3 className="font-bold text-white text-lg">Assets</h3>
                                <button onClick={() => alert("Manage assets functionality synced from mobile")} className="text-xs font-bold text-purple-400">Manage</button>
                            </div>
                            <table className="w-full text-left">
                                <thead><tr className="border-b border-slate-800/50 text-slate-500 text-sm"><th className="px-6 py-4 font-medium">Asset</th><th className="px-6 py-4 font-medium">Price</th><th className="px-6 py-4 font-medium">Balance</th><th className="px-6 py-4 font-medium">Value</th><th className="px-6 py-4 font-medium text-right">Visible</th></tr></thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {assets.map((asset, i) => (
                                        <tr key={i} className={`hover:bg-slate-800/50 transition-colors group ${!asset.visible ? 'opacity-50' : ''}`}>
                                            <td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl ${asset.color} flex items-center justify-center text-white font-bold`}>{asset.id === 'fld' ? <FluidLogo className="w-5 h-5"/> : asset.symbol[0]}</div><div><div className="font-bold text-white">{asset.name}</div><div className="text-xs text-slate-500">{asset.symbol}</div></div></div></td>
                                            <td className="px-6 py-4 text-white font-medium">${asset.price.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-white font-medium">{asset.balance.toLocaleString()} {asset.symbol}</td>
                                            <td className="px-6 py-4 text-white font-bold">${(asset.balance * asset.price).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => toggleAssetVisibility(asset.id)} className={`w-10 h-5 rounded-full p-1 transition-colors ${asset.visible ? 'bg-purple-600' : 'bg-slate-700'}`}>
                                                    <div className={`w-3 h-3 rounded-full bg-white transform transition-transform ${asset.visible ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* --- SWAP VIEW --- */}
                {activeTab === 'swap' && (
                    <div className="flex justify-center items-start pt-10">
                        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
                            <h2 className="text-2xl font-bold text-white mb-6">Swap Assets</h2>
                            
                            {/* FROM */}
                            <div className="p-4 bg-slate-950 rounded-2xl mb-2 border border-slate-800">
                                <div className="flex justify-between text-xs text-slate-500 mb-2"><span>Pay</span><span>Bal: {swapFrom.balance}</span></div>
                                <div className="flex items-center justify-between">
                                    <input 
                                        type="number" 
                                        placeholder="0.0" 
                                        value={swapAmount}
                                        onChange={(e) => setSwapAmount(e.target.value)}
                                        className="bg-transparent text-3xl font-bold text-white w-32 outline-none placeholder-slate-700" 
                                    />
                                    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 cursor-pointer hover:bg-slate-700">
                                        <span className={`font-bold ${swapFrom.color}`}>{swapFrom.symbol}</span>
                                        <ChevronDown size={16} className="text-slate-400"/>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center -my-5 relative z-10">
                                <button className="bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-xl hover:rotate-180 transition-all hover:border-purple-500/50">
                                    <ArrowDown size={20} className="text-purple-400" />
                                </button>
                            </div>

                            {/* TO */}
                            <div className="p-4 bg-slate-950 rounded-2xl mt-2 border border-slate-800">
                                <div className="flex justify-between text-xs text-slate-500 mb-2"><span>Receive</span><span>Bal: {swapTo.balance}</span></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold text-slate-400">{swapOutputAmount}</span>
                                    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 cursor-pointer hover:bg-slate-700">
                                        <span className={`font-bold ${swapTo.color}`}>{swapTo.symbol}</span>
                                        <ChevronDown size={16} className="text-slate-400"/>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between px-2 text-xs font-medium text-slate-500 mt-4 mb-6">
                                <span>Rate</span>
                                <span>1 {swapFrom.symbol} ≈ {swapExchangeRate.toFixed(4)} {swapTo.symbol}</span>
                            </div>

                            <button 
                                disabled={!swapAmount || isSwapping}
                                onClick={handleSwap}
                                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-900/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                            >
                                {isSwapping ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                                {isSwapping ? 'Swapping...' : 'Swap Now'}
                            </button>
                        </div>
                    </div>
                )}

                {/* --- CARDS VIEW --- */}
                {activeTab === 'cards' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Selected Card Details */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">Your Cards</h2>
                                <button onClick={handleAddCard} disabled={isAddingCard} className="text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                                    {isAddingCard ? <Loader2 className="animate-spin" size={14}/> : <Plus size={14}/>} New Card
                                </button>
                            </div>
                            
                            {selectedCard ? (
                                <>
                                    <div className={`relative aspect-[1.58/1] rounded-3xl ${selectedCard.color} border ${selectedCard.border} shadow-2xl overflow-hidden p-8 transition-all duration-500`}>
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                        <FluidLogo className={`absolute -bottom-16 -right-16 w-64 h-64 opacity-10 transform rotate-12 pointer-events-none ${selectedCard.text}`} />
                                        
                                        <div className={`relative z-10 flex flex-col justify-between h-full ${selectedCard.text}`}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2"><FluidLogo className="w-8 h-8 text-current" /><span className="font-bold text-2xl italic tracking-tight">Fluid</span></div>
                                                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{selectedCard.type}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="font-mono text-3xl tracking-widest">{showCardNumber ? selectedCard.realNumber : selectedCard.number}</div>
                                                    <button onClick={() => setShowCardNumber(!showCardNumber)} className="p-2 rounded-full hover:bg-white/10 transition-colors">{showCardNumber ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <div className="text-xs uppercase opacity-70 mb-1 font-bold">Card Holder</div>
                                                        <div className="font-bold text-lg">{selectedCard.name}</div>
                                                    </div>
                                                    <div className="text-right flex gap-6">
                                                        <div><div className="text-xs uppercase opacity-70 mb-1 font-bold text-right">Expires</div><div className="font-bold text-lg">{selectedCard.expiry}</div></div>
                                                        <div><div className="text-xs uppercase opacity-70 mb-1 font-bold text-right">CVV</div><div className="font-bold text-lg">{showCvv ? selectedCard.cvv : '•••'}</div></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center gap-2 transition-all"><Snowflake size={18}/> Freeze Card</button>
                                        <button onClick={handleToggleCvv} className="py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center gap-2 transition-all">
                                            {showCvv ? <EyeOff size={18}/> : <ScanEye size={18}/>} 
                                            {showCvv ? 'Hide CVV' : 'Show CVV'} {cvvTimer > 0 && `(${cvvTimer}s)`}
                                        </button>
                                        <button onClick={() => handleDeleteCard(selectedCard.id)} disabled={isDeleting} className="py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/30 flex items-center justify-center gap-2 transition-all col-span-2">
                                            {isDeleting ? <Loader2 size={18} className="animate-spin"/> : <Trash2 size={18}/>} Delete Card
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="aspect-[1.58/1] rounded-3xl bg-slate-900 border border-slate-800 border-dashed flex items-center justify-center text-slate-500">
                                    No Card Selected
                                </div>
                            )}
                        </div>

                        {/* Card List & History */}
                        <div className="space-y-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                <h3 className="font-bold text-white mb-4">Your Wallet Cards</h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                                    {cards.map(card => (
                                        <div 
                                            key={card.id} 
                                            onClick={() => setSelectedCard(card)}
                                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedCard?.id === card.id ? 'bg-purple-600/20 border-purple-500/50' : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-7 rounded ${card.color}`}></div>
                                                <div><div className="font-bold text-white text-sm">{card.name}</div><div className="text-xs text-slate-500">{card.number}</div></div>
                                            </div>
                                            {selectedCard?.id === card.id && <CheckCircle2 size={18} className="text-purple-500" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                                <h3 className="font-bold text-white mb-6">Recent Transactions</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Uber Trip', date: 'Today, 2:30 PM', amount: -24.50 },
                                        { name: 'Starbucks', date: 'Today, 9:15 AM', amount: -5.40 },
                                        { name: 'Apple Store', date: 'Oct 20', amount: -1299.00 },
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
                        
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search & Register New Domain..." 
                                value={domainSearch}
                                onChange={(e) => setDomainSearch(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-6 pr-24 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-6 transition-colors">
                                Register
                            </button>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center"><h3 className="font-bold text-white text-lg">Active Deployments</h3></div>
                            <div className="p-6 space-y-4">
                                {HOST_DEPLOYMENTS.map(deploy => (
                                    <div key={deploy.id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500"><Server size={20}/></div>
                                            <div><div className="font-bold text-white">{deploy.name}</div><div className="text-xs text-blue-400 hover:underline cursor-pointer">{deploy.url}</div></div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-xs text-slate-500">Storage</div>
                                                <div className="text-sm font-bold text-white">{deploy.storage}</div>
                                            </div>
                                            <span className={`flex items-center gap-2 text-xs font-bold px-2 py-1 rounded ${deploy.status === 'Online' ? 'text-emerald-400 bg-emerald-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                                                <div className={`w-2 h-2 rounded-full ${deploy.status === 'Online' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></div> 
                                                {deploy.status}
                                            </span>
                                            <ChevronRight size={18} className="text-slate-500 cursor-pointer hover:text-white"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SETTINGS VIEW --- */}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl mx-auto space-y-8">
                        <h2 className="text-2xl font-bold text-white">Security & Preferences</h2>
                        
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <div className="p-5 border-b border-slate-800/50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500"><Fingerprint size={22} /></div>
                                    <div><div className="font-bold text-white">Biometric Authentication</div><div className="text-xs text-slate-500">Require FaceID/TouchID for transactions</div></div>
                                </div>
                                <button onClick={() => setBiometricEnabled(!biometricEnabled)} className={`w-12 h-6 rounded-full transition-colors relative ${biometricEnabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${biometricEnabled ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500"><Zap size={22} /></div>
                                    <div><div className="font-bold text-white">Gas-Less Mode</div><div className="text-xs text-slate-500">Pay network fees with any token</div></div>
                                </div>
                                <button onClick={() => setGaslessMode(!gaslessMode)} className={`w-12 h-6 rounded-full transition-colors relative ${gaslessMode ? 'bg-purple-600' : 'bg-slate-700'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${gaslessMode ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 ml-1">Connected Devices</h3>
                            <div className="space-y-3">
                                {devices.map(device => (
                                    <div key={device.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between group hover:border-slate-700 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${device.current ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-800 text-slate-400'}`}>
                                                {device.type === 'mobile' ? <Smartphone size={20} /> : device.type === 'desktop' ? <Monitor size={20} /> : <Globe size={20} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="font-bold text-white">{device.name}</div>
                                                    {device.current && <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Current</span>}
                                                </div>
                                                <div className="text-xs text-slate-500">{device.location} • {device.lastActive}</div>
                                            </div>
                                        </div>
                                        {!device.current && (
                                            <button 
                                                onClick={() => handleRevokeDevice(device.id)}
                                                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Revoke Access"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
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