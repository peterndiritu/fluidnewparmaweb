import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, Apple, Box, ArrowDownUp, ChevronDown, RefreshCw, 
  Wallet as WalletIcon, Layers, CreditCard, Shield, 
  Globe, Smartphone, Zap, Landmark, DollarSign,
  Building2, SmartphoneNfc, Receipt, ArrowRightLeft,
  CheckCircle2, ShieldAlert, X, ShieldCheck, AlertTriangle,
  History, Settings, MoreHorizontal, Layout, Search, ExternalLink,
  Network, Database, Coins, Eye, Cloud, Lock, Plus, Save,
  Fingerprint, ScanFace, EyeOff, Truck, MapPin, User, CreditCard as CardIcon,
  Wifi, Ban, Globe2, Compass, AlertCircle, Sparkles, Key, Smartphone as PhoneIcon,
  ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Monitor, Terminal, Info, 
  ArrowDown, Briefcase, Gamepad2, Share2, Rocket, ArrowRight, MousePointer2,
  LockKeyhole, UserCircle, ChevronLeft, Bell
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

interface FluidWalletAppProps {
  onNavigate: (page: string) => void;
  initialView?: 'assets' | 'swap' | 'card' | 'fiat' | 'security' | 'history' | 'dapps';
}

// Mock Data for Chart
const chartData = [
  { name: 'Mon', value: 12400 },
  { name: 'Tue', value: 12800 },
  { name: 'Wed', value: 12200 },
  { name: 'Thu', value: 13500 },
  { name: 'Fri', value: 13100 },
  { name: 'Sat', value: 14200 },
  { name: 'Sun', value: 14592 },
];

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="currentColor" />
    <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="currentColor" />
    <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 83.3137 82 60 82H10L15 66Z" fill="currentColor" />
  </svg>
);

const FluidWalletApp: React.FC<FluidWalletAppProps> = ({ initialView = 'assets' }) => {
  const [mockupView, setMockupView] = useState<'assets' | 'swap' | 'card' | 'history' | 'security' | 'dapps'>(initialView as any);
  const [openDropdown, setOpenDropdown] = useState<string | null>('wallet');
  
  // Navigation internal state for deeper simulation
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  
  // Card Specific States
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  
  // Swap States
  const [swapInput, setSwapInput] = useState('1.5');
  const [swapOutput, setSwapOutput] = useState('8420');
  const [swapStep, setSwapStep] = useState<'input' | 'review' | 'processing' | 'success'>('input');

  // Security Preferences
  const [securitySettings, setSecuritySettings] = useState({
    globalBiometrics: true,
    requireForCardDetails: true,
    requireForLimits: true,
    requireForSwaps: true,
    seedPhraseBackedUp: false,
    twoFactorEnabled: false,
  });

  const [spentAmount] = useState(2400);
  const [monthlyLimit, setMonthlyLimit] = useState(5000);
  
  // Dynamic Island State
  const [islandState, setIslandState] = useState<'idle' | 'faceid' | 'loading' | 'success'>('idle');

  const sidebarMenu = [
    { id: 'wallet', label: 'Wallet Hub', icon: WalletIcon, children: ['Assets', 'History', 'Portfolio'] },
    { id: 'banking', label: 'Payments', icon: CreditCard, children: ['Native Cards', 'Fiat Rails', 'Billing'] },
    { id: 'trade', label: 'Trading', icon: RefreshCw, children: ['Fluid DEX', 'Limit Orders', 'Analytics'] },
    { id: 'privacy', label: 'Security', icon: LockKeyhole, children: ['Biometrics', '2FA Center', 'Privacy'] }
  ];

  const coins = [
    { name: 'Fluid', symbol: 'FLD', amount: '45,000', value: '$22,500', color: 'bg-emerald-500', trend: '+1.2%', chartColor: '#10b981' },
    { name: 'Ethereum', symbol: 'ETH', amount: '12.5', value: '$38,240', color: 'bg-indigo-500', trend: '+0.8%', chartColor: '#6366f1' },
    { name: 'Tether', symbol: 'USDT', amount: '63,852', value: '$63,852', color: 'bg-slate-600', trend: '+0.0%', chartColor: '#94a3b8' }
  ];

  const transactions = [
    { id: '1', type: 'swap', token: 'FLD', subToken: 'ETH', amount: '+1,200', usdValue: '$600.00', status: 'completed', date: 'Today, 2:45 PM', icon: ArrowLeftRight },
    { id: '2', type: 'send', token: 'ETH', address: '0x7a...2f1', amount: '-0.5', usdValue: '$1,240.50', status: 'completed', date: 'Today, 11:20 AM', icon: ArrowUpRight },
    { id: '3', type: 'receive', token: 'USDT', from: 'Exchange', amount: '+5,000', usdValue: '$5,000.00', status: 'completed', date: 'Yesterday', icon: ArrowDownLeft },
    { id: '4', type: 'card', token: 'USD', merchant: 'Apple Store', amount: '-$999.00', usdValue: '$999.00', status: 'completed', date: 'Oct 24, 2024', icon: CardIcon },
  ];

  const dapps = [
    { id: '1', name: 'Fluid DEX', category: 'defi', icon: RefreshCw, desc: 'Swap tokens instantly' },
    { id: '2', name: 'Fluid Lend', category: 'defi', icon: Landmark, desc: 'Lending protocol' },
    { id: '3', name: 'ParmaDAO', category: 'social', icon: User, desc: 'Governance portal' },
    { id: '4', name: 'Fluid NFT', category: 'utility', icon: Layout, desc: 'NFT Marketplace' }
  ];

  // Helper: Trigger FaceID Simulation
  const triggerFaceID = (onSuccess: () => void) => {
    setIslandState('faceid');
    setTimeout(() => {
        setIslandState('success');
        setTimeout(() => {
            setIslandState('idle');
            onSuccess();
        }, 800);
    }, 1500);
  };

  const handleSwap = () => {
    setSwapStep('review');
  };

  const confirmSwap = () => {
    triggerFaceID(() => {
        setSwapStep('processing');
        setTimeout(() => {
            setSwapStep('success');
            setTimeout(() => {
                setSwapStep('input');
                setMockupView('assets'); // Go back to assets after swap
            }, 2000);
        }, 1500);
    });
  };

  const limitPercentage = Math.min((spentAmount / monthlyLimit) * 100, 100);

  return (
    <div className="min-h-screen pt-32 pb-12 flex flex-col lg:flex-row max-w-7xl mx-auto px-4 gap-8">
      
      {/* CSS for 3D Card Flip */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      {/* Left Sidebar Dropdown Navigation */}
      <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
        <div className="sticky top-32 w-full">
            <div className="bg-[#0F1115] border border-white/5 rounded-2xl p-2 shadow-2xl overflow-hidden">
               <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Wallet</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
               </div>
               
               <div className="flex flex-col gap-1">
                   {sidebarMenu.map((menu) => (
                     <div key={menu.id} className="group">
                        <button 
                          onClick={() => setOpenDropdown(openDropdown === menu.id ? null : menu.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 border ${
                             openDropdown === menu.id 
                             ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                             : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                          }`}
                        >
                           <div className="flex items-center gap-3">
                              <menu.icon size={16} className={openDropdown === menu.id ? 'text-emerald-500' : 'text-slate-500 group-hover:text-slate-400'} />
                              <span className="text-xs font-bold tracking-wide">{menu.label}</span>
                           </div>
                           <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === menu.id ? 'rotate-180 text-emerald-500' : 'text-slate-600'}`} />
                        </button>
                        
                        {openDropdown === menu.id && (
                           <div className="mt-1 mb-2 ml-3 pl-3 border-l border-white/5 space-y-0.5 animate-fade-in-up">
                              {menu.children.map((child) => (
                                <button 
                                  key={child}
                                  onClick={() => {
                                     setSelectedAsset(null);
                                     if (child === 'Assets') setMockupView('assets');
                                     if (child === 'Native Cards') setMockupView('card');
                                     if (child === 'History') setMockupView('history');
                                     if (child === 'Fluid DEX') setMockupView('swap');
                                     if (child === 'Privacy') setMockupView('security');
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                >
                                   <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-emerald-500 transition-colors"></div>
                                   {child}
                                </button>
                              ))}
                           </div>
                        )}
                     </div>
                   ))}
               </div>

               {/* User Profile Snippet */}
               <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg">
                     <UserCircle size={20} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-white">Fluid User</span>
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Verified</span>
                  </div>
               </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow">
        <section className="text-center lg:text-left mb-12 px-4 lg:px-0">
           <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
              <span className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px]">V2.0 LIVE SIMULATION</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-none">
              Super <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500">Wallet</span>
           </h1>
           <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 font-medium">
              Interact with the simulation below to experience the future of non-custodial finance.
           </p>
        </section>

        {/* Interface Mockup */}
        <section className="max-w-[420px] mx-auto lg:mx-0 relative z-10">
            {/* Phone Container */}
            <div className="bg-[#0b0e14] border-[6px] border-[#1e232f] rounded-[3.5rem] shadow-2xl overflow-hidden relative min-h-[820px] flex flex-col">
                
                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 inset-x-0 h-10 flex justify-center z-50 pt-3 pointer-events-none">
                    <div className={`bg-black rounded-full transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden ${
                        islandState === 'faceid' ? 'w-48 h-12' : 
                        islandState === 'success' ? 'w-48 h-12 bg-emerald-500' :
                        islandState === 'loading' ? 'w-32 h-8' : 
                        'w-28 h-8'
                    }`}>
                        {islandState === 'faceid' && (
                            <>
                                <ScanFace size={20} className="text-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Face ID</span>
                            </>
                        )}
                        {islandState === 'success' && (
                             <>
                                <CheckCircle2 size={20} className="text-white" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Success</span>
                             </>
                        )}
                        {islandState === 'idle' && (
                             <div className="w-16 h-full flex items-center justify-center gap-1.5">
                                 <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                                 <div className="w-1.5 h-1.5 rounded-full bg-blue-900/50"></div>
                             </div>
                        )}
                    </div>
                </div>

                {/* Status Bar */}
                <div className="flex justify-between items-center px-8 pt-4 pb-2 text-[10px] font-bold text-white z-40">
                    <span>9:41</span>
                    <div className="flex gap-1.5">
                        <Wifi size={12} />
                        <div className="w-4 h-2.5 bg-white rounded-[2px] relative overflow-hidden">
                             <div className="absolute inset-y-0 left-0 w-[80%] bg-black"></div>
                        </div>
                    </div>
                </div>

                {/* Main Screen Content */}
                <div className="flex-grow flex flex-col relative bg-[#020617] overflow-hidden">
                  
                  {/* Views */}
                  <div className="flex-grow overflow-y-auto no-scrollbar pb-24 relative">
                     
                     {/* Asset View */}
                     {mockupView === 'assets' && !selectedAsset && (
                        <div className="animate-fade-in-up px-6 pt-6 space-y-6">
                            {/* Total Balance */}
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Total Balance</span>
                                <h2 className="text-4xl font-black text-white tracking-tighter">$14,592.45</h2>
                                <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full text-[10px] font-bold mt-2">
                                    <ArrowUpRight size={10} /> +2.4% Today
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-4 gap-3">
                                {['Send', 'Receive', 'Buy', 'More'].map((action, i) => (
                                    <button key={i} className="flex flex-col items-center gap-2 group">
                                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white group-active:scale-95 transition-transform border border-white/5">
                                            {i === 0 && <ArrowUpRight size={20} />}
                                            {i === 1 && <ArrowDownLeft size={20} />}
                                            {i === 2 && <CreditCard size={20} />}
                                            {i === 3 && <MoreHorizontal size={20} />}
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400">{action}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Chart Area */}
                            <div className="h-40 -mx-6 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Asset List */}
                            <div className="space-y-3 pb-8">
                                <h3 className="text-sm font-bold text-white">Assets</h3>
                                {coins.map(coin => (
                                    <div key={coin.symbol} onClick={() => setSelectedAsset(coin.name)} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-98 transition-all cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full ${coin.color} flex items-center justify-center text-white font-bold`}>{coin.symbol[0]}</div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{coin.name}</div>
                                                <div className="text-[10px] text-slate-400">{coin.amount} {coin.symbol}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-white">{coin.value}</div>
                                            <div className="text-[10px] text-emerald-500 font-bold">{coin.trend}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                     )}

                     {/* Detailed Asset View (Drill Down) */}
                     {selectedAsset && mockupView === 'assets' && (
                        <div className="animate-fade-in-up h-full flex flex-col">
                            <div className="px-6 pt-2 pb-4 flex items-center gap-4 border-b border-white/5">
                                <button onClick={() => setSelectedAsset(null)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white"><ChevronLeft size={18}/></button>
                                <span className="font-bold text-white">{selectedAsset}</span>
                            </div>
                            <div className="flex-grow p-6 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-full bg-emerald-500 mb-4 flex items-center justify-center text-2xl font-black text-white">
                                    {selectedAsset[0]}
                                </div>
                                <h2 className="text-3xl font-black text-white mb-1">$22,500.00</h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8">~45,000 FLD</p>
                                
                                <div className="w-full bg-slate-900 rounded-2xl p-4 border border-white/5 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-slate-400 font-bold">Network Stats</span>
                                        <span className="text-[9px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Live</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-left">
                                        <div>
                                            <span className="text-[9px] text-slate-500 uppercase block">Market Cap</span>
                                            <span className="text-xs text-white font-bold">$450M</span>
                                        </div>
                                        <div>
                                            <span className="text-[9px] text-slate-500 uppercase block">Vol (24h)</span>
                                            <span className="text-xs text-white font-bold">$12.4M</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    <button className="py-3 rounded-xl bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider">Stake</button>
                                    <button className="py-3 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase tracking-wider">Trade</button>
                                </div>
                            </div>
                        </div>
                     )}

                     {/* Swap View */}
                     {mockupView === 'swap' && (
                         <div className="px-6 pt-6 h-full flex flex-col">
                             <h2 className="text-xl font-black text-white mb-6">Fluid DEX</h2>
                             
                             {swapStep === 'input' && (
                                 <div className="space-y-2 animate-fade-in-up">
                                     {/* Input Token */}
                                     <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
                                         <div className="flex justify-between mb-2">
                                             <span className="text-[10px] font-bold text-slate-500 uppercase">Pay</span>
                                             <span className="text-[10px] font-bold text-slate-500">Bal: 12.5 ETH</span>
                                         </div>
                                         <div className="flex justify-between items-center">
                                             <input 
                                                 type="text" 
                                                 value={swapInput}
                                                 onChange={(e) => setSwapInput(e.target.value)}
                                                 className="bg-transparent text-2xl font-bold text-white w-1/2 outline-none"
                                             />
                                             <div className="flex items-center gap-2 bg-slate-800 px-2 py-1.5 rounded-xl border border-white/5">
                                                 <div className="w-5 h-5 rounded-full bg-indigo-500"></div>
                                                 <span className="text-xs font-bold text-white">ETH</span>
                                                 <ChevronDown size={12} className="text-slate-500" />
                                             </div>
                                         </div>
                                     </div>

                                     <div className="flex justify-center -my-3 relative z-10">
                                         <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 text-white shadow-lg">
                                             <ArrowDown size={16} />
                                         </div>
                                     </div>

                                     {/* Output Token */}
                                     <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
                                         <div className="flex justify-between mb-2">
                                             <span className="text-[10px] font-bold text-slate-500 uppercase">Receive</span>
                                             <span className="text-[10px] font-bold text-emerald-500">Best Rate</span>
                                         </div>
                                         <div className="flex justify-between items-center">
                                             <div className="text-2xl font-bold text-emerald-400">{swapOutput}</div>
                                             <div className="flex items-center gap-2 bg-slate-800 px-2 py-1.5 rounded-xl border border-white/5">
                                                 <div className="w-5 h-5 rounded-full bg-emerald-500"></div>
                                                 <span className="text-xs font-bold text-white">FLD</span>
                                                 <ChevronDown size={12} className="text-slate-500" />
                                             </div>
                                         </div>
                                     </div>

                                     <div className="mt-8">
                                         <button onClick={handleSwap} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                                             Review Swap
                                         </button>
                                     </div>
                                 </div>
                             )}

                             {swapStep === 'review' && (
                                 <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 mt-4 animate-fade-in-up">
                                     <h3 className="text-center font-bold text-white mb-6">Confirm Transaction</h3>
                                     <div className="space-y-4 mb-8">
                                         <div className="flex justify-between items-center text-sm">
                                             <span className="text-slate-400">Rate</span>
                                             <span className="text-white font-bold">1 ETH = 5,613 FLD</span>
                                         </div>
                                         <div className="flex justify-between items-center text-sm">
                                             <span className="text-slate-400">Network Fee</span>
                                             <span className="text-white font-bold flex items-center gap-1"><Zap size={12} className="text-orange-500"/> $4.20</span>
                                         </div>
                                     </div>
                                     <button onClick={confirmSwap} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-2xl text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                                         <ScanFace size={18}/> Sign & Swap
                                     </button>
                                     <button onClick={() => setSwapStep('input')} className="w-full py-3 mt-2 text-slate-500 font-bold text-xs uppercase tracking-widest">Cancel</button>
                                 </div>
                             )}

                             {swapStep === 'processing' && (
                                 <div className="flex-grow flex flex-col items-center justify-center text-center animate-pulse">
                                     <RefreshCw size={48} className="text-cyan-400 animate-spin mb-4" />
                                     <h3 className="text-white font-bold text-lg">Swapping...</h3>
                                     <p className="text-slate-500 text-xs mt-2">Interacting with Fluid Smart Contract</p>
                                 </div>
                             )}

                             {swapStep === 'success' && (
                                 <div className="flex-grow flex flex-col items-center justify-center text-center animate-fade-in-up">
                                     <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/40">
                                         <CheckCircle2 size={40} className="text-white" />
                                     </div>
                                     <h3 className="text-white font-black text-2xl mb-2">Swap Complete!</h3>
                                     <p className="text-slate-400 text-sm">You received 8,420 FLD</p>
                                 </div>
                             )}
                         </div>
                     )}

                     {/* Card View - 3D Flip */}
                     {mockupView === 'card' && (
                        <div className="px-6 pt-6 h-full flex flex-col">
                            <h2 className="text-xl font-black text-white mb-6">Fluid Debit</h2>
                            
                            <div className="perspective-1000 w-full aspect-[1.586/1] mb-8 cursor-pointer group" onClick={() => setIsCardFlipped(!isCardFlipped)}>
                                <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isCardFlipped ? 'rotate-y-180' : ''}`}>
                                    
                                    {/* Front */}
                                    <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 p-6 flex flex-col justify-between shadow-2xl overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
                                        <div className="flex justify-between items-start z-10">
                                            <FluidLogo className="w-8 h-8 text-white" />
                                            <div className="flex items-center gap-1">
                                                <div className="w-1 h-2 bg-slate-600 rounded-full"></div>
                                                <div className="w-1 h-3 bg-white rounded-full"></div>
                                                <div className="w-1 h-2 bg-slate-600 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="z-10">
                                            {isCardFrozen && <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20"><Lock size={32} className="text-white"/></div>}
                                            <div className="text-white font-mono text-lg tracking-widest mb-1">**** **** **** 8842</div>
                                            <div className="text-[10px] text-slate-400 font-black uppercase">Alexander Fluid</div>
                                        </div>
                                        <div className="absolute bottom-6 right-6">
                                            <div className="w-8 h-5 bg-white/20 rounded"></div>
                                        </div>
                                    </div>

                                    {/* Back */}
                                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-slate-900 border border-slate-700 p-6 flex flex-col justify-center shadow-2xl">
                                        <div className="w-full h-10 bg-black mb-4"></div>
                                        <div className="px-4">
                                            <div className="bg-white h-8 flex items-center justify-end px-2 font-mono text-black font-bold tracking-widest">
                                                884
                                            </div>
                                            <p className="text-[8px] text-slate-500 mt-2">This card is issued by Fluid Protocol. Use implies acceptance of terms.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isCardFrozen ? 'bg-orange-500/20 text-orange-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                            <Lock size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">Freeze Card</div>
                                            <div className="text-[10px] text-slate-400">{isCardFrozen ? 'Card is frozen' : 'Card is active'}</div>
                                        </div>
                                    </div>
                                    <div 
                                        onClick={() => setIsCardFrozen(!isCardFrozen)}
                                        className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${isCardFrozen ? 'bg-orange-500' : 'bg-slate-700'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${isCardFrozen ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                                            <Eye size={18} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">Show Details</div>
                                            <div className="text-[10px] text-slate-400">View PAN & CVV</div>
                                        </div>
                                    </div>
                                    <ChevronDown size={16} className="-rotate-90 text-slate-500" />
                                </div>
                            </div>
                        </div>
                     )}

                     {/* History View */}
                     {mockupView === 'history' && (
                         <div className="px-6 pt-6">
                            <h2 className="text-xl font-black text-white mb-6">Activity</h2>
                            <div className="space-y-4">
                                {transactions.map(tx => (
                                    <div key={tx.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white border border-white/5">
                                                <tx.icon size={16} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white flex items-center gap-1">
                                                    {tx.type === 'send' ? 'Sent' : tx.type === 'receive' ? 'Received' : tx.type === 'swap' ? 'Swapped' : 'Purchase'}
                                                </div>
                                                <div className="text-[10px] text-slate-500">{tx.date}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-sm font-bold ${tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-white'}`}>{tx.amount} {tx.token}</div>
                                            <div className="text-[9px] text-slate-500">{tx.usdValue}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         </div>
                     )}

                  </div>

                  {/* Bottom Navigation Bar */}
                  <div className="absolute bottom-0 inset-x-0 h-20 bg-[#020617]/90 backdrop-blur-md border-t border-white/5 flex justify-around items-start pt-4 px-2 z-30">
                     {[
                         { id: 'assets', icon: WalletIcon },
                         { id: 'swap', icon: RefreshCw },
                         { id: 'card', icon: CreditCard },
                         { id: 'history', icon: History }
                     ].map(item => (
                         <button 
                            key={item.id}
                            onClick={() => { setMockupView(item.id as any); setSelectedAsset(null); }}
                            className={`p-2 rounded-xl transition-all ${mockupView === item.id ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500 hover:text-slate-300'}`}
                         >
                             <item.icon size={24} />
                         </button>
                     ))}
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-40"></div>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default FluidWalletApp;