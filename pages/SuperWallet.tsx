
import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet, ArrowRightLeft, CreditCard, Globe, 
  Send, Plus, LogOut, Search, Bell, X, 
  Fingerprint, Scan, ArrowDown, History, 
  ChevronRight, Lock, ShieldCheck, Smartphone, 
  MoreHorizontal, RefreshCw, Server, Zap, Copy,
  Monitor, AlertTriangle, ChevronLeft, CheckCircle2,
  MapPin, Truck, Loader2, ShieldAlert, ScanEye,
  Activity, Cloud, HardDrive, ExternalLink, Code2, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { analyzeTransactionRisk, TransactionRiskAnalysis } from '../services/geminiService';

interface FluidWalletAppProps {
  onNavigate: (page: string) => void;
  initialView?: string;
}

// Mock Data
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

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 20 H78 C83.5 20 88 24.5 88 30 C88 35.5 83.5 40 78 40 H38 L48 20 Z" fill="currentColor" />
    <path d="M35 45 H65 C70.5 45 75 49.5 75 55 C75 60.5 70.5 65 65 65 H25 L35 45 Z" fill="currentColor" />
    <path d="M22 70 H52 C57.5 70 62 74.5 62 80 C62 85.5 57.5 90 52 90 H12 L22 70 Z" fill="currentColor" />
  </svg>
);

const CARD_TIERS = [
  { id: 'black', name: 'Fluid Black', bg: 'bg-slate-950', border: 'border-slate-800', text: 'text-white' },
  { id: 'steel', name: 'Fluid Steel', bg: 'bg-slate-600', border: 'border-slate-500', text: 'text-white' },
  { id: 'silver', name: 'Fluid Silver', bg: 'bg-slate-300', border: 'border-slate-400', text: 'text-slate-900' },
  { id: 'bronze', name: 'Fluid Bronze', bg: 'bg-amber-700', border: 'border-amber-600', text: 'text-white' },
  { id: 'platinum', name: 'Fluid Platinum', bg: 'bg-slate-400', border: 'border-slate-300', text: 'text-white' },
  { id: 'gold', name: 'Fluid Gold', bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-white' },
];

type ViewState = 'locked' | 'assets' | 'swap' | 'cards' | 'host' | 'settings' | 'send' | 'receive';

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
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

  // Send Flow
  const [sendStep, setSendStep] = useState<'input' | 'scanning' | 'review' | 'processing' | 'success'>('input');
  const [sendData, setSendData] = useState({ address: '', amount: '', assetId: 'eth' });
  const [riskReport, setRiskReport] = useState<TransactionRiskAnalysis | null>(null);

  // Swap Flow
  const [swapData, setSwapData] = useState({ from: 'eth', to: 'fld', fromAmount: '1.0', toAmount: '' });
  const [isSwapping, setIsSwapping] = useState(false);

  // Host Flow
  const [domainSearch, setDomainSearch] = useState('');
  const [isSearchingDomain, setIsSearchingDomain] = useState(false);
  const [domainResult, setDomainResult] = useState<boolean | null>(null);

  // Card Request State
  const [showCardRequest, setShowCardRequest] = useState(false);
  const [requestStep, setRequestStep] = useState<'config' | 'address' | 'success'>('config');
  const [cardType, setCardType] = useState<'virtual' | 'physical'>('virtual');
  const [cardTier, setCardTier] = useState(CARD_TIERS[0]);
  const [shippingDetails, setShippingDetails] = useState({ address: '', city: '', zip: '', country: '' });

  const totalBalance = assets.reduce((acc, asset) => acc + (asset.balance * asset.price), 0);

  // Auto-calculate swap output
  useEffect(() => {
    const fromAsset = assets.find(a => a.id === swapData.from);
    const toAsset = assets.find(a => a.id === swapData.to);
    if (fromAsset && toAsset && swapData.fromAmount) {
        const val = (parseFloat(swapData.fromAmount) * fromAsset.price) / toAsset.price;
        setSwapData(prev => ({...prev, toAmount: val.toFixed(4)}));
    }
  }, [swapData.fromAmount, swapData.from, swapData.to, assets]);

  // Simulate Biometric Unlock
  const handleUnlock = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setView('assets');
    }, 1500);
  };

  const handleCardOrder = () => {
      if (cardType === 'physical' && requestStep === 'config') {
          setRequestStep('address');
      } else {
          setRequestStep('success');
      }
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

  const resetSend = () => {
      setSendStep('input');
      setSendData({ address: '', amount: '', assetId: 'eth' });
      setView('assets');
  };

  const resetCardFlow = () => {
      setShowCardRequest(false);
      setRequestStep('config');
      setCardType('virtual');
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
          }
          setIsSwapping(false);
          setView('assets');
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

  const clearNotifications = () => {
      setNotifications([]);
      setShowNotificationList(false);
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

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 animate-fade-in-up">
          <Smartphone size={14} />
          Mobile Simulator
        </div>
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

             {/* Fluid Logo Watermark */}
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
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                         <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full" />
                      </div>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Welcome Back</span>
                      <span className="text-sm font-bold text-white">Alexander</span>
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
                
                {/* ASSETS VIEW */}
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
                          <span className="text-slate-300 text-xs font-medium">Total Balance</span>
                          <div className="text-3xl font-black text-white mt-1 tracking-tight">${totalBalance.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                             <span className="text-emerald-400 text-xs font-bold">+$2,450.20 (4.2%)</span>
                          </div>
                       </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-4 gap-4">
                         <button onClick={() => setView('send')} className="flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-purple-600 transition-all shadow-lg">
                               <Send size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-400">Send</span>
                         </button>
                         <button onClick={() => setView('receive')} className="flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-purple-600 transition-all shadow-lg">
                               <ArrowDown size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-400">Receive</span>
                         </button>
                         <button onClick={() => setView('swap')} className="flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-purple-600 transition-all shadow-lg">
                               <RefreshCw size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-400">Swap</span>
                         </button>
                         <button className="flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-purple-600 transition-all shadow-lg">
                               <Scan size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-400">Scan</span>
                         </button>
                    </div>

                    {/* Assets List */}
                    <div>
                       <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-white">Assets</h3>
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

                    {/* Recent Transactions (Short) */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Activity</h3>
                        <div className="space-y-3">
                            {transactions.slice(0, 3).map((tx, i) => (
                                <div key={i} className="flex items-center justify-between p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                                            <tx.icon size={16} />
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

                {/* SEND VIEW */}
                {view === 'send' && (
                    <div className="animate-fade-in-up">
                        <button onClick={() => {setView('assets'); setSendStep('input');}} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white"><ChevronLeft size={20}/> Back</button>
                        
                        {sendStep === 'input' && (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-6">Send Assets</h2>
                                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
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
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Recipient</label>
                                        <input 
                                            type="text" 
                                            className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-purple-500 focus:outline-none font-mono text-sm" 
                                            placeholder="0x..." 
                                            value={sendData.address}
                                            onChange={(e) => setSendData({...sendData, address: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Amount</label>
                                        <div className="relative mt-1">
                                            <input 
                                                type="number" 
                                                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-4 pr-20 text-white focus:border-purple-500 focus:outline-none text-2xl font-bold" 
                                                placeholder="0.00" 
                                                value={sendData.amount}
                                                onChange={(e) => setSendData({...sendData, amount: e.target.value})}
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 px-2 py-1 rounded text-xs font-bold text-white">
                                                {assets.find(a => a.id === sendData.assetId)?.symbol}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleSendAnalyze}
                                        disabled={!sendData.amount || !sendData.address}
                                        className="w-full py-4 bg-purple-600 rounded-xl font-bold text-white hover:bg-purple-500 transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ScanEye size={20} /> Scan & Preview
                                    </button>
                                </div>
                            </>
                        )}

                        {sendStep === 'scanning' && (
                             <div className="text-center py-12">
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
                                <h3 className="text-xl font-bold text-white">Review Transaction</h3>
                                
                                {/* Risk Card */}
                                <div className={`p-4 rounded-xl border ${
                                    riskReport.riskLevel === 'HIGH' ? 'bg-red-500/10 border-red-500/30' :
                                    riskReport.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/30' :
                                    'bg-emerald-500/10 border-emerald-500/30'
                                }`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Risk Assessment</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                            riskReport.riskLevel === 'HIGH' ? 'bg-red-500 text-white' : 
                                            riskReport.riskLevel === 'MEDIUM' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-white'
                                        }`}>
                                            {riskReport.riskLevel} RISK
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-white mb-2 leading-relaxed">{riskReport.summary}</p>
                                    <ul className="text-[10px] space-y-1 text-slate-400">
                                        {riskReport.warnings.map((w, i) => (
                                            <li key={i} className="flex gap-2">
                                                <ShieldAlert size={12} className="shrink-0 mt-0.5" /> {w}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-slate-900 p-4 rounded-xl space-y-3 border border-slate-800">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Sending</span>
                                        <span className="text-white font-bold">{sendData.amount} {assets.find(a => a.id === sendData.assetId)?.symbol}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">To</span>
                                        <span className="text-white font-mono text-xs">{sendData.address.slice(0, 10)}...{sendData.address.slice(-4)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Network Fee</span>
                                        <span className="text-white font-bold text-xs">~$0.45</span>
                                    </div>
                                </div>

                                <button onClick={handleSendConfirm} className="w-full py-4 bg-purple-600 rounded-xl font-bold text-white hover:bg-purple-500 transition-colors">
                                    Confirm Send
                                </button>
                                <button onClick={() => setSendStep('input')} className="w-full py-3 bg-slate-800 text-slate-400 rounded-xl font-bold text-sm">
                                    Cancel
                                </button>
                            </div>
                        )}

                        {sendStep === 'processing' && (
                            <div className="text-center py-12">
                                <Loader2 size={48} className="animate-spin text-purple-500 mx-auto mb-4" />
                                <h3 className="text-white font-bold">Broadcasting...</h3>
                            </div>
                        )}

                        {sendStep === 'success' && (
                            <div className="text-center py-12 bg-slate-900 rounded-3xl border border-slate-800">
                                <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-2">Sent!</h3>
                                <p className="text-slate-400 mb-8">Your transaction has been broadcasted.</p>
                                <button onClick={resetSend} className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl">Done</button>
                            </div>
                        )}
                    </div>
                )}

                {/* RECEIVE VIEW */}
                {view === 'receive' && (
                    <div className="animate-fade-in-up text-center">
                        <button onClick={() => setView('assets')} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white"><ChevronLeft size={20}/> Back</button>
                        <h2 className="text-2xl font-bold text-white mb-6">Receive</h2>
                        <div className="bg-white p-4 rounded-xl inline-block mb-6">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=0x71C7656EC7ab88b098defB751B7401B5f6d8976F" alt="QR" className="w-48 h-48" />
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4 flex items-center justify-between gap-2">
                             <span className="font-mono text-xs text-slate-400 truncate">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</span>
                             <Copy size={16} className="text-purple-400"/>
                        </div>
                        <p className="text-xs text-slate-500">Send only supported assets to this address.</p>
                    </div>
                )}

                {/* SWAP VIEW */}
                {view === 'swap' && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-2xl font-bold text-white mb-6">Swap Assets</h2>
                        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 relative shadow-xl">
                            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-2">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-400">You Pay</span>
                                    <span className="text-slate-500 font-bold">
                                        Bal: {assets.find(a => a.id === swapData.from)?.balance.toFixed(4)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <input 
                                        type="number" 
                                        value={swapData.fromAmount}
                                        onChange={(e) => setSwapData({...swapData, fromAmount: e.target.value})}
                                        className="bg-transparent text-2xl font-bold text-white w-2/3 outline-none" 
                                    />
                                    <button className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 hover:border-purple-500 transition-colors">
                                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-bold text-white">
                                            {assets.find(a => a.id === swapData.from)?.symbol[0]}
                                        </div>
                                        <span className="font-bold text-white text-sm">{assets.find(a => a.id === swapData.from)?.symbol}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-center -my-3 relative z-10">
                                <button 
                                    onClick={() => setSwapData(prev => ({...prev, from: prev.to, to: prev.from}))}
                                    className="w-8 h-8 bg-slate-800 border-2 border-slate-900 rounded-lg flex items-center justify-center text-purple-400 shadow-xl hover:rotate-180 transition-transform duration-300"
                                >
                                    <ArrowDownLeft size={16} />
                                </button>
                            </div>

                            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mt-1 mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-400">You Receive</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <input type="text" value={swapData.toAmount} className="bg-transparent text-2xl font-bold text-purple-400 w-2/3 outline-none" readOnly />
                                    <button className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 hover:border-purple-500 transition-colors">
                                        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[8px] font-bold text-white">
                                            {assets.find(a => a.id === swapData.to)?.symbol[0]}
                                        </div>
                                        <span className="font-bold text-white text-sm">{assets.find(a => a.id === swapData.to)?.symbol}</span>
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={handleSwap}
                                disabled={isSwapping}
                                className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold text-lg shadow-lg hover:bg-purple-500 transition-colors flex items-center justify-center gap-2"
                            >
                                {isSwapping ? <Loader2 className="animate-spin" /> : 'Swap Now'}
                            </button>
                        </div>
                    </div>
                )}

                {/* CARDS VIEW */}
                {view === 'cards' && (
                   <div className="space-y-6 animate-fade-in-up">
                      <div className="flex justify-between items-end mb-2">
                         <h2 className="text-2xl font-bold text-white">Cards</h2>
                         <button 
                            onClick={() => setShowCardRequest(!showCardRequest)}
                            className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-purple-600 transition-colors"
                         >
                             <Plus size={20}/>
                         </button>
                      </div>

                      {/* Card Request Overlay */}
                      {showCardRequest && (
                          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 animate-fade-in-up">
                              <div className="flex justify-between items-start mb-4">
                                  <h3 className="font-bold text-white">Request New Card</h3>
                                  <button onClick={resetCardFlow} className="text-slate-500 hover:text-white"><X size={16}/></button>
                              </div>
                              
                              {requestStep === 'success' ? (
                                  <div className="text-center py-6">
                                      <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                                      <h4 className="text-white font-bold mb-2">Request Sent!</h4>
                                      <p className="text-xs text-slate-400 mb-4">Your {cardType} {cardTier.name} card is being processed.</p>
                                      <button onClick={resetCardFlow} className="w-full py-2 bg-slate-800 text-white rounded-lg text-xs font-bold">Done</button>
                                  </div>
                              ) : (
                                <>
                                  {requestStep === 'config' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            <button 
                                                onClick={() => setCardType('virtual')}
                                                className={`p-3 rounded-xl border text-xs font-bold ${cardType === 'virtual' ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-700 text-slate-400'}`}
                                            >
                                                Virtual
                                            </button>
                                            <button 
                                                onClick={() => setCardType('physical')}
                                                className={`p-3 rounded-xl border text-xs font-bold ${cardType === 'physical' ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-700 text-slate-400'}`}
                                            >
                                                Physical
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            {CARD_TIERS.map(tier => (
                                                <button 
                                                    key={tier.id}
                                                    onClick={() => setCardTier(tier)}
                                                    className={`p-2 rounded-lg text-[10px] font-bold border ${cardTier.id === tier.id ? 'border-purple-500 text-white' : 'border-slate-800 text-slate-500'}`}
                                                >
                                                    {tier.name}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                  )}

                                  {requestStep === 'address' && (
                                      <div className="space-y-3 mb-4">
                                          <input 
                                            type="text" 
                                            placeholder="Street Address" 
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                                            value={shippingDetails.address}
                                            onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                                          />
                                          <div className="grid grid-cols-2 gap-2">
                                              <input 
                                                type="text" 
                                                placeholder="City" 
                                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                                                value={shippingDetails.city}
                                                onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})}
                                              />
                                              <input 
                                                type="text" 
                                                placeholder="ZIP Code" 
                                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                                                value={shippingDetails.zip}
                                                onChange={(e) => setShippingDetails({...shippingDetails, zip: e.target.value})}
                                              />
                                          </div>
                                          <input 
                                            type="text" 
                                            placeholder="Country" 
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                                            value={shippingDetails.country}
                                            onChange={(e) => setShippingDetails({...shippingDetails, country: e.target.value})}
                                          />
                                      </div>
                                  )}

                                  <button 
                                    onClick={handleCardOrder}
                                    className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl text-sm"
                                  >
                                      {requestStep === 'config' && cardType === 'physical' ? 'Next: Shipping' : 'Confirm Order'}
                                  </button>
                                </>
                              )}
                          </div>
                      )}

                      {/* Concurrent Cards Display */}
                      <div className="flex flex-col gap-6 mb-4">
                        {/* Virtual Card */}
                        <div className="relative aspect-[1.58/1] rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 shadow-xl group hover:scale-[1.02] transition-transform duration-500">
                             <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black opacity-90"></div>
                             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                             <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 blur-2xl rounded-full"></div>
                             
                             <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                                 <div className="flex justify-between items-start">
                                   <div className="flex items-center gap-2">
                                     <FluidLogo className="w-6 h-6" />
                                     <span className="font-black text-lg text-white tracking-widest italic">Fluid</span>
                                   </div>
                                   <Smartphone size={20} className="text-slate-400" />
                                 </div>
                                 <div>
                                   <div className="font-mono text-white text-xl tracking-widest mb-1">**** 4829</div>
                                   <div className="flex justify-between items-end">
                                       <span className="text-[10px] text-slate-400 uppercase font-bold">Alexander Fluid</span>
                                       <span className="text-[9px] text-purple-400 font-bold uppercase border border-purple-400 px-1.5 py-0.5 rounded">Virtual</span>
                                   </div>
                                 </div>
                             </div>
                        </div>

                        {/* Physical Card */}
                        <div className="relative aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-slate-700 to-slate-600 overflow-hidden border border-slate-500 shadow-xl group hover:scale-[1.02] transition-transform duration-500">
                             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
                             <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
                             
                             <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                                 <div className="flex justify-between items-start">
                                   <div className="flex items-center gap-2">
                                     <FluidLogo className="w-6 h-6 text-white" />
                                     <span className="font-black text-lg text-white tracking-widest italic">Fluid</span>
                                   </div>
                                   <CreditCard size={20} className="text-slate-300" />
                                 </div>
                                 <div>
                                   <div className="font-mono text-white text-xl tracking-widest mb-1 text-shadow-sm">**** 9921</div>
                                   <div className="flex justify-between items-end">
                                       <span className="text-[10px] text-slate-300 uppercase font-bold">Alexander Fluid</span>
                                       <span className="text-[9px] text-cyan-300 font-bold uppercase border border-cyan-300 px-1.5 py-0.5 rounded">Physical</span>
                                   </div>
                                 </div>
                             </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="space-y-2">
                         <div className="p-4 bg-slate-900 rounded-2xl flex items-center justify-between border border-slate-800">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Lock size={18} /></div>
                               <span className="text-sm font-bold text-white">Freeze All</span>
                            </div>
                            <div className="w-10 h-6 bg-slate-800 rounded-full relative cursor-pointer border border-slate-700">
                               <div className="absolute left-1 top-1 w-4 h-4 bg-slate-500 rounded-full transition-all"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                )}
                
                {/* HOST VIEW */}
                {view === 'host' && (
                  <div className="space-y-6 animate-fade-in-up">
                      <h2 className="text-2xl font-bold text-white">Fluid Host</h2>

                      {/* Domain Search */}
                      <form onSubmit={handleDomainSearch} className="relative">
                          <input 
                              type="text" 
                              value={domainSearch}
                              onChange={(e) => {
                                  setDomainSearch(e.target.value);
                                  setDomainResult(null);
                              }}
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
                              <div>
                                  <div className="font-bold text-white">{domainSearch}</div>
                                  <div className="text-xs text-emerald-500 uppercase font-bold">Available</div>
                              </div>
                              <button className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg">Claim Free</button>
                          </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                              <HardDrive className="text-indigo-500 mb-2" size={24} />
                              <div className="text-2xl font-bold text-white">45MB</div>
                              <div className="text-xs text-slate-500">Storage Used</div>
                          </div>
                          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                              <Activity className="text-emerald-500 mb-2" size={24} />
                              <div className="text-2xl font-bold text-white">100%</div>
                              <div className="text-xs text-slate-500">Uptime</div>
                          </div>
                      </div>

                      {/* Deployments List */}
                      <div>
                          <h3 className="font-bold text-white mb-3">Deployments</h3>
                          <div className="space-y-3">
                              {HOST_DEPLOYMENTS.map(deploy => (
                                  <div key={deploy.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                                      <div>
                                          <div className="font-bold text-white text-sm">{deploy.name}</div>
                                          <div className="text-xs text-blue-400">{deploy.url}</div>
                                      </div>
                                      <div className={`w-2 h-2 rounded-full ${deploy.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Domains List */}
                      <div>
                          <h3 className="font-bold text-white mb-3">My Domains</h3>
                          <div className="space-y-3">
                              {HOST_DOMAINS.map(domain => (
                                  <div key={domain.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-bold text-slate-400">
                                              {domain.name[0].toUpperCase()}
                                          </div>
                                          <div>
                                              <div className="font-bold text-white text-sm">{domain.name}</div>
                                              <div className="text-xs text-slate-500">{domain.type}</div>
                                          </div>
                                      </div>
                                      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded font-bold uppercase">{domain.status}</span>
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
