import React, { useState, useEffect } from 'react';
import { 
  Play, Apple, Box, ArrowDownUp, ChevronDown, RefreshCw, 
  Wallet as WalletIcon, Layers, CreditCard, Shield, 
  Globe, Smartphone, Zap, Landmark, DollarSign,
  Building2, SmartphoneNfc, Receipt, ArrowRightLeft,
  CheckCircle2, ShieldAlert, X, ShieldCheck, AlertTriangle,
  History, Settings, MoreHorizontal, Layout, Search, ExternalLink,
  Network, Database, Coins, Eye, Cloud, Lock, Plus, Save,
  Fingerprint, ScanFace, EyeOff
} from 'lucide-react';

interface SuperWalletProps {
  onNavigate: (page: string) => void;
  initialView?: 'assets' | 'swap' | 'card' | 'fiat' | 'hosting';
}

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 20 H78 C83.5 20 88 24.5 88 30 C88 35.5 83.5 40 78 40 H38 L48 20 Z" fill="white" />
    <path d="M35 45 H65 C70.5 45 75 49.5 75 55 C75 60.5 70.5 65 65 65 H25 L35 45 Z" fill="white" />
    <path d="M22 70 H52 C57.5 70 62 74.5 62 80 C62 85.5 57.5 90 52 90 H12 L22 70 Z" fill="white" />
  </svg>
);

const SuperWallet: React.FC<SuperWalletProps> = ({ initialView = 'assets' }) => {
  const [mockupView, setMockupView] = useState<'assets' | 'swap' | 'card' | 'fiat' | 'hosting'>(initialView);
  const [activeSecurityPrompt, setActiveSecurityPrompt] = useState<string | null>(null);
  const [securityAgreements, setSecurityAgreements] = useState({
    verifyAddress: false,
    riskAcknowledged: false,
    irreversible: false
  });

  // Card Limit States
  const [spentAmount] = useState(2400);
  const [monthlyLimit, setMonthlyLimit] = useState(5000);
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [tempLimit, setTempLimit] = useState('5000');

  // Biometric States
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [authPendingAction, setAuthPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    setMockupView(initialView as any);
  }, [initialView]);

  const coins = [
    { name: 'Fluid', symbol: 'FLD', amount: '45,000', value: '$22,500', color: 'bg-emerald-500', trend: '+1.2%' },
    { name: 'Ethereum', symbol: 'ETH', amount: '12.5', value: '$38,240', color: 'bg-indigo-500', trend: '+1.2%' },
    { name: 'Tether', symbol: 'USDT', amount: '63,852', value: '$63,852', color: 'bg-emerald-600', trend: '+0.1%' }
  ];

  const handleSensitiveAction = (action: string) => {
    setSecurityAgreements({ verifyAddress: false, riskAcknowledged: false, irreversible: false });
    setActiveSecurityPrompt(action);
  };

  const handleCloseSecurity = () => {
    setActiveSecurityPrompt(null);
  };

  const triggerBiometricAuth = (onSuccess: () => void) => {
    if (!biometricsEnabled) {
      onSuccess();
      return;
    }
    setIsAuthenticating(true);
    setAuthPendingAction(() => onSuccess);
    // Simulate biometric scan delay
    setTimeout(() => {
      setIsAuthenticating(false);
      onSuccess();
      setAuthPendingAction(null);
    }, 1800);
  };

  const handleSaveLimit = () => {
    const val = parseInt(tempLimit);
    if (!isNaN(val) && val >= spentAmount) {
      triggerBiometricAuth(() => {
        setMonthlyLimit(val);
        setIsEditingLimit(false);
      });
    } else {
      alert(`Limit must be at least $${spentAmount} (your current spend).`);
    }
  };

  const toggleDetails = () => {
    if (!showDetails) {
      triggerBiometricAuth(() => setShowDetails(true));
    } else {
      setShowDetails(false);
    }
  };

  const limitPercentage = Math.min((spentAmount / monthlyLimit) * 100, 100);

  return (
    <div className="min-h-screen pt-28 pb-12">
      
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
         <div className="inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6 animate-fade-in-up">
            <span className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px]">V2.0 PUBLIC BETA</span>
         </div>
         <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">
            The Super App for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500">Decentralized Living</span>
         </h1>
         <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto mb-12 font-medium leading-relaxed">
            Manage your entire digital life in one place. From high-frequency trading and fiat spending to deploying censorship-resistant websites on Parmaweb.
         </p>
         
         <div className="flex flex-wrap gap-4 justify-center mb-20">
             <button className="flex items-center gap-4 bg-slate-900 text-white border border-slate-700 rounded-2xl px-8 py-4 hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-2xl">
                <Apple size={28} fill="white" />
                <div className="text-left">
                   <div className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Download on</div>
                   <div className="text-xl font-black leading-none tracking-tight">App Store</div>
                </div>
             </button>
             <button className="flex items-center gap-4 bg-slate-900 text-white border border-slate-700 rounded-2xl px-8 py-4 hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-2xl">
                <Play size={28} fill="white" />
                <div className="text-left">
                   <div className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Get it on</div>
                   <div className="text-xl font-black leading-none tracking-tight">Google Play</div>
                </div>
             </button>
         </div>
      </section>

      {/* Unified Super Mockup */}
      <section className="max-w-md mx-auto px-4 mb-24 relative z-10">
          <div className="bg-slate-950 border border-slate-800 rounded-[3.5rem] shadow-2xl overflow-hidden relative min-h-[750px] flex flex-col p-1.5">
              <div className="bg-[#020617] rounded-[3.2rem] flex-grow flex flex-col overflow-hidden relative">
                
                {/* Biometric Auth Overlay */}
                {isAuthenticating && (
                  <div className="absolute inset-0 z-[100] bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in-up">
                    <div className="relative mb-8">
                       <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full"></div>
                       <div className="relative w-24 h-24 bg-slate-900/50 border border-white/10 rounded-full flex items-center justify-center text-cyan-400">
                          <ScanFace size={48} className="animate-pulse" />
                       </div>
                    </div>
                    <div className="text-center">
                       <h4 className="text-white font-black tracking-tight mb-2">Authenticating</h4>
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Verify identity with Face ID</p>
                    </div>
                  </div>
                )}

                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-8 bg-slate-900/50 flex items-center justify-center gap-2 z-30">
                   <div className="w-28 h-6 bg-black rounded-full shadow-inner"></div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow flex flex-col pt-16 px-6 pb-24 overflow-y-auto custom-scrollbar relative">
                   
                   {/* Toggles (Reality Switcher) */}
                   <div className="flex gap-1 mb-10 bg-black/40 p-1.5 rounded-3xl border border-white/5 sticky top-0 z-20 backdrop-blur-xl">
                      <button 
                        onClick={() => setMockupView('assets')}
                        className={`flex-1 py-3.5 rounded-2xl text-[9px] font-black transition-all flex flex-col items-center gap-1.5 ${mockupView === 'assets' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        <WalletIcon size={14} /> Wallet
                      </button>
                      <button 
                        onClick={() => setMockupView('swap')}
                        className={`flex-1 py-3.5 rounded-2xl text-[9px] font-black transition-all flex flex-col items-center gap-1.5 ${mockupView === 'swap' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        <RefreshCw size={14} /> Swap
                      </button>
                      <button 
                        onClick={() => setMockupView('card')}
                        className={`flex-1 py-3.5 rounded-2xl text-[9px] font-black transition-all flex flex-col items-center gap-1.5 ${mockupView === 'card' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        <CreditCard size={14} /> Cards
                      </button>
                      <button 
                        onClick={() => setMockupView('hosting')}
                        className={`flex-1 py-3.5 rounded-2xl text-[9px] font-black transition-all flex flex-col items-center gap-1.5 ${mockupView === 'hosting' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        <Layout size={14} /> Hosting
                      </button>
                   </div>
                   
                   {/* Active Reality View */}
                   <div className="flex-grow animate-fade-in-up">
                      
                      {/* ASSETS VIEW */}
                      {mockupView === 'assets' && (
                        <div className="space-y-6">
                           <div className="flex justify-between items-center mb-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-xs text-white">JD</div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-white">Account 1 <ChevronDown size={12}/></div>
                              </div>
                              <Network size={18} className="text-slate-400" />
                           </div>

                           <div className="text-center mb-8">
                              <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Total Balance</div>
                              <div className="text-4xl font-black text-white tracking-tighter mb-1">$124,592.45</div>
                              <div className="text-xs text-emerald-500 font-black tracking-widest">+ $1,240 (2.4%)</div>
                           </div>

                           <div className="grid grid-cols-4 gap-3 mb-10">
                              {['Send', 'Receive', 'Swap', 'Buy'].map((action, i) => (
                                 <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all cursor-pointer">
                                       {i === 0 ? <Zap size={18} /> : i === 1 ? <Database size={18} /> : i === 2 ? <RefreshCw size={18} /> : <Coins size={18} />}
                                    </div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{action}</span>
                                 </div>
                              ))}
                           </div>

                           <div className="space-y-4">
                              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">Assets</div>
                              {coins.map(coin => (
                                 <div key={coin.symbol} className="flex items-center justify-between p-5 bg-slate-900/50 border border-white/5 rounded-3xl group cursor-pointer hover:bg-slate-800 transition-all">
                                    <div className="flex items-center gap-4">
                                       <div className={`w-12 h-12 rounded-2xl ${coin.color} flex items-center justify-center font-black text-white shadow-xl`}>
                                          {coin.symbol[0]}
                                       </div>
                                       <div>
                                          <div className="text-sm font-black text-white">{coin.name}</div>
                                          <div className="text-[10px] text-slate-500 font-bold">{coin.amount} {coin.symbol}</div>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <div className="text-sm font-black text-white">{coin.value}</div>
                                       <div className="text-[10px] text-emerald-500 font-black">{coin.trend}</div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                      )}

                      {/* SWAP VIEW */}
                      {mockupView === 'swap' && (
                        <div className="space-y-6">
                           <h3 className="text-2xl font-black text-white tracking-tighter text-center mb-8">Swap</h3>
                           <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5">
                              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-4">You pay <span className="text-slate-600">Balance: 12.5 ETH</span></div>
                              <div className="flex justify-between items-center">
                                 <div className="text-4xl font-black text-white">1.5</div>
                                 <div className="flex items-center gap-2 bg-blue-600/10 border border-blue-600/30 px-3 py-2 rounded-xl">
                                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center font-black text-[8px] text-white">E</div>
                                    <span className="text-xs font-black text-white">ETH</span>
                                    <ChevronDown size={14} className="text-slate-500" />
                                 </div>
                              </div>
                              <div className="text-xs font-bold text-slate-600 mt-2">~$4,592.50</div>
                           </div>

                           <div className="flex justify-center -my-6 relative z-10">
                              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-cyan-400 shadow-2xl">
                                 <ArrowDownUp size={18} />
                              </div>
                           </div>

                           <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5">
                              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-4">You receive <span className="text-slate-600">Balance: 0 FLD</span></div>
                              <div className="flex justify-between items-center">
                                 <div className="text-4xl font-black text-cyan-400">9,184</div>
                                 <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl">
                                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center font-black text-[8px] text-white italic">F</div>
                                    <span className="text-xs font-black text-white">FLD</span>
                                    <ChevronDown size={14} className="text-slate-500" />
                                 </div>
                              </div>
                              <div className="text-xs font-bold text-slate-600 mt-2">~$4,588.10 (-0.1% Slip)</div>
                           </div>

                           <div className="p-4 space-y-2">
                              <div className="flex justify-between text-[10px] font-black text-slate-500">
                                 <span>Rate</span>
                                 <span className="text-white">1 ETH = 6,122 FLD</span>
                              </div>
                              <div className="flex justify-between text-[10px] font-black text-slate-500">
                                 <span>Network Fee</span>
                                 <span className="text-amber-500 flex items-center gap-1"><Zap size={10} /> $1.50</span>
                              </div>
                           </div>

                           <button className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black rounded-3xl shadow-xl uppercase tracking-widest text-xs transition-all active:scale-95 mt-4">
                              Confirm Swap
                           </button>
                        </div>
                      )}

                      {/* CARD VIEW */}
                      {mockupView === 'card' && (
                        <div className="space-y-8">
                           <div className="flex justify-between items-center">
                              <h3 className="text-2xl font-black text-white tracking-tighter">Fluid Card</h3>
                              <button className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 hover:bg-cyan-500/20 transition-all">
                                 <Plus size={18}/>
                              </button>
                           </div>

                           <div className="aspect-[1.58/1] bg-gradient-to-br from-indigo-700 to-purple-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all duration-500">
                              <div className="absolute top-0 right-0 p-8">
                                 <Smartphone size={24} className="text-white/40" />
                              </div>
                              <div className="flex justify-between items-start z-10">
                                 <div className="flex flex-col">
                                   <FluidLogo className="w-8 h-8 mb-1" />
                                   <span className="text-[8px] font-black text-white tracking-widest uppercase">VIRTUAL</span>
                                 </div>
                                 <span className="text-[10px] font-black text-white/50 tracking-[0.2em] italic">Debit</span>
                              </div>
                              <div className="z-10">
                                 <div className="text-white font-mono text-2xl tracking-[0.3em] mb-4">
                                    {showDetails ? '4288 1592 0048 8842' : '**** **** **** 8842'}
                                 </div>
                                 <div className="flex justify-between items-end">
                                    <div>
                                       <div className="text-[7px] text-white/50 uppercase font-black tracking-widest mb-1">Card Holder</div>
                                       <div className="text-[10px] text-white font-black uppercase tracking-wider">HOLDER'S NAME</div>
                                    </div>
                                    <div className="text-right">
                                       <div className="text-[7px] text-white/50 uppercase font-black tracking-widest mb-1">CVV</div>
                                       <div className="text-[10px] text-white font-black">{showDetails ? '452' : '***'}</div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="grid grid-cols-4 gap-4">
                              <div className="flex flex-col items-center gap-2">
                                 <div className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-all cursor-pointer">
                                    <Lock size={18}/>
                                 </div>
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Freeze</span>
                              </div>
                              <div onClick={toggleDetails} className="flex flex-col items-center gap-2 cursor-pointer group">
                                 <div className={`w-11 h-11 border rounded-2xl flex items-center justify-center transition-all ${showDetails ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500 group-hover:text-cyan-400'}`}>
                                    {showDetails ? <EyeOff size={18}/> : <Eye size={18}/>}
                                 </div>
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{showDetails ? 'Hide' : 'Details'}</span>
                              </div>
                              <div onClick={() => setBiometricsEnabled(!biometricsEnabled)} className="flex flex-col items-center gap-2 cursor-pointer group">
                                 <div className={`w-11 h-11 border rounded-2xl flex items-center justify-center transition-all ${biometricsEnabled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500 group-hover:text-emerald-400'}`}>
                                    <Fingerprint size={18}/>
                                 </div>
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{biometricsEnabled ? 'Secured' : 'Secure'}</span>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                 <div className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-all cursor-pointer">
                                    <Settings size={18}/>
                                 </div>
                                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Settings</span>
                              </div>
                           </div>

                           {/* Biometric Status Indicator */}
                           {biometricsEnabled && (
                              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl animate-fade-in-up">
                                 <ShieldCheck size={12} className="text-emerald-500" />
                                 <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider">Biometric Verification Active</span>
                              </div>
                           )}

                           {/* Interactive Monthly Limit Section */}
                           <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 relative group">
                              <div className="flex justify-between items-center mb-4">
                                 <span className="text-[10px] font-black text-white tracking-widest uppercase">Monthly Limit</span>
                                 {!isEditingLimit ? (
                                    <button 
                                      onClick={() => { setIsEditingLimit(true); setTempLimit(monthlyLimit.toString()); }}
                                      className="text-[10px] font-black text-cyan-400 hover:underline flex items-center gap-1 transition-all"
                                    >
                                       ${spentAmount.toLocaleString()} / ${monthlyLimit.toLocaleString()}
                                       <Settings size={10} />
                                    </button>
                                 ) : (
                                    <div className="flex items-center gap-2 animate-fade-in-up">
                                       <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg border border-white/10">
                                          <span className="text-[10px] text-slate-500 font-black">$</span>
                                          <input 
                                            autoFocus
                                            type="number"
                                            value={tempLimit}
                                            onChange={(e) => setTempLimit(e.target.value)}
                                            className="bg-transparent border-none text-[10px] font-black text-white p-0 w-16 focus:ring-0"
                                          />
                                       </div>
                                       <button onClick={handleSaveLimit} className="p-1 rounded bg-cyan-500 text-slate-950">
                                          <Save size={10} />
                                       </button>
                                       <button onClick={() => setIsEditingLimit(false)} className="p-1 rounded bg-slate-800 text-slate-400">
                                          <X size={10} />
                                       </button>
                                    </div>
                                 )}
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full bg-cyan-400 transition-all duration-500" 
                                    style={{ width: `${limitPercentage}%` }} 
                                 />
                              </div>
                              {isEditingLimit && (
                                <p className="text-[8px] text-slate-500 mt-2 font-black uppercase tracking-widest text-right">Adjust card ceiling instantly</p>
                              )}
                           </div>

                           <div className="space-y-4">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Activity</span>
                              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black font-black">A</div>
                                    <div>
                                       <div className="text-[11px] font-black text-white">Apple Store</div>
                                       <div className="text-[8px] text-slate-500 font-bold">Today, 10:23 AM</div>
                                    </div>
                                 </div>
                                 <span className="text-xs font-black text-white">- $1,299.00</span>
                              </div>
                           </div>
                        </div>
                      )}

                      {/* HOSTING VIEW */}
                      {mockupView === 'hosting' && (
                        <div className="space-y-6">
                           <div className="flex justify-between items-center">
                              <h3 className="text-2xl font-black text-white tracking-tighter">Parmaweb</h3>
                              <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500"><Box size={18}/></div>
                           </div>

                           <div className="bg-slate-900/50 p-2 rounded-2xl border border-white/5 flex items-center gap-3 px-4">
                              <Search size={16} className="text-slate-500" />
                              <input type="text" placeholder="Find your .fluid domain" className="bg-transparent border-none text-[11px] py-3 text-white placeholder-slate-600 focus:ring-0 w-full" />
                           </div>

                           <div className="space-y-4">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">My Domains</span>
                              <div className="p-5 bg-slate-900/50 rounded-3xl border border-white/5 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500"><Globe size={22}/></div>
                                    <div>
                                       <div className="text-xs font-black text-white">alex.fluid</div>
                                       <div className="flex items-center gap-1.5 text-[8px] font-black text-emerald-500"><div className="w-1 h-1 rounded-full bg-emerald-500"/> Active</div>
                                    </div>
                                 </div>
                                 <Settings size={16} className="text-slate-600" />
                              </div>
                           </div>

                           <div className="space-y-4">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Static Hosting</span>
                              <div className="p-6 bg-slate-900/80 rounded-[2.5rem] border border-white/10 space-y-5">
                                 <div className="flex justify-between items-start">
                                    <div>
                                       <div className="text-sm font-black text-white">defi-app-v2</div>
                                       <div className="text-[9px] text-slate-500 font-medium">ipfs://QmXy...8z9</div>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[8px] font-black rounded-lg">ONLINE</span>
                                 </div>
                                 <div className="grid grid-cols-3 gap-2">
                                    {[{label: 'Bandwidth', val: '24 GB'}, {label: 'Visitors', val: '1.2K'}, {label: 'Storage', val: '120 MB'}].map((stat, i) => (
                                       <div key={i} className="text-center p-2">
                                          <div className="text-[8px] text-slate-500 font-black uppercase mb-1">{stat.label}</div>
                                          <div className="text-[10px] font-black text-white">{stat.val}</div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           <button className="w-full py-5 bg-slate-900/50 border border-dashed border-white/20 rounded-3xl text-[10px] font-black text-slate-300 flex items-center justify-center gap-3 hover:bg-slate-900 transition-all uppercase tracking-widest mt-4">
                              <Cloud size={16}/> Deploy New Site
                           </button>
                        </div>
                      )}
                   </div>
                </div>
                
                {/* Bottom Nav Mockup */}
                <div className="absolute bottom-0 inset-x-0 border-t border-white/5 bg-[#020617] p-6 flex justify-between items-center px-12 z-40">
                   <div className={`${mockupView === 'assets' ? 'text-blue-500' : 'text-slate-700'} transition-all hover:scale-110 cursor-pointer`} onClick={() => setMockupView('assets')}><WalletIcon size={24} /></div>
                   <div className={`${mockupView === 'swap' ? 'text-blue-500' : 'text-slate-700'} transition-all hover:scale-110 cursor-pointer`} onClick={() => setMockupView('swap')}><RefreshCw size={24} /></div>
                   <div className={`${mockupView === 'card' ? 'text-blue-500' : 'text-slate-700'} transition-all hover:scale-110 cursor-pointer`} onClick={() => setMockupView('card')}><CreditCard size={24} /></div>
                   <div className={`${mockupView === 'hosting' ? 'text-blue-500' : 'text-slate-700'} transition-all hover:scale-110 cursor-pointer`} onClick={() => setMockupView('hosting')}><Layout size={24} /></div>
                </div>
              </div>
          </div>

          {/* Super App Glow */}
          <div className="absolute inset-x-10 -bottom-10 h-48 bg-emerald-500/20 blur-[120px] -z-10 rounded-full animate-pulse"></div>
      </section>

      {/* Value Proposition Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
         <div className="grid md:grid-cols-3 gap-12">
            {[
               { icon: Shield, title: "Non-Custodial Security", desc: "You are the only one with access to your funds. Your private keys are encrypted on your device and never shared with our servers.", color: "cyan" },
               { icon: Zap, title: "Lightning Fast", desc: "Built on Fluid Chain's high-performance architecture, transactions confirm in milliseconds, not minutes.", color: "purple" },
               { icon: Globe, title: "Truly Decentralized", desc: "Access DApps directly from the browser. Host content permanently on Parmaweb without fear of takedowns.", color: "orange" }
            ].map((prop, i) => (
               <div key={i} className="text-center group">
                  <div className={`w-16 h-16 mx-auto bg-${prop.color}-500/10 rounded-2xl flex items-center justify-center mb-8 text-${prop.color}-500 group-hover:scale-110 transition-transform shadow-lg`}>
                     <prop.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{prop.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{prop.desc}</p>
               </div>
            ))}
         </div>
      </section>

    </div>
  );
};

export default SuperWallet;