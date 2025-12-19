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
  LockKeyhole, UserCircle
} from 'lucide-react';

interface FluidWalletAppProps {
  onNavigate: (page: string) => void;
  initialView?: 'assets' | 'swap' | 'card' | 'fiat' | 'security' | 'history' | 'dapps';
}

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="white" />
    <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="white" />
    <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 83.3137 82 60 82H10L15 66Z" fill="white" />
  </svg>
);

const FluidWalletApp: React.FC<FluidWalletAppProps> = ({ initialView = 'assets' }) => {
  const [mockupView, setMockupView] = useState<'assets' | 'swap' | 'card' | 'history' | 'security' | 'dapps'>(initialView as any);
  const [openDropdown, setOpenDropdown] = useState<string | null>('wallet');
  
  // Card Specific States
  const [cardType, setCardType] = useState<'virtual' | 'physical'>('virtual');
  
  // Swap States
  const [swapInput, setSwapInput] = useState('1.5');
  const [swapOutput, setSwapOutput] = useState('8420');
  const [swapTokenFrom, setSwapTokenFrom] = useState({ symbol: 'ETH', color: 'bg-indigo-500', name: 'Ethereum' });
  const [swapTokenTo, setSwapTokenTo] = useState({ symbol: 'FLD', color: 'bg-emerald-500', name: 'Fluid' });
  const [isSwapping, setIsSwapping] = useState(false);

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
  
  // Biometric States
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // History States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'send' | 'receive' | 'swap'>('all');

  // Dapp States
  const [dappSearch, setDappSearch] = useState('');
  const [dappCategory, setDappCategory] = useState<'all' | 'defi' | 'social' | 'games' | 'utility'>('all');

  useEffect(() => {
    setMockupView(initialView as any);
  }, [initialView]);

  const sidebarMenu = [
    { id: 'wallet', label: 'Wallet Hub', icon: WalletIcon, children: ['Assets', 'History', 'Portfolio'] },
    { id: 'banking', label: 'Payments', icon: CreditCard, children: ['Native Cards', 'Fiat Rails', 'Billing'] },
    { id: 'trade', label: 'Trading', icon: RefreshCw, children: ['Fluid DEX', 'Limit Orders', 'Analytics'] },
    { id: 'privacy', label: 'Security', icon: LockKeyhole, children: ['Biometrics', '2FA Center', 'Privacy'] }
  ];

  const coins = [
    { name: 'Fluid', symbol: 'FLD', amount: '45,000', value: '$22,500', color: 'bg-emerald-500', trend: '+1.2%' },
    { name: 'Ethereum', symbol: 'ETH', amount: '12.5', value: '$38,240', color: 'bg-indigo-500', trend: '+1.2%' },
    { name: 'Tether', symbol: 'USDT', amount: '63,852', value: '$63,852', color: 'bg-emerald-600', trend: '+0.1%' }
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

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.token.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || tx.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const filteredDapps = useMemo(() => {
    return dapps.filter(dapp => dapp.name.toLowerCase().includes(dappSearch.toLowerCase()));
  }, [dappSearch]);

  const triggerBiometricAuth = (onSuccess: () => void, settingKey?: keyof typeof securitySettings) => {
    const isRequired = settingKey ? securitySettings[settingKey] : securitySettings.globalBiometrics;
    if (!isRequired) { onSuccess(); return; }
    setIsAuthenticating(true);
    setTimeout(() => { setIsAuthenticating(false); onSuccess(); }, 1200);
  };

  const toggleDetails = () => {
    if (!showDetails) triggerBiometricAuth(() => setShowDetails(true), 'requireForCardDetails');
    else setShowDetails(false);
  };

  const handleConfirmSwap = () => {
    triggerBiometricAuth(() => {
      setIsSwapping(true);
      setTimeout(() => { setIsSwapping(false); setMockupView('history'); }, 2000);
    }, 'requireForSwaps');
  };

  const securityScore = (() => {
    let score = 20;
    if (securitySettings.globalBiometrics) score += 20;
    if (securitySettings.seedPhraseBackedUp) score += 25;
    if (securitySettings.twoFactorEnabled) score += 20;
    return score;
  })();

  const getScoreColor = (score: number) => {
    if (score < 50) return 'text-red-500';
    if (score < 80) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const limitPercentage = Math.min((spentAmount / monthlyLimit) * 100, 100);

  return (
    <div className="min-h-screen pt-32 pb-12 flex flex-col lg:flex-row max-w-7xl mx-auto px-4 gap-8">
      
      {/* Left Sidebar Dropdown Navigation */}
      <aside className="lg:w-64 flex-shrink-0">
        <div className="sticky top-32 space-y-2 bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10">
           <div className="px-2 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 mb-4 flex items-center justify-between">
              <span>Wallet Menu</span>
              <WalletIcon size={12} className="text-emerald-500" />
           </div>
           {sidebarMenu.map((menu) => (
             <div key={menu.id} className="group">
                <button 
                  onClick={() => setOpenDropdown(openDropdown === menu.id ? null : menu.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${openDropdown === menu.id ? 'bg-emerald-600/10 text-emerald-500 border border-emerald-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                   <div className="flex items-center gap-3">
                      <menu.icon size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">{menu.label}</span>
                   </div>
                   <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === menu.id ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openDropdown === menu.id ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                   <div className="pl-11 pr-4 py-2 space-y-2">
                      {menu.children.map((child) => (
                        <button 
                          key={child}
                          className="block text-[10px] font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-widest text-left w-full"
                          onClick={() => {
                             if (child === 'Assets') setMockupView('assets');
                             if (child === 'Native Cards') setMockupView('card');
                             if (child === 'History') setMockupView('history');
                             if (child === 'Fluid DEX') setMockupView('swap');
                             if (child === 'Privacy') setMockupView('security');
                          }}
                        >
                           {child}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
           ))}

           {/* User Profile Snippet */}
           <div className="mt-8 p-4 bg-slate-900/40 border border-white/5 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg">
                 <UserCircle size={24} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-white">Fluid User</span>
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Verified</span>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow">
        <section className="text-center lg:text-left mb-16 px-4 lg:px-0">
           <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
              <span className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px]">V2.0 SECURITY UPGRADE</span>
           </div>
           <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-none">
              Fluid <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500">Wallet</span>
           </h1>
           <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 font-medium">
              Multichain gateway with native fiat rails and Parmaweb browsing.
           </p>
        </section>

        {/* Interface Mockup */}
        <section className="max-w-md mx-auto lg:mx-0 relative z-10">
            <div className="bg-slate-950 border border-slate-800 rounded-[3.5rem] shadow-2xl overflow-hidden relative min-h-[700px] flex flex-col p-1.5">
                <div className="bg-[#020617] rounded-[3.2rem] flex-grow flex flex-col overflow-hidden relative">
                  
                  {isAuthenticating && (
                    <div className="absolute inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in-up">
                      <ScanFace size={48} className="text-cyan-400 animate-pulse mb-4" />
                      <h4 className="text-white font-black tracking-tight text-xs uppercase">Authenticating</h4>
                    </div>
                  )}

                  <div className="flex-grow flex flex-col pt-12 px-6 pb-24 overflow-y-auto relative no-scrollbar">
                     <div className="flex-grow animate-fade-in-up">
                        {mockupView === 'history' ? (
                          <div className="space-y-6">
                             <h3 className="text-white font-black text-xl tracking-tight">Activity</h3>
                             <div className="space-y-3">
                                {filteredTransactions.map((tx) => (
                                  <div key={tx.id} className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-white`}>
                                        <tx.icon size={14} />
                                      </div>
                                      <div>
                                        <div className="text-[10px] font-black text-white">{tx.type} {tx.token}</div>
                                        <div className="text-[8px] text-slate-500 font-bold">{tx.date}</div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className={`text-[10px] font-black ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>{tx.amount}</div>
                                    </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                        ) : mockupView === 'assets' ? (
                          <div className="space-y-6">
                             <div className="text-center mb-8">
                                <div className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Portfolio Value</div>
                                <div className="text-3xl font-black text-white tracking-tighter">$124,592.45</div>
                             </div>
                             <div className="space-y-4">
                                {coins.map(coin => (
                                   <div key={coin.symbol} className="flex items-center justify-between p-4 bg-slate-900/50 border border-white/5 rounded-[2rem] group cursor-pointer hover:bg-slate-900 transition-colors">
                                      <div className="flex items-center gap-4">
                                         <div className={`w-10 h-10 rounded-xl ${coin.color} flex items-center justify-center font-black text-white text-xs shadow-lg`}>{coin.symbol[0]}</div>
                                         <div><div className="text-xs font-black text-white">{coin.name}</div><div className="text-[9px] text-slate-500 font-bold">{coin.amount} {coin.symbol}</div></div>
                                      </div>
                                      <div className="text-right"><div className="text-xs font-black text-white">{coin.value}</div><div className="text-[8px] text-emerald-500 font-black">{coin.trend}</div></div>
                                   </div>
                                ))}
                             </div>
                          </div>
                        ) : mockupView === 'swap' ? (
                          <div className="space-y-6">
                             <h3 className="text-white font-black text-xl tracking-tight uppercase">Fluid DEX</h3>
                             <div className="space-y-2 relative">
                                <div className="bg-slate-900/50 p-4 rounded-[2rem] border border-white/5">
                                   <span className="text-[8px] font-black text-slate-500 uppercase block mb-2">You Pay</span>
                                   <input type="number" value={swapInput} onChange={(e) => setSwapInput(e.target.value)} className="bg-transparent text-2xl font-black text-white outline-none w-full" />
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-[2rem] border border-white/5 pt-6">
                                   <span className="text-[8px] font-black text-slate-500 uppercase block mb-2">You Receive</span>
                                   <div className="text-2xl font-black text-emerald-400">{swapOutput}</div>
                                </div>
                             </div>
                             <button onClick={handleConfirmSwap} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-xs rounded-[2rem] uppercase tracking-widest">
                                Confirm Swap
                             </button>
                          </div>
                        ) : mockupView === 'card' ? (
                          <div className="space-y-6">
                             <div className="aspect-[1.58/1] bg-gradient-to-br from-indigo-700 to-purple-800 rounded-[2rem] p-6 flex flex-col justify-between shadow-2xl cursor-pointer" onClick={toggleDetails}>
                                <FluidLogo className="w-6 h-6" />
                                <div className="text-white font-mono text-xl tracking-[0.2em]">{showDetails ? '4288 1592 0048 8842' : '**** **** **** 8842'}</div>
                             </div>
                             <div className="p-6 bg-slate-900/50 rounded-[2rem] border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                   <span className="text-[9px] font-black text-white tracking-widest uppercase">Spending Power</span>
                                   <span className="text-[9px] font-black text-cyan-400">${spentAmount} / ${monthlyLimit}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                   <div className="h-full bg-cyan-400" style={{ width: `${limitPercentage}%` }} />
                                </div>
                             </div>
                          </div>
                        ) : mockupView === 'dapps' ? (
                          <div className="space-y-6">
                             <h3 className="text-white font-black text-xl tracking-tight uppercase">DApp Store</h3>
                             <div className="bg-slate-900/50 p-3 rounded-2xl border border-white/5 flex items-center gap-2 mb-4">
                                <Search size={16} className="text-slate-500" />
                                <input 
                                  type="text" 
                                  placeholder="Search dApps..." 
                                  value={dappSearch}
                                  onChange={(e) => setDappSearch(e.target.value)}
                                  className="bg-transparent text-sm font-bold text-white outline-none w-full placeholder-slate-600"
                                />
                             </div>
                             <div className="space-y-3">
                                {filteredDapps.map(dapp => (
                                   <div key={dapp.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                      <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                                         <dapp.icon size={20} />
                                      </div>
                                      <div>
                                         <div className="text-xs font-black text-white">{dapp.name}</div>
                                         <div className="text-[9px] text-slate-500 font-bold">{dapp.desc}</div>
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                             <h3 className="text-white font-black text-xl tracking-tight text-center uppercase">Security Score</h3>
                             <div className="flex justify-center">
                                <div className={`w-24 h-24 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center ${getScoreColor(securityScore)}`}>
                                   <span className="text-3xl font-black">{securityScore}</span>
                                   <span className="text-[6px] font-black uppercase">Score</span>
                                </div>
                             </div>
                             <div className="space-y-3">
                                {[
                                   { label: 'Cloud Seed Backup', state: securitySettings.seedPhraseBackedUp, key: 'seedPhraseBackedUp' },
                                   { label: 'Biometric Shield', state: securitySettings.globalBiometrics, key: 'globalBiometrics' }
                                ].map(s => (
                                   <div key={s.label} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5" onClick={() => setSecuritySettings(prev => ({...prev, [s.key]: !s.state}))}>
                                      <span className="text-[10px] font-black text-white uppercase">{s.label}</span>
                                      {s.state ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Plus size={16} className="text-slate-700" />}
                                   </div>
                                ))}
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
                  
                  <div className="absolute bottom-0 inset-x-0 border-t border-white/5 bg-[#020617] p-6 flex justify-between items-center px-10 z-40">
                     <WalletIcon size={20} className={mockupView === 'assets' ? 'text-cyan-500' : 'text-slate-700'} onClick={() => setMockupView('assets')} />
                     <RefreshCw size={20} className={mockupView === 'swap' ? 'text-cyan-500' : 'text-slate-700'} onClick={() => setMockupView('swap')} />
                     <CreditCard size={20} className={mockupView === 'card' ? 'text-cyan-500' : 'text-slate-700'} onClick={() => setMockupView('card')} />
                     <History size={20} className={mockupView === 'history' ? 'text-cyan-500' : 'text-slate-700'} onClick={() => setMockupView('history')} />
                  </div>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default FluidWalletApp;