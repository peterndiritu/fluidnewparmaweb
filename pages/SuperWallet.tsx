import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Building2, Banknote, History, Flag, QrCode, UploadCloud, Rocket,
  Key, Chrome, ChevronLeft, Delete, User, Edit3, AtSign, Camera, Share2, Save, ShoppingCart, ArrowRight,
  ShoppingBag, Coins, Monitor, Play, RotateCw, Check
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
  description?: string;
}

interface Deployment {
  id: string;
  name: string;
  hash: string;
  status: 'active' | 'deploying' | 'error';
  url: string;
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
  { id: '1', name: 'Fluid Swap', url: 'fluid://dex', icon: RefreshCw, category: 'DeFi', status: 'online', description: 'Instant, low-fee token swaps.' },
  { id: '2', name: 'Fluid Storage', url: 'fluid://storage', icon: Database, category: 'Infrastructure', status: 'online', description: 'Decentralized permanent file storage.' },
  { id: '3', name: 'SecureChat', url: 'fluid://chat', icon: Lock, category: 'Social', status: 'online', description: 'E2E encrypted wallet-to-wallet chat.' },
  { id: '4', name: 'Uniswap', url: 'fluid://uniswap', icon: Repeat, category: 'DeFi', status: 'online', description: 'Swap, earn, and build on the leading decentralized protocol.' },
  { id: '5', name: 'Aave', url: 'fluid://aave', icon: Landmark, category: 'DeFi', status: 'online', description: 'Open source liquidity protocol.' },
  { id: '6', name: 'Fluid Names', url: 'fluid://ns', icon: Globe, category: 'Utils', status: 'online', description: 'Register and manage your web3 identity.' },
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
  const [view, setView] = useState<'main' | 'input' | 'passkey_scan'>('main');
  const [authMethod, setAuthMethod] = useState<'phone' | 'google' | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'verifying' | 'error'>('idle');

  // Handles Biometric (Immediate) and Passkey (Simulated System Dialog)
  const handleDirectAuth = (method: 'biometric' | 'passkey') => {
    if (method === 'passkey') setView('passkey_scan');
    
    setStatus('scanning');
    
    // Simulate auth delay
    setTimeout(() => {
      setStatus('success');
      setTimeout(onUnlock, 800);
    }, 1500);
  };

  // Switch to Input View for Code-based Auth
  const handleCodeAuth = (method: 'phone' | 'google') => {
    setAuthMethod(method);
    setView('input');
    setInputCode('');
    setStatus('idle');
  };

  const handleKeyPress = (num: string) => {
    if (inputCode.length < 6) {
      setInputCode(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setInputCode(prev => prev.slice(0, -1));
  };

  const verifyCode = () => {
    if (inputCode.length !== 6) return;
    setStatus('verifying');
    setTimeout(() => {
      // Mock validation - Accept any code for simulation
      setStatus('success');
      setTimeout(onUnlock, 800);
    }, 1000);
  };

  // Submit automatically when 6 digits are entered
  useEffect(() => {
    if (inputCode.length === 6) verifyCode();
  }, [inputCode]);

  return (
    <div className="absolute inset-0 z-50 bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {view === 'main' || view === 'passkey_scan' ? (
        <>
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

          <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">FLUID DAPP</h1>
          <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
            {view === 'passkey_scan' ? 'Follow system prompt to authenticate.' : 'Select authentication method to activate session.'}
          </p>

          {/* Primary Biometric Button */}
          {view === 'main' && (
            <button 
              onClick={() => handleDirectAuth('biometric')}
              className="group relative px-8 py-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all w-full max-w-xs overflow-hidden mb-6"
            >
              <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative flex items-center justify-center gap-3">
                 <Fingerprint size={20} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                 <span className="text-slate-300 font-bold uppercase tracking-wider text-xs group-hover:text-white">Biometric Login</span>
              </div>
            </button>
          )}

          {/* Alternative Auth Methods */}
          {view === 'main' && (
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
               <button onClick={() => handleDirectAuth('passkey')} className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors group">
                  <Key size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                  <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-300 uppercase">Passkey</span>
               </button>
               <button onClick={() => handleCodeAuth('phone')} className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors group">
                  <Smartphone size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                  <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-300 uppercase">Phone</span>
               </button>
               <button onClick={() => handleCodeAuth('google')} className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors group">
                  <Chrome size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                  <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-300 uppercase">Google</span>
               </button>
            </div>
          )}
          
          {view === 'passkey_scan' && (
             <div className="animate-pulse flex flex-col items-center gap-4">
                <ScanFace size={48} className="text-emerald-500" />
                <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Waiting for Passkey...</span>
                <button onClick={() => setView('main')} className="text-slate-500 hover:text-white text-xs font-bold mt-4">Cancel</button>
             </div>
          )}
        </>
      ) : (
        // --- Input View for Phone/Google ---
        <div className="w-full max-w-xs flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-300">
           <button onClick={() => setView('main')} className="absolute top-6 left-6 text-slate-500 hover:text-white">
              <ChevronLeft size={24} />
           </button>

           <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 border border-slate-800">
              {authMethod === 'phone' ? <Smartphone size={28} /> : <Chrome size={28} />}
           </div>

           <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
              {authMethod === 'phone' ? 'SMS Code' : 'Authenticator'}
           </h2>
           <p className="text-slate-500 text-xs mb-8">
              {authMethod === 'phone' 
                ? 'Enter the code sent to +1 *** *** 9928' 
                : 'Enter the code from your Google Auth app'}
           </p>

           {/* Code Display */}
           <div className="flex gap-3 mb-8">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className={`w-10 h-12 rounded-xl border flex items-center justify-center text-xl font-bold transition-all ${
                    inputCode[i] 
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-white' 
                    : 'border-slate-800 bg-slate-900 text-slate-700'
                 } ${status === 'error' ? 'border-rose-500 text-rose-500' : ''}`}>
                    {inputCode[i] || ''}
                 </div>
              ))}
           </div>

           {/* Feedback */}
           {status === 'verifying' && <div className="text-emerald-500 text-xs font-bold uppercase tracking-widest animate-pulse mb-4">Verifying...</div>}
           {status === 'error' && <div className="text-rose-500 text-xs font-bold uppercase tracking-widest mb-4">Invalid Code</div>}

           {/* Keypad */}
           <div className="grid grid-cols-3 gap-4 w-full px-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                 <button 
                   key={num}
                   onClick={() => handleKeyPress(num.toString())}
                   className="h-14 rounded-2xl bg-slate-900/50 hover:bg-slate-800 text-white font-bold text-lg transition-colors border border-white/5 active:scale-95"
                 >
                    {num}
                 </button>
              ))}
              <div className="h-14"></div>
              <button 
                 onClick={() => handleKeyPress('0')}
                 className="h-14 rounded-2xl bg-slate-900/50 hover:bg-slate-800 text-white font-bold text-lg transition-colors border border-white/5 active:scale-95"
              >
                 0
              </button>
              <button 
                 onClick={handleDelete}
                 className="h-14 rounded-2xl bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/5 active:scale-95"
              >
                 <Delete size={20} />
              </button>
           </div>
        </div>
      )}
      
      {view === 'main' && (
        <div className="mt-8">
          <button className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Emergency Kit</button>
        </div>
      )}
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
  const [activeModal, setActiveModal] = useState<'send' | 'receive' | 'buy' | 'editProfile' | 'domainRegistrar' | 'cardLimits' | 'deploy' | 'dappStore' | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Profile State
  const [profile, setProfile] = useState({
    name: 'Alexander Fluid',
    handle: 'alex.fluid',
    bio: 'DeFi Native & Fluid Validator 💧',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander&backgroundColor=b6e3f4'
  });
  const [tempProfile, setTempProfile] = useState(profile);

  // Card Limits State
  const [cardLimits, setCardLimits] = useState({
    online: 5000,
    inStore: 2500,
    atm: 1000
  });
  const [tempCardLimits, setTempCardLimits] = useState(cardLimits);

  // Domain Registrar State
  const [domainQuery, setDomainQuery] = useState('');
  const [domainSearchStatus, setDomainSearchStatus] = useState<'idle' | 'searching' | 'results'>('idle');

  // Deployment State
  const [myDeployments, setMyDeployments] = useState<Deployment[]>([
    { id: '1', name: 'fluid-dex-v2', hash: 'ipfs://QmX...7a2', status: 'active', url: 'https://fluid.link/dex' }
  ]);
  const [newDeployName, setNewDeployName] = useState('');
  const [deployStep, setDeployStep] = useState(0); // 0: input, 1: deploying, 2: success
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // DApp Store State
  const [dAppSearch, setDAppSearch] = useState('');
  const [selectedDAppCategory, setSelectedDAppCategory] = useState('All');

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
    sendCrypto: true,
    buyCrypto: true,
  });
  
  // Security Audit Score Calculation
  const securityScore = useMemo(() => {
    let score = 50; // Base score
    if (!isLocked) score += 10; // Vault accessed successfully
    if (securitySettings.viewCardDetails) score += 10;
    if (securitySettings.initiateSwap) score += 10;
    if (securitySettings.changeLimits) score += 10;
    if (securitySettings.sendCrypto) score += 5;
    if (securitySettings.buyCrypto) score += 5;
    if (profile.handle.endsWith('.fluid')) score += 10; // Bonus for setting up handle
    return Math.min(score, 100);
  }, [securitySettings, isLocked, profile.handle]);

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

  const handleDomainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainQuery.trim()) return;
    setDomainSearchStatus('searching');
    setTimeout(() => {
      setDomainSearchStatus('results');
    }, 1500);
  };

  // --- Deployment Simulation ---
  const startDeployment = () => {
    if (!newDeployName) return;
    setDeployStep(1);
    setDeployLogs(['> Initializing Fluid CLI environment...']);
    
    const steps = [
        { msg: '> Cloning repository...', delay: 800 },
        { msg: '> Installing dependencies (npm install)...', delay: 2000 },
        { msg: '> Building optimized production bundle...', delay: 3500 },
        { msg: '> Encrypting assets for sharding...', delay: 5000 },
        { msg: '> Uploading to Fluid Node Grid (Shard 1/3)...', delay: 6000 },
        { msg: '> Uploading to Fluid Node Grid (Shard 2/3)...', delay: 7000 },
        { msg: '> Uploading to Fluid Node Grid (Shard 3/3)...', delay: 8000 },
        { msg: '> Verifying integrity and propagation...', delay: 9000 },
        { msg: '> Generating immutable hash...', delay: 10000 },
        { msg: 'SUCCESS: Deployment Complete!', delay: 11000 },
    ];

    steps.forEach(({ msg, delay }) => {
        setTimeout(() => {
            setDeployLogs(prev => [...prev, msg]);
            if (logsEndRef.current) {
                logsEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, delay);
    });

    setTimeout(() => {
        setMyDeployments(prev => [{
            id: Date.now().toString(),
            name: newDeployName,
            hash: `ipfs://Qm${Math.random().toString(36).substring(7)}`,
            status: 'active',
            url: `https://${newDeployName}.fluid.link`
        }, ...prev]);
        setDeployStep(2);
    }, 11500);
  };
  
  // Navigation
  const tabs = [
    { id: 'assets', label: 'Wallet', icon: WalletIcon },
    { id: 'dex', label: 'DEX', icon: RefreshCw },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'fiat', label: 'Fiat', icon: Landmark },
    { id: 'hosting', label: 'Fluid Host', icon: Server },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center">
       
       {/* Introduction Header */}
       <div className="text-center mb-12 max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-bold uppercase tracking-widest mb-4">
             <Layout size={12} /> Interactive Demo
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
             Experience the Future of DeFi
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
             Take an interactive tour of the Fluid Dapp — a preview of the seamless convergence of crypto, banking, and decentralized hosting we are building.
          </p>
       </div>

       {/* Device Chassis */}
       {isLocked ? (
          <div className="w-full max-w-[420px] h-[850px] bg-black rounded-[3.5rem] border-8 border-slate-900 relative overflow-hidden shadow-2xl mx-auto">
             <SecurityVault onUnlock={() => setIsLocked(false)} />
          </div>
       ) : (
          <div className="w-full max-w-[420px] h-[850px] bg-[#020617] rounded-[3.5rem] border-[8px] border-[#1e232f] relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col mx-auto">
          
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
                  className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors overflow-hidden"
                >
                   <img src={profile.avatar} alt="User" className="w-full h-full object-cover" />
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
                                    {asset.symbol === 'FLD' ? <FluidLogo className="w-6 h-6" /> : <Coins size={20} />}
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
                           <div 
                             key={tx.id} 
                             onClick={() => setSelectedTransaction(tx)}
                             className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
                           >
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
                                     <span className="text-xs text-white font-bold tracking-wider">{profile.name.toUpperCase()}</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-white/50 italic">{cardMode === 'physical' ? 'STEEL' : 'VIRTUAL'}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                   {/* ... controls ... */}
                   <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                         <button 
                           onClick={() => handleSecureAction('changeLimits', () => {
                              setTempCardLimits(cardLimits);
                              setActiveModal('cardLimits');
                           })}
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

                   {/* Domains Section */}
                   <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Domains</h3>
                         <button 
                           onClick={() => setActiveModal('domainRegistrar')}
                           className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider hover:text-white transition-colors"
                         >
                            + Register
                         </button>
                      </div>
                      <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900 transition-colors">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                      <Globe size={18} />
                                  </div>
                                  <div>
                                      <div className="text-xs font-bold text-white">alex.fluid</div>
                                      <div className="text-[9px] text-emerald-500 font-bold">Active • Auto-Renew</div>
                                  </div>
                              </div>
                              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                  <Settings size={16} className="text-slate-500" />
                              </button>
                          </div>
                      </div>
                   </div>

                   {/* Deployed dApps */}
                   <div className="mb-6">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">My Deployments</h3>
                      <div className="space-y-3">
                          {myDeployments.map((deploy) => (
                            <div key={deploy.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900 transition-colors animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <Rocket size={18} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white">{deploy.name}</div>
                                        <div className="text-[9px] text-slate-500 font-mono truncate w-24">{deploy.hash}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {deploy.status === 'active' && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>}
                                    <a href={deploy.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                          ))}
                          
                          <button 
                            onClick={() => {
                                setNewDeployName('');
                                setDeployStep(0);
                                setDeployLogs([]);
                                setActiveModal('deploy');
                            }}
                            className="w-full py-3 rounded-2xl border border-dashed border-slate-700 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900/50 hover:text-white hover:border-slate-600 transition-all flex items-center justify-center gap-2"
                          >
                               <UploadCloud size={14} /> Deploy New Site
                          </button>
                      </div>
                   </div>

                   {/* dApp Browser */}
                   <div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Fluid Host Browser</h3>
                      <div className="grid grid-cols-3 gap-3">
                          {DAPPS.map(app => (
                              <button 
                                key={app.id} 
                                onClick={() => setActiveModal('dappStore')}
                                className="flex flex-col items-center gap-2 p-3 bg-slate-900/30 border border-slate-800 rounded-2xl hover:bg-slate-800 hover:border-slate-700 transition-all group"
                              >
                                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white border border-white/5 group-hover:scale-110 transition-transform">
                                      <app.icon size={18} />
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-400 group-hover:text-white">{app.name}</span>
                              </button>
                          ))}
                          <button 
                            onClick={() => setActiveModal('dappStore')}
                            className="flex flex-col items-center gap-2 p-3 border border-dashed border-slate-800 rounded-2xl hover:bg-slate-900/50 transition-all group"
                          >
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 group-hover:text-white transition-colors">
                                  <Search size={18} />
                              </div>
                              <span className="text-[9px] font-bold text-slate-600 group-hover:text-white transition-colors">Explore</span>
                          </button>
                      </div>
                   </div>
                </div>
             )}

             {/* === MODULE E: SETTINGS & SECURITY === */}
             {activeTab === 'settings' && (
               <div className="p-6 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Settings</h2>
                  
                  {/* Profile Card */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 mb-6 relative overflow-hidden backdrop-blur-md">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none"></div>
                    <div className="flex items-start justify-between mb-6 relative z-10">
                       <div className="flex items-center gap-4">
                          <div className="relative">
                             <img src={profile.avatar} alt="Profile" className="w-20 h-20 rounded-2xl bg-slate-800 object-cover border-2 border-white/10" />
                             <div className="absolute -bottom-2 -right-2 p-1.5 bg-indigo-500 rounded-lg border-4 border-slate-900 text-white shadow-lg">
                                <ShieldCheck size={12} />
                             </div>
                          </div>
                          <div>
                             <h3 className="text-xl font-black text-white tracking-tight">{profile.name}</h3>
                             <div className="flex items-center gap-1 text-indigo-400 font-bold text-sm bg-indigo-500/10 px-2 py-0.5 rounded-lg w-fit mt-1 border border-indigo-500/20">
                                <AtSign size={12} /> {profile.handle}
                             </div>
                             <p className="text-[10px] text-slate-500 font-medium mt-2 max-w-[160px] leading-tight">{profile.bio}</p>
                          </div>
                       </div>
                       <button 
                          onClick={() => {
                             setTempProfile(profile);
                             setActiveModal('editProfile');
                          }}
                          className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-lg"
                       >
                          <Edit3 size={18} />
                       </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                       <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex flex-col items-center text-center">
                          <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Fluid Score</div>
                          <div className="text-lg font-black text-white">850</div>
                       </div>
                       <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex flex-col items-center text-center">
                          <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Member Since</div>
                          <div className="text-lg font-black text-white">2024</div>
                       </div>
                    </div>
                  </div>

                  {/* Desktop Sync Promotion */}
                  <div className="mb-8 p-4 bg-indigo-600/10 border border-indigo-600/20 rounded-2xl flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-600 rounded-xl text-white"><Monitor size={18}/></div>
                          <div>
                              <div className="text-xs font-bold text-white">Desktop App</div>
                              <div className="text-[9px] text-indigo-300">Sync with Windows/Mac/Linux</div>
                          </div>
                      </div>
                      <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-[9px] font-bold rounded-lg uppercase tracking-wider">Download</button>
                  </div>

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
                            {profile.handle.endsWith('.fluid') || profile.handle.length > 3 ? <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center"><CheckCircle2 size={10}/></div> : <div className="w-4 h-4 rounded bg-slate-800 text-slate-600 flex items-center justify-center"><AlertOctagon size={10}/></div>}
                            <span>Fluid Handle Active</span>
                         </div>
                         <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                            {securitySettings.viewCardDetails ? <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center"><CheckCircle2 size={10}/></div> : <div className="w-4 h-4 rounded bg-slate-800 text-slate-600 flex items-center justify-center"><AlertOctagon size={10}/></div>}
                            <span>Card Details Hidden</span>
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
                        { id: 'sendCrypto', label: 'Send Crypto', desc: 'Require auth for outgoing transfers' },
                        { id: 'buyCrypto', label: 'Buy Crypto', desc: 'Require auth for fiat on-ramp' },
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
                  
                  <div className="mt-8 pt-6 border-t border-white/5 pb-20">
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
                       {activeModal === 'editProfile' && 'Edit Profile'}
                       {activeModal === 'domainRegistrar' && 'Domain Registrar'}
                       {activeModal === 'cardLimits' && 'Spending Limits'}
                       {activeModal === 'deploy' && 'Deploy dApp'}
                       {activeModal === 'dappStore' && 'dApp Store'}
                     </h3>
                     <button onClick={() => { setActiveModal(null); setDomainSearchStatus('idle'); setDomainQuery(''); }} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                        <X size={16} />
                     </button>
                  </div>

                  {activeModal === 'domainRegistrar' && (
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* Search */}
                        <div className="mb-6 relative z-10">
                            <form onSubmit={handleDomainSearch} className="relative">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                    type="text" 
                                    value={domainQuery}
                                    onChange={(e) => setDomainQuery(e.target.value)}
                                    placeholder="Search names..." 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-20 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-all"
                                />
                                <button 
                                    type="submit"
                                    disabled={!domainQuery || domainSearchStatus === 'searching'}
                                    className="absolute right-2 top-1.5 bottom-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition-colors disabled:opacity-50"
                                >
                                    {domainSearchStatus === 'searching' ? '...' : 'Search'}
                                </button>
                            </form>
                        </div>

                        {/* Results */}
                        <div className="flex-grow overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                            {domainSearchStatus === 'idle' && (
                                <div className="flex flex-col items-center justify-center h-40 text-slate-500 space-y-3 opacity-50">
                                    <Globe size={48} strokeWidth={1} />
                                    <span className="text-xs font-bold">Search to register</span>
                                </div>
                            )}

                            {domainSearchStatus === 'results' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="p-4 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors"></div>
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div>
                                                <span className="text-sm font-black text-white">{domainQuery.split('.')[0]}<span className="text-indigo-400">.fluid</span></span>
                                                <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400 font-bold">
                                                    <CheckCircle2 size={10} /> Available
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-black text-white">FREE</span>
                                                <span className="block text-[8px] text-slate-400 uppercase tracking-wider line-through">$500 Value</span>
                                            </div>
                                        </div>
                                        <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors shadow-lg relative z-10 flex items-center justify-center gap-2">
                                            Claim Handle <ArrowRight size={12} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 my-2">
                                        <div className="h-px flex-grow bg-slate-800"></div>
                                        <span className="text-[9px] font-bold text-slate-600 uppercase">Traditional TLDs</span>
                                        <div className="h-px flex-grow bg-slate-800"></div>
                                    </div>

                                    {[
                                        { tld: '.com', price: '$12.99' },
                                        { tld: '.io', price: '$35.00' },
                                        { tld: '.xyz', price: '$1.99' }
                                    ].map((item) => (
                                        <div key={item.tld} className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 border border-white/5">
                                                    <Globe size={14} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-300">{domainQuery.split('.')[0]}<span className="text-slate-500">{item.tld}</span></span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-white">{item.price}</span>
                                                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                                    <ShoppingCart size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                  )}

                  {activeModal === 'deploy' && (
                    <div className="flex flex-col h-full overflow-hidden">
                        {deployStep === 0 && (
                            <div className="space-y-6 flex-grow animate-in fade-in">
                                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex gap-3">
                                    <Rocket className="text-indigo-500 shrink-0" size={20} />
                                    <p className="text-[10px] text-indigo-200/80 leading-relaxed">
                                        Deploy standard React/Next.js projects directly from GitHub. Your site will be hosted permanently on the Fluid Node Network.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Project Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="my-awesome-dapp" 
                                            value={newDeployName}
                                            onChange={(e) => setNewDeployName(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">GitHub Repository URL</label>
                                        <input 
                                            type="text" 
                                            placeholder="https://github.com/username/repo" 
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 px-4 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Framework Preset</label>
                                        <div className="flex gap-2">
                                            {['Next.js', 'React', 'Vite', 'Static'].map(fw => (
                                                <button key={fw} className="flex-1 py-2 bg-slate-800 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-white/5 focus:border-indigo-500">{fw}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={startDeployment}
                                    disabled={!newDeployName}
                                    className="w-full py-4 mt-auto bg-indigo-600 text-white font-black rounded-xl uppercase tracking-widest hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Terminal size={16} /> Initialize Deploy
                                </button>
                            </div>
                        )}

                        {deployStep === 1 && (
                            <div className="flex flex-col h-full animate-in fade-in">
                                <div className="flex-grow bg-black rounded-2xl border border-white/10 p-4 font-mono text-[10px] text-slate-300 overflow-y-auto mb-4 custom-scrollbar">
                                    <div className="flex gap-2 mb-2 pb-2 border-b border-white/10 text-slate-500">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="ml-2">fluid-cli deploy --prod</span>
                                    </div>
                                    <div className="space-y-1">
                                        {deployLogs.map((log, i) => (
                                            <div key={i} className={`${i === deployLogs.length - 1 ? 'text-white font-bold animate-pulse' : 'text-slate-400'}`}>
                                                {log}
                                            </div>
                                        ))}
                                        <div ref={logsEndRef} />
                                    </div>
                                </div>
                                <div className="text-center text-[10px] text-slate-500 uppercase font-black tracking-widest animate-pulse">
                                    Building & Sharding...
                                </div>
                            </div>
                        )}

                        {deployStep === 2 && (
                            <div className="flex flex-col items-center justify-center h-full animate-in zoom-in-95 duration-500 text-center space-y-6">
                                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                                    <Check size={48} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Deployed!</h2>
                                    <p className="text-slate-400 text-sm">Your decentralized site is live.</p>
                                </div>
                                <div className="w-full bg-black/30 p-4 rounded-xl border border-emerald-500/20 flex items-center justify-between">
                                    <span className="text-emerald-400 font-mono text-xs">{`https://${newDeployName}.fluid.link`}</span>
                                    <ExternalLink size={16} className="text-slate-500 hover:text-white cursor-pointer" />
                                </div>
                                <button 
                                    onClick={() => setActiveModal(null)}
                                    className="px-8 py-3 bg-white text-slate-900 font-black rounded-xl uppercase tracking-widest hover:scale-105 transition-transform"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                  )}

                  {activeModal === 'dappStore' && (
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* Search */}
                        <div className="mb-4 relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                                type="text" 
                                value={dAppSearch}
                                onChange={(e) => setDAppSearch(e.target.value)}
                                placeholder="Search apps, protocols..." 
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Categories */}
                        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2">
                            {['All', 'DeFi', 'NFT', 'Social', 'Games', 'Utils'].map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setSelectedDAppCategory(cat)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${selectedDAppCategory === cat ? 'bg-white text-slate-900 border-white' : 'bg-transparent text-slate-500 border-slate-800 hover:border-slate-600'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* List */}
                        <div className="flex-grow overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                            {DAPPS.filter(app => (selectedDAppCategory === 'All' || app.category === selectedDAppCategory) && app.name.toLowerCase().includes(dAppSearch.toLowerCase())).map(app => (
                                <div 
                                    key={app.id} 
                                    onClick={() => {
                                        if (app.id === '6') {
                                            setActiveModal('domainRegistrar');
                                        }
                                    }}
                                    className="flex items-center gap-4 p-3 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-indigo-500/30 transition-all group cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white border border-white/5 shrink-0 group-hover:scale-105 transition-transform">
                                        <app.icon size={20} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-bold text-white">{app.name}</h4>
                                            <span className="text-[9px] font-bold text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">{app.category}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{app.description}</p>
                                    </div>
                                    <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            ))}
                            {/* Promo Banner */}
                            <div className="mt-4 p-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-2xl flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-white mb-1">Submit your dApp</div>
                                    <div className="text-[9px] text-purple-300">Join the Fluid ecosystem today.</div>
                                </div>
                                <button className="px-3 py-1.5 bg-purple-500 hover:bg-purple-400 text-white text-[9px] font-bold rounded-lg uppercase tracking-wider transition-colors">Apply</button>
                            </div>
                        </div>
                    </div>
                  )}

                  {activeModal === 'send' && (
                     <div className="space-y-4 flex-grow">
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Recipient Address</label>
                           <div className="flex items-center bg-black/20 rounded-xl border border-white/10 p-3">
                              <input type="text" placeholder="0x... or @username" className="bg-transparent w-full text-sm text-white outline-none font-mono" />
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
                        <button 
                          onClick={() => handleSecureAction('sendCrypto', () => alert("Transaction Sent"))}
                          className="w-full py-4 mt-auto bg-white text-slate-900 font-black rounded-xl uppercase tracking-widest hover:bg-slate-200 transition-colors"
                        >
                          Confirm Send
                        </button>
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
                        <button 
                          onClick={() => handleSecureAction('buyCrypto', () => alert("Proceeding to MoonPay"))}
                          className="w-full py-4 mt-auto bg-emerald-500 text-white font-black rounded-xl uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                        >
                          Continue to Payment
                        </button>
                     </div>
                  )}

                  {activeModal === 'cardLimits' && (
                    <div className="space-y-6 flex-grow flex flex-col">
                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-3">
                            <ShieldCheck size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-indigo-200/80 leading-relaxed">
                                Set daily spending limits for different transaction types to enhance security. Changes apply instantly.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Online */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <Globe size={16} className="text-blue-400" />
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">Online</span>
                                    </div>
                                    <span className="text-sm font-black text-white">${tempCardLimits.online.toLocaleString()}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="20000" 
                                    step="100" 
                                    value={tempCardLimits.online}
                                    onChange={(e) => setTempCardLimits({...tempCardLimits, online: parseInt(e.target.value)})}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            {/* In-Store */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag size={16} className="text-purple-400" />
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">In-Store</span>
                                    </div>
                                    <span className="text-sm font-black text-white">${tempCardLimits.inStore.toLocaleString()}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="10000" 
                                    step="100" 
                                    value={tempCardLimits.inStore}
                                    onChange={(e) => setTempCardLimits({...tempCardLimits, inStore: parseInt(e.target.value)})}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                            </div>

                            {/* ATM */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <Banknote size={16} className="text-emerald-400" />
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">ATM Withdrawal</span>
                                    </div>
                                    <span className="text-sm font-black text-white">${tempCardLimits.atm.toLocaleString()}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="5000" 
                                    step="50" 
                                    value={tempCardLimits.atm}
                                    onChange={(e) => setTempCardLimits({...tempCardLimits, atm: parseInt(e.target.value)})}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                            </div>
                        </div>

                        <button 
                            onClick={() => {
                                setCardLimits(tempCardLimits);
                                setActiveModal(null);
                            }}
                            className="w-full py-4 mt-auto bg-white text-slate-900 font-black rounded-xl uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-lg"
                        >
                            Save Limits
                        </button>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* ... Transaction Detail Modal and Bottom Nav remain unchanged ... */}
          {selectedTransaction && (
            <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center animate-in fade-in duration-200">
               <div className="w-full h-[90%] sm:h-auto sm:max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-[2rem] sm:rounded-[2rem] p-6 relative flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                  <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-6 sm:hidden"></div>
                  
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-black text-white uppercase tracking-tight">Transaction Details</h3>
                     <button onClick={() => setSelectedTransaction(null)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                        <X size={16} />
                     </button>
                  </div>
                  
                  <div className="space-y-6">
                      <div className="text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 mb-2">
                              {selectedTransaction.status === 'confirmed' ? <CheckCircle2 size={12} className="text-emerald-500"/> : <Activity size={12} className="text-amber-500"/>}
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{selectedTransaction.status}</span>
                          </div>
                          <h1 className={`text-4xl font-black ${selectedTransaction.amount.startsWith('+') ? 'text-emerald-500' : 'text-white'}`}>{selectedTransaction.amount}</h1>
                          <p className="text-xs text-slate-500 font-bold mt-1">{selectedTransaction.time}</p>
                      </div>

                      <div className="bg-black/20 rounded-2xl p-4 border border-white/5 space-y-4">
                          <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-500 font-bold uppercase">Type</span>
                              <span className="text-sm text-white font-bold capitalize">{selectedTransaction.type}</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-500 font-bold uppercase">Network</span>
                              <span className="text-sm text-white font-bold">Fluid Mainnet</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-500 font-bold uppercase">Hash</span>
                              <div className="flex items-center gap-2">
                                  <span className="text-xs text-blue-400 font-mono">0x71...92aF</span>
                                  <Copy size={12} className="text-slate-600" />
                              </div>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-500 font-bold uppercase">Gas Fee</span>
                              <span className="text-xs text-slate-300 font-mono">0.00042 FLD</span>
                          </div>
                      </div>

                      {selectedTransaction.type === 'contract' && (
                          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2 block">Interaction Data</span>
                              <code className="text-[10px] text-blue-300 font-mono break-all">
                                  0xa9059cbb000000000000000000000000...
                              </code>
                          </div>
                      )}

                      <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                          <ExternalLink size={16} /> View on Explorer
                      </button>
                  </div>
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
       )}

       {/* Features Highlight (Below Simulation) */}
       <div className="mt-24 max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-indigo-500/50 transition-colors group">
             <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 text-indigo-500 group-hover:scale-110 transition-transform">
                <CreditCard size={24} />
             </div>
             <h3 className="text-lg font-bold text-white mb-2">Universal Access</h3>
             <p className="text-xs text-slate-400 leading-relaxed">Spend crypto like fiat anywhere in the world with instant issuance virtual and physical metal cards.</p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-emerald-500/50 transition-colors group">
             <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 text-emerald-500 group-hover:scale-110 transition-transform">
                <RefreshCw size={24} />
             </div>
             <h3 className="text-lg font-bold text-white mb-2">Multi-Chain DEX</h3>
             <p className="text-xs text-slate-400 leading-relaxed">Swap assets instantly across Ethereum, Solana, and more with our built-in aggregator engine.</p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-blue-500/50 transition-colors group">
             <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform">
                <Server size={24} />
             </div>
             <h3 className="text-lg font-bold text-white mb-2">Fluid Host</h3>
             <p className="text-xs text-slate-400 leading-relaxed">Access unstoppable decentralized applications directly within the wallet's secure browser environment.</p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-rose-500/50 transition-colors group">
             <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-4 text-rose-500 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
             </div>
             <h3 className="text-lg font-bold text-white mb-2">ZK-Security</h3>
             <p className="text-xs text-slate-400 leading-relaxed">Your keys never leave your device. Enhanced with biometric FaceID and Zero-Knowledge proofs.</p>
          </div>
       </div>
    </div>
  );
};

export default FluidWalletApp;