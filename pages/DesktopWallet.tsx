import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Wallet, ArrowRightLeft, CreditCard, Globe, 
  Settings, LogOut, Bell, Search, TrendingUp, ArrowUpRight, 
  ArrowDownLeft, MoreHorizontal, Copy, ShieldCheck, PieChart,
  User, RefreshCw, Zap, Plus, Lock, History, ChevronRight,
  Server, Smartphone, Check, ChevronDown, Activity, ScanLine, Key,
  ArrowRight
} from 'lucide-react';

interface DesktopWalletProps {
  onNavigate: (page: string) => void;
}

// Mock Data
const ASSETS = [
  { id: 'fld', symbol: 'FLD', name: 'Fluid', balance: '45,200', value: '$22,600.00', change: '+12.5%', color: 'text-purple-400' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', balance: '4.20', value: '$10,240.50', change: '+2.4%', color: 'text-blue-400' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', balance: '145.5', value: '$21,825.00', change: '+5.1%', color: 'text-emerald-400' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', balance: '5,000', value: '$5,000.00', change: '0.0%', color: 'text-slate-400' },
];

const RECENT_TRANSACTIONS = [
  { type: 'Sent', asset: 'USDT', amount: '200.00', date: 'Today, 14:30', status: 'Completed', icon: ArrowUpRight },
  { type: 'Received', asset: 'ETH', amount: '1.5', date: 'Yesterday, 09:15', status: 'Completed', icon: ArrowDownLeft },
  { type: 'Swapped', asset: 'FLD', amount: '5000', date: 'Oct 24, 2023', status: 'Completed', icon: RefreshCw },
];

const DesktopWallet: React.FC<DesktopWalletProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLocked(false);
      setIsLoading(false);
    }, 1500);
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
        activeTab === id 
        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
         {/* Background Effects */}
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
         
         <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl">
            <div className="text-center mb-8">
               <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20">
                  <Wallet className="text-white" size={32} />
               </div>
               <h1 className="text-2xl font-black text-white mb-2">Welcome Back</h1>
               <p className="text-slate-400">Enter your password to access Fluid Vault</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
               <div className="space-y-2">
                  <div className="relative">
                     <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                     <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                     />
                  </div>
               </div>
               <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2"
               >
                  {isLoading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                     <>
                        Unlock Wallet <ArrowRight size={20} />
                     </>
                  )}
               </button>
            </form>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex pt-24">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-800 flex flex-col p-6 hidden md:flex fixed h-[calc(100vh-6rem)] top-24 left-0 bg-slate-950 z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <Wallet size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Fluid Vault</span>
        </div>

        <div className="space-y-1 flex-grow">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="swap" icon={ArrowRightLeft} label="Swap" />
          <NavItem id="cards" icon={CreditCard} label="Cards" />
          <NavItem id="host" icon={Globe} label="Host" />
          <NavItem id="settings" icon={Settings} label="Settings" />
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800">
           <button 
             onClick={() => onNavigate('home')}
             className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors"
            >
             <LogOut size={20} /> Exit Desktop
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-8 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-10 py-4 -mt-4">
           <div>
             <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
             <p className="text-slate-400 text-sm">Non-custodial session active</p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                 <input 
                   type="text" 
                   placeholder="Search assets..." 
                   className="bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-purple-500 transition-colors w-64"
                 />
              </div>
              <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                 <Bell size={18} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                      <User size={20} className="text-slate-200" />
                  </div>
              </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in-up">
          
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-12 gap-6">
              {/* Total Balance Card */}
              <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/30 transition-colors duration-500"></div>
                  
                  <div className="relative z-10 flex justify-between items-start mb-8">
                    <div>
                        <span className="text-purple-200 font-medium mb-1 block flex items-center gap-2"><ShieldCheck size={16}/> Vault Balance</span>
                        <h2 className="text-5xl font-black text-white tracking-tight">$59,645.50</h2>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-sm font-bold flex items-center gap-1">
                              <TrendingUp size={14} /> +4.2%
                          </span>
                          <span className="text-purple-200/60 text-sm">vs last 24h</span>
                        </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex gap-4">
                    <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg">
                        <ArrowUpRight size={18} /> Send
                    </button>
                    <button className="px-6 py-3 bg-slate-800/50 backdrop-blur-md text-white border border-white/10 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2">
                        <ArrowDownLeft size={18} /> Receive
                    </button>
                    <button 
                       onClick={() => setActiveTab('swap')}
                       className="px-6 py-3 bg-slate-800/50 backdrop-blur-md text-white border border-white/10 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw size={18} /> Swap
                    </button>
                  </div>
              </div>

              {/* Stats / Allocation */}
              <div className="col-span-12 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white mb-6">Asset Allocation</h3>
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-32 rounded-full border-[12px] border-slate-800 border-t-purple-500 border-r-indigo-500 border-b-blue-500 relative flex items-center justify-center">
                          <PieChart size={24} className="text-slate-500" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                              <span className="text-sm text-slate-300">Fluid (45%)</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                              <span className="text-sm text-slate-300">Ethereum (30%)</span>
                          </div>
                          <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <span className="text-sm text-slate-300">Solana (25%)</span>
                          </div>
                        </div>
                    </div>
                  </div>
              </div>

              {/* Assets Table */}
              <div className="col-span-12 lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl text-white">Your Assets</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {ASSETS.map((asset, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl hover:bg-slate-800/50 transition-colors group cursor-pointer border border-transparent hover:border-slate-700">
                          <div className="flex items-center gap-4 w-1/4">
                              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 group-hover:text-white group-hover:bg-purple-500 transition-colors">
                                {asset.symbol[0]}
                              </div>
                              <div>
                                <div className="font-bold text-white">{asset.name}</div>
                                <div className="text-xs text-slate-500">{asset.symbol}</div>
                              </div>
                          </div>
                          <div className="w-1/4 text-slate-400 text-sm text-right pr-8">{asset.balance}</div>
                          <div className="w-1/4 text-right">
                              <div className="font-bold text-white">{asset.value}</div>
                              <div className="text-xs text-emerald-500 font-bold">{asset.change}</div>
                          </div>
                        </div>
                    ))}
                  </div>
              </div>

               {/* Recent Activity */}
               <div className="col-span-12 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-8">
                   <h3 className="font-bold text-xl text-white mb-6">Recent Activity</h3>
                   <div className="space-y-4">
                      {RECENT_TRANSACTIONS.map((tx, i) => (
                         <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                                  <tx.icon size={18} />
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

          {/* SWAP VIEW */}
          {activeTab === 'swap' && (
             <div className="flex justify-center items-start pt-10">
                <div className="w-full max-w-lg">
                   <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 relative shadow-2xl">
                      <div className="flex justify-between items-center mb-8">
                         <h2 className="text-2xl font-bold text-white">Swap</h2>
                         <button className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><Settings size={20}/></button>
                      </div>

                      {/* Pay */}
                      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mb-2">
                         <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">You Pay</span>
                            <span className="text-slate-500 font-bold">Balance: 1.45 ETH</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <input type="text" defaultValue="1.0" className="bg-transparent text-4xl font-bold text-white w-1/2 outline-none" />
                            <button className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 hover:border-purple-500 transition-colors">
                               <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">E</div>
                               <span className="font-bold text-white">ETH</span>
                               <ChevronDown size={16} className="text-slate-400" />
                            </button>
                         </div>
                         <div className="text-right text-sm text-slate-500 mt-2">~$2,450.00</div>
                      </div>

                      {/* Swap Icon */}
                      <div className="flex justify-center -my-4 relative z-10">
                         <button className="w-10 h-10 bg-slate-800 border-4 border-slate-900 rounded-xl flex items-center justify-center text-purple-400 shadow-xl hover:rotate-180 transition-transform duration-300">
                            <ArrowDownLeft size={20} />
                         </button>
                      </div>

                      {/* Receive */}
                      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 mt-2 mb-6">
                         <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">You Receive</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <input type="text" defaultValue="3,240.50" className="bg-transparent text-4xl font-bold text-purple-400 w-1/2 outline-none" readOnly />
                            <button className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800 hover:border-purple-500 transition-colors">
                               <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white">F</div>
                               <span className="font-bold text-white">FLD</span>
                               <ChevronDown size={16} className="text-slate-400" />
                            </button>
                         </div>
                         <div className="text-right text-sm text-slate-500 mt-2">~$2,450.00</div>
                      </div>

                      <div className="space-y-3 mb-8">
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Rate</span>
                            <span className="text-white font-medium">1 ETH = 3,240.50 FLD</span>
                         </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Network Fee</span>
                            <span className="text-white font-medium flex items-center gap-1"><Zap size={12} className="text-amber-500" /> $4.20</span>
                         </div>
                      </div>

                      <button className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-purple-900/20 hover:scale-[1.02] transition-transform">
                         Confirm Swap
                      </button>
                   </div>
                </div>
             </div>
          )}

          {/* CARDS VIEW */}
          {activeTab === 'cards' && (
             <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-2xl font-bold text-white">My Cards</h2>
                   <button className="px-4 py-2 bg-purple-600 rounded-xl text-white font-bold flex items-center gap-2 hover:bg-purple-500 transition-colors">
                      <Plus size={18} /> Add New Card
                   </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                   {/* Card 1 */}
                   <div className="relative aspect-[1.58/1] rounded-3xl bg-slate-900 overflow-hidden border border-slate-800 shadow-2xl group hover:scale-[1.02] transition-transform duration-500">
                         {/* Texture */}
                         <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-900 to-black opacity-90"></div>
                         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                         <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full"></div>

                         <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                               <span className="font-black text-2xl text-white tracking-widest italic">Fluid</span>
                               <Smartphone size={24} className="text-slate-400" />
                            </div>
                            <div>
                               <div className="flex items-center gap-2 mb-4">
                                  <div className="w-12 h-8 bg-amber-200/20 rounded-md border border-amber-200/30"></div>
                                  <span className="text-sm text-slate-500 font-mono">((( )))</span>
                               </div>
                               <div className="font-mono text-white text-2xl tracking-widest mb-2">**** **** **** 4829</div>
                               <div className="flex justify-between items-end">
                                  <span className="text-xs text-slate-400 uppercase">Alexander Fluid</span>
                                  <span className="text-xs text-purple-400 font-bold uppercase">Virtual</span>
                               </div>
                            </div>
                         </div>
                   </div>

                   {/* Controls */}
                   <div className="space-y-4">
                      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl"><Lock size={20} /></div>
                            <div>
                               <div className="font-bold text-white">Freeze Card</div>
                               <div className="text-xs text-slate-500">Temporarily disable transactions</div>
                            </div>
                         </div>
                         <div className="w-12 h-7 bg-slate-800 rounded-full relative cursor-pointer border border-slate-700">
                            <div className="absolute left-1 top-1 w-5 h-5 bg-slate-500 rounded-full transition-all"></div>
                         </div>
                      </div>

                      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between cursor-pointer hover:border-purple-500/50 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl"><History size={20} /></div>
                            <div>
                               <div className="font-bold text-white">Transaction History</div>
                               <div className="text-xs text-slate-500">View recent spending</div>
                            </div>
                         </div>
                         <ChevronRight size={20} className="text-slate-500" />
                      </div>
                      
                      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between cursor-pointer hover:border-purple-500/50 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><Settings size={20} /></div>
                            <div>
                               <div className="font-bold text-white">Card Settings</div>
                               <div className="text-xs text-slate-500">Limits & Security</div>
                            </div>
                         </div>
                         <ChevronRight size={20} className="text-slate-500" />
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* HOST VIEW */}
          {activeTab === 'host' && (
             <div className="max-w-5xl mx-auto">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="col-span-2 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8">
                        <div className="flex justify-between items-start mb-8">
                           <div>
                              <h2 className="text-2xl font-bold text-white mb-1">Fluid Host</h2>
                              <p className="text-slate-400 text-sm">Decentralized Content Management</p>
                           </div>
                           <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Network Active
                           </div>
                        </div>

                        <div className="flex items-center gap-6">
                           <div className="w-20 h-20 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                              <Globe size={32} />
                           </div>
                           <div>
                              <h3 className="text-xl font-bold text-white">alex.fluid</h3>
                              <p className="text-slate-400 text-sm mb-3">Primary Domain</p>
                              <div className="flex gap-3">
                                 <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors">Manage</button>
                                 <button className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors">View Site</button>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-center">
                        <span className="text-slate-500 font-bold uppercase text-xs mb-2">Total Bandwidth</span>
                        <div className="text-4xl font-black text-white mb-4">45.2 GB</div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full w-[30%] bg-purple-500 rounded-full"></div>
                        </div>
                        <p className="text-right text-xs text-slate-500 mt-2">30% of monthly quota</p>
                     </div>
                 </div>

                 <h3 className="text-xl font-bold text-white mb-6">Deployments</h3>
                 <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                     <div className="grid grid-cols-5 p-4 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase">
                        <div className="col-span-2">Project</div>
                        <div>Status</div>
                        <div>Visitors</div>
                        <div className="text-right">Action</div>
                     </div>
                     {[
                        { name: 'Portfolio V2', url: 'alex.fluid/portfolio', status: 'Live', visitors: '1.2k', color: 'text-emerald-400' },
                        { name: 'NFT Gallery', url: 'alex.fluid/gallery', status: 'Building', visitors: '-', color: 'text-amber-400' },
                        { name: 'Blog', url: 'alex.fluid/blog', status: 'Live', visitors: '850', color: 'text-emerald-400' }
                     ].map((deployment, i) => (
                        <div key={i} className="grid grid-cols-5 p-4 items-center border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                           <div className="col-span-2">
                              <div className="font-bold text-white">{deployment.name}</div>
                              <div className="text-xs text-slate-500">{deployment.url}</div>
                           </div>
                           <div className={`text-xs font-bold ${deployment.color} flex items-center gap-2`}>
                              <div className={`w-1.5 h-1.5 rounded-full bg-current`}></div>
                              {deployment.status}
                           </div>
                           <div className="text-slate-300 font-medium">{deployment.visitors}</div>
                           <div className="text-right">
                              <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                                 <MoreHorizontal size={16} />
                              </button>
                           </div>
                        </div>
                     ))}
                     <div className="p-4 bg-slate-800/20 hover:bg-slate-800/40 transition-colors cursor-pointer flex justify-center items-center gap-2 text-slate-400 hover:text-white">
                        <Plus size={16} /> <span className="text-sm font-bold">New Deployment</span>
                     </div>
                 </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DesktopWallet;