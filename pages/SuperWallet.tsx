import React, { useState, useEffect } from 'react';
import { 
  Wallet, ArrowRightLeft, CreditCard, Globe, 
  Send, Plus, LogOut, Search, Bell, X, 
  Fingerprint, Scan, ArrowDown, History, 
  ChevronRight, Lock, ShieldCheck, Smartphone, 
  MoreHorizontal, RefreshCw, Server, Zap, Copy,
  Monitor, AlertTriangle, ChevronLeft, CheckCircle2,
  MapPin, Truck, Loader2, ShieldAlert, ScanEye,
  Activity, Cloud, HardDrive, ExternalLink, Code2, 
  ArrowUpRight, ArrowDownLeft, Landmark, Banknote, Phone,
  QrCode, ChevronDown, Repeat, Settings, User, Mail, 
  FileText, HelpCircle, Edit3, Camera, ToggleLeft, ToggleRight,
  Eye, EyeOff, Timer, KeyRound, Map, Palette, Trash2, Snowflake,
  Coffee, Car, Tv, ShoppingBag, ArrowDownCircle, Sparkles
} from 'lucide-react';

// --- Components ---

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="currentColor" />
    <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="currentColor" />
    <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 83.3137 82 60 82H10L15 66Z" fill="currentColor" />
  </svg>
);

const NavButton: React.FC<{ id: string; icon: any; label: string; view: string; setView: (v: any) => void }> = ({ id, icon: Icon, label, view, setView }) => (
  <button 
    onClick={() => setView(id)}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${
      view === id ? 'text-purple-400 scale-110' : 'text-slate-500 hover:text-slate-300'
    }`}
  >
    <Icon size={20} strokeWidth={view === id ? 2.5 : 2} />
    <span className="text-[10px] font-bold tracking-wide">{label}</span>
  </button>
);

// --- Types & Data ---

interface FluidWalletAppProps {
  onNavigate: (page: string) => void;
  initialView?: string;
}

type ViewState = 'locked' | 'assets' | 'swap' | 'cards' | 'host' | 'send' | 'receive' | 'deposit' | 'withdraw' | 'add_card' | 'settings' | 'profile' | 'card_details' | 'load_card';

const INITIAL_ASSETS = [
  { id: 'fld', symbol: 'FLD', name: 'Fluid', balance: 45200, price: 0.5, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', type: 'crypto' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', balance: 4.20, price: 2450.00, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', type: 'crypto' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', balance: 145.5, price: 150.00, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', type: 'crypto' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', balance: 5000, price: 1.00, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', type: 'crypto' },
];

const FIAT_ASSETS = [
  { id: 'usd', symbol: 'USD', name: 'US Dollar', balance: 2500.00, price: 1.00, color: 'text-emerald-500', flag: '🇺🇸', type: 'fiat' },
  { id: 'eur', symbol: 'EUR', name: 'Euro', balance: 140.50, price: 1.10, color: 'text-blue-500', flag: '🇪🇺', type: 'fiat' },
];

const MOCK_CARDS = [
    { id: 1, type: 'Virtual', name: 'Fluid Black', number: '**** 4829', realNumber: '4829 1029 4829 4829', balance: 5000, color: 'bg-slate-900', border: 'border-slate-800', text: 'text-white', watermark: 'text-white/5', expiry: '12/28', cvv: '123', isFrozen: false },
    { id: 2, type: 'Physical', name: 'Fluid Steel', number: '**** 9921', realNumber: '9921 5521 8832 9921', balance: 1200, color: 'bg-gradient-to-br from-slate-700 to-slate-900', border: 'border-slate-600', text: 'text-white', watermark: 'text-white/10', expiry: '09/27', cvv: '456', isFrozen: true }
];

const CARD_TIERS = [
  { id: 'black', name: 'Fluid Black', bg: 'bg-slate-950', border: 'border-slate-800', text: 'text-white', watermark: 'text-white/5' },
  { id: 'steel', name: 'Fluid Steel', bg: 'bg-gradient-to-br from-slate-700 to-slate-900', border: 'border-slate-600', text: 'text-white', watermark: 'text-white/10' },
  { id: 'silver', name: 'Fluid Silver', bg: 'bg-gradient-to-br from-gray-100 via-gray-300 to-gray-400', border: 'border-gray-400', text: 'text-slate-900', watermark: 'text-slate-900/10' },
  { id: 'bronze', name: 'Fluid Bronze', bg: 'bg-gradient-to-br from-amber-800 to-amber-950', border: 'border-amber-700', text: 'text-amber-50', watermark: 'text-white/10' },
];

const MOCK_TRANSACTIONS = [
    { id: 1, merchant: 'Uber Trip', amount: -24.50, date: 'Today, 2:30 PM', icon: 'car' },
    { id: 2, merchant: 'Starbucks', amount: -5.40, date: 'Today, 9:15 AM', icon: 'coffee' },
    { id: 3, merchant: 'Top Up', amount: 500.00, date: 'Yesterday', icon: 'plus' },
    { id: 4, merchant: 'Netflix', amount: -14.99, date: 'Oct 24', icon: 'tv' },
    { id: 5, merchant: 'Apple Store', amount: -1299.00, date: 'Oct 20', icon: 'shopping' },
];

const HOST_DEPLOYMENTS = [
  { id: 1, name: 'Personal Portfolio', url: 'fluid://alex.fluid', status: 'Online', visitors: '1.2k', storage: '45 MB' },
  { id: 2, name: 'Fluid DEX Interface', url: 'fluid://dex.fluid', status: 'Syncing', visitors: '8.5k', storage: '120 MB' }
];

const FluidWalletApp: React.FC<FluidWalletAppProps> = ({ onNavigate, initialView = 'assets' }) => {
  const [view, setView] = useState<ViewState>('locked');
  const [isScanning, setIsScanning] = useState(false);
  const [showNotificationList, setShowNotificationList] = useState(false);
  
  // App State
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [fiatAssets, setFiatAssets] = useState(FIAT_ASSETS);
  const [cards, setCards] = useState(MOCK_CARDS);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // User Profile
  const [userProfile, setUserProfile] = useState({
    name: 'Alexander',
    handle: '@alex.fluid',
    email: 'alex@fluid.chain',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  });
  const [editProfileForm, setEditProfileForm] = useState(userProfile);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Functionality State
  const [swapFrom, setSwapFrom] = useState(INITIAL_ASSETS[1]); // ETH
  const [swapTo, setSwapTo] = useState(INITIAL_ASSETS[0]); // FLD
  const [swapAmount, setSwapAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Card Management
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [cvvTimer, setCvvTimer] = useState(0);
  const [tempCvv, setTempCvv] = useState('***');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 
  const [selectedCardTier, setSelectedCardTier] = useState(CARD_TIERS[0]);
  const [newCardType, setNewCardType] = useState<'Virtual' | 'Physical'>('Virtual');
  
  // Load Card State
  const [loadAmount, setLoadAmount] = useState('');
  const [selectedLoadAsset, setSelectedLoadAsset] = useState<any>(INITIAL_ASSETS[1]); // Default ETH
  const [isLoadingCard, setIsLoadingCard] = useState(false);

  // Host
  const [domainSearch, setDomainSearch] = useState('');
  const [isSearchingDomain, setIsSearchingDomain] = useState(false);
  const [domainResult, setDomainResult] = useState<boolean | null>(null);

  // Initial routing
  useEffect(() => {
      if (initialView && initialView !== 'assets' && view === 'locked') {
          // Keep locked initially
      } else if (initialView) {
          // If we were already unlocked or explicit nav handled by handleUnlock
      }
  }, [initialView]);

  const totalBalance = assets.reduce((acc, asset) => acc + (asset.balance * (asset.price || 0)), 0);
  const totalFiat = fiatAssets.reduce((acc, asset) => acc + (asset.symbol === 'USD' ? asset.balance : asset.balance / 1.1), 0);

  const handleUnlock = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setView(initialView as ViewState || 'assets');
    }, 1500);
  };

  const handleSwap = () => {
      if (!swapAmount) return;
      setIsSwapping(true);
      setTimeout(() => {
          setIsSwapping(false);
          setSwapAmount('');
          alert(`Swapped ${swapAmount} ${swapFrom.symbol} to ${swapTo.symbol}`);
          setNotifications(prev => [{id: Date.now(), title: 'Swap Successful', message: `Swapped ${swapAmount} ${swapFrom.symbol}`, time: 'Just now', type: 'success'}, ...prev]);
      }, 2000);
  };

  const handleSend = () => {
      if (!sendAmount || !sendAddress) return;
      setIsSending(true);
      setTimeout(() => {
          setIsSending(false);
          setSendAmount('');
          setSendAddress('');
          setView('assets');
          setNotifications(prev => [{id: Date.now(), title: 'Transfer Sent', message: `Sent to ${sendAddress.slice(0,6)}...`, time: 'Just now', type: 'success'}, ...prev]);
      }, 2000);
  };

  const handleAddCard = () => {
      setIsAddingCard(true);
      setTimeout(() => {
          setIsAddingCard(false);
          const newCard = {
              id: Date.now(),
              type: newCardType,
              name: selectedCardTier.name,
              number: '**** ' + Math.floor(1000 + Math.random() * 9000),
              realNumber: Array(4).fill(0).map(() => Math.floor(1000 + Math.random() * 9000)).join(' '),
              balance: 0,
              color: selectedCardTier.bg,
              border: selectedCardTier.border,
              text: selectedCardTier.text,
              watermark: selectedCardTier.watermark,
              expiry: '12/29',
              cvv: Math.floor(100 + Math.random() * 900).toString(),
              isFrozen: false
          };
          setCards(prev => [...prev, newCard]);
          setView('cards');
      }, 1500);
  };

  const handleDeleteCard = () => {
      if (!selectedCard) return;
      if (window.confirm(`Are you sure you want to delete your ${selectedCard.name}?`)) {
          setIsDeleting(true);
          setTimeout(() => {
              setCards(prev => prev.filter(c => c.id !== selectedCard.id));
              setSelectedCard(null);
              setView('cards');
              setIsDeleting(false);
              setNotifications(prev => [{id: Date.now(), title: 'Card Deleted', message: `${selectedCard.name} removed`, time: 'Just now', type: 'success'}, ...prev]);
          }, 1500);
      }
  };

  const handleLoadCard = () => {
      if (!loadAmount || !selectedCard || !selectedLoadAsset) return;
      const loadValueUSD = parseFloat(loadAmount);
      const assetPrice = selectedLoadAsset.price || 1;
      const requiredAmount = loadValueUSD / assetPrice;

      if (selectedLoadAsset.balance < requiredAmount) {
          alert(`Insufficient ${selectedLoadAsset.symbol} balance.`);
          return;
      }

      setIsLoadingCard(true);
      setTimeout(() => {
          // Update Asset Balance
          if (selectedLoadAsset.type === 'crypto') {
              setAssets(prev => prev.map(a => a.id === selectedLoadAsset.id ? { ...a, balance: a.balance - requiredAmount } : a));
          } else {
              setFiatAssets(prev => prev.map(a => a.id === selectedLoadAsset.id ? { ...a, balance: a.balance - requiredAmount } : a));
          }

          // Update Card Balance
          const updatedCard = { ...selectedCard, balance: selectedCard.balance + loadValueUSD };
          setCards(prev => prev.map(c => c.id === selectedCard.id ? updatedCard : c));
          setSelectedCard(updatedCard);

          // UI Feedback
          setIsLoadingCard(false);
          setLoadAmount('');
          setView('card_details');
          setNotifications(prev => [{id: Date.now(), title: 'Card Loaded', message: `Added $${loadValueUSD} to ${selectedCard.name}`, time: 'Just now', type: 'success'}, ...prev]);
      }, 2000);
  };

  const handleDomainSearch = (e: React.FormEvent) => { 
      e.preventDefault(); 
      setIsSearchingDomain(true); 
      setDomainResult(null); 
      setTimeout(() => { 
          setIsSearchingDomain(false); 
          setDomainResult(true); 
      }, 1500); 
  };

  const handleSaveProfile = () => {
    setIsSavingProfile(true);
    setTimeout(() => {
      setUserProfile(editProfileForm);
      setIsSavingProfile(false);
      setView('settings');
    }, 1000);
  };

  // CVV Timer Logic
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
      if (selectedCard?.isFrozen) {
          alert("Unfreeze card to view CVV");
          return;
      }
      
      // If showing, hide it. If hiding, show it.
      if (showCvv) {
          setShowCvv(false);
          setCvvTimer(0);
      } else {
          setTempCvv(selectedCard.cvv || '123');
          setShowCvv(true);
          setCvvTimer(30); // 30s auto hide
      }
  };

  const handleRegenerateCvv = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (selectedCard?.isFrozen) {
          alert("Card is frozen.");
          return;
      }
      // Generate new 3-digit CVV
      const newCvv = Math.floor(100 + Math.random() * 900).toString();
      
      const updatedCard = { ...selectedCard, cvv: newCvv };
      setSelectedCard(updatedCard);
      setCards(prev => prev.map(c => c.id === selectedCard.id ? updatedCard : c));
      
      // Visual feedback
      setNotifications(prev => [{id: Date.now(), title: 'Security Alert', message: 'Dynamic CVV Rotated', time: 'Just now', type: 'success'}, ...prev]);
      
      // Reset timer if already showing
      if (showCvv) setCvvTimer(30);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col justify-center items-center relative z-10">
      
      {/* Background Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      {/* Description Above */}
      <div className="text-center mb-10 animate-fade-in-up relative z-10">
          <span className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-2 block flex items-center justify-center gap-2">
              <Sparkles size={12} /> Live Interactive Demo
          </span>
          <h2 className="text-3xl font-black text-white mb-4">Fluid Super App Simulator</h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
              Experience the full power of the Fluid ecosystem. No download required. Tap the phone to interact.
          </p>
      </div>

      {/* Device Frame (The Simulator) */}
      <div className="relative w-full max-w-[400px] h-[850px] bg-slate-950 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10 z-10">
        
        {/* Dynamic Island / Notch Area */}
        <div className="absolute top-0 inset-x-0 h-8 bg-black z-50 flex justify-center">
             <div className="w-32 h-6 bg-black rounded-b-2xl flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                <div className="w-12 h-1.5 rounded-full bg-slate-900"></div>
             </div>
        </div>

        {/* --- VIEW: LOCKED (Biometric) --- */}
        {view === 'locked' && (
          <div className="flex-grow flex flex-col items-center justify-center bg-slate-950 relative p-8">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950"></div>
             
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 border border-white/10 flex items-center justify-center mb-8 shadow-2xl shadow-purple-500/30 p-6 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <FluidLogo className="w-full h-full text-white drop-shadow-md" />
                </div>

                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Fluid Dapp</h1>
                <p className="text-slate-500 text-sm font-medium mb-12">Non-Custodial. Encrypted.</p>

                <button 
                  onClick={handleUnlock}
                  className="group relative flex items-center justify-center"
                >
                   {isScanning ? (
                     <div className="relative">
                       <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full animate-pulse"></div>
                       <Scan size={64} className="text-purple-400 animate-spin-slow duration-1000" />
                     </div>
                   ) : (
                     <div className="flex flex-col items-center gap-4 transition-transform group-hover:scale-105">
                        <div className="p-6 rounded-full bg-slate-900 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] group-hover:border-purple-500/60 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] transition-all">
                           <Fingerprint size={40} className="text-purple-400" />
                        </div>
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Tap to Unlock</span>
                     </div>
                   )}
                </button>
             </div>

             <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
                <FluidLogo className="w-64 h-64 text-white" />
             </div>
          </div>
        )}

        {/* --- MAIN APP INTERFACE --- */}
        {view !== 'locked' && (
          <div className="flex-grow flex flex-col bg-slate-950 relative overflow-hidden">
             
             {/* Header */}
             <div className="pt-12 px-6 pb-4 flex justify-between items-center bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" 
                  onClick={() => {
                    setEditProfileForm(userProfile);
                    setView('settings');
                  }}
                >
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                         <img src={userProfile.avatar} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Welcome Back</span>
                      <span className="text-sm font-bold text-white">{userProfile.name}</span>
                   </div>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowNotificationList(!showNotificationList)}
                    className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
                  >
                      <Bell size={18} />
                      {notifications.length > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>}
                  </button>

                  {showNotificationList && (
                    <div className="absolute right-0 top-12 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 animate-fade-in-up z-50">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                            <h3 className="font-bold text-white text-sm">Notifications</h3>
                            <button onClick={() => setNotifications([])} className="text-[10px] text-purple-400 hover:text-purple-300">Clear</button>
                        </div>
                        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? <p className="text-center text-slate-500 text-xs">No new notifications</p> : notifications.map(n => (
                                <div key={n.id} className="flex gap-3 hover:bg-white/5 p-2 rounded-lg">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1"></div>
                                    <div><div className="text-xs font-bold text-white">{n.title}</div><div className="text-[10px] text-slate-400">{n.message}</div></div>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}
                </div>
             </div>

             {/* Content Scroll Area */}
             <div className="flex-grow overflow-y-auto px-6 pb-24 custom-scrollbar">
                
                {/* --- ASSETS VIEW --- */}
                {view === 'assets' && (
                  <div className="space-y-6 animate-fade-in-up">
                    <div className="relative w-full aspect-[1.6/1] rounded-3xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl shadow-purple-900/20 group">
                       <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900"></div>
                       <div className="relative z-10 flex justify-between items-start">
                          <div className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                             <span className="text-[10px] font-bold text-purple-200 flex items-center gap-1"><ShieldCheck size={10} /> Fluid Protected</span>
                          </div>
                          <MoreHorizontal size={20} className="text-purple-200" />
                       </div>
                       <div className="relative z-10">
                          <div className="flex items-center justify-between">
                              <span className="text-slate-300 text-xs font-medium">Total Balance (Crypto + Fiat)</span>
                              <button onClick={() => setShowBalance(!showBalance)} className="text-slate-400 hover:text-white p-1">
                                  {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
                              </button>
                          </div>
                          <div className="text-3xl font-black text-white mt-1 tracking-tight">
                              {showBalance ? '$' + (totalBalance + totalFiat).toLocaleString(undefined, {maximumFractionDigits: 2}) : '****'}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1"><span className="text-emerald-400 text-xs font-bold">+$2,450.20 (4.2%)</span></div>
                       </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                         <button onClick={() => setView('deposit')} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-purple-600 transition-all shadow-lg"><Plus size={20} /></div><span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-400">Deposit</span></button>
                         <button onClick={() => setView('withdraw')} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-purple-600 transition-all shadow-lg"><LogOut size={20} className="-rotate-90" /></div><span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-400">Withdraw</span></button>
                         <button onClick={() => setView('swap')} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-purple-600 transition-all shadow-lg"><RefreshCw size={20} /></div><span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-400">Swap</span></button>
                         <button onClick={() => setView('send')} className="flex flex-col items-center gap-2 group"><div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-purple-600 transition-all shadow-lg"><Send size={20} /></div><span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-400">Send</span></button>
                    </div>

                    <div>
                       <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-white">Crypto Assets</h3><button className="text-xs font-bold text-purple-400">Manage</button></div>
                       <div className="space-y-3">
                          {assets.map((asset) => (
                             <div key={asset.id} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl hover:bg-slate-800 transition-all">
                                <div className="flex items-center gap-4">
                                   <div className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-xs ${asset.color} border border-white/5`}>{asset.id === 'fld' ? <FluidLogo className="w-5 h-5 text-current" /> : asset.symbol[0]}</div>
                                   <div><div className="font-bold text-white text-sm">{asset.name}</div><div className="text-xs text-slate-500">{asset.balance.toLocaleString()} {asset.symbol}</div></div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-white text-sm">
                                        {showBalance ? '$' + (asset.balance * asset.price).toLocaleString(undefined, {maximumFractionDigits: 2}) : '****'}
                                    </div>
                                    <div className="text-xs text-emerald-400 font-medium">+1.2%</div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                {/* --- SWAP VIEW --- */}
                {view === 'swap' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4">
                            <button onClick={() => setView('assets')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                            <h2 className="text-xl font-bold text-white">Swap Assets</h2>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 relative">
                            <div className="p-4 bg-slate-950 rounded-2xl mb-2">
                                <div className="flex justify-between text-xs text-slate-500 mb-2"><span>Pay</span><span>Bal: {swapFrom.balance}</span></div>
                                <div className="flex items-center justify-between">
                                    <input type="number" placeholder="0.0" value={swapAmount} onChange={(e) => setSwapAmount(e.target.value)} className="bg-transparent text-2xl font-bold text-white w-24 outline-none placeholder-slate-600" />
                                    <button className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700"><span className={`font-bold ${swapFrom.color}`}>{swapFrom.symbol}</span><ChevronDown size={14} className="text-slate-400"/></button>
                                </div>
                            </div>
                            <div className="flex justify-center -my-5 relative z-10"><div className="bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-xl cursor-pointer hover:rotate-180 transition-transform"><ArrowDown size={16} className="text-purple-400" /></div></div>
                            <div className="p-4 bg-slate-950 rounded-2xl mt-2">
                                <div className="flex justify-between text-xs text-slate-500 mb-2"><span>Receive</span><span>Bal: {swapTo.balance}</span></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-slate-400">{swapAmount ? (parseFloat(swapAmount) * 1.05).toFixed(4) : '0.0'}</span>
                                    <button className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700"><span className={`font-bold ${swapTo.color}`}>{swapTo.symbol}</span><ChevronDown size={14} className="text-slate-400"/></button>
                                </div>
                            </div>
                        </div>
                        <button disabled={!swapAmount || isSwapping} onClick={handleSwap} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-900/20 disabled:opacity-50 flex items-center justify-center gap-2">{isSwapping ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}{isSwapping ? 'Swapping...' : 'Swipe to Swap'}</button>
                    </div>
                )}

                {/* --- SEND VIEW --- */}
                {view === 'send' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4">
                            <button onClick={() => setView('assets')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                            <h2 className="text-xl font-bold text-white">Send Crypto</h2>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                           <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Recipient Address</label>
                           <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 mb-6 focus-within:border-purple-500 transition-colors">
                              <input type="text" placeholder="0x..." value={sendAddress} onChange={(e) => setSendAddress(e.target.value)} className="bg-transparent w-full text-sm text-white outline-none font-mono" />
                              <button className="text-purple-400 hover:text-white"><Scan size={18} /></button>
                           </div>
                           <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Amount</label>
                           <div className="relative mb-8">
                               <input type="number" placeholder="0.00" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} className="w-full bg-transparent text-5xl font-black text-center text-white outline-none placeholder-slate-800" />
                               <span className="block text-center text-sm text-slate-500 mt-2 font-bold">ETH</span>
                           </div>
                           <button disabled={!sendAmount || !sendAddress || isSending} onClick={handleSend} className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">{isSending ? <Loader2 className="animate-spin" /> : <Send size={20} />}{isSending ? 'Sending...' : 'Confirm Send'}</button>
                        </div>
                    </div>
                )}

                {/* --- CARDS VIEW --- */}
                {view === 'cards' && (
                   <div className="space-y-6 animate-fade-in-up">
                      <div className="flex justify-between items-end mb-2">
                         <h2 className="text-2xl font-bold text-white">Cards</h2>
                         <button onClick={() => setView('add_card')} className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-purple-600 transition-colors"><Plus size={20}/></button>
                      </div>
                      <div className="flex flex-col gap-4">
                        {cards.map((card) => (
                            <div key={card.id} onClick={() => { setSelectedCard(card); setView('card_details'); setShowFullNumber(false); }} className={`relative aspect-[1.58/1] rounded-2xl ${card.color} border ${card.border} shadow-xl overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform duration-300`}>
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                {/* Huge Visible Fluid Logo on Plate */}
                                <div className={`absolute -bottom-12 -right-12 w-64 h-64 opacity-10 transform rotate-12 pointer-events-none ${card.text === 'text-slate-900' ? 'text-slate-900' : 'text-white'}`}>
                                    <FluidLogo className="w-full h-full fill-current" />
                                </div>
                                
                                {card.isFrozen && <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-20 flex items-center justify-center"><div className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm backdrop-blur-md shadow-xl"><Snowflake size={16} /> Frozen</div></div>}
                                <div className={`relative z-10 p-5 flex flex-col justify-between h-full ${card.text || 'text-white'}`}>
                                    <div className="flex justify-between items-start"><div className="flex items-center gap-1.5"><FluidLogo className="w-5 h-5 text-current" /><span className="font-bold text-lg tracking-tight italic">Fluid</span></div></div>
                                    <div>
                                        <div className="text-2xl font-bold mb-2 tracking-wide">
                                            {showBalance ? '$' + card.balance.toLocaleString() : '****'}
                                        </div>
                                        <div className="font-mono text-sm tracking-widest mb-1 opacity-80">{card.number}</div>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span className="text-[10px] opacity-70 uppercase font-bold">{card.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[9px] font-bold uppercase opacity-80">CVV</div>
                                                <div className="text-xs font-mono font-bold">***</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                      </div>
                   </div>
                )}

                {/* --- ADD CARD VIEW --- */}
                {view === 'add_card' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4">
                            <button onClick={() => setView('cards')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white">
                                <ChevronLeft size={20}/>
                            </button>
                            <h2 className="text-xl font-bold text-white">Add New Card</h2>
                        </div>

                        {/* Card Type Toggle */}
                        <div className="bg-slate-900 p-1 rounded-xl flex">
                            <button 
                                onClick={() => setNewCardType('Virtual')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${newCardType === 'Virtual' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500'}`}
                            >
                                Virtual
                            </button>
                            <button 
                                onClick={() => setNewCardType('Physical')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${newCardType === 'Physical' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500'}`}
                            >
                                Physical
                            </button>
                        </div>

                        {/* Card Preview (Selected) */}
                        <div className={`relative aspect-[1.58/1] rounded-2xl ${selectedCardTier.bg} ${selectedCardTier.border} border shadow-2xl p-6 overflow-hidden transition-all duration-500`}>
                             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                             {/* WATERMARK */}
                             <div className={`absolute -bottom-10 -right-10 opacity-10 rotate-12 pointer-events-none transform scale-110 ${selectedCardTier.text === 'text-slate-900' ? 'text-slate-900' : 'text-white'}`}>
                                <FluidLogo className="w-48 h-48" />
                             </div>
                             <div className={`relative z-10 flex flex-col justify-between h-full ${selectedCardTier.text}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2"><FluidLogo className="w-6 h-6 text-current" /><span className="font-bold text-lg italic">Fluid</span></div>
                                    <span className={`text-[10px] border px-1.5 py-0.5 rounded uppercase font-bold ${selectedCardTier.text === 'text-slate-900' ? 'border-slate-900/30' : 'border-white/30'}`}>{newCardType}</span>
                                </div>
                                <div>
                                    <div className="text-xl tracking-widest mb-1 font-mono">**** **** **** 0000</div>
                                    <div className="text-[10px] opacity-70 uppercase font-bold">{selectedCardTier.name}</div>
                                </div>
                             </div>
                        </div>

                        {/* Plate Selection */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-3 block ml-1">Select Metal Plate</label>
                            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                {CARD_TIERS.map(tier => (
                                    <button
                                        key={tier.id}
                                        onClick={() => setSelectedCardTier(tier)}
                                        className={`p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden group ${
                                            selectedCardTier.id === tier.id ? 'border-purple-500 ring-1 ring-purple-500/50' : 'border-slate-800 hover:border-slate-700'
                                        }`}
                                    >
                                        <div className={`absolute inset-0 ${tier.bg} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                                        <div className="relative z-10">
                                            <span className={`block text-xs font-bold ${selectedCardTier.id === tier.id ? 'text-white' : 'text-slate-400'}`}>{tier.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handleAddCard} 
                            disabled={isAddingCard}
                            className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-lg mt-auto flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                        >
                            {isAddingCard ? <Loader2 className="animate-spin" size={20}/> : <Plus size={20} />}
                            {isAddingCard ? 'Issuing Card...' : 'Issue Card'}
                        </button>
                    </div>
                )}

                {/* --- CARD DETAILS VIEW --- */}
                {view === 'card_details' && selectedCard && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4"><button onClick={() => setView('cards')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button><h2 className="text-xl font-bold text-white">Card Management</h2></div>
                        <div className={`relative aspect-[1.58/1] rounded-2xl ${selectedCard.color} border ${selectedCard.border} shadow-2xl overflow-hidden p-6 ${selectedCard.text || 'text-white'}`}>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            {/* Logo Background in Details too */}
                            <div className={`absolute -bottom-12 -right-12 w-64 h-64 opacity-10 transform rotate-12 pointer-events-none ${selectedCard.text === 'text-slate-900' ? 'text-slate-900' : 'text-white'}`}>
                                <FluidLogo className="w-full h-full fill-current" />
                            </div>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2"><FluidLogo className="w-6 h-6 text-current" /><span className="font-bold text-lg italic">Fluid</span></div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">
                                            {showBalance ? '$' + selectedCard.balance.toLocaleString() : '****'}
                                        </div>
                                        <div className="text-[10px] opacity-70 uppercase font-bold">Balance</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="font-mono text-xl tracking-widest shadow-sm">{showFullNumber ? selectedCard.realNumber : selectedCard.number}</div>
                                        <button onClick={() => setShowFullNumber(!showFullNumber)} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">{showFullNumber ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div><div className="text-[10px] uppercase opacity-70 mb-0.5">Card Holder</div><div className="font-bold text-sm">{selectedCard.name}</div></div>
                                        <div className="text-right flex gap-3">
                                            <div>
                                                <div className="text-[10px] uppercase opacity-70 mb-0.5">Expires</div>
                                                <div className="font-bold text-sm">{selectedCard.expiry}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase opacity-70 mb-0.5">CVV</div>
                                                <div 
                                                    onClick={showCvv ? handleRegenerateCvv : undefined}
                                                    className={`font-bold text-sm font-mono flex items-center gap-1 ${showCvv ? 'cursor-pointer hover:text-blue-400 transition-colors' : ''}`}
                                                    title={showCvv ? "Tap to regenerate" : ""}
                                                >
                                                    {showCvv ? selectedCard.cvv : '***'}
                                                    {showCvv && <RefreshCw size={10} className="opacity-70" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            <button 
                                onClick={() => { 
                                    setLoadAmount(''); 
                                    setSelectedLoadAsset(INITIAL_ASSETS[1]); 
                                    setView('load_card'); 
                                }} 
                                disabled={selectedCard.isFrozen}
                                className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center gap-1 transition-colors hover:border-emerald-500/50 disabled:opacity-50"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400"><ArrowDownCircle size={16} /></div>
                                <span className="text-[10px] font-bold text-white">Load</span>
                            </button>
                            <button onClick={() => { const updated = cards.map(c => c.id === selectedCard.id ? {...c, isFrozen: !c.isFrozen} : c); setCards(updated); setSelectedCard(updated.find(c => c.id === selectedCard.id)); }} className={`p-3 border rounded-xl flex flex-col items-center gap-1 transition-colors ${selectedCard.isFrozen ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800'}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedCard.isFrozen ? 'bg-blue-500/20' : 'bg-slate-800'}`}>{selectedCard.isFrozen ? <Snowflake size={16}/> : <Lock size={16}/>}</div><span className="text-[10px] font-bold text-white">{selectedCard.isFrozen ? 'Unfrz' : 'Freeze'}</span></button>
                            <button onClick={handleToggleCvv} disabled={selectedCard.isFrozen} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center gap-1 transition-colors relative overflow-hidden"><div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-blue-400"><ScanEye size={16} /></div><span className="text-[10px] font-bold text-white">{showCvv ? 'Hide' : 'CVV'}</span>{showCvv && <div className="absolute inset-0 bg-blue-600/10 flex flex-col items-center justify-center z-10 pointer-events-none"><div className="flex items-center gap-1 text-[8px] text-blue-200 mt-8"><Timer size={8} /> {cvvTimer}s</div></div>}</button>
                            <button 
                                onClick={handleDeleteCard} 
                                disabled={isDeleting}
                                className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center gap-1 transition-colors hover:border-red-500/50 hover:bg-red-500/10 disabled:opacity-50"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-red-500">
                                    {isDeleting ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />}
                                </div>
                                <span className="text-[10px] font-bold text-white">Delete</span>
                            </button>
                        </div>
                        <div className="mt-6 mb-6">
                            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Recent Transactions</h3>
                            <div className="space-y-3">{MOCK_TRANSACTIONS.map((tx) => <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-400'}`}>{tx.icon === 'coffee' ? <Coffee size={18} /> : tx.icon === 'car' ? <Car size={18} /> : <ShoppingBag size={18} />}</div><div><div className="font-bold text-white text-sm">{tx.merchant}</div><div className="text-[10px] text-slate-500">{tx.date}</div></div></div><div className={`font-mono text-sm font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>{tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}</div></div>)}</div>
                        </div>
                    </div>
                )}

                {/* --- LOAD CARD VIEW --- */}
                {view === 'load_card' && selectedCard && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4">
                            <button onClick={() => setView('card_details')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                            <h2 className="text-xl font-bold text-white">Load {selectedCard.name}</h2>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                            <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Amount to Load (USD)</label>
                            <div className="relative mb-6">
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={loadAmount}
                                    onChange={(e) => setLoadAmount(e.target.value)}
                                    className="w-full bg-transparent text-5xl font-black text-center text-white outline-none placeholder-slate-800"
                                />
                                <span className="block text-center text-sm text-slate-500 mt-2 font-bold">Current Bal: {showBalance ? '$' + selectedCard.balance.toLocaleString() : '****'}</span>
                            </div>

                            <label className="text-xs text-slate-500 font-bold uppercase mb-3 block">Pay With</label>
                            <div className="space-y-2 mb-8 max-h-48 overflow-y-auto custom-scrollbar">
                                {[...assets, ...fiatAssets].map((asset) => (
                                    <button 
                                        key={asset.id}
                                        onClick={() => setSelectedLoadAsset(asset)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                                            selectedLoadAsset?.id === asset.id 
                                            ? 'bg-blue-500/10 border-blue-500' 
                                            : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${asset.color || ''} bg-slate-900`}>
                                                {asset.type === 'crypto' ? asset.symbol[0] : asset.flag}
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-bold text-white">{asset.name}</div>
                                                <div className="text-[10px] text-slate-500">Bal: {asset.balance.toLocaleString()} {asset.symbol}</div>
                                            </div>
                                        </div>
                                        {loadAmount && (
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-white">
                                                    - {(parseFloat(loadAmount || '0') / (asset.price || 1)).toFixed(4)} {asset.symbol}
                                                </div>
                                                <div className="text-[10px] text-slate-500">Rate: ${asset.price}</div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <button 
                                disabled={!loadAmount || isLoadingCard}
                                onClick={handleLoadCard}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoadingCard ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                {isLoadingCard ? 'Processing...' : 'Confirm Load'}
                            </button>
                        </div>
                    </div>
                )}

                {/* --- HOST VIEW --- */}
                {view === 'host' && (
                  <div className="space-y-6 animate-fade-in-up">
                      <h2 className="text-2xl font-bold text-white">Fluid Host</h2>
                      <form onSubmit={handleDomainSearch} className="relative">
                          <input type="text" value={domainSearch} onChange={(e) => { setDomainSearch(e.target.value); setDomainResult(null); }} placeholder="Search .fluid domains" className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-4 pr-12 text-white focus:outline-none focus:border-indigo-500" />
                          <button type="submit" disabled={isSearchingDomain || !domainSearch} className="absolute right-2 top-2 bottom-2 bg-indigo-600 rounded-lg px-4 text-white font-bold text-xs flex items-center justify-center disabled:opacity-50">{isSearchingDomain ? <Loader2 size={16} className="animate-spin"/> : 'Search'}</button>
                      </form>
                      {domainResult && <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 flex justify-between items-center animate-fade-in-up"><div><div className="font-bold text-white">{domainSearch}</div><div className="text-xs text-emerald-500 uppercase font-bold">Available</div></div><button className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg">Claim Free</button></div>}
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800"><HardDrive className="text-indigo-500 mb-2" size={24} /><div className="text-2xl font-bold text-white">45MB</div><div className="text-xs text-slate-500">Storage Used</div></div>
                          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800"><Activity className="text-emerald-500 mb-2" size={24} /><div className="text-2xl font-bold text-white">100%</div><div className="text-xs text-slate-500">Uptime</div></div>
                      </div>
                      <div>
                          <h3 className="font-bold text-white mb-3">Deployments</h3>
                          <div className="space-y-3">
                              {HOST_DEPLOYMENTS.map(deploy => (
                                  <div key={deploy.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                                      <div><div className="font-bold text-white text-sm">{deploy.name}</div><div className="text-xs text-blue-400">{deploy.url}</div></div>
                                      <div className={`w-2 h-2 rounded-full ${deploy.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
                )}

                {/* --- SETTINGS/PROFILE --- */}
                {view === 'settings' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4"><button onClick={() => setView('assets')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button><h2 className="text-xl font-bold text-white">Settings</h2></div>
                        <div onClick={() => setView('profile')} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-purple-500/50 transition-colors"><div className="flex items-center gap-4"><div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5"><img src={userProfile.avatar} alt="avatar" className="w-full h-full rounded-full bg-slate-900 object-cover" /></div><div><div className="font-bold text-white">{userProfile.name}</div><div className="text-xs text-slate-500">{userProfile.handle}</div></div></div><ChevronRight size={18} className="text-slate-400" /></div>
                        <div className="space-y-3"><div className="px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">General</div><button className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><ShieldCheck size={18} /></div><span className="text-sm font-bold text-white">Security</span></div><ChevronRight size={16} className="text-slate-600" /></button></div>
                        <div className="pt-4"><button onClick={() => setView('locked')} className="w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-xl border border-red-500/20 hover:bg-red-500/20 flex items-center justify-center gap-2"><LogOut size={18} /> Log Out</button></div>
                    </div>
                )}

                {view === 'profile' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4"><button onClick={() => setView('settings')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button><h2 className="text-xl font-bold text-white">Edit Profile</h2></div>
                        <div className="space-y-4">
                            <div><label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Name</label><input type="text" value={editProfileForm.name} onChange={(e) => setEditProfileForm({...editProfileForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white" /></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Handle</label><input type="text" value={editProfileForm.handle} onChange={(e) => setEditProfileForm({...editProfileForm, handle: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white" /></div>
                        </div>
                        <button onClick={handleSaveProfile} disabled={isSavingProfile} className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl mt-4 flex items-center justify-center gap-2">{isSavingProfile ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}{isSavingProfile ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                )}

             </div>

             {/* Bottom Navigation */}
             <div className="absolute bottom-6 left-6 right-6 bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-4 rounded-3xl flex justify-between items-center shadow-2xl z-40">
                <NavButton id="assets" icon={Wallet} label="Wallet" view={view} setView={setView} />
                <NavButton id="swap" icon={ArrowRightLeft} label="Swap" view={view} setView={setView} />
                <div className="relative -top-8">
                   <button 
                      onClick={() => setView('assets')}
                      className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform"
                   >
                      <FluidLogo className="w-6 h-6 fill-current" />
                   </button>
                </div>
                <NavButton id="cards" icon={CreditCard} label="Cards" view={view} setView={setView} />
                <NavButton id="host" icon={Globe} label="Host" view={view} setView={setView} />
             </div>
          </div>
        )}
      </div>

      {/* Description Below */}
      <div className="text-center mt-12 animate-fade-in-up delay-200 max-w-lg z-10">
          <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
              <span className="flex items-center gap-2"><Lock size={12} className="text-emerald-500" /> Non-Custodial</span>
              <span className="flex items-center gap-2"><Zap size={12} className="text-blue-500" /> Instant Issue</span>
          </div>
          <p className="text-sm text-slate-500">
              Try the "Load" feature to simulate adding crypto funds, or use "Host" to register a decentralized domain.
          </p>
      </div>
    </div>
  );
};

export default FluidWalletApp;