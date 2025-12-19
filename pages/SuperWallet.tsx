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
  ArrowDown, Layout, Users
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
  { id: '3', type: 'contract', title: 'Contract Interaction', subtitle: 'Parmaweb Hosting', amount: '-50 FLD', status: 'pending', time: 'Just now' },
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
  const [network, setNetwork] = useState('Fluid Mainnet');
  const [cardMode, setCardMode] = useState<'virtual' | 'physical'>('virtual');
  const [cardFrozen, setCardFrozen] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  
  // DEX States
  const [swapRoute, setSwapRoute] = useState<'fluid' | 'nexus' | 'mesh'>('fluid');
  
  // Navigation
  const tabs = [
    { id: 'assets', label: 'Wallet', icon: WalletIcon },
    { id: 'dex', label: 'DEX', icon: RefreshCw },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'fiat', label: 'Fiat', icon: Landmark },
    { id: 'hosting', label: 'Hosting', icon: Server },
    { id: 'settings', label: 'Settings', icon: Settings },
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
             <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-full flex items-center justify-center gap-2 px-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Secure Enclave</span>
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
                <button className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400">
                   <User size={14} />
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
                        {[
                           { label: 'Send', icon: ArrowUpRight, color: 'text-white' },
                           { label: 'Receive', icon: ArrowDownLeft, color: 'text-white' },
                           { label: 'Buy', icon: CreditCard, color: 'text-emerald-400' },
                           { label: 'Swap', icon: ArrowLeftRight, color: 'text-indigo-400' },
                        ].map((action, i) => (
                           <button key={i} className="flex flex-col items-center gap-2 group">
                              <div className="w-14 h-14 rounded-[1.2rem] bg-slate-900 border border-white/5 flex items-center justify-center shadow-lg group-active:scale-95 transition-all group-hover:border-white/20">
                                 <action.icon size={20} className={action.color} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{action.label}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Asset List */}
                  <div>
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Assets</h3>
                        <Settings size={14} className="text-slate-600" />
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

                      <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2 group">
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
                                  <button onClick={(e) => { e.stopPropagation(); setShowCardDetails(!showCardDetails); }} className="text-slate-400 hover:text-white">
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
                         <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors">
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

             {/* === MODULE D: HOSTING & DAPPS === */}
             {activeTab === 'hosting' && (
                <div className="p-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                   <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Parmaweb</h2>
                   
                   {/* Hosting Status */}
                   <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-500 border border-slate-700">
                               <Cloud size={20} />
                            </div>
                            <div>
                               <div className="text-sm font-bold text-white">alex.fluid</div>
                               <div className="flex items-center gap-1.5 mt-1">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Online</span>
                               </div>
                            </div>
                         </div>
                         <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"><ExternalLink size={16} /></button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                         <div className="text-center">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Visits</div>
                            <div className="text-lg font-black text-white">2.4k</div>
                         </div>
                         <div className="text-center border-x border-slate-800">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Storage</div>
                            <div className="text-lg font-black text-white">45mb</div>
                         </div>
                         <div className="text-center">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Cost</div>
                            <div className="text-lg font-black text-white">$0</div>
                         </div>
                      </div>
                   </div>

                   {/* DApp Browser */}
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Ecosystem</h3>
                   <div className="grid grid-cols-2 gap-4">
                      {[
                         { name: 'Fluid Lend', cat: 'DeFi', icon: Landmark, color: 'text-indigo-400' },
                         { name: 'ParmaDAO', cat: 'Governance', icon: Users, color: 'text-amber-400' },
                         { name: 'Fluid NFT', cat: 'Market', icon: Layout, color: 'text-rose-400' },
                         { name: 'Bridge', cat: 'Utility', icon: Repeat, color: 'text-cyan-400' },
                      ].map((app, i) => (
                         <div key={i} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                            <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mb-3 ${app.color}`}>
                               <app.icon size={16} />
                            </div>
                            <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{app.name}</div>
                            <div className="text-[10px] font-bold text-slate-500">{app.cat}</div>
                         </div>
                      ))}
                   </div>
                </div>
             )}

          </div>

          {/* Bottom Navigation (Glass) */}
          <nav className="h-20 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 flex justify-between px-6 items-center relative z-50">
             {tabs.map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

// Simple User Icon Component needed above
const Users = ({size, className}: {size: number, className?: string}) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
   </svg>
);

const User = ({size, className}: {size: number, className?: string}) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
   </svg>
);

export default FluidWalletApp;