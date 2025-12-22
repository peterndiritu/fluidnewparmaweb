
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
  Eye, EyeOff, Timer, KeyRound, Map, Palette, Trash2, Snowflake
} from 'lucide-react';

interface FluidWalletAppProps {
  onNavigate: (page: string) => void;
  initialView?: string;
}

// Mock Data
const INITIAL_ASSETS = [
  { id: 'fld', symbol: 'FLD', name: 'Fluid', balance: 45200, price: 0.5, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', type: 'crypto' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', balance: 4.20, price: 2450.00, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', type: 'crypto' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', balance: 145.5, price: 150.00, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', type: 'crypto' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', balance: 5000, price: 1.00, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', type: 'crypto' },
];

const FIAT_ASSETS = [
  { id: 'usd', symbol: 'USD', name: 'US Dollar', balance: 2500.00, color: 'text-emerald-500', flag: '🇺🇸', type: 'fiat' },
  { id: 'eur', symbol: 'EUR', name: 'Euro', balance: 140.50, color: 'text-blue-500', flag: '🇪🇺', type: 'fiat' },
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Deposit Successful', message: 'Your Bank Transfer of $1,000 arrived.', time: '2m ago', type: 'success' },
  { id: 2, title: 'Security Alert', message: 'New login from Mac OS X', time: '1h ago', type: 'warning' },
  { id: 3, title: 'System Update', message: 'Fluid Node v2.1 is live', time: '1d ago', type: 'info' },
];

const HOST_DEPLOYMENTS = [
  { id: 1, name: 'Personal Portfolio', url: 'fluid://alex.fluid', status: 'Online', visitors: '1.2k', storage: '45 MB' },
  { id: 2, name: 'Fluid DEX Interface', url: 'fluid://dex.fluid', status: 'Syncing', visitors: '8.5k', storage: '120 MB' }
];

const CARD_TIERS = [
  { id: 'black', name: 'Fluid Black', bg: 'bg-slate-950', border: 'border-slate-800', text: 'text-white', watermark: 'text-white/5', ring: 'ring-slate-800' },
  { id: 'steel', name: 'Fluid Steel', bg: 'bg-gradient-to-br from-slate-700 to-slate-900', border: 'border-slate-600', text: 'text-white', watermark: 'text-white/10', ring: 'ring-slate-600' },
  { id: 'silver', name: 'Fluid Silver', bg: 'bg-gradient-to-br from-gray-100 via-gray-300 to-gray-400', border: 'border-gray-400', text: 'text-slate-900', watermark: 'text-slate-900/10', ring: 'ring-gray-300' },
  { id: 'bronze', name: 'Fluid Bronze', bg: 'bg-gradient-to-br from-amber-800 to-amber-950', border: 'border-amber-700', text: 'text-amber-50', watermark: 'text-white/10', ring: 'ring-amber-700' },
  { id: 'platinum', name: 'Fluid Platinum', bg: 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500', border: 'border-slate-300', text: 'text-slate-900', watermark: 'text-slate-900/10', ring: 'ring-slate-400' },
  { id: 'gold', name: 'Fluid Gold', bg: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600', border: 'border-yellow-500', text: 'text-yellow-950', watermark: 'text-yellow-900/20', ring: 'ring-yellow-500' },
];

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 20 H78 C83.5 20 88 24.5 88 30 C88 35.5 83.5 40 78 40 H38 L48 20 Z" fill="currentColor" />
    <path d="M35 45 H65 C70.5 45 75 49.5 75 55 C75 60.5 70.5 65 65 65 H25 L35 45 Z" fill="currentColor" />
    <path d="M22 70 H52 C57.5 70 62 74.5 62 80 C62 85.5 57.5 90 52 90 H12 L22 70 Z" fill="currentColor" />
  </svg>
);

const MOCK_CARDS = [
    { id: 1, type: 'Virtual', name: 'Fluid Black', number: '**** 4829', realNumber: '4829 1029 4829 4829', balance: 5000, color: 'bg-slate-900', border: 'border-slate-800', text: 'text-white', watermark: 'text-white/5', expiry: '12/28', cvv: '123', isFrozen: false },
    { id: 2, type: 'Physical', name: 'Fluid Steel', number: '**** 9921', realNumber: '9921 5521 8832 9921', balance: 1200, color: 'bg-gradient-to-br from-slate-700 to-slate-900', border: 'border-slate-600', text: 'text-white', watermark: 'text-white/10', expiry: '09/27', cvv: '456', isFrozen: true }
];

type ViewState = 'locked' | 'assets' | 'swap' | 'cards' | 'host' | 'send' | 'receive' | 'deposit' | 'withdraw' | 'add_card' | 'settings' | 'profile' | 'card_details';

const NavButton: React.FC<{ id: ViewState; icon: any; label: string; view: ViewState; setView: (v: ViewState) => void }> = ({ id, icon: Icon, label, view, setView }) => (
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

const FluidWalletApp: React.FC<FluidWalletAppProps> = ({ onNavigate, initialView = 'assets' }) => {
  const [view, setView] = useState<ViewState>('locked');
  const [isScanning, setIsScanning] = useState(false);
  const [showNotificationList, setShowNotificationList] = useState(false);
  
  // Wallet Data State
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [cards, setCards] = useState(MOCK_CARDS);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Alexander',
    handle: '@alex.fluid',
    email: 'alex@fluid.chain',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  });
  const [editProfileForm, setEditProfileForm] = useState(userProfile);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Swap State
  const [swapFrom, setSwapFrom] = useState(INITIAL_ASSETS[1]); // ETH
  const [swapTo, setSwapTo] = useState(INITIAL_ASSETS[0]); // FLD
  const [swapAmount, setSwapAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  // Send State
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Add Card State
  const [newCardType, setNewCardType] = useState<'Virtual' | 'Physical'>('Virtual');
  const [selectedCardTier, setSelectedCardTier] = useState(CARD_TIERS[0]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({ address: '', city: '', zip: '' });

  // Card Management State
  const [cvvTimer, setCvvTimer] = useState(0);
  const [showCvv, setShowCvv] = useState(false);
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [tempCvv, setTempCvv] = useState('***');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [isOrderingPhysical, setIsOrderingPhysical] = useState(false);

  // Host Flow
  const [domainSearch, setDomainSearch] = useState('');
  const [isSearchingDomain, setIsSearchingDomain] = useState(false);
  const [domainResult, setDomainResult] = useState<boolean | null>(null);

  const totalBalance = assets.reduce((acc, asset) => acc + (asset.balance * asset.price), 0);
  const totalFiat = FIAT_ASSETS.reduce((acc, asset) => acc + (asset.symbol === 'USD' ? asset.balance : asset.balance / 1.1), 0);

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

  const handleUnlock = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setView('assets');
    }, 1500);
  };

  const handleDomainSearch = (e: React.FormEvent) => { e.preventDefault(); setIsSearchingDomain(true); setDomainResult(null); setTimeout(() => { setIsSearchingDomain(false); setDomainResult(true); }, 1500); };
  const clearNotifications = () => { setNotifications([]); setShowNotificationList(false); };

  const handleSwap = () => {
      if (!swapAmount) return;
      setIsSwapping(true);
      setTimeout(() => {
          setIsSwapping(false);
          setSwapAmount('');
          alert(`Swapped ${swapAmount} ${swapFrom.symbol} to ${swapTo.symbol}`);
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
      if (newCardType === 'Physical' && (!shippingDetails.address || !shippingDetails.city || !shippingDetails.zip)) return;
      
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
          setShippingDetails({ address: '', city: '', zip: '' });
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

  const handleRevealCvv = () => {
      if (selectedCard?.isFrozen) {
          alert("Unfreeze card to view CVV");
          return;
      }
      setTempCvv(selectedCard.cvv || '123');
      setShowCvv(true);
      setCvvTimer(30);
  };

  const handleSetPin = () => {
      if(newPin.length !== 4) return;
      setIsSettingPin(false);
      setNewPin('');
      alert("PIN updated successfully.");
  };

  const handleOrderPhysical = () => {
      if(!shippingDetails.address) return;
      setIsOrderingPhysical(true);
      setTimeout(() => {
          setIsOrderingPhysical(false);
          setCards(prev => prev.map(c => c.id === selectedCard.id ? {...c, type: 'Physical', name: selectedCard.name} : c));
          setView('cards');
          setShippingDetails({ address: '', city: '', zip: '' });
      }, 2000);
  };

  const handleFreezeCard = () => {
      if (!selectedCard) return;
      const updatedCards = cards.map(c => 
          c.id === selectedCard.id ? { ...c, isFrozen: !c.isFrozen } : c
      );
      setCards(updatedCards);
      setSelectedCard(updatedCards.find(c => c.id === selectedCard.id));
  };

  const handleDeleteCard = () => {
      if (!selectedCard) return;
      if (confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
          setCards(prev => prev.filter(c => c.id !== selectedCard.id));
          setSelectedCard(null);
          setView('cards');
      }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col justify-center items-center relative z-10">
      
      {/* Background Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      {/* Intro Text & Desktop Toggle */}
      <div className="text-center mb-10 relative z-20">
        
        {/* FLUID DAPP Visual Box */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[260px] border border-blue-400/20 rounded-lg flex items-end justify-end p-4 pointer-events-none -z-10">
           <span className="text-white/40 font-bold tracking-widest text-xs">FLUID DAPP</span>
        </div>

        <button 
          onClick={() => {
            setView('locked');
            setIsScanning(false);
          }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 animate-fade-in-up hover:bg-purple-500/20 transition-colors cursor-pointer"
        >
          <Smartphone size={14} />
          Mobile Simulator
        </button>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight animate-fade-in-up delay-100">
          Fluid Super Wallet
        </h1>
        <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto animate-fade-in-up delay-200">
          Experience the power of a non-custodial multi-chain wallet directly in your browser. Encrypted, secure, and intuitive.
        </p>
        <button 
          onClick={() => onNavigate('desktop')}
          className="inline-flex items-center gap-2 px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-fade-in-up delay-300 group"
        >
          <Monitor size={20} className="group-hover:text-purple-600 transition-colors" />
          Explore Desktop Version
        </button>
      </div>

      {/* Device Frame (The Simulator) */}
      <div className="relative w-full max-w-[400px] h-[850px] bg-slate-950 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
        
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
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-8 shadow-2xl shadow-purple-900/20">
                    <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <Wallet className="text-white" size={24} />
                    </div>
                </div>

                <h1 className="text-2xl font-black text-white mb-2 tracking-tight">Fluid Vault</h1>
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

                  {/* Notification Dropdown */}
                  {showNotificationList && (
                    <div className="absolute right-0 top-12 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 animate-fade-in-up z-50">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                            <h3 className="font-bold text-white text-sm">Notifications</h3>
                            <span onClick={clearNotifications} className="text-[10px] text-purple-400 cursor-pointer hover:text-purple-300">Clear all</span>
                        </div>
                        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <p className="text-center text-slate-500 text-xs py-4">No new notifications</p>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} className="flex gap-3 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer">
                                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'success' ? 'bg-emerald-500' : n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                        <div>
                                            <div className="text-xs font-bold text-white">{n.title}</div>
                                            <div className="text-[10px] text-slate-400">{n.message}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                  )}
                </div>
             </div>

             {/* Content Scroll Area */}
             <div className="flex-grow overflow-y-auto px-6 pb-24 custom-scrollbar">
                
                {/* --- ASSETS VIEW - Default --- */}
                {view === 'assets' && (
                  <div className="space-y-6 animate-fade-in-up">
                    
                    {/* Security Tip */}
                    <div className="bg-slate-900/80 border-l-4 border-blue-500 p-4 rounded-r-xl flex items-start gap-3 shadow-lg">
                        <ShieldCheck size={18} className="text-blue-500 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="text-xs font-bold text-white mb-0.5">Security Tip</h4>
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                Fluid Support will <strong>NEVER</strong> ask for your seed phrase.
                            </p>
                        </div>
                    </div>

                    {/* Balance Card */}
                    <div className="relative w-full aspect-[1.6/1] rounded-3xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl shadow-purple-900/20 group">
                       <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900"></div>
                       <div className="relative z-10 flex justify-between items-start">
                          <div className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                             <span className="text-[10px] font-bold text-purple-200 flex items-center gap-1">
                                <ShieldCheck size={10} /> Vault Protected
                             </span>
                          </div>
                          <MoreHorizontal size={20} className="text-purple-200" />
                       </div>

                       <div className="relative z-10">
                          <span className="text-slate-300 text-xs font-medium">Total Balance (Crypto + Fiat)</span>
                          <div className="text-3xl font-black text-white mt-1 tracking-tight">${(totalBalance + totalFiat).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                             <span className="text-emerald-400 text-xs font-bold">+$2,450.20 (4.2%)</span>
                          </div>
                       </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-4 gap-4">
                         <button onClick={() => setView('deposit')} className="flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-purple-600 transition-all shadow-lg">
                               <Plus size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-400">Deposit</span>
                         </button>
                         <button onClick={() => setView('withdraw')} className="flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-purple-600 transition-all shadow-lg">
                               <LogOut size={20} className="-rotate-90" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-400">Withdraw</span>
                         </button>
                         <button onClick={() => setView('swap')} className="flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-purple-600 transition-all shadow-lg">
                               <RefreshCw size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-400">Swap</span>
                         </button>
                         <button onClick={() => setView('send')} className="flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-purple-600 transition-all shadow-lg">
                               <Send size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-400">Send</span>
                         </button>
                    </div>

                    {/* Assets List */}
                    <div>
                       <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-white">Crypto Assets</h3>
                          <button className="text-xs font-bold text-purple-400">Manage</button>
                       </div>
                       <div className="space-y-3">
                          {assets.map((asset) => (
                             <div key={asset.id} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl hover:bg-slate-800 transition-all">
                                <div className="flex items-center gap-4">
                                   <div className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-xs ${asset.color} border border-white/5`}>
                                      {asset.id === 'fld' ? <FluidLogo className="w-5 h-5 text-current" /> : asset.symbol[0]}
                                   </div>
                                   <div>
                                      <div className="font-bold text-white text-sm">{asset.name}</div>
                                      <div className="text-xs text-slate-500">{asset.balance.toLocaleString()} {asset.symbol}</div>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <div className="font-bold text-white text-sm">${(asset.balance * asset.price).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                                   <div className="text-xs text-emerald-400 font-medium">+1.2%</div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                {/* --- SETTINGS VIEW --- */}
                {view === 'settings' && (
                  <div className="space-y-6 animate-fade-in-up">
                      <div className="flex items-center gap-4 mb-4">
                          <button onClick={() => setView('assets')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                          <h2 className="text-xl font-bold text-white">Settings</h2>
                      </div>

                      {/* Profile Card */}
                      <div 
                        onClick={() => {
                          setEditProfileForm(userProfile);
                          setView('profile');
                        }}
                        className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-purple-500/50 transition-colors"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
                                <img src={userProfile.avatar} alt="avatar" className="w-full h-full rounded-full bg-slate-900 object-cover" />
                            </div>
                            <div>
                               <div className="font-bold text-white">{userProfile.name}</div>
                               <div className="text-xs text-slate-500">{userProfile.handle}</div>
                            </div>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                            <ChevronRight size={18} />
                         </div>
                      </div>

                      <div className="space-y-3">
                         <div className="px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">General</div>
                         
                         <button className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><ShieldCheck size={18} /></div>
                                <span className="text-sm font-bold text-white">Security & Privacy</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-600" />
                         </button>
                         
                         <button className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Bell size={18} /></div>
                                <span className="text-sm font-bold text-white">Notifications</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">On</span>
                                <ChevronRight size={16} className="text-slate-600" />
                            </div>
                         </button>

                         <button className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><Globe size={18} /></div>
                                <span className="text-sm font-bold text-white">Currency</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">USD</span>
                                <ChevronRight size={16} className="text-slate-600" />
                            </div>
                         </button>
                      </div>

                      <div className="space-y-3">
                         <div className="px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">Support</div>
                         
                         <button className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500"><HelpCircle size={18} /></div>
                                <span className="text-sm font-bold text-white">Help Center</span>
                            </div>
                            <ExternalLink size={16} className="text-slate-600" />
                         </button>

                         <button className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500"><FileText size={18} /></div>
                                <span className="text-sm font-bold text-white">Terms & Privacy</span>
                            </div>
                            <ExternalLink size={16} className="text-slate-600" />
                         </button>
                      </div>

                      <div className="pt-4">
                         <button onClick={() => setView('locked')} className="w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                             <LogOut size={18} /> Log Out
                         </button>
                         <p className="text-center text-[10px] text-slate-600 mt-4 font-mono">Fluid App v2.4.0 (Build 492)</p>
                      </div>
                  </div>
                )}

                {/* --- PROFILE SETTINGS VIEW --- */}
                {view === 'profile' && (
                   <div className="space-y-6 animate-fade-in-up">
                      <div className="flex items-center gap-4 mb-4">
                          <button onClick={() => setView('settings')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                      </div>

                      <div className="flex flex-col items-center mb-8">
                          <div className="relative group cursor-pointer">
                              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 mb-4">
                                  <img src={editProfileForm.avatar} alt="avatar" className="w-full h-full rounded-full bg-slate-900 object-cover" />
                              </div>
                              <div className="absolute bottom-4 right-0 p-2 bg-purple-600 rounded-full text-white border-2 border-slate-950 hover:bg-purple-500 transition-colors">
                                  <Camera size={16} />
                              </div>
                          </div>
                          <p className="text-xs font-bold text-purple-400">Change Profile Picture</p>
                      </div>

                      <div className="space-y-4">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Display Name</label>
                              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3 focus-within:border-purple-500 transition-colors">
                                  <User size={18} className="text-slate-500" />
                                  <input 
                                    type="text" 
                                    value={editProfileForm.name}
                                    onChange={(e) => setEditProfileForm({...editProfileForm, name: e.target.value})}
                                    className="bg-transparent w-full text-white font-bold outline-none text-sm"
                                  />
                              </div>
                          </div>

                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Handle</label>
                              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3 focus-within:border-purple-500 transition-colors">
                                  <span className="text-slate-500 font-bold">@</span>
                                  <input 
                                    type="text" 
                                    value={editProfileForm.handle.replace('@', '')}
                                    onChange={(e) => setEditProfileForm({...editProfileForm, handle: '@' + e.target.value})}
                                    className="bg-transparent w-full text-white font-bold outline-none text-sm"
                                  />
                              </div>
                          </div>

                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block ml-1">Email Address</label>
                              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3 focus-within:border-purple-500 transition-colors">
                                  <Mail size={18} className="text-slate-500" />
                                  <input 
                                    type="email" 
                                    value={editProfileForm.email}
                                    onChange={(e) => setEditProfileForm({...editProfileForm, email: e.target.value})}
                                    className="bg-transparent w-full text-white font-bold outline-none text-sm"
                                  />
                              </div>
                          </div>
                      </div>

                      <button 
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                      >
                         {isSavingProfile ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                         {isSavingProfile ? 'Saving...' : 'Save Changes'}
                      </button>
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
                            {/* Pay */}
                            <div className="p-4 bg-slate-950 rounded-2xl mb-2">
                                <div className="flex justify-between text-xs text-slate-500 mb-2">
                                    <span>Pay</span>
                                    <span>Bal: {swapFrom.balance}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <input 
                                        type="number" 
                                        placeholder="0.0" 
                                        value={swapAmount}
                                        onChange={(e) => setSwapAmount(e.target.value)}
                                        className="bg-transparent text-2xl font-bold text-white w-24 outline-none placeholder-slate-600"
                                    />
                                    <button className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                                        <span className={`font-bold ${swapFrom.color}`}>{swapFrom.symbol}</span>
                                        <ChevronDown size={14} className="text-slate-400"/>
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="flex justify-center -my-5 relative z-10">
                                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-xl cursor-pointer hover:rotate-180 transition-transform">
                                    <ArrowDown size={16} className="text-purple-400" />
                                </div>
                            </div>

                            {/* Receive */}
                            <div className="p-4 bg-slate-950 rounded-2xl mt-2">
                                <div className="flex justify-between text-xs text-slate-500 mb-2">
                                    <span>Receive</span>
                                    <span>Bal: {swapTo.balance}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-slate-400">{swapAmount ? (parseFloat(swapAmount) * 1.05).toFixed(4) : '0.0'}</span>
                                    <button className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                                        <span className={`font-bold ${swapTo.color}`}>{swapTo.symbol}</span>
                                        <ChevronDown size={14} className="text-slate-400"/>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Rate</span>
                                <span className="text-white">1 {swapFrom.symbol} ≈ {(swapFrom.price / swapTo.price).toFixed(2)} {swapTo.symbol}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Fee (0.5%)</span>
                                <span className="text-white">$1.20</span>
                            </div>
                        </div>

                        <button 
                            disabled={!swapAmount || isSwapping}
                            onClick={handleSwap}
                            className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSwapping ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                            {isSwapping ? 'Swapping...' : 'Swipe to Swap'}
                        </button>
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
                              <input 
                                type="text" 
                                placeholder="0x..." 
                                value={sendAddress}
                                onChange={(e) => setSendAddress(e.target.value)}
                                className="bg-transparent w-full text-sm text-white outline-none font-mono"
                              />
                              <button className="text-purple-400 hover:text-white"><Scan size={18} /></button>
                           </div>

                           <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Amount</label>
                           <div className="relative mb-8">
                               <input 
                                  type="number" 
                                  placeholder="0.00" 
                                  value={sendAmount}
                                  onChange={(e) => setSendAmount(e.target.value)}
                                  className="w-full bg-transparent text-5xl font-black text-center text-white outline-none placeholder-slate-800"
                               />
                               <span className="block text-center text-sm text-slate-500 mt-2 font-bold">ETH</span>
                           </div>

                           <button 
                              disabled={!sendAmount || !sendAddress || isSending}
                              onClick={handleSend}
                              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                           >
                              {isSending ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                              {isSending ? 'Sending...' : 'Confirm Send'}
                           </button>
                        </div>
                    </div>
                )}

                {/* --- RECEIVE VIEW --- */}
                {view === 'receive' && (
                    <div className="space-y-6 animate-fade-in-up flex flex-col items-center pt-8">
                         <div className="w-full flex items-center gap-4 mb-4">
                            <button onClick={() => setView('assets')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                            <h2 className="text-xl font-bold text-white">Receive</h2>
                        </div>
                        
                        <div className="bg-white p-4 rounded-3xl shadow-2xl">
                           <QrCode size={200} className="text-slate-900" />
                        </div>
                        
                        <div className="text-center">
                           <h3 className="text-white font-bold text-lg mb-1">{userProfile.name}'s Wallet</h3>
                           <p className="text-slate-500 text-xs bg-slate-900 px-3 py-1 rounded-full border border-slate-800 font-mono">0x71C...9A21</p>
                        </div>

                        <div className="flex gap-4 w-full">
                           <button className="flex-1 bg-slate-900 border border-slate-800 py-3 rounded-xl text-white font-bold text-sm hover:bg-slate-800 flex items-center justify-center gap-2">
                              <Copy size={16} /> Copy
                           </button>
                           <button className="flex-1 bg-slate-900 border border-slate-800 py-3 rounded-xl text-white font-bold text-sm hover:bg-slate-800 flex items-center justify-center gap-2">
                              <Scan size={16} /> Share
                           </button>
                        </div>
                    </div>
                )}

                {/* --- DEPOSIT VIEW --- */}
                {view === 'deposit' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4">
                            <button onClick={() => setView('assets')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                            <h2 className="text-xl font-bold text-white">Deposit Fiat</h2>
                        </div>
                        
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-4 cursor-pointer hover:border-purple-500 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500"><Banknote size={20} /></div>
                                <div>
                                    <div className="font-bold text-white">Bank Transfer</div>
                                    <div className="text-xs text-slate-500">1-3 Business Days • 0% Fee</div>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-4 cursor-pointer hover:border-purple-500 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><CreditCard size={20} /></div>
                                <div>
                                    <div className="font-bold text-white">Card Payment</div>
                                    <div className="text-xs text-slate-500">Instant • 2.5% Fee</div>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-4 cursor-pointer hover:border-purple-500 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500"><Phone size={20} /></div>
                                <div>
                                    <div className="font-bold text-white">Apple Pay</div>
                                    <div className="text-xs text-slate-500">Instant • 2.5% Fee</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- WITHDRAW VIEW --- */}
                {view === 'withdraw' && (
                     <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4">
                            <button onClick={() => setView('assets')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                            <h2 className="text-xl font-bold text-white">Withdraw</h2>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
                            <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">Verification Required</h3>
                            <p className="text-sm text-slate-400 mb-6">To withdraw fiat currency to a bank account, you must complete KYC verification level 2.</p>
                            <button className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700">Start Verification</button>
                        </div>
                     </div>
                )}

                {/* --- CARDS VIEW --- */}
                {view === 'cards' && (
                   <div className="space-y-6 animate-fade-in-up">
                      <div className="flex justify-between items-end mb-2">
                         <h2 className="text-2xl font-bold text-white">Cards</h2>
                         <button onClick={() => setView('add_card')} className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-purple-600 transition-colors">
                             <Plus size={20}/>
                         </button>
                      </div>

                      <div className="flex flex-col gap-4">
                        {cards.map((card) => (
                            <div 
                                key={card.id} 
                                onClick={() => { setSelectedCard(card); setView('card_details'); setShowFullNumber(false); }}
                                className={`relative aspect-[1.58/1] rounded-2xl ${card.color} border ${card.border} shadow-xl overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform duration-300`}
                            >
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 blur-2xl rounded-full"></div>
                                
                                {card.isFrozen && (
                                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                                        <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm backdrop-blur-md shadow-xl">
                                            <Snowflake size={16} /> Frozen
                                        </div>
                                    </div>
                                )}
                                
                                {/* Watermark */}
                                <div className={`absolute bottom-[-10%] left-[-10%] ${card.watermark || 'text-white/5'} opacity-30 transform -rotate-12 pointer-events-none`}>
                                    <FluidLogo className="w-40 h-40" />
                                </div>

                                <div className={`relative z-10 p-5 flex flex-col justify-between h-full ${card.text || 'text-white'}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-1.5">
                                            <FluidLogo className="w-5 h-5 text-current" />
                                            <span className="font-bold text-lg tracking-tight italic">Fluid</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-mono text-lg tracking-widest mb-1">{card.number}</div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] opacity-70 uppercase font-bold">{card.name}</span>
                                            <span className={`text-[9px] font-bold uppercase border px-1.5 py-0.5 rounded ${card.text === 'text-slate-900' ? 'border-slate-900/30' : 'border-white/30'}`}>{card.type}</span>
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
                            <button onClick={() => setView('cards')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                            <h2 className="text-xl font-bold text-white">Add Card</h2>
                        </div>
                        
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                            <label className="text-xs text-slate-500 font-bold uppercase mb-3 block">1. Select Format</label>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button 
                                    onClick={() => setNewCardType('Virtual')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${newCardType === 'Virtual' ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                                >
                                    <Smartphone size={24} />
                                    <span className="text-xs font-bold">Virtual</span>
                                </button>
                                <button 
                                    onClick={() => setNewCardType('Physical')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${newCardType === 'Physical' ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                                >
                                    <CreditCard size={24} />
                                    <span className="text-xs font-bold">Physical</span>
                                </button>
                            </div>

                            <label className="text-xs text-slate-500 font-bold uppercase mb-3 block flex items-center gap-2"><Palette size={12}/> 2. Select Plate Design</label>
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {CARD_TIERS.map(tier => (
                                    <button
                                        key={tier.id}
                                        onClick={() => setSelectedCardTier(tier)}
                                        className={`p-2 rounded-xl border text-[10px] font-bold transition-all relative overflow-hidden h-16 flex flex-col justify-end items-center ${
                                            selectedCardTier.id === tier.id 
                                            ? `border-transparent ring-2 ${tier.ring || 'ring-blue-500'} scale-105 shadow-xl` 
                                            : 'border-slate-700 opacity-70 hover:opacity-100 hover:border-slate-500'
                                        } ${tier.bg} ${tier.text}`}
                                    >
                                        <div className={`absolute -top-4 -right-4 ${tier.watermark} opacity-30 transform rotate-12`}>
                                            <FluidLogo className="w-16 h-16" />
                                        </div>
                                        <span className="relative z-10 text-center leading-tight">{tier.name.replace('Fluid ', '')}</span>
                                    </button>
                                ))}
                            </div>

                            {newCardType === 'Physical' && (
                                <div className="space-y-3 mb-6 animate-fade-in-up">
                                    <h4 className="text-xs font-bold text-white uppercase flex items-center gap-2"><MapPin size={12}/> 3. Shipping Address</h4>
                                    <input 
                                        type="text" 
                                        placeholder="Street Address"
                                        value={shippingDetails.address}
                                        onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:border-purple-500 outline-none"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input 
                                            type="text" 
                                            placeholder="City"
                                            value={shippingDetails.city}
                                            onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:border-purple-500 outline-none"
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="ZIP Code"
                                            value={shippingDetails.zip}
                                            onChange={(e) => setShippingDetails({...shippingDetails, zip: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <button 
                                onClick={handleAddCard}
                                disabled={isAddingCard}
                                className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2"
                            >
                                {isAddingCard ? <Loader2 className="animate-spin"/> : <Plus size={20} />}
                                {isAddingCard ? 'Processing...' : `Create ${selectedCardTier.name}`}
                            </button>
                        </div>
                    </div>
                )}

                {/* --- CARD DETAILS VIEW --- */}
                {view === 'card_details' && selectedCard && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4">
                            <button onClick={() => setView('cards')} className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                            <h2 className="text-xl font-bold text-white">Card Management</h2>
                        </div>

                        {/* Visual Card */}
                        <div className={`relative aspect-[1.58/1] rounded-2xl ${selectedCard.color} border ${selectedCard.border} shadow-2xl overflow-hidden p-6 ${selectedCard.text || 'text-white'}`}>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            
                            {selectedCard.isFrozen && (
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                                    <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm backdrop-blur-md shadow-xl animate-pulse">
                                        <Snowflake size={16} /> Frozen
                                    </div>
                                </div>
                            )}

                            {/* Large Watermark */}
                            <div className={`absolute -bottom-12 -right-12 ${selectedCard.watermark || 'text-white/5'} opacity-30 transform -rotate-12 pointer-events-none`}>
                                <FluidLogo className="w-64 h-64" />
                            </div>
                            
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <FluidLogo className="w-6 h-6 text-current" />
                                        <span className="font-bold text-lg italic">Fluid</span>
                                    </div>
                                    <span className={`text-xs border px-2 py-0.5 rounded font-bold uppercase ${selectedCard.text === 'text-slate-900' ? 'border-slate-900/30' : 'border-white/30'}`}>{selectedCard.type}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="font-mono text-xl tracking-widest shadow-sm">
                                            {showFullNumber ? selectedCard.realNumber : selectedCard.number}
                                        </div>
                                        <button 
                                            onClick={() => setShowFullNumber(!showFullNumber)}
                                            className={`p-1.5 rounded-full hover:bg-white/20 transition-colors ${selectedCard.text === 'text-slate-900' ? 'text-slate-600' : 'text-white/70'}`}
                                        >
                                            {showFullNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-[10px] uppercase opacity-70 mb-0.5">Card Holder</div>
                                            <div className="font-bold text-sm">{selectedCard.name}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] uppercase opacity-70 mb-0.5">Expires</div>
                                            <div className="font-bold text-sm">{selectedCard.expiry}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={handleFreezeCard}
                                className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-colors ${
                                    selectedCard.isFrozen 
                                    ? 'bg-blue-500/10 border-blue-500 text-blue-400 hover:bg-blue-500/20' 
                                    : 'bg-slate-900 border-slate-800 hover:border-purple-500/50'
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCard.isFrozen ? 'bg-blue-500/20' : 'bg-slate-800'}`}>
                                    {selectedCard.isFrozen ? <Snowflake size={20} className="text-blue-400"/> : <Lock size={20} className="text-purple-400" />}
                                </div>
                                <span className="text-xs font-bold text-white">{selectedCard.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
                            </button>
                            <button 
                                onClick={handleRevealCvv}
                                disabled={selectedCard.isFrozen}
                                className={`p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center gap-2 transition-colors relative overflow-hidden ${selectedCard.isFrozen ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500/50'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
                                    <ScanEye size={20} />
                                </div>
                                <span className="text-xs font-bold text-white">Dynamic CVV</span>
                                {showCvv && (
                                    <div className="absolute inset-0 bg-blue-600 flex flex-col items-center justify-center z-10 animate-fade-in-up">
                                        <span className="text-2xl font-black text-white tracking-widest">{tempCvv}</span>
                                        <div className="flex items-center gap-1 text-[10px] text-blue-200 mt-1">
                                            <Timer size={10} /> {cvvTimer}s
                                        </div>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* PIN Setting UI */}
                        {isSettingPin ? (
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl animate-fade-in-up">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">New 4-Digit PIN</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="password" 
                                        maxLength={4}
                                        value={newPin}
                                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g,''))}
                                        placeholder="****"
                                        className="flex-grow bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-center tracking-[0.5em] font-mono focus:border-purple-500 outline-none"
                                    />
                                    <button 
                                        onClick={handleSetPin}
                                        className="bg-purple-600 text-white px-4 rounded-lg font-bold text-xs"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsSettingPin(true)}
                                disabled={selectedCard.isFrozen}
                                className="w-full py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                <KeyRound size={16} /> Change PIN
                            </button>
                        )}

                        {/* Request Physical Card Logic */}
                        {selectedCard.type === 'Virtual' && (
                            <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-5 rounded-2xl mt-4">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Upgrade to Physical</h3>
                                        <p className="text-xs text-slate-400 mt-1">Get the {selectedCard.name} physical card. Spend crypto instantly at 50M+ merchants.</p>
                                    </div>
                                </div>
                                
                                {!isOrderingPhysical ? (
                                    <>
                                        <div className="space-y-3 mb-4">
                                            <input 
                                                type="text" 
                                                placeholder="Shipping Address"
                                                value={shippingDetails.address}
                                                onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                                            />
                                        </div>
                                        <button 
                                            onClick={handleOrderPhysical}
                                            className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Truck size={16} /> Order Card (Free)
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center py-4 text-emerald-500 animate-fade-in-up">
                                        <Loader2 size={32} className="animate-spin mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Processing Order...</span>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Physical Card Status */}
                        {selectedCard.type === 'Physical' && (
                            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Truck size={20} className="text-blue-500" />
                                    <div>
                                        <div className="text-xs font-bold text-white">Shipping Status</div>
                                        <div className="text-[10px] text-slate-500">Arriving in 3-5 days</div>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">On the way</div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-slate-800/50">
                            <button 
                                onClick={handleDeleteCard}
                                className="w-full text-red-500 text-xs font-bold py-3 flex items-center justify-center gap-2 hover:bg-red-500/10 rounded-xl transition-colors"
                            >
                                <Trash2 size={14} /> Terminate Card
                            </button>
                        </div>
                    </div>
                )}
                
                {/* --- HOST VIEW --- */}
                {view === 'host' && (
                  <div className="space-y-6 animate-fade-in-up">
                      <h2 className="text-2xl font-bold text-white">Fluid Host</h2>
                      <form onSubmit={handleDomainSearch} className="relative">
                          <input 
                              type="text" 
                              value={domainSearch}
                              onChange={(e) => { setDomainSearch(e.target.value); setDomainResult(null); }}
                              placeholder="Search .fluid domains" 
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-4 pr-12 text-white focus:outline-none focus:border-indigo-500"
                          />
                          <button 
                              type="submit"
                              disabled={isSearchingDomain || !domainSearch}
                              className="absolute right-2 top-2 bottom-2 bg-indigo-600 rounded-lg px-4 text-white font-bold text-xs flex items-center justify-center disabled:opacity-50"
                          >
                              {isSearchingDomain ? <Loader2 size={16} className="animate-spin"/> : 'Search'}
                          </button>
                      </form>
                      {domainResult && (
                          <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 flex justify-between items-center animate-fade-in-up">
                              <div><div className="font-bold text-white">{domainSearch}</div><div className="text-xs text-emerald-500 uppercase font-bold">Available</div></div>
                              <button className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg">Claim Free</button>
                          </div>
                      )}
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
    </div>
  );
};

export default FluidWalletApp;
