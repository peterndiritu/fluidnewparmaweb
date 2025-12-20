import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet, ArrowRightLeft, CreditCard, Globe, 
  Send, Plus, LogOut, Search, Bell, X, 
  Fingerprint, Scan, ArrowDown, History, 
  ChevronRight, Lock, ShieldCheck, Smartphone, 
  MoreHorizontal, RefreshCw, Server, Zap, Copy
} from 'lucide-react';

interface FluidWalletAppProps {
  onNavigate: (page: string) => void;
  initialView?: string;
}

// Mock Data
const ASSETS = [
  { id: 'fld', symbol: 'FLD', name: 'Fluid', balance: '45,200', value: '$22,600.00', change: '+12.5%', color: 'text-purple-400' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', balance: '4.20', value: '$10,240.50', change: '+2.4%', color: 'text-blue-400' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', balance: '145.5', value: '$21,825.00', change: '+5.1%', color: 'text-emerald-400' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', balance: '5,000', value: '$5,000.00', change: '0.0%', color: 'text-slate-400' },
];

const TRANSACTIONS = [
  { type: 'receive', asset: 'ETH', amount: '+1.5 ETH', date: 'Today, 10:23 AM', status: 'Confirmed' },
  { type: 'send', asset: 'USDT', amount: '-200 USDT', date: 'Yesterday, 4:00 PM', status: 'Confirmed' },
  { type: 'swap', asset: 'FLD', amount: 'Swap ETH', date: 'Oct 24', status: 'Confirmed' },
];

type ViewState = 'locked' | 'assets' | 'swap' | 'cards' | 'host' | 'settings';

const FluidWalletApp: React.FC<FluidWalletAppProps> = ({ onNavigate, initialView = 'assets' }) => {
  const [view, setView] = useState<ViewState>('locked');
  const [isScanning, setIsScanning] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Simulate Biometric Unlock
  const handleUnlock = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setView('assets');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }, 1500);
  };

  const NavButton = ({ id, icon: Icon, label }: { id: ViewState, icon: any, label: string }) => (
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

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center relative z-10">
      
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

             <div className="absolute bottom-10 flex flex-col items-center gap-4">
                <button className="text-xs font-bold text-slate-600 hover:text-white transition-colors">Use Passcode</button>
                <button className="text-[10px] text-slate-700 font-mono">Emergency Kit</button>
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
                <div className="flex items-center gap-3">
                   <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative">
                      <Bell size={18} />
                      {showNotification && <span className="absolute top-2 right-2.5 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>}
                   </button>
                </div>
             </div>

             {/* Content Scroll Area */}
             <div className="flex-grow overflow-y-auto px-6 pb-24 custom-scrollbar">
                
                {/* ASSETS VIEW */}
                {view === 'assets' && (
                  <div className="space-y-6 animate-fade-in-up">
                    {/* Balance Card */}
                    <div className="relative w-full aspect-[1.6/1] rounded-3xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl shadow-purple-900/20 group">
                       <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 transition-transform duration-500 group-hover:scale-105"></div>
                       <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                       
                       <div className="relative z-10 flex justify-between items-start">
                          <div className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                             <span className="text-[10px] font-bold text-purple-200 flex items-center gap-1">
                                <ShieldCheck size={10} /> Vault Protected
                             </span>
                          </div>
                          <div className="text-purple-200">
                             <MoreHorizontal size={20} />
                          </div>
                       </div>

                       <div className="relative z-10">
                          <span className="text-slate-300 text-xs font-medium">Total Balance</span>
                          <div className="text-3xl font-black text-white mt-1 tracking-tight">$59,645.50</div>
                          <div className="flex items-center gap-1.5 mt-1">
                             <div className="bg-emerald-500/20 rounded px-1.5 py-0.5">
                                <ChevronRight size={10} className="text-emerald-400 -rotate-90" />
                             </div>
                             <span className="text-emerald-400 text-xs font-bold">+$2,450.20 (4.2%)</span>
                          </div>
                       </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-4 gap-4">
                       {[
                         { icon: Send, label: 'Send' },
                         { icon: ArrowDown, label: 'Receive' },
                         { icon: RefreshCw, label: 'Swap' },
                         { icon: Scan, label: 'Scan' }
                       ].map((action) => (
                         <button key={action.label} className="flex flex-col items-center gap-2 group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-purple-600 group-hover:border-purple-500 transition-all shadow-lg">
                               <action.icon size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-400 transition-colors">{action.label}</span>
                         </button>
                       ))}
                    </div>

                    {/* Assets List */}
                    <div>
                       <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-white">Assets</h3>
                          <button className="text-xs font-bold text-purple-400">Manage</button>
                       </div>
                       <div className="space-y-3">
                          {ASSETS.map((asset) => (
                             <div key={asset.id} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800/50 rounded-2xl hover:bg-slate-800 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                   <div className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-xs ${asset.color} border border-white/5`}>
                                      {asset.symbol[0]}
                                   </div>
                                   <div>
                                      <div className="font-bold text-white text-sm">{asset.name}</div>
                                      <div className="text-xs text-slate-500">{asset.balance} {asset.symbol}</div>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <div className="font-bold text-white text-sm">{asset.value}</div>
                                   <div className="text-xs text-emerald-400 font-medium">{asset.change}</div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}

                {/* SWAP VIEW */}
                {view === 'swap' && (
                  <div className="h-full flex flex-col justify-center animate-fade-in-up">
                      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 relative">
                         <div className="mb-2 flex justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase">You Pay</span>
                            <span className="text-xs font-bold text-slate-400">Bal: 1.45 ETH</span>
                         </div>
                         <div className="flex justify-between items-center mb-6">
                            <input type="text" defaultValue="1.0" className="bg-transparent text-3xl font-bold text-white w-1/2 outline-none" />
                            <button className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
                               <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-bold text-white">E</div>
                               <span className="font-bold text-white text-sm">ETH</span>
                            </button>
                         </div>

                         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                             <div className="w-10 h-10 bg-slate-950 border-4 border-slate-900 rounded-xl flex items-center justify-center text-purple-400 shadow-xl z-10">
                                <ArrowDown size={18} />
                             </div>
                         </div>

                         <div className="pt-6 border-t border-slate-800/50">
                            <div className="mb-2 flex justify-between">
                               <span className="text-xs font-bold text-slate-500 uppercase">You Receive</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <input type="text" defaultValue="3,240.50" className="bg-transparent text-3xl font-bold text-purple-400 w-1/2 outline-none" readOnly />
                               <button className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
                                  <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[8px] font-bold text-white">F</div>
                                  <span className="font-bold text-white text-sm">FLD</span>
                               </button>
                            </div>
                         </div>
                      </div>
                      <button className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-purple-900/20 hover:scale-[1.02] transition-transform">
                         Review Swap
                      </button>
                      <p className="text-center text-[10px] text-slate-500 mt-4">Powered by Fluid DEX Aggregator</p>
                  </div>
                )}

                {/* CARDS VIEW */}
                {view === 'cards' && (
                   <div className="space-y-6 animate-fade-in-up">
                      <div className="flex justify-between items-end mb-2">
                         <h2 className="text-2xl font-bold text-white">Cards</h2>
                         <button className="p-2 bg-slate-900 rounded-full text-slate-400"><Plus size={20}/></button>
                      </div>

                      {/* Card Visual */}
                      <div className="relative aspect-[1.58/1] rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 shadow-2xl group">
                         {/* Metal Texture */}
                         <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-900 to-black opacity-90"></div>
                         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                         <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full"></div>

                         <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                               <span className="font-black text-lg text-white tracking-widest italic">Fluid</span>
                               <Smartphone size={24} className="text-slate-400" />
                            </div>
                            <div>
                               <div className="flex items-center gap-2 mb-2">
                                  <div className="w-8 h-5 bg-amber-200/20 rounded-md border border-amber-200/30"></div>
                                  <span className="text-xs text-slate-500 font-mono">((( )))</span>
                               </div>
                               <div className="font-mono text-white text-lg tracking-widest mb-1">**** 4829</div>
                            </div>
                         </div>
                      </div>

                      {/* Controls */}
                      <div className="space-y-2">
                         <div className="p-4 bg-slate-900 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Lock size={18} /></div>
                               <span className="text-sm font-bold text-white">Freeze Card</span>
                            </div>
                            <div className="w-10 h-6 bg-slate-800 rounded-full relative cursor-pointer">
                               <div className="absolute left-1 top-1 w-4 h-4 bg-slate-500 rounded-full transition-all"></div>
                            </div>
                         </div>
                         <div className="p-4 bg-slate-900 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><History size={18} /></div>
                               <span className="text-sm font-bold text-white">View History</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-500" />
                         </div>
                      </div>
                   </div>
                )}

                {/* HOST VIEW */}
                {view === 'host' && (
                   <div className="space-y-6 animate-fade-in-up">
                       <h2 className="text-2xl font-bold text-white">Fluid Host</h2>
                       
                       <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl">
                          <div className="flex items-center justify-between mb-6">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                                   <Globe size={20} />
                                </div>
                                <div>
                                   <h4 className="text-sm font-bold text-white">alex.fluid</h4>
                                   <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
                                   </p>
                                </div>
                             </div>
                             <button className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors font-bold">
                                Manage
                             </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                             <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Visitors</span>
                                <div className="text-lg font-bold text-white">2.4k</div>
                             </div>
                             <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                                <span className="text-[10px] text-slate-500 font-bold uppercase">Bandwidth</span>
                                <div className="text-lg font-bold text-white">45 GB</div>
                             </div>
                          </div>
                       </div>

                       <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-purple-500/30 transition-all">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                                <Server size={20} />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-white">Deploy App</h4>
                                <p className="text-[10px] text-slate-500">Upload to IPFS/Fluid Chain</p>
                             </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                             <Plus size={16} />
                          </div>
                       </div>
                   </div>
                )}
             </div>

             {/* Bottom Navigation */}
             <div className="absolute bottom-0 inset-x-0 h-20 bg-slate-950/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 z-50">
                 <NavButton id="assets" icon={Wallet} label="Wallet" />
                 <NavButton id="swap" icon={RefreshCw} label="Swap" />
                 <NavButton id="cards" icon={CreditCard} label="Cards" />
                 <NavButton id="host" icon={Globe} label="Host" />
             </div>
          </div>
        )}

        {/* Home Button Indicator */}
        <div className="absolute bottom-1 inset-x-0 flex justify-center z-50 pointer-events-none">
           <div className="w-32 h-1 bg-slate-800 rounded-full"></div>
        </div>

      </div>

      {/* Desktop Helper Text */}
      <div className="absolute -right-48 top-1/2 -translate-y-1/2 hidden xl:block w-40">
         <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
             <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-xs uppercase">
                <Zap size={14} /> Pro Tip
             </div>
             <p className="text-slate-400 text-xs leading-relaxed">
                This simulated environment demonstrates the non-custodial architecture. Keys are encrypted locally within the "Vault" state.
             </p>
         </div>
      </div>
      
      {/* Return Home */}
      <button 
        onClick={() => onNavigate('home')}
        className="absolute top-8 left-8 p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors backdrop-blur-sm md:flex hidden items-center gap-2"
      >
         <LogOut size={20} />
         <span className="text-sm font-bold">Exit Demo</span>
      </button>

    </div>
  );
};

export default FluidWalletApp;
