import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet as WalletIcon, RefreshCw, CreditCard, Layers, 
  Lock, Fingerprint, ScanFace, ChevronDown, Bell, 
  Search, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, 
  Zap, Shield, Globe, Cpu, Server, Database, 
  Wifi, Battery, Signal, MoreHorizontal, Copy, CheckCircle2,
  ExternalLink, Eye, EyeOff, X, Activity, AlertTriangle,
  Landmark, CreditCard as CardIcon, Power, Settings,
  ChevronRight, Terminal, Cloud, Smartphone, Repeat,
  ArrowDown, Layout, Users, ShieldCheck, AlertOctagon, FileCheck,
  Building2, Banknote, History, Flag, QrCode, UploadCloud, Rocket
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

// --- Types & Interfaces ---
interface Asset {
  symbol: string;
  name: string;
  amount: string;
  value: string;
  change: string;
  color: string;
}

interface Transaction {
  id: string;
  type: 'receive' | 'send' | 'swap' | 'contract';
  title: string;
  subtitle: string;
  amount: string;
  status: 'confirmed' | 'pending';
  time: string;
}

interface DApp {
  id: string;
  name: string;
  url: string;
  icon: React.ElementType;
  category: string;
  status: 'online' | 'offline';
}

// --- Mock Data ---
const CHART_DATA = [
  { time: '00:00', value: 12400 },
  { time: '04:00', value: 12800 },
  { time: '08:00', value: 13500 },
  { time: '12:00', value: 13200 },
  { time: '16:00', value: 14100 },
  { time: '20:00', value: 14300 },
  { time: '24:00', value: 14592 },
];

const ASSETS: Asset[] = [
  { symbol: 'FLD', name: 'Fluid', amount: '45,000', value: '$22,500.00', change: '+12.5%', color: 'bg-emerald-500' },
  { symbol: 'ETH', name: 'Ethereum', amount: '12.5', value: '$38,240.50', change: '+2.1%', color: 'bg-indigo-500' },
  { symbol: 'SOL', name: 'Solana', amount: '245.0', value: '$18,450.00', change: '-0.4%', color: 'bg-purple-500' },
  { symbol: 'USDT', name: 'Tether', amount: '5,000', value: '$5,000.00', change: '0.0%', color: 'bg-emerald-400' },
];

const TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'swap', title: 'Swap ETH to FLD', subtitle: 'Fluid DEX • Aggregator', amount: '+4,200 FLD', status: 'confirmed', time: '2 min ago' },
  { id: '2', type: 'receive', title: 'Received SOL', subtitle: 'From 8x...92a', amount: '+120 SOL', status: 'confirmed', time: '1 hour ago' },
  { id: '3', type: 'contract', title: 'Contract Interaction', subtitle: 'Fluid Host', amount: '-50 FLD', status: 'pending', time: 'Just now' },
];

const FIAT_ACCOUNTS = [
   { currency: 'USD', symbol: '$', balance: '12,450.00', bank: 'Fluid US', type: 'Checking', flag: '🇺🇸', details: { route: '021000021', acct: '9876543210' } },
   { currency: 'EUR', symbol: '€', balance: '4,200.50', bank: 'Fluid EU', type: 'IBAN', flag: '🇪🇺', details: { route: 'FLUDDEFF', acct: 'DE89 3704 0044 0532 0130 00' } },
   { currency: 'GBP', symbol: '£', balance: '850.00', bank: 'Fluid UK', type: 'Sort Code', flag: '🇬🇧', details: { route: '04-00-04', acct: '12345678' } },
];

const DAPPS: DApp[] = [
  { id: '1', name: 'Fluid Swap', url: 'fluid://dex', icon: RefreshCw, category: 'DeFi', status: 'online' },
  { id: '2', name: 'Fluid Storage', url: 'fluid://storage', icon: Database, category: 'Infrastructure', status: 'online' },
  { id: '3', name: 'SecureChat', url: 'fluid://chat', icon: Lock, category: 'Social', status: 'online' },
];

// --- Components ---

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="currentColor" />
    <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="currentColor" />
    <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 83.3137 82 60 82H10L15 66Z" fill="currentColor" />
  </svg>
);

// --- Security Vault Overlay ---
const SecurityVault = ({ onUnlock }: { onUnlock: () => void }) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  const handleAuth = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('success');
      setTimeout(onUnlock, 800);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative mb-8">
         <div className={`w-24 h-24 rounded-[2rem] bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-500 ${status === 'scanning' ? 'border-emerald-500/50 shadow-emerald-500/20' : ''}`}>
            {status === 'scanning' && <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>}
            {status === 'success' ? (
               <CheckCircle2 size={40} className="text-emerald-500 animate-in zoom-in" />
            ) : (
               <FluidLogo className="w-12 h-12 text-white" />
            )}
         </div>
      </div>

      <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Fluid Sovereign Vault</h1>
      <p className="text-slate-500 text-sm mb-12 max-w-xs mx-auto">Biometric authentication required to decrypt your local session.</p>

      <button 
        onClick={handleAuth}
        className="group relative px-8 py-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all w-full max-w-xs overflow-hidden"
      >
        <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        <div className="relative flex items-center justify-center gap-3">
          {status === 'scanning' ? (
             <>
               <ScanFace size={20} className="text-emerald-500 animate-pulse" />
               <span className="text-emerald-500 font-bold uppercase tracking-wider text-xs">Verifying Identity...</span>
             </>
          ) : (
             <>
               <Fingerprint size={20} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
               <span className="text-slate-300 font-bold uppercase tracking-wider text-xs group-hover:text-white">Authenticate Access</span>
             </>
          )}
        </div>
      </button>
      
      <div className="mt-8 flex gap-6">
        <button className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Use Passkey</button>
        <button className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Emergency Kit</button>
      </div>
    </div>
  );
};

// --- Main Wallet Application ---
const FluidWalletApp: React.FC<{ onNavigate: (page: string) => void, initialView?: string }> = ({ onNavigate, initialView = 'assets' }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState(initialView);
  const [lastActiveTab, setLastActiveTab] = useState('assets');
  const [network, setNetwork] = useState('Fluid Mainnet');
  const [cardMode, setCardMode] = useState<'virtual' | 'physical'>('virtual');
  const [cardFrozen, setCardFrozen] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [activeModal, setActiveModal] = useState<'send' | 'receive' | 'buy' | null>(null);
  
  // DEX States
  const [swapRoute, setSwapRoute] = useState<'fluid' | 'nexus' | 'mesh'>('fluid');

  // Fiat States
  const [activeFiatIndex, setActiveFiatIndex] = useState(0);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    viewCardDetails: true,
    initiateSwap: false,
    changeLimits: true,
  });
  
  // Security Audit Score Calculation
  const securityScore = useMemo(() => {
    let score = 50; // Base score
    if (!isLocked) score += 10; // Vault accessed successfully
    if (securitySettings.viewCardDetails) score += 15;
    if (securitySettings.initiateSwap) score += 15;
    if (securitySettings.changeLimits) score += 10;
    return Math.min(score, 100);
  }, [securitySettings, isLocked]);

  // Auth Simulation
  const [verifyingAction, setVerifyingAction] = useState<string | null>(null);

  const handleSecureAction = (actionType: keyof typeof securitySettings | 'generic', callback: () => void) => {
    const shouldVerify = actionType === 'generic' ? true : securitySettings[actionType];
    
    if (shouldVerify) {
      setVerifyingAction(typeof actionType === 'string' ? actionType : 'Verify');
      // Simulate FaceID
      setTimeout(() => {
        setVerifyingAction(null);
        callback();
      }, 1500);
    } else {
      callback();
    }
  };

  const handleTabChange = (tabId: string) => {
    if (tabId !== 'settings') {
      setLastActiveTab(tabId);
    }
    setActiveTab(tabId);
  };
  
  const toggleSettings = () => {
    if (activeTab === 'settings') {
      setActiveTab(lastActiveTab);
    } else {
      setLastActiveTab(activeTab);
      setActiveTab('settings');
    }
  };
  
  // Navigation
  const tabs = [
    { id: 'assets', label: 'Wallet', icon: WalletIcon },
    { id: 'dex', label: 'DEX', icon: RefreshCw },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'fiat', label: 'Fiat', icon: Landmark },
    { id: 'hosting', label: 'Fluid Host', icon: Server },
  ];

  if (isLocked) {
    return (
       <div className="min-h-screen pt-24 pb-12 flex justify-center px-4">
          <div className="w-full max-w-[420px] h-[850px] bg-black rounded-[3.5rem] border-8 border-slate-900 relative overflow-hidden shadow-2xl">
             <SecurityVault onUnlock={() => setIsLocked(false)} />
          </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4">
       {/* Device Chassis */}
       <div className="w-full max-w-[420px] h-[850px] bg-[#020617] rounded-[3.5rem] border-[8px] border-[#1e232f] relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col">
          
          {/* Dynamic Island / Status Bar */}
          <div className="absolute top-0 inset-x-0 h-14 z-50 pointer-events-none px-8 pt-5 flex justify-between items-start text-white">
             <span className="text-xs font-bold tracking-widest ml-2">9:41</span>
             
             {/* Dynamic Island Area */}
             <div className={`absolute top-3 left-1/2 -translate-x-1/2 bg-black rounded-full flex items-center justify-center gap-2 px-3 transition-all duration-300 ${verifyingAction ? 'w-40 h-10' : 'w-32 h-8'}`}>
                {verifyingAction ? (
                  <>
                    <ScanFace size={16} className="text-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider animate-in fade-in">Verifying...</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Secure Enclave</span>
                  </>
                )}
             </div>

             <div className="flex gap-1.5 mr-2">
                <Signal size={12} />
                <Wifi size={12} />
                <Battery size={12} />
             </div>
          </div>

          {/* App Header (Glass) */}
          <header className="px-6 pt-16 pb-4 flex justify-between items-center z-40 bg-slate-950/50 backdrop-blur-md border-b border-white/5">
             <div className="flex items-center gap-3">
                <button 
                  onClick={toggleSettings}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                   <Users size={14} />
                </button>
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network</span>
                   <button 
                      onClick={() => setNetwork(prev => prev === 'Fluid Mainnet' ? 'Ethereum' : 'Fluid Mainnet')}
                      className="flex items-center gap-1 text-xs font-black text-white"
                   >
                      {network} <ChevronDown size={10} className="text-slate-500" />
                   </button>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <button 
                  onClick={toggleSettings}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                    activeTab === 'settings' 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                      : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                   <Settings size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all relative">
                   <Bell size={18} />
                   <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-slate-900"></span>
                </button>
             </div>
          </header>

          {/* Main Scrollable Content */}
          <div className="flex-grow overflow-y-auto no-scrollbar relative bg-[#020617] scroll-smooth">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>

             {/* === MODULE A: DASHBOARD === */}
             {activeTab === 'assets' && (
               <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Portfolio Card */}
                  <div className="relative">
                     <div className="text-center mb-6">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1 block">Total Liquidity</span>
                        <h1 className="text-4xl font-black text-white tracking-tighter">$84,592.45</h1>
                        <div className="flex items-center justify-center gap-2 mt-2">
                           <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">+2.4% (24H)</span>
                        </div>
                     </div>
                     
                     {/* Chart */}
                     <div className="h-32 w-full -mx-2">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={CHART_DATA}>
                              <defs>
                                 <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#6366f1" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorVal)" 
                              />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>

                     {/* Global Actions */}
                     <div className="grid grid-cols-4 gap-3 mt-4">
                        <button onClick={() => setActiveModal('send')} className="flex flex-col items-center gap-2 group">
                          <div className="w-14 h-14 rounded-[1.2rem] bg-slate-900 border border-white/5 flex items-center justify-center shadow-lg group-active:scale-95 transition-all group-hover:border-white/20">
                             <ArrowUpRight size={20} className="text-white" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Send</span>
                        </button>

                        <button onClick={() => setActiveModal('receive')} className="flex flex-col items-center gap-2 group">
                          <div className="w-14 h-14 rounded-[1.2rem] bg-slate-900 border border-white/5 flex items-center justify-center shadow-lg group-active:scale-95 transition-all group-hover:border-white/20">
                             <ArrowDownLeft size={20} className="text-white" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Receive</span>
                        </button>

                        <button onClick={() => setActiveModal('buy')} className="flex flex-col items-center gap-2 group">
                          <div className="w-14 h-14 rounded-[1.2rem] bg-slate-900 border border-white/5 flex items-center justify-center shadow-lg group-active:scale-95 transition-all group-hover:border-white/20">
                             <CreditCard size={20} className="text-emerald-400" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Buy</span>
                        </button>

                        <button onClick={() => setActiveTab('dex')} className="flex flex-col items-center gap-2 group">
                          <div className="w-14 h-14 rounded-[1.2rem] bg-slate-900 border border-white/5 flex items-center justify-center shadow-lg group-active:scale-95 transition-all group-hover:border-white/20">
                             <ArrowLeftRight size={20} className="text-indigo-400" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Swap</span>
                        </button>
                     </div>
                  </div>

                  {/* Asset List */}
                  <div>
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Assets</h3>
                     </div>
                     <div className="space-y-3">
                        {ASSETS.map((asset) => (
                           <div key={asset.symbol} className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                              <div className="flex items-center gap-4">
                                 <div className={`w-10 h-10 rounded-xl ${asset.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                                    {asset.symbol[0]}
                                 </div>
                                 <div>
                                    <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{asset.name}</div>
                                    <div className="text-[10px] font-bold text-slate-500">{asset.amount} {asset.symbol}</div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-sm font-bold text-white">{asset.value}</div>
                                 <div className={`text-[10px] font-bold ${asset.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{asset.change}</div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Ledger */}
                  <div>
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Ledger</h3>
                     <div className="space-y-3">
                        {TRANSACTIONS.map((tx) => (
                           <div key={tx.id} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors">
                              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                                 {tx.type === 'swap' && <RefreshCw size={14} />}
                                 {tx.type === 'receive' && <ArrowDownLeft size={14} />}
                                 {tx.type === 'contract' && <Terminal size={14} />}
                              </div>
                              <div className="flex-grow">
                                 <div className="flex justify-between items-center mb-0.5">
                                    <span className="text-xs font-bold text-white">{tx.title}</span>
                                    <span className={`text-xs font-bold ${tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-white'}`}>{tx.amount}</span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-medium text-slate-500">{tx.subtitle}</span>
                                    <span className="text-[10px] font-medium text-slate-600">{tx.time}</span>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
             )}

             {/* === MODULE B: DEX === */}
             {activeTab === 'dex' && (
                <div className="p-6 h-full flex flex-col animate-in fade-in zoom-in-95 duration-300">
                   <div className="mb-6 flex justify-between items-center">
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Fluid DEX</h2>
                      <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-1">
                         <Shield size={10} /> MEV Protected
                      </div>
                   </div>

                   {/* Swap Interface */}
                   <div className="bg-slate-900/50 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden backdrop-blur-xl mb-6">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none"></div>
                      
                      {/* From */}
                      <div className="mb-2">
                         <div className="flex justify-between mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>You Pay</span>
                            <span>Bal: 12.5 ETH</span>
                         </div>
                         <div className="flex items-center justify-between bg-black/20 rounded-2xl p-4 border border-white/5">
                            <input type="number" defaultValue="1.5" className="bg-transparent text-2xl font-black text-white outline-none w-32" />
                            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-white/10">
                               <div className="w-5 h-5 rounded-full bg-indigo-500"></div>
                               <span className="text-xs font-bold text-white">ETH</span>
                               <ChevronDown size={12} className="text-slate-500" />
                            </div>
                         </div>
                      </div>

                      {/* Divider */}
                      <div className="flex justify-center -my-3 relative z-10">
                         <div className="bg-slate-800 border border-slate-700 p-2 rounded-xl text-indigo-400 shadow-lg">
                            <ArrowDown size={16} />
                         </div>
                      </div>

                      {/* To */}
                      <div className="mt-2 mb-6">
                         <div className="flex justify-between mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <span>You Receive</span>
                            <span className="text-emerald-500">Best Price</span>
                         </div>
                         <div className="flex items-center justify-between bg-black/20 rounded-2xl p-4 border border-white/5">
                            <span className="text-2xl font-black text-emerald-400">8,420.50</span>
                            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-white/10">
                               <div className="w-5 h-5 rounded-full bg-emerald-500"></div>
                               <span className="text-xs font-bold text-white">FLD</span>
                               <ChevronDown size={12} className="text-slate-500" />
                            </div>
                         </div>
                      </div>

                      {/* Route Selection */}
                      <div className="bg-black/20 rounded-xl p-3 border border-white/5 mb-6">
                         <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Routing Engine</span>
                            <Zap size={12} className="text-amber-500" />
                         </div>
                         <div className="space-y-2">
                            {[
                               { id: 'fluid', label: 'Fluid Hub', fee: '$2.40', time: '1s', best: true },
                               { id: 'nexus', label: 'Nexus Liq', fee: '$2.45', time: '3s', best: false },
                               { id: 'mesh', label: 'Mesh Route', fee: '$3.10', time: '5s', best: false },
                            ].map(route => (
                               <button 
                                 key={route.id}
                                 onClick={() => setSwapRoute(route.id as any)}
                                 className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${swapRoute === route.id ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-transparent border-transparent opacity-50'}`}
                               >
                                  <div className="flex items-center gap-2">
                                     <div className={`w-2 h-2 rounded-full ${route.best ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                                     <span className="text-[10px] font-bold text-white">{route.label}</span>
                                     {route.best && <span className="text-[8px] bg-emerald-500/20 text-emerald-500 px-1 rounded uppercase font-black">Best</span>}
                                  </div>
                                  <div className="text-[10px] font-mono text-slate-400">{route.fee} • ~{route.time}</div>
                               </button>
                            ))}
                         </div>
                      </div>

                      <button 
                        onClick={() => handleSecureAction('initiateSwap', () => alert("Swap Initiated"))}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2 group"
                      >
                         <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                         Swap Assets
                      </button>
                   </div>
                </div>
             )}

             {/* === MODULE C: CARDS === */}
             {activeTab === 'cards' && (
                <div className="p-6 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="flex justify-center mb-8">
                      <div className="flex bg-slate-900 p-1 rounded-full border border-slate-800">
                         <button 
                           onClick={() => setCardMode('virtual')}
                           className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${cardMode === 'virtual' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}
                         >
                           Digital
                         </button>
                         <button 
                           onClick={() => setCardMode('physical')}
                           className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${cardMode === 'physical' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500'}`}
                         >
                           Metal
                         </button>
                      </div>
                   </div>

                   {/* Card Visual */}
                   <div className="perspective-1000 mb-8 relative group cursor-pointer" onClick={() => setCardFrozen(!cardFrozen)}>
                      <div className={`aspect-[1.586/1] rounded-2xl relative transition-all duration-500 overflow-hidden shadow-2xl border border-white/10 ${cardFrozen ? 'grayscale brightness-75' : ''} ${cardMode === 'physical' ? 'bg-[#1a1a1a]' : 'bg-gradient-to-br from-indigo-900 via-slate-900 to-black'}`}>
                         
                         {/* Card Texture */}
                         {cardMode === 'physical' && <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>}
                         {cardMode === 'virtual' && <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px]"></div>}

                         {/* Freeze Overlay */}
                         {cardFrozen && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/40 backdrop-blur-[2px]">
                               <Lock size={32} className="text-white mb-2" />
                               <span className="text-xs font-black text-white uppercase tracking-widest border border-white px-2 py-1 rounded">Frozen</span>
                            </div>
                         )}

                         <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                            <div className="flex justify-between items-start">
                               <FluidLogo className="w-8 h-8 text-white" />
                               <div className="flex items-center gap-1">
                                  <div className="w-1 h-2 bg-slate-600 rounded-full"></div>
                                  <div className="w-1 h-3 bg-white rounded-full"></div>
                                  <div className="w-1 h-2 bg-slate-600 rounded-full"></div>
                               </div>
                            </div>

                            <div>
                               <div className="flex items-center justify-between mb-4">
                                  {showCardDetails ? (
                                     <span className="font-mono text-lg text-white tracking-widest">4920 1928 4492 1029</span>
                                  ) : (
                                     <span className="font-mono text-lg text-white tracking-widest">**** **** **** 1029</span>
                                  )}
                                  <button 
                                    onClick={(e) => { 
                                      e.stopPropagation(); 
                                      if (!showCardDetails) {
                                        handleSecureAction('viewCardDetails', () => setShowCardDetails(true));
                                      } else {
                                        setShowCardDetails(false);
                                      }
                                    }} 
                                    className="text-slate-400 hover:text-white"
                                  >
                                     {showCardDetails ? <EyeOff size={16} /> : <Eye size={16} />}
                                  </button>
                               </div>
                               <div className="flex justify-between items-end">
                                  <div>
                                     <span className="text-[8px] text-slate-400 uppercase font-black block mb-0.5">Card Holder</span>
                                     <span className="text-xs text-white font-bold tracking-wider">ALEXANDER FLUID</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-white/50 italic">{cardMode === 'physical' ? 'STEEL' : 'VIRTUAL'}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Controls */}
                   <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                         <button 
                           onClick={() => handleSecureAction('changeLimits', () => alert("Limits Settings"))}
                           className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors"
                         >
                            <Settings size={20} className="text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Limits</span>
                         </button>
                         <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                            <Lock size={20} className="text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Pin</span>
                         </button>
                         <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors">
                            <RefreshCw size={20} className="text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase">Replace</span>
                         </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500"><AlertTriangle size={18}/></div>
                            <div>
                               <div className="text-xs font-bold text-white">Freeze Card</div>
                               <div className="text-[9px] text-slate-500">Temporarily disable transactions</div>
                            </div>
                         </div>
                         <div 
                           onClick={() => setCardFrozen(!cardFrozen)}
                           className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${cardFrozen ? 'bg-rose-500' : 'bg-slate-700'}`}
                         >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${cardFrozen ? 'translate-x-4' : ''}`}></div>
                         </div>
                      </div>
                   </div>
                </div>
             )}
             
             {/* === MODULE: FIAT INTEGRATION === */}
             {activeTab === 'fiat' && (
                <div className="p-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                   <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Fiat Gateway</h2>
                      <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                         <Globe size={10} /> Global Accounts
                      </div>
                   </div>

                   {/* Global Account Card */}
                   <div className="bg-gradient-to-br from-emerald-900 to-slate-900 border border-white/10 rounded-[2rem] p-6 mb-6 relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-[60px] pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
                      
                      <div className="relative z-10">
                         <div className="flex justify-between items-start mb-6">
                             <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                                <Building2 size={20} className="text-emerald-400" />
                             </div>
                             <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                                 <span className="text-xl">{FIAT_ACCOUNTS[activeFiatIndex].flag}</span>
                                 <span className="text-xs font-bold text-white">{FIAT_ACCOUNTS[activeFiatIndex].currency}</span>
                                 <ChevronDown size={12} className="text-slate-400" />
                             </div>
                         </div>

                         <div className="mb-6">
                             <span className="text-[10px] font-bold text-emerald-200/60 uppercase tracking-widest mb-1 block">Total Balance</span>
                             <h1 className="text-4xl font-black text-white tracking-tighter">
                                {FIAT_ACCOUNTS[activeFiatIndex].symbol}{FIAT_ACCOUNTS[activeFiatIndex].balance}
                             </h1>
                         </div>

                         {/* Accounts Carousel Dots */}
                         <div className="flex gap-1.5 justify-center mb-6">
                            {FIAT_ACCOUNTS.map((_, i) => (
                               <button 
                                 key={i} 
                                 onClick={() => setActiveFiatIndex(i)}
                                 className={`h-1.5 rounded-full transition-all ${i === activeFiatIndex ? 'w-6 bg-emerald-400' : 'w-1.5 bg-white/20'}`}
                               />
                            ))}
                         </div>

                         <div className="grid grid-cols-2 gap-3">
                             <button className="py-3 bg-white text-emerald-900 font-bold rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors">
                                <ArrowDownLeft size={16} /> Add Funds
                             </button>
                             <button className="py-3 bg-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-white/20 transition-colors border border-white/10">
                                <ArrowUpRight size={16} /> Withdraw
                             </button>
                         </div>
                      </div>
                   </div>

                   {/* Banking Details */}
                   <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Banking Details</h3>
                         <button 
                           onClick={() => setShowAccountDetails(!showAccountDetails)}
                           className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider hover:text-white transition-colors"
                         >
                            {showAccountDetails ? 'Hide' : 'Reveal'}
                         </button>
                      </div>

                      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                         {!showAccountDetails && (
                            <div className="absolute inset-0 backdrop-blur-md bg-slate-900/10 flex items-center justify-center z-10">
                               <div className="flex flex-col items-center gap-2">
                                  <Lock size={24} className="text-slate-500" />
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Tap Reveal to View</span>
                               </div>
                            </div>
                         )}
                         <div className="flex justify-between items-center pb-3 border-b border-white/5">
                            <span className="text-xs text-slate-500 font-bold">Bank Name</span>
                            <div className="flex items-center gap-2">
                               <span className="text-sm text-white font-mono">{FIAT_ACCOUNTS[activeFiatIndex].bank}</span>
                               <Copy size={12} className="text-slate-600" />
                            </div>
                         </div>
                         <div className="flex justify-between items-center pb-3 border-b border-white/5">
                             <span className="text-xs text-slate-500 font-bold">{FIAT_ACCOUNTS[activeFiatIndex].type === 'IBAN' ? 'IBAN' : 'Routing Number'}</span>
                             <div className="flex items-center gap-2">
                                <span className="text-sm text-white font-mono">{FIAT_ACCOUNTS[activeFiatIndex].details.route}</span>
                                <Copy size={12} className="text-slate-600" />
                             </div>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-xs text-slate-500 font-bold">Account Number</span>
                             <div className="flex items-center gap-2">
                                <span className="text-sm text-white font-mono">{FIAT_ACCOUNTS[activeFiatIndex].details.acct}</span>
                                <Copy size={12} className="text-slate-600" />
                             </div>
                         </div>
                      </div>
                   </div>

                   {/* Linked Banks List */}
                   <div>
                       <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Linked Accounts</h3>
                       <div className="space-y-3">
                           <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                               <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-xl bg-blue-900/30 flex items-center justify-center text-blue-500 font-black text-sm">C</div>
                                   <div>
                                       <div className="text-xs font-bold text-white">Chase Bank</div>
                                       <div className="text-[9px] text-slate-500 font-bold">**** 8842</div>
                                   </div>
                               </div>
                               <div className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase rounded tracking-wider">Verified</div>
                           </div>
                           
                           <button className="w-full py-3 rounded-2xl border border-dashed border-slate-700 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900/50 hover:text-white hover:border-slate-600 transition-all flex items-center justify-center gap-2">
                               <Building2 size={14} /> Link New Account
                           </button>
                       </div>
                   </div>
                </div>
             )}

             {/* === MODULE D: HOSTING & FLUID HOST === */}
             {activeTab === 'hosting' && (
                <div className="p-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                   <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Fluid Host</h2>
                      <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1">
                         <Globe size={10} /> Decentralized
                      </div>
                   </div>

                   {/* Node Status Card */}
                   <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 mb-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none"></div>
                       
                       <div className="flex justify-between items-start mb-6">
                           <div>
                               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Storage Node</span>
                               <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                   <span className="text-xl font-black text-white">Online</span>
                               </div>
                           </div>
                           <Cpu className="text-blue-500" size={24} />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                           <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                               <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">Used Storage</div>
                               <div className="text-sm font-bold text-white">45.2 GB <span className="text-slate-600">/ 1TB</span></div>
                               <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                   <div className="w-[4%] h-full bg-blue-500"></div>
                               </div>
                           </div>
                           <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                               <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">Bandwidth</div>
                               <div className="text-sm font-bold text-white">12 GB/s</div>
                               <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                   <div className="w-[60%] h-full bg-emerald-500"></div>
                               </div>
                           </div>
                       </div>
                   </div>

                   {/* Deployed dApps */}
                   <div className="mb-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">My Deployments</h3>
                      <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900 transition-colors">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                      <Rocket size={18} />
                                  </div>
                                  <div>
                                      <div className="text-xs font-bold text-white">fluid-dex-v2</div>
                                      <div className="text-[9px] text-slate-500 font-mono">ipfs://QmX...7a2</div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                  <MoreHorizontal size={16} className="text-slate-500" />
                              </div>
                          </div>
                          
                          <button className="w-full py-3 rounded-2xl border border-dashed border-slate-700 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900/50 hover:text-white hover:border-slate-600 transition-all flex items-center justify-center gap-2">
                               <UploadCloud size={14} /> Deploy New Site
                          </button>
                      </div>
                   </div>

                   {/* dApp Browser */}
                   <div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Fluid Host Browser</h3>
                      <div className="grid grid-cols-3 gap-3">
                          {DAPPS.map(app => (
                              <button key={app.id} className="flex flex-col items-center gap-2 p-3 bg-slate-900/30 border border-slate-800 rounded-2xl hover:bg-slate-800 hover:border-slate-700 transition-all group">
                                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white border border-white/5 group-hover:scale-110 transition-transform">
                                      <app.icon size={18} />
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-400 group-hover:text-white">{app.name}</span>
                              </button>
                          ))}
                          <button className="flex flex-col items-center gap-2 p-3 border border-dashed border-slate-800 rounded-2xl hover:bg-slate-900/50 transition-all">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600">
                                  <Search size={18} />
                              </div>
                              <span className="text-[9px] font-bold text-slate-600">Explore</span>
                          </button>
                      </div>
                   </div>
                </div>
             )}

             {/* === MODULE E: SETTINGS & SECURITY === */}
             {activeTab === 'settings' && (
               <div className="p-6 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Security Center</h2>
                  
                  {/* Security Score Audit */}
                  <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none"></div>
                      <div className="flex items-center justify-between mb-6">
                         <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Audit Score</span>
                            <div className="flex items-baseline gap-1">
                               <span className={`text-4xl font-black ${securityScore > 80 ? 'text-emerald-500' : securityScore > 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                                  {securityScore}
                               </span>
                               <span className="text-slate-500 font-bold">/100</span>
                            </div>
                         </div>
                         <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center ${securityScore > 80 ? 'border-emerald-500/20 text-emerald-500' : 'border-amber-500/20 text-amber-500'}`}>
                            <ShieldCheck size={24} />
                         </div>
                      </div>
                      
                      <div className="space-y-3">
                         <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                            {isLocked ? <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center"><CheckCircle2 size={10}/></div> : <div className="w-4 h-4 rounded bg-rose-500/20 text-rose-500 flex items-center justify-center"><X size={10}/></div>}
                            <span>Vault Protection Active</span>
                         </div>
                         <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                            {securitySettings.viewCardDetails ? <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center"><CheckCircle2 size={10}/></div> : <div className="w-4 h-4 rounded bg-slate-800 text-slate-600 flex items-center justify-center"><AlertOctagon size={10}/></div>}
                            <span>Card Details Hidden</span>
                         </div>
                         <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                            {securitySettings.initiateSwap ? <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center"><CheckCircle2 size={10}/></div> : <div className="w-4 h-4 rounded bg-slate-800 text-slate-600 flex items-center justify-center"><AlertOctagon size={10}/></div>}
                            <span>High Value Swap Auth</span>
                         </div>
                      </div>
                  </div>

                  {/* Granular Biometric Settings */}
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Fingerprint size={12} /> Biometric Triggers
                  </h3>
                  <div className="space-y-3">
                     {[
                        { id: 'viewCardDetails', label: 'View Card Number', desc: 'Require auth to unmask PAN' },
                        { id: 'changeLimits', label: 'Adjust Limits', desc: 'Require auth to increase spend limits' },
                        { id: 'initiateSwap', label: 'Initiate Swaps', desc: 'Require auth for DEX trades > $100' },
                     ].map((setting) => (
                        <div key={setting.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between">
                           <div>
                              <div className="text-sm font-bold text-white mb-0.5">{setting.label}</div>
                              <div className="text-[10px] text-slate-500">{setting.desc}</div>
                           </div>
                           <div 
                              onClick={() => setSecuritySettings(prev => ({...prev, [setting.id]: !prev[setting.id as keyof typeof securitySettings]}))}
                              className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${securitySettings[setting.id as keyof typeof securitySettings] ? 'bg-emerald-500' : 'bg-slate-700'}`}
                           >
                              <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${securitySettings[setting.id as keyof typeof securitySettings] ? 'translate-x-4' : ''}`}></div>
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5">
                     <button className="w-full py-4 bg-slate-900 border border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/10 text-rose-500 font-black rounded-xl uppercase tracking-widest transition-all text-xs flex items-center justify-center gap-2">
                        <Power size={14} /> Lock Vault Now
                     </button>
                  </div>
               </div>
             )}

          </div>
          
          {/* --- ACTION MODALS --- */}
          {activeModal && (
            <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center animate-in fade-in duration-200">
               <div className="w-full h-[90%] sm:h-auto sm:max-w-xs bg-slate-900 border-t sm:border border-slate-800 rounded-t-[2rem] sm:rounded-[2rem] p-6 relative flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                  <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-6 sm:hidden"></div>
                  
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-black text-white uppercase tracking-tight">
                       {activeModal === 'send' && 'Send Asset'}
                       {activeModal === 'receive' && 'Receive Asset'}
                       {activeModal === 'buy' && 'Buy Crypto'}
                     </h3>
                     <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                        <X size={16} />
                     </button>
                  </div>

                  {activeModal === 'send' && (
                     <div className="space-y-4 flex-grow">
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Recipient Address</label>
                           <div className="flex items-center bg-black/20 rounded-xl border border-white/10 p-3">
                              <input type="text" placeholder="0x..." className="bg-transparent w-full text-sm text-white outline-none font-mono" />
                              <ScanFace size={16} className="text-slate-500" />
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Amount</label>
                           <div className="flex items-center justify-between bg-black/20 rounded-xl border border-white/10 p-3">
                              <input type="number" placeholder="0.0" className="bg-transparent w-full text-xl font-black text-white outline-none" />
                              <button className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-xs font-bold text-white">
                                 FLD <ChevronDown size={10} />
                              </button>
                           </div>
                           <div className="text-right mt-1 text-[10px] text-slate-500 font-bold">Balance: 45,000 FLD</div>
                        </div>
                        <button className="w-full py-4 mt-auto bg-white text-slate-900 font-black rounded-xl uppercase tracking-widest hover:bg-slate-200 transition-colors">Confirm Send</button>
                     </div>
                  )}

                  {activeModal === 'receive' && (
                     <div className="space-y-6 flex-col flex items-center flex-grow justify-center">
                        <div className="p-1 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-[1.5rem]">
                           <div className="bg-white p-4 rounded-[1.3rem]">
                              <QrCode size={160} className="text-slate-900" />
                           </div>
                        </div>
                        <div className="w-full">
                           <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block text-center">Your FLD Address</label>
                           <button className="w-full flex items-center justify-between bg-black/20 rounded-xl border border-white/10 p-3 group hover:border-white/20 transition-colors">
                              <span className="text-xs text-slate-300 font-mono truncate mr-2">0x71C...92aF</span>
                              <Copy size={14} className="text-slate-500 group-hover:text-white" />
                           </button>
                        </div>
                        <div className="flex gap-2 w-full">
                           <button className="flex-1 py-3 bg-slate-800 rounded-xl text-xs font-bold text-white">Share</button>
                           <button className="flex-1 py-3 bg-slate-800 rounded-xl text-xs font-bold text-white">Save Image</button>
                        </div>
                     </div>
                  )}

                  {activeModal === 'buy' && (
                     <div className="space-y-4 flex-grow">
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                           <ShieldCheck size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                           <p className="text-[10px] text-emerald-200/80 leading-relaxed">Transactions are processed via MoonPay. KYC may be required for purchases over $500.</p>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">You Pay</label>
                           <div className="flex items-center justify-between bg-black/20 rounded-xl border border-white/10 p-3">
                              <input type="number" defaultValue="100" className="bg-transparent w-full text-xl font-black text-white outline-none" />
                              <button className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-xs font-bold text-white">
                                 USD <ChevronDown size={10} />
                              </button>
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">You Get</label>
                           <div className="flex items-center justify-between bg-black/20 rounded-xl border border-white/10 p-3">
                              <span className="text-xl font-black text-emerald-400">~8,420</span>
                              <div className="flex items-center gap-2">
                                 <div className="w-5 h-5 rounded-full bg-emerald-500"></div>
                                 <span className="text-xs font-bold text-white">FLD</span>
                              </div>
                           </div>
                        </div>
                        <button className="w-full py-4 mt-auto bg-emerald-500 text-white font-black rounded-xl uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">Continue to Payment</button>
                     </div>
                  )}
               </div>
            </div>
          )}

          {/* Bottom Navigation (Glass) */}
          <nav className="h-20 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 flex justify-between px-6 items-center relative z-50">
             {tabs.map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === tab.id ? 'text-indigo-400 -translate-y-1' : 'text-slate-600 hover:text-slate-400'}`}
                >
                   <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                   {activeTab === tab.id && <span className="w-1 h-1 bg-indigo-500 rounded-full absolute -bottom-2"></span>}
                </button>
             ))}
          </nav>
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 pointer-events-none"></div>

       </div>
    </div>
  );
};

export default FluidWalletApp;