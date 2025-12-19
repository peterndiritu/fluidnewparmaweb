import React, { useState, useEffect } from 'react';
import { 
  Play, Apple, Box, ArrowDownUp, ChevronDown, RefreshCw, 
  Wallet as WalletIcon, Layers, CreditCard, Shield, 
  Globe, Smartphone, Zap, Landmark, DollarSign,
  Building2, SmartphoneNfc, Receipt, ArrowRightLeft,
  CheckCircle2, ShieldAlert, X, ShieldCheck, AlertTriangle,
  History, Settings, MoreHorizontal, Layout, Search, ExternalLink,
  Network, Database, Coins, Eye, Cloud, Lock, Plus, Save,
  Fingerprint, ScanFace, EyeOff, Truck, MapPin, User, CreditCard as CardIcon,
  Wifi, Ban, Globe2, Compass
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
  
  // Card Specific States
  const [cardType, setCardType] = useState<'virtual' | 'physical'>('virtual');
  const [hasPhysicalCard, setHasPhysicalCard] = useState(false);
  const [isOrderingCard, setIsOrderingCard] = useState(false);
  const [orderStep, setOrderStep] = useState(1);

  // Settings for Physical Card
  const [physicalSettings, setPhysicalSettings] = useState({
    contactless: true,
    atm: true,
    online: true,
    international: false,
    magstripe: false
  });

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

  const triggerBiometricAuth = (onSuccess: () => void) => {
    if (!biometricsEnabled) {
      onSuccess();
      return;
    }
    setIsAuthenticating(true);
    setAuthPendingAction(() => onSuccess);
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
    }
  };

  const toggleDetails = () => {
    if (!showDetails) {
      triggerBiometricAuth(() => setShowDetails(true));
    } else {
      setShowDetails(false);
    }
  };

  const togglePhysicalSetting = (key: keyof typeof physicalSettings) => {
    triggerBiometricAuth(() => {
      setPhysicalSettings(prev => ({ ...prev, [key]: !prev[key] }));
    });
  };

  const handleOrderCard = () => {
    setIsOrderingCard(true);
    setOrderStep(1);
  };

  const confirmOrder = () => {
    triggerBiometricAuth(() => {
      setHasPhysicalCard(true);
      setIsOrderingCard(false);
      setCardType('physical');
    });
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
            Fluid <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500">Super App</span>
         </h1>
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
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Verify identity</p>
                    </div>
                  </div>
                )}

                {/* Card Ordering Modal Overlay */}
                {isOrderingCard && (
                  <div className="absolute inset-0 z-[60] bg-slate-950 p-8 pt-16 animate-fade-in-up overflow-y-auto custom-scrollbar">
                    <button onClick={() => setIsOrderingCard(false)} className="absolute top-8 right-8 text-slate-500">
                      <X size={24} />
                    </button>
                    
                    <div className="mb-8">
                      <div className="flex gap-2 mb-4">
                        {[1, 2, 3].map(s => (
                          <div key={s} className={`h-1 flex-1 rounded-full ${orderStep >= s ? 'bg-cyan-500' : 'bg-slate-800'}`}></div>
                        ))}
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Order Physical Card</h3>
                    </div>

                    {orderStep === 1 && (
                      <div className="space-y-6 animate-fade-in-up">
                        <div className="p-6 bg-slate-900 rounded-3xl border border-white/5">
                           <p className="text-slate-400 text-sm mb-4 font-medium">Choose your card finish:</p>
                           <div className="space-y-3">
                              <div className="p-4 bg-slate-950 border-2 border-cyan-500 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-slate-800 border border-white/10"></div>
                                  <span className="text-white font-bold text-sm">Space Black (Steel)</span>
                                </div>
                                <CheckCircle2 className="text-cyan-500" size={18} />
                              </div>
                              <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-between opacity-50">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-amber-500 border border-white/10"></div>
                                  <span className="text-white font-bold text-sm">Fluid Gold (Limited)</span>
                                </div>
                              </div>
                           </div>
                        </div>
                        <button onClick={() => setOrderStep(2)} className="w-full py-4 bg-white text-slate-950 font-black rounded-2xl uppercase tracking-widest text-xs">Continue</button>
                      </div>
                    )}

                    {orderStep === 2 && (
                      <div className="space-y-6 animate-fade-in-up">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Delivery Address</label>
                          <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex gap-3 items-start">
                             <MapPin className="text-cyan-500 shrink-0" size={18} />
                             <input type="text" placeholder="Street Address" className="bg-transparent border-none p-0 text-sm text-white focus:ring-0 w-full" defaultValue="123 Fluid Way, Block 7" />
                          </div>
                          <div className="flex gap-4">
                             <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex-1">
                                <input type="text" placeholder="City" className="bg-transparent border-none p-0 text-sm text-white focus:ring-0 w-full" defaultValue="Crypto City" />
                             </div>
                             <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl w-24">
                                <input type="text" placeholder="Zip" className="bg-transparent border-none p-0 text-sm text-white focus:ring-0 w-full" defaultValue="8842" />
                             </div>
                          </div>
                        </div>
                        <button onClick={() => setOrderStep(3)} className="w-full py-4 bg-white text-slate-950 font-black rounded-2xl uppercase tracking-widest text-xs">Verify Details</button>
                      </div>
                    )}

                    {orderStep === 3 && (
                      <div className="space-y-8 animate-fade-in-up">
                        <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/10 text-center">
                           <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-500 mx-auto mb-4">
                              <Truck size={32} />
                           </div>
                           <h4 className="text-white font-black text-lg mb-2 tracking-tight">One-time Fee: $15</h4>
                           <p className="text-slate-500 text-xs mb-6">Payment will be deducted from your Fluid (FLD) balance.</p>
                           <div className="flex justify-between items-center text-xs py-3 border-t border-white/5">
                              <span className="text-slate-500">Shipping</span>
                              <span className="text-emerald-500 font-bold">Free Express</span>
                           </div>
                        </div>
                        <button onClick={confirmOrder} className="w-full py-5 bg-cyan-500 text-slate-950 font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-cyan-500/20">Pay & Order Now</button>
                      </div>
                    )}
                  </div>
                )}

                {/* Main Content Area */}
                <div className="flex-grow flex flex-col pt-16 px-6 pb-24 overflow-y-auto custom-scrollbar relative">
                   
                   {/* Navigation Toggles */}
                   <div className="flex gap-1 mb-10 bg-black/40 p-1.5 rounded-3xl border border-white/5 sticky top-0 z-20 backdrop-blur-xl">
                      {['assets', 'swap', 'card', 'hosting'].map((view) => (
                        <button 
                          key={view}
                          onClick={() => setMockupView(view as any)}
                          className={`flex-1 py-3.5 rounded-2xl text-[9px] font-black transition-all flex flex-col items-center gap-1.5 ${mockupView === view ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500'}`}
                        >
                          {view === 'assets' ? <WalletIcon size={14} /> : view === 'swap' ? <RefreshCw size={14} /> : view === 'card' ? <CreditCard size={14} /> : <Layout size={14} />}
                          <span className="capitalize">{view}</span>
                        </button>
                      ))}
                   </div>
                   
                   {/* Card View Reality */}
                   <div className="flex-grow animate-fade-in-up">
                      {mockupView === 'card' && (
                        <div className="space-y-6">
                           <div className="flex justify-between items-center mb-6">
                              <div className="flex p-1 bg-slate-900 rounded-xl border border-white/5">
                                 <button 
                                  onClick={() => setCardType('virtual')}
                                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${cardType === 'virtual' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
                                 >Virtual</button>
                                 <button 
                                  onClick={() => setCardType('physical')}
                                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${cardType === 'physical' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
                                 >Physical</button>
                              </div>
                              <button onClick={handleOrderCard} className="text-cyan-500 p-2"><Plus size={20}/></button>
                           </div>

                           {/* Card Visual Selector */}
                           {cardType === 'virtual' ? (
                             <div className="aspect-[1.58/1] bg-gradient-to-br from-indigo-700 to-purple-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl group cursor-pointer" onClick={toggleDetails}>
                                <div className="absolute top-0 right-0 p-8"><Smartphone size={24} className="text-white/40" /></div>
                                <div className="flex justify-between items-start z-10">
                                   <div className="flex flex-col"><FluidLogo className="w-8 h-8 mb-1" /><span className="text-[8px] font-black text-white tracking-widest">VIRTUAL</span></div>
                                   <span className="text-[10px] font-black text-white/50 tracking-[0.2em] italic">Debit</span>
                                </div>
                                <div className="z-10">
                                   <div className="text-white font-mono text-2xl tracking-[0.3em] mb-4">{showDetails ? '4288 1592 0048 8842' : '**** **** **** 8842'}</div>
                                   <div className="flex justify-between items-end">
                                      <div><div className="text-[7px] text-white/50 uppercase font-black tracking-widest">Holder</div><div className="text-[10px] text-white font-black">FLUID MEMBER</div></div>
                                      <div className="text-right text-[10px] text-white font-black">{showDetails ? '452' : '***'}</div>
                                   </div>
                                </div>
                             </div>
                           ) : hasPhysicalCard ? (
                             <div className="aspect-[1.58/1] bg-slate-900 border border-white/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl group cursor-pointer">
                                <div className="absolute top-0 right-0 p-8 opacity-20"><FluidLogo className="w-24 h-24" /></div>
                                <div className="flex justify-between items-start z-10">
                                   <div className="flex flex-col"><FluidLogo className="w-8 h-8 mb-1" /><span className="text-[8px] font-black text-white tracking-widest">PHYSICAL</span></div>
                                   <div className="flex items-center gap-2"><div className="w-8 h-6 bg-amber-500/20 rounded border border-amber-500/30"></div></div>
                                </div>
                                <div className="z-10">
                                   <div className="text-white font-mono text-2xl tracking-[0.3em] mb-4">**** **** **** 0014</div>
                                   <div className="flex justify-between items-end">
                                      <div><div className="text-[7px] text-slate-500 uppercase font-black">Member Since</div><div className="text-[10px] text-white font-black uppercase">2024</div></div>
                                      <div className="text-right text-xs text-amber-500 font-black italic tracking-tighter uppercase">Space Black Steel</div>
                                   </div>
                                </div>
                             </div>
                           ) : (
                             <div onClick={handleOrderCard} className="aspect-[1.58/1] bg-slate-950 border border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-cyan-500/50 transition-all">
                                <CardIcon className="text-slate-800 group-hover:text-cyan-500 transition-all mb-4" size={48} />
                                <h4 className="text-white font-black text-sm tracking-tight">Order Your Physical Card</h4>
                                <p className="text-slate-600 text-[10px] mt-1">Get the ultimate steel card delivered to your door.</p>
                             </div>
                           )}

                           {/* Card Control Grid */}
                           <div className="grid grid-cols-4 gap-4">
                              <div className="flex flex-col items-center gap-2">
                                 <div className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-cyan-400 cursor-pointer"><Lock size={18}/></div>
                                 <span className="text-[8px] font-black text-slate-500 uppercase">Lock</span>
                              </div>
                              <div onClick={toggleDetails} className="flex flex-col items-center gap-2 cursor-pointer">
                                 <div className={`w-11 h-11 border rounded-2xl flex items-center justify-center ${showDetails ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>{showDetails ? <EyeOff size={18}/> : <Eye size={18}/>}</div>
                                 <span className="text-[8px] font-black text-slate-500 uppercase">Reveal</span>
                              </div>
                              <div onClick={() => setBiometricsEnabled(!biometricsEnabled)} className="flex flex-col items-center gap-2 cursor-pointer">
                                 <div className={`w-11 h-11 border rounded-2xl flex items-center justify-center ${biometricsEnabled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}><Fingerprint size={18}/></div>
                                 <span className="text-[8px] font-black text-slate-500 uppercase">Secure</span>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                 <div className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-cyan-400 cursor-pointer"><Settings size={18}/></div>
                                 <span className="text-[8px] font-black text-slate-500 uppercase">Limits</span>
                              </div>
                           </div>

                           {/* Physical Card Settings Toggles - Dynamic Content */}
                           {cardType === 'physical' && hasPhysicalCard && (
                             <div className="space-y-4 pt-4 border-t border-white/5 animate-fade-in-up">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Physical Card Controls</span>
                                <div className="space-y-2">
                                   {[
                                      { key: 'contactless', label: 'Contactless Payments', icon: Wifi },
                                      { key: 'atm', label: 'ATM Withdrawals', icon: Building2 },
                                      { key: 'international', label: 'International Use', icon: Globe2 },
                                      { key: 'online', label: 'Online Transactions', icon: ShoppingBag },
                                      { key: 'magstripe', label: 'Swipe (Magstripe)', icon: Compass }
                                   ].map((item) => (
                                      <div key={item.key} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                                         <div className="flex items-center gap-3">
                                            <div className="text-slate-400"><item.icon size={16}/></div>
                                            <span className="text-[11px] font-black text-white">{item.label}</span>
                                         </div>
                                         <button 
                                            onClick={() => togglePhysicalSetting(item.key as any)}
                                            className={`w-8 h-4 rounded-full relative transition-colors ${physicalSettings[item.key as keyof typeof physicalSettings] ? 'bg-cyan-500' : 'bg-slate-800'}`}
                                         >
                                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${physicalSettings[item.key as keyof typeof physicalSettings] ? 'left-4.5' : 'left-0.5'}`}></div>
                                         </button>
                                      </div>
                                   ))}
                                </div>
                             </div>
                           )}

                           {/* Standard Limit Display */}
                           <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5">
                              <div className="flex justify-between items-center mb-4">
                                 <span className="text-[10px] font-black text-white tracking-widest uppercase">Spending Power</span>
                                 <span className="text-[10px] font-black text-cyan-400">${spentAmount.toLocaleString()} / ${monthlyLimit.toLocaleString()}</span>
                              </div>
                              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${limitPercentage}%` }} />
                              </div>
                           </div>
                        </div>
                      )}

                      {/* Fallback to Assets View for other types (already implemented in your file, keeping logic minimal) */}
                      {mockupView === 'assets' && (
                        <div className="space-y-6">
                           <div className="text-center mb-8">
                              <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Portfolio Value</div>
                              <div className="text-4xl font-black text-white tracking-tighter mb-1">$124,592.45</div>
                           </div>
                           <div className="space-y-4">
                              {coins.map(coin => (
                                 <div key={coin.symbol} className="flex items-center justify-between p-5 bg-slate-900/50 border border-white/5 rounded-3xl">
                                    <div className="flex items-center gap-4">
                                       <div className={`w-12 h-12 rounded-2xl ${coin.color} flex items-center justify-center font-black text-white`}>{coin.symbol[0]}</div>
                                       <div><div className="text-sm font-black text-white">{coin.name}</div><div className="text-[10px] text-slate-500 font-bold">{coin.amount} {coin.symbol}</div></div>
                                    </div>
                                    <div className="text-right"><div className="text-sm font-black text-white">{coin.value}</div><div className="text-[10px] text-emerald-500 font-black">{coin.trend}</div></div>
                                 </div>
                              ))}
                           </div>
                        </div>
                      )}

                      {/* SWAP/HOSTING logic remains as per your original file */}
                   </div>
                </div>
                
                {/* Bottom Nav Mockup */}
                <div className="absolute bottom-0 inset-x-0 border-t border-white/5 bg-[#020617] p-6 flex justify-between items-center px-12 z-40">
                   {['assets', 'swap', 'card', 'hosting'].map((v) => (
                     <div key={v} onClick={() => setMockupView(v as any)} className={`${mockupView === v ? 'text-blue-500' : 'text-slate-700'} transition-all cursor-pointer`}>
                        {v === 'assets' ? <WalletIcon size={24} /> : v === 'swap' ? <RefreshCw size={24} /> : v === 'card' ? <CreditCard size={24} /> : <Layout size={24} />}
                     </div>
                   ))}
                </div>
              </div>
          </div>
      </section>

    </div>
  );
};

// Helper Icon for Shopping
const ShoppingBag = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

export default SuperWallet;
