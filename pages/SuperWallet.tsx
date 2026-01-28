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
  Eye, EyeOff, Timer, KeyRound, Map, Palette, Trash2, Snowflake,
  Coffee, Car, Tv, ShoppingBag, ArrowDownCircle, Sparkles, Maximize2
} from 'lucide-react';

// --- Components ---

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="currentColor" />
    <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="currentColor" />
    <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 83.3137 82 60 82H10L15 66Z" fill="currentColor" />
  </svg>
);

const INITIAL_ASSETS = [
  { id: 'fld', symbol: 'FLD', name: 'Fluid', balance: 145000, price: 0.5, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', type: 'crypto', visible: true },
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', balance: 0.42, price: 68500.00, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', type: 'crypto', visible: true },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', balance: 12.5, price: 2450.00, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', type: 'crypto', visible: true },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', balance: 5000, price: 1.00, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', type: 'crypto', visible: true },
  { id: 'usd', symbol: 'USD', name: 'Dollar', balance: 1250.75, price: 1.00, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', type: 'fiat', visible: true, flag: '🇺🇸' },
];

const MOCK_CARDS = [
  { id: 1, type: 'Virtual', name: 'Genesis Black', number: '**** 4829', expiry: '12/28', balance: 5000, color: 'bg-slate-900' },
  { id: 2, type: 'Physical', name: 'Steel Core', number: '**** 9921', expiry: '09/27', balance: 1200, color: 'bg-slate-700' }
];

interface FluidWalletAppProps {
  onNavigate: (page: string) => void;
}

const FluidWalletApp: React.FC<FluidWalletAppProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'swap' | 'cards' | 'settings'>('dashboard');
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [assets, setAssets] = useState(INITIAL_ASSETS);

  const totalBalance = assets.reduce((acc, asset) => acc + (asset.balance * asset.price), 0);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in-up">
            {/* Main Balance Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                  <p className="text-indigo-200 font-nebula font-black uppercase text-[10px] tracking-widest mb-2">Total Combined Value</p>
                  <div className="flex items-center gap-4">
                    <h2 className="text-4xl md:text-6xl font-nebula font-black text-white">
                      {balanceVisible ? `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
                    </h2>
                    <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-white/40 hover:text-white transition-colors">
                      {balanceVisible ? <EyeOff size={24} /> : <Eye size={24} />}
                    </button>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10 flex items-center gap-2">
                   <Activity size={14} className="text-emerald-400" />
                   <span className="text-emerald-400 font-nebula font-black text-xs uppercase">+4.2%</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 relative z-10">
                {[
                  { icon: ArrowUpRight, label: 'Send', color: 'bg-white/10' },
                  { icon: ArrowDownLeft, label: 'Receive', color: 'bg-white/10' },
                  { icon: Repeat, label: 'Swap', color: 'bg-white/10' },
                  { icon: Plus, label: 'Buy', color: 'bg-white/20' }
                ].map((action, i) => (
                  <button key={i} className="flex flex-col items-center gap-2 group">
                    <div className={`w-14 h-14 ${action.color} backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/10 transition-transform group-hover:-translate-y-1`}>
                      <action.icon size={24} />
                    </div>
                    <span className="text-[10px] font-nebula font-black uppercase tracking-widest text-white/60">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Assets List */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden">
               <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-lg font-nebula font-black text-white uppercase">Portfolio Assets</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-nebula font-black uppercase tracking-widest text-slate-400">Crypto</button>
                    <button className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-nebula font-black uppercase tracking-widest text-indigo-400">Fiat</button>
                  </div>
               </div>
               <div className="p-2">
                  {assets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between p-6 hover:bg-white/5 rounded-[2rem] transition-all group">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl ${asset.bg} border ${asset.border} flex items-center justify-center ${asset.color}`}>
                             {asset.type === 'crypto' ? (
                                asset.id === 'fld' ? <FluidLogo className="w-6 h-6" /> : <Landmark size={24} />
                             ) : (
                                <span className="text-2xl">{(asset as any).flag || '💰'}</span>
                             )}
                          </div>
                          <div>
                             <div className="text-sm font-nebula font-black text-white uppercase">{asset.name}</div>
                             <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{asset.symbol}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-sm font-nebula font-black text-white">
                            {balanceVisible ? `${asset.balance.toLocaleString()} ${asset.symbol}` : '••••'}
                          </div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {balanceVisible ? `$${(asset.balance * asset.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••'}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );
      case 'swap':
        return (
          <div className="max-w-md mx-auto animate-fade-in-up">
            <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 shadow-2xl">
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-nebula font-black text-white uppercase">Fluid Swap</h2>
                  <Settings size={20} className="text-slate-500" />
               </div>

               <div className="space-y-2">
                  <div className="bg-black/40 border border-white/10 rounded-[2rem] p-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-nebula font-black text-slate-500 uppercase">Pay</span>
                      <span className="text-[10px] font-nebula font-black text-slate-500 uppercase">Balance: 12.5 ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <input type="number" placeholder="0.00" className="bg-transparent text-3xl font-nebula font-black text-white outline-none w-1/2" />
                      <button className="flex items-center gap-2 bg-slate-800 rounded-2xl px-4 py-2 border border-white/10">
                        <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white"><Activity size={14} /></div>
                        <span className="text-xs font-nebula font-black text-white">ETH</span>
                        <ChevronDown size={14} className="text-slate-500" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-center -my-6 relative z-10">
                    <button className="bg-slate-800 border border-white/10 rounded-2xl p-3 text-indigo-400 shadow-xl hover:rotate-180 transition-transform">
                      <ArrowDown size={24} />
                    </button>
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-[2rem] p-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-nebula font-black text-slate-500 uppercase">Receive</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-3xl font-nebula font-black text-white/20">0.00</div>
                      <button className="flex items-center gap-2 bg-indigo-500/10 rounded-2xl px-4 py-2 border border-indigo-500/20">
                        <FluidLogo className="w-6 h-6 text-indigo-400" />
                        <span className="text-xs font-nebula font-black text-indigo-400">FLD</span>
                        <ChevronDown size={14} className="text-slate-500" />
                      </button>
                    </div>
                  </div>
               </div>

               <div className="mt-8">
                  <button className="w-full py-5 bg-white text-slate-950 rounded-[1.5rem] font-nebula font-black text-sm uppercase tracking-widest shadow-xl hover:brightness-90 transition-all">
                    Unlock Assets
                  </button>
               </div>
            </div>
          </div>
        );
      case 'cards':
        return (
          <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-2xl font-nebula font-black text-white uppercase">My Fluid Cards</h2>
            <div className="grid gap-6">
               {MOCK_CARDS.map((card) => (
                  <div key={card.id} className={`${card.color} border border-white/10 rounded-[2.5rem] p-8 aspect-[1.6/1] relative overflow-hidden group shadow-2xl`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <FluidLogo className="absolute -bottom-20 -left-20 w-80 h-80 text-white opacity-5 pointer-events-none" />
                    <div className="flex justify-between items-start relative z-10">
                       <div className="flex items-center gap-2">
                          <FluidLogo className="w-8 h-8 text-white" />
                          <span className="text-xl font-nebula font-black text-white tracking-tighter">Fluid</span>
                       </div>
                       <div className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-nebula font-black text-white uppercase tracking-widest">{card.type}</div>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end relative z-10">
                       <div>
                          <div className="text-xs font-nebula font-black text-white/50 uppercase tracking-widest mb-1">Alexander Fluid</div>
                          <div className="text-2xl font-nebula font-black text-white tracking-widest">{card.number}</div>
                       </div>
                       <div className="text-right">
                          <div className="text-[10px] font-nebula font-black text-white/50 uppercase mb-1">Expires</div>
                          <div className="text-sm font-nebula font-black text-white">{card.expiry}</div>
                       </div>
                    </div>
                  </div>
               ))}
               <button className="w-full py-8 border-2 border-dashed border-white/10 rounded-[2.5rem] text-slate-500 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors">
                  <Plus size={32} />
                  <span className="text-xs font-nebula font-black uppercase tracking-widest">Apply for New Card</span>
               </button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6 animate-fade-in-up">
             <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                <div>
                   <h3 className="text-xs font-nebula font-black text-slate-500 uppercase tracking-widest mb-4">Security Infrastructure</h3>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <Fingerprint size={20} className="text-indigo-400" />
                            <span className="text-sm font-nebula font-black text-white uppercase">Biometric Vault</span>
                         </div>
                         <div className="w-12 h-6 bg-indigo-500 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full translate-x-6"></div></div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <Zap size={20} className="text-amber-400" />
                            <span className="text-sm font-nebula font-black text-white uppercase">Gas-Less Mode</span>
                         </div>
                         <div className="w-12 h-6 bg-slate-700 rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full"></div></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-950 flex">
      {/* Desktop Sidebar */}
      <div className="w-72 hidden lg:flex flex-col p-6 fixed h-full border-r border-white/5">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-fluid-gradient rounded-xl flex items-center justify-center text-white">
            <FluidLogo className="w-6 h-6" />
          </div>
          <span className="text-2xl font-nebula font-black text-white tracking-tighter uppercase">Fluid</span>
        </div>
        
        <nav className="space-y-4 flex-grow">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Vault' },
            { id: 'swap', icon: ArrowRightLeft, label: 'Swap' },
            { id: 'cards', icon: CreditCard, label: 'Cards' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                activeTab === item.id 
                ? 'bg-indigo-500 text-white shadow-lg' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs font-nebula font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={() => onNavigate('home')} className="flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-red-400 transition-colors">
          <LogOut size={20} />
          <span className="text-xs font-nebula font-black uppercase tracking-widest">Sign Out</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-12">
             <h1 className="text-4xl font-nebula font-black text-white uppercase tracking-tighter">
                {activeTab === 'dashboard' ? 'My Vault' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
             </h1>
             <div className="flex items-center gap-4">
                <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-400">
                  <Bell size={20} />
                </button>
                <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/5">
                   <div className="text-right">
                      <div className="text-[10px] font-nebula font-black text-white uppercase">Alexander Fluid</div>
                      <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Tier 1 Genesis</div>
                   </div>
                   <div className="w-10 h-10 bg-slate-800 rounded-xl"></div>
                </div>
             </div>
          </header>
          
          {renderContent()}
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/5 p-4 flex justify-between items-center z-50">
        {[
          { id: 'dashboard', icon: LayoutDashboard },
          { id: 'swap', icon: ArrowRightLeft },
          { id: 'cards', icon: CreditCard },
          { id: 'settings', icon: Settings }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`p-4 rounded-2xl ${activeTab === item.id ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}
          >
            <item.icon size={20} />
          </button>
        ))}
      </div>
    </div>
  );
};

// Re-defining layout icon since it was missing in original imports
const LayoutDashboard = (props: any) => (
  <svg 
    {...props} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

export default FluidWalletApp;