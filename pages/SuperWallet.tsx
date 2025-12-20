import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet as WalletIcon, RefreshCw, CreditCard, Layers, 
  Lock, Fingerprint, ScanFace, ChevronDown, Bell, 
  Search, ArrowUpRight, ArrowDownLeft, 
  Zap, Shield, Globe, Server, 
  Wifi, Battery, Signal, MoreHorizontal, Copy, CheckCircle2,
  Eye, EyeOff, Activity, 
  Settings, ChevronRight, Cloud, Smartphone,
  Grid, Home, MessageSquare, Send, Paperclip, Phone,
  Delete, Key, Chrome, ChevronLeft, Coins, Check, X,
  Landmark, Banknote, QrCode, UploadCloud, Terminal, HardDrive, History,
  Apple, ShieldAlert, Monitor, AlertTriangle, Pen, Camera, User, Mail, AtSign,
  MapPin, Package, Truck, Unlock, Sliders, Calendar, Filter
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// --- Types & Interfaces ---
interface Asset {
  symbol: string;
  name: string;
  amount: string;
  value: string;
  change: string;
  color: string;
}

interface DApp {
  id: string;
  name: string;
  url: string;
  icon: React.ElementType;
  category: string;
  status: 'online' | 'offline';
  description?: string;
  action?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface FiatAccount {
  currency: 'USD' | 'EUR' | 'GBP';
  balance: string;
  symbol: string;
  iban?: string;
  bankName: string;
  flag: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'buy';
  amount: string;
  symbol: string;
  value: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  counterparty?: string;
  icon?: React.ElementType;
}

interface DeployedSite {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'deploying';
  visits: string;
}

interface UserProfile {
  name: string;
  handle: string;
  email: string;
  avatar: string;
  bio: string;
}

interface FluidWalletAppProps {
  onNavigate: (page: string) => void;
  initialView?: string;
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

const FIAT_ACCOUNTS: FiatAccount[] = [
  { currency: 'USD', balance: '12,450.00', symbol: '$', bankName: 'Fluid US', flag: '🇺🇸', iban: 'US89 3704 0044 0532 0130 00' },
  { currency: 'EUR', balance: '4,200.50', symbol: '€', bankName: 'Fluid EU', flag: '🇪🇺', iban: 'DE89 3704 0044 0532 0130 00' },
];

const TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'receive', amount: '450', symbol: 'FLD', value: '$225.00', date: 'Just now', status: 'completed', counterparty: 'Staking Pool' },
  { id: '2', type: 'swap', amount: '1.2', symbol: 'ETH', value: '$3,650.00', date: '2h ago', status: 'completed', counterparty: 'Fluid DEX' },
  { id: '3', type: 'send', amount: '500', symbol: 'USDT', value: '$500.00', date: 'Yesterday', status: 'completed', counterparty: '0x7a...992c' },
  { id: '4', type: 'buy', amount: '0.5', symbol: 'ETH', value: '$1,500.00', date: 'Oct 24', status: 'completed', counterparty: 'Apple Pay' },
  { id: '5', type: 'send', amount: '25', symbol: 'SOL', value: '$1,800.00', date: 'Oct 22', status: 'failed', counterparty: 'Bridge' },
  { id: '6', type: 'receive', amount: '1000', symbol: 'FLD', value: '$500.00', date: 'Oct 20', status: 'completed', counterparty: 'Airdrop' },
  { id: '7', type: 'swap', amount: '500', symbol: 'USDC', value: '$500.00', date: 'Oct 18', status: 'completed', counterparty: 'Uniswap' },
];

const DEPLOYED_SITES: DeployedSite[] = [
  { id: '1', name: 'My Portfolio', domain: 'alex.fluid', status: 'active', visits: '1.2k' },
  { id: '2', name: 'DeFi Dashboard', domain: 'defi.fluid', status: 'active', visits: '850' },
];

const CONTACTS: ChatContact[] = [
  { id: '1', name: 'Sarah DeFi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', lastMessage: 'Did you see the new APY on Fluid?', time: '2m', unread: 2, online: true },
  { id: '2', name: 'Dev Team', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev', lastMessage: 'Deployment successful! 🚀', time: '1h', unread: 0, online: false },
  { id: '3', name: 'Crypto Dad', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dad', lastMessage: 'How do I bridge to L2?', time: '3h', unread: 0, online: true },
];

const DAPPS: DApp[] = [
  { id: '1', name: 'Fluid DEX', url: 'https://fluid.link/dex', icon: RefreshCw, category: 'DeFi', status: 'online', description: 'Swap tokens instantly with zero slippage.' },
  { id: '2', name: 'SecureChat', url: 'https://chat.fluid.link', icon: MessageSquare, category: 'Social', status: 'online', description: 'End-to-end encrypted wallet messaging.' },
  { id: '3', name: 'NFT Market', url: 'https://nft.fluid.link', icon: Layers, category: 'NFT', status: 'online', description: 'Trade digital collectibles on Fluid.' },
];

// --- Components ---

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="currentColor" />
    <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="currentColor" />
    <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 83.3137 82 60 82H10L15 66Z" fill="currentColor" />
  </svg>
);

const CardChip = ({ className, size = 32 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" className="opacity-80" />
    <path d="M2 12H22" stroke="currentColor" strokeWidth="1" className="opacity-50" />
    <path d="M12 4V20" stroke="currentColor" strokeWidth="1" className="opacity-50" />
    <path d="M8 4V12" stroke="currentColor" strokeWidth="1" className="opacity-50" />
    <path d="M16 4V12" stroke="currentColor" strokeWidth="1" className="opacity-50" />
    <path d="M8 12V20" stroke="currentColor" strokeWidth="1" className="opacity-50" />
    <path d="M16 12V20" stroke="currentColor" strokeWidth="1" className="opacity-50" />
  </svg>
);

// --- Security Vault Overlay ---
const SecurityVault = ({ onUnlock }: { onUnlock: () => void }) => {
  const [view, setView] = useState<'main' | 'input' | 'passkey_scan'>('main');
  const [authMethod, setAuthMethod] = useState<'phone' | 'google' | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'verifying' | 'error' | 'welcome'>('idle');

  const handleDirectAuth = (method: 'biometric' | 'passkey') => {
    if (method === 'passkey') setView('passkey_scan');
    
    setStatus('scanning');
    
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('welcome');
        setTimeout(onUnlock, 1800);
      }, 800);
    }, 1200);
  };

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
      setStatus('success');
      setTimeout(() => {
        setStatus('welcome');
        setTimeout(onUnlock, 1800);
      }, 800);
    }, 1000);
  };

  useEffect(() => {
    if (inputCode.length === 6) verifyCode();
  }, [inputCode]);

  return (
    <div className="absolute inset-0 z-50 bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {status === 'welcome' ? (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
           <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-emerald-500/30 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander&backgroundColor=b6e3f4" alt="User" className="w-full h-full object-cover opacity-90" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-900 rounded-full p-1.5 border-4 border-[#020617]">
                  <CheckCircle2 size={16} />
              </div>
           </div>
           <h2 className="text-2xl font-black text-white tracking-tight mb-2">Welcome Back</h2>
           <p className="text-slate-400 text-sm font-medium animate-pulse">Decrypted & Ready</p>
        </div>
      ) : (
        <>
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
                  {authMethod === 'phone' ? 'Enter the code sent to +1 *** *** 9928' : 'Enter the code from your Google Auth app'}
               </p>

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

               {status === 'verifying' && <div className="text-emerald-500 text-xs font-bold uppercase tracking-widest animate-pulse mb-4">Verifying...</div>}
               {status === 'error' && <div className="text-rose-500 text-xs font-bold uppercase tracking-widest mb-4">Invalid Code</div>}

               <div className="grid grid-cols-3 gap-4 w-full px-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                     <button key={num} onClick={() => handleKeyPress(num.toString())} className="h-14 rounded-2xl bg-slate-900/50 hover:bg-slate-800 text-white font-bold text-lg transition-colors border border-white/5 active:scale-95">{num}</button>
                  ))}
                  <div className="h-14"></div>
                  <button onClick={() => handleKeyPress('0')} className="h-14 rounded-2xl bg-slate-900/50 hover:bg-slate-800 text-white font-bold text-lg transition-colors border border-white/5 active:scale-95">0</button>
                  <button onClick={handleDelete} className="h-14 rounded-2xl bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/5 active:scale-95"><Delete size={20} /></button>
               </div>
            </div>
          )}
          {view === 'main' && (
            <div className="mt-8">
              <button className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Emergency Kit</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// --- Secure Chat Component ---
const SecureChatApp = ({ onBack }: { onBack: () => void }) => {
  const [activeChat, setActiveChat] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'other', text: 'Hey! Did you check out the new Fluid staking pool?', time: '10:02 AM', status: 'read' },
    { id: '2', sender: 'me', text: 'Yeah, the APY looks insane. Just bridged some ETH.', time: '10:05 AM', status: 'read' },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    
    // Simulate Reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'other',
        text: 'Nice! Fees are super low right now too.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      }]);
    }, 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#020617] animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={activeChat ? () => setActiveChat(null) : onBack} className="p-2 -ml-2 text-slate-400 hover:text-white">
            <ChevronLeft size={24} />
          </button>
          {activeChat ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={activeChat.avatar} className="w-10 h-10 rounded-full bg-slate-800" alt="Avatar" />
                {activeChat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#020617]"></div>}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{activeChat.name}</div>
                <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online Encrypted</div>
              </div>
            </div>
          ) : (
            <span className="font-black text-lg text-white">Secure Chat</span>
          )}
        </div>
        <div className="flex gap-2">
            <button className="p-2 bg-slate-800 rounded-full text-slate-400"><Phone size={18}/></button>
            <button className="p-2 bg-slate-800 rounded-full text-slate-400"><MoreHorizontal size={18}/></button>
        </div>
      </div>

      {activeChat ? (
        <>
           <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <div className="flex justify-center my-4">
                 <div className="px-3 py-1 bg-slate-900 rounded-full text-[10px] text-slate-500 font-bold uppercase tracking-widest border border-slate-800">
                    End-to-End Encrypted via Fluid Node
                 </div>
              </div>
              {messages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                       msg.sender === 'me' 
                       ? 'bg-emerald-600 text-white rounded-tr-sm' 
                       : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'
                    }`}>
                       {msg.text}
                       <div className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${msg.sender === 'me' ? 'text-emerald-200' : 'text-slate-500'}`}>
                          {msg.time}
                          {msg.sender === 'me' && (
                             msg.status === 'read' ? <div className="flex"><Check size={10}/><Check size={10} className="-ml-1"/></div> : <Check size={10}/>
                          )}
                       </div>
                    </div>
                 </div>
              ))}
              <div ref={messagesEndRef} />
           </div>
           
           <form onSubmit={sendMessage} className="p-3 bg-slate-900 border-t border-slate-800">
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 focus-within:border-emerald-500/50 transition-colors">
                 <button type="button" className="p-2 text-slate-500 hover:text-white"><Paperclip size={20}/></button>
                 <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a secure message..."
                    className="flex-grow bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
                 />
                 <button type="submit" className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:grayscale">
                    <Send size={18} />
                 </button>
              </div>
           </form>
        </>
      ) : (
        <div className="p-4 space-y-2">
           <div className="relative mb-4">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Search contacts..." className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
           </div>
           
           <div className="space-y-1">
              {CONTACTS.map(contact => (
                 <button 
                    key={contact.id} 
                    onClick={() => setActiveChat(contact)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-900 transition-colors group"
                 >
                    <div className="relative">
                       <img src={contact.avatar} className="w-12 h-12 rounded-full bg-slate-800 border-2 border-[#020617] group-hover:border-slate-800 transition-colors" alt={contact.name} />
                       {contact.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#020617]"></div>}
                    </div>
                    <div className="flex-grow text-left overflow-hidden">
                       <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-white text-sm truncate">{contact.name}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{contact.time}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400 truncate max-w-[140px] group-hover:text-slate-300">{contact.lastMessage}</span>
                          {contact.unread > 0 && (
                             <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-black">
                                {contact.unread}
                             </div>
                          )}
                       </div>
                    </div>
                 </button>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

// --- Main Fluid Wallet App Container ---
const FluidWalletApp: React.FC<FluidWalletAppProps> = ({ onNavigate, initialView = 'home' }) => {
  const [activeTab, setActiveTab] = useState(initialView === 'assets' ? 'home' : initialView);
  const [currentTime, setCurrentTime] = useState('');
  const [locked, setLocked] = useState(true);

  // Expanded View State to include new actions
  const [viewState, setViewState] = useState<'home' | 'swap' | 'cards' | 'dapps' | 'chat' | 'send' | 'receive' | 'buy' | 'hosting' | 'fiat' | 'settings' | 'history'>('home');

  // User Profile State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false); // New state for Add Bank Modal
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Fluid',
    handle: 'alex.fluid.eth',
    email: 'alex@fluid.link',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander&backgroundColor=b6e3f4',
    bio: 'Crypto enthusiast & DeFi explorer'
  });

  // History State
  const [historyFilter, setHistoryFilter] = useState<'all' | 'send' | 'receive' | 'swap' | 'buy'>('all');
  const [historySearch, setHistorySearch] = useState('');

  // Security Settings State
  const [biometricSettings, setBiometricSettings] = useState({
    viewCard: true,
    adjustLimits: true,
    initiateSwap: false,
    sendCrypto: true,
    buyCrypto: true
  });

  // Card State
  const [cardTab, setCardTab] = useState<'digital' | 'metal'>('digital'); 
  const [hasPhysicalCard, setHasPhysicalCard] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [cardViewMode, setCardViewMode] = useState<'main' | 'history' | 'manage' | 'order'>('main');
  const [selectedDesign, setSelectedDesign] = useState<'steel' | 'gold' | 'black'>('black');
  const [isFrozen, setIsFrozen] = useState(false);
  const [orderStep, setOrderStep] = useState(1); // 1: Design, 2: Shipping, 3: Success

  // Mock Transactions
  const CARD_TXS = [
    { id: 1, merchant: 'Netflix Subscription', type: 'Subscription', amount: '-$15.99', date: 'Today, 9:41 AM', icon: 'N', bg: 'bg-red-600' },
    { id: 2, merchant: 'Apple Store', type: 'Electronics', amount: '-$2,499.00', date: 'Yesterday', icon: 'A', bg: 'bg-white text-black' },
    { id: 3, merchant: 'Uber Rides', type: 'Transport', amount: '-$24.50', date: 'Oct 24', icon: 'U', bg: 'bg-black text-white' },
    { id: 4, merchant: 'Starbucks', type: 'Food & Drink', amount: '-$8.75', date: 'Oct 23', icon: 'S', bg: 'bg-green-700' },
  ];

  // Helper to get card gradient
  const getCardStyle = (design: string) => {
    switch (design) {
        case 'gold': return 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 border-yellow-400/50 text-yellow-950';
        case 'steel': return 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 border-slate-300/50 text-slate-900';
        default: return 'bg-gradient-to-br from-slate-800 via-slate-900 to-black border-slate-700 text-white';
    }
  };

  useEffect(() => {
    // Sync initialView props with internal state
    if (initialView === 'dex') setViewState('swap');
    else if (initialView === 'cards') setViewState('cards');
    else if (initialView === 'dapps') setViewState('dapps');
    else if (initialView === 'hosting') setViewState('hosting');
    else if (initialView === 'chat') setViewState('chat');
    else setViewState('home');
  }, [initialView]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tab: string) => {
    // Map tabs to views
    if (tab === 'home') setViewState('home');
    if (tab === 'swap') setViewState('swap');
    if (tab === 'cards') setViewState('cards');
    if (tab === 'dapps') setViewState('dapps');
  };

  const getActiveTab = () => {
    if (['home', 'send', 'receive', 'buy', 'fiat', 'settings', 'history'].includes(viewState)) return 'home';
    if (viewState === 'hosting') return 'dapps';
    return viewState;
  };

  const filteredHistory = TRANSACTIONS.filter(tx => {
    const matchesFilter = historyFilter === 'all' || tx.type === historyFilter;
    const matchesSearch = !historySearch || 
        tx.symbol.toLowerCase().includes(historySearch.toLowerCase()) || 
        (tx.counterparty && tx.counterparty.toLowerCase().includes(historySearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const DAPPS_EXPANDED: DApp[] = [
    ...DAPPS,
    { id: 'host-internal', name: 'Fluid Host', url: 'fluid://host', icon: Server, category: 'Utils', status: 'online', description: 'Manage your decentralized sites.', action: () => setViewState('hosting') }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-transparent">
       <div className="relative w-full max-w-[380px] h-[800px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10">
          
          {/* Status Bar */}
          <div className="absolute top-0 inset-x-0 h-14 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-between px-6 pt-2">
             <span className="text-xs font-bold text-white">{currentTime}</span>
             <div className="absolute left-1/2 -translate-x-1/2 top-0 w-32 h-7 bg-black rounded-b-2xl"></div>
             <div className="flex items-center gap-1.5 text-white">
                <Signal size={12} />
                <Wifi size={12} />
                <Battery size={12} />
             </div>
          </div>

          {/* Locked State Overlay */}
          {locked && <SecurityVault onUnlock={() => setLocked(false)} />}

          {/* Edit Profile Modal */}
          {showProfileModal && (
            <div className="absolute inset-0 z-[60] bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-300">
               {/* Modal Header */}
               <div className="p-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                     <User size={18} className="text-blue-500" /> Edit Profile
                  </h3>
                  <button onClick={() => setShowProfileModal(false)} className="p-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white transition-colors">
                     <X size={20} />
                  </button>
               </div>

               {/* Modal Content */}
               <div className="p-6 flex-grow overflow-y-auto custom-scrollbar space-y-6">
                  {/* Avatar Edit */}
                  <div className="flex justify-center mb-2 relative group">
                     <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-slate-800 overflow-hidden relative shadow-2xl">
                        <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                           <Camera size={32} className="text-white drop-shadow-md" />
                        </div>
                     </div>
                     <button className="absolute bottom-0 right-1/2 translate-x-12 translate-y-2 p-2.5 bg-blue-600 rounded-full text-white border-4 border-slate-950 hover:bg-blue-500 transition-colors shadow-lg">
                        <Pen size={14} />
                     </button>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-1 block">Display Name</label>
                        <div className="relative">
                           <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                           <input 
                              type="text" 
                              value={userProfile.name}
                              onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-bold"
                           />
                        </div>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-1 block">Fluid Handle</label>
                        <div className="relative">
                           <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                           <input 
                              type="text" 
                              value={userProfile.handle}
                              readOnly
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-10 pr-4 text-sm text-slate-400 focus:outline-none cursor-not-allowed font-mono"
                           />
                           <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-emerald-500 font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Verified</span>
                        </div>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-1 block">Bio</label>
                        <textarea 
                           value={userProfile.bio}
                           onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                           className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all min-h-[80px] resize-none"
                           placeholder="Tell us about yourself..."
                        />
                     </div>

                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-1 block">Email (Private)</label>
                        <div className="relative">
                           <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                           <input 
                              type="email" 
                              value={userProfile.email}
                              onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                           />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Modal Footer */}
               <div className="p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
                  <button 
                     onClick={() => setShowProfileModal(false)}
                     className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-wider"
                  >
                     Save Changes
                  </button>
               </div>
            </div>
          )}

          {/* Add Bank Account Modal */}
          {showAddBankModal && (
            <div className="absolute inset-0 z-[70] bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-300">
               <div className="p-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Link Bank Account</h3>
                  <button onClick={() => setShowAddBankModal(false)} className="p-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white transition-colors">
                     <X size={20} />
                  </button>
               </div>
               <div className="p-6 flex-grow overflow-y-auto">
                  <p className="text-sm text-slate-400 mb-6">Connect your traditional bank account to enable seamless fiat on/off ramps.</p>
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-1 block">Account Holder</label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="John Doe" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-1 block">IBAN / Account Number</label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="US89..." />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-2 mb-1 block">Bank Name</label>
                        <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Chase Bank" />
                     </div>
                  </div>
                  <button onClick={() => setShowAddBankModal(false)} className="w-full py-4 mt-8 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20">Link Account</button>
               </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="h-full pt-16 pb-20 overflow-y-auto custom-scrollbar bg-slate-950">
             
             {/* HOME TAB */}
             {viewState === 'home' && (
               <div className="px-5 space-y-6 animate-in fade-in duration-300">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                     <button onClick={() => setShowProfileModal(true)} className="flex items-center gap-3 group text-left">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-0.5 group-hover:scale-105 transition-transform">
                           <img src={userProfile.avatar} alt="Profile" className="w-full h-full rounded-full bg-slate-900 object-cover" />
                        </div>
                        <div>
                           <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover:text-blue-400 transition-colors">Welcome Back</div>
                           <div className="text-sm font-black text-white">{userProfile.name}</div>
                        </div>
                     </button>
                     <div className="flex gap-2">
                        <button onClick={() => setViewState('history')} className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Transaction History">
                           <History size={18}/>
                        </button>
                        <button onClick={() => setViewState('chat')} className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-colors relative">
                          <MessageSquare size={18}/>
                          <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </button>
                        <button onClick={() => setViewState('settings')} className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
                           <Settings size={18}/>
                        </button>
                     </div>
                  </div>

                  {/* Balance Card */}
                  <div className="p-6 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-500/20 text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                     <div className="relative z-10">
                        <span className="text-xs font-medium text-blue-200">Total Balance</span>
                        <div className="text-3xl font-black mt-1 mb-6">$67,190.50</div>
                        <div className="flex gap-3">
                           <button onClick={() => setViewState('receive')} className="flex-1 bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 backdrop-blur-sm">
                              <ArrowDownLeft size={14} /> Receive
                           </button>
                           <button onClick={() => setViewState('send')} className="flex-1 bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 backdrop-blur-sm">
                              <ArrowUpRight size={14} /> Send
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Actions Grid - Updated */}
                  <div className="grid grid-cols-4 gap-2">
                     {[
                        { label: 'Send', icon: ArrowUpRight, color: 'text-blue-400', action: () => setViewState('send') },
                        { label: 'Receive', icon: ArrowDownLeft, color: 'text-emerald-400', action: () => setViewState('receive') },
                        { label: 'Buy', icon: CreditCard, color: 'text-purple-400', action: () => setViewState('buy') },
                        { label: 'Bank', icon: Landmark, color: 'text-amber-400', action: () => setViewState('fiat') },
                     ].map((action, i) => (
                        <button key={i} onClick={action.action} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors">
                           <action.icon size={20} className={action.color} />
                           <span className="text-[10px] font-bold text-slate-400">{action.label}</span>
                        </button>
                     ))}
                  </div>

                  {/* Chart */}
                  <div className="h-32 -mx-5 px-5">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CHART_DATA}>
                           <defs>
                              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>

                  {/* Fiat Accounts Section */}
                  <div>
                     <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-white text-sm">Fiat Accounts</h3>
                        <button onClick={() => setShowAddBankModal(true)} className="text-xs font-bold text-blue-500 flex items-center gap-1">
                           + Add New
                        </button>
                     </div>
                     <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 no-scrollbar">
                        {FIAT_ACCOUNTS.map((account, i) => (
                           <div key={i} className="min-w-[160px] p-4 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-between h-24">
                              <div className="flex justify-between items-start z-10">
                                 <div className="flex items-center gap-2">
                                    <span className="text-xl">{account.flag}</span>
                                    <span className="text-xs font-bold text-white">{account.currency}</span>
                                 </div>
                                 <Landmark size={14} className="text-slate-500" />
                              </div>
                              <div className="z-10">
                                 <div className="text-[10px] text-slate-500 font-medium truncate mb-0.5">{account.bankName}</div>
                                 <div className="text-sm font-black text-white">{account.symbol}{account.balance}</div>
                              </div>
                              {/* Decor */}
                              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Assets List */}
                  <div>
                     <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-white text-sm">Crypto Assets</h3>
                        <span className="text-xs font-bold text-blue-500">See All</span>
                     </div>
                     <div className="space-y-3">
                        {ASSETS.map((asset) => (
                           <div key={asset.symbol} className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                              <div className="flex items-center gap-3">
                                 <div className={`w-10 h-10 rounded-xl ${asset.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                                    {asset.symbol === 'FLD' ? <FluidLogo className="w-5 h-5" /> : asset.symbol[0]}
                                 </div>
                                 <div>
                                    <div className="font-bold text-white text-sm">{asset.name}</div>
                                    <div className="text-xs text-slate-500">{asset.amount} {asset.symbol}</div>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="font-bold text-white text-sm">{asset.value}</div>
                                 <div className={`text-[10px] font-bold ${asset.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{asset.change}</div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
             )}

             {/* TRANSACTION HISTORY VIEW */}
             {viewState === 'history' && (
                <div className="px-5 h-full flex flex-col animate-in slide-in-from-right duration-300 pb-24">
                   {/* Header */}
                   <div className="flex items-center gap-2 mb-6">
                      <button onClick={() => setViewState('home')} className="p-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                      <h2 className="text-xl font-black text-white">Transaction History</h2>
                   </div>

                   {/* Search & Filters */}
                   <div className="space-y-4 mb-6">
                      <div className="relative">
                         <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                         <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                            value={historySearch}
                            onChange={(e) => setHistorySearch(e.target.value)}
                         />
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                         {['all', 'send', 'receive', 'swap', 'buy'].map((filter) => (
                            <button 
                               key={filter}
                               onClick={() => setHistoryFilter(filter as any)}
                               className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                                  historyFilter === filter 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300'
                               }`}
                            >
                               {filter}
                            </button>
                         ))}
                      </div>
                   </div>

                   {/* Transaction List */}
                   <div className="space-y-3 overflow-y-auto custom-scrollbar flex-grow">
                      {filteredHistory.length > 0 ? (
                         filteredHistory.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-900 transition-colors">
                               <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg ${
                                     tx.type === 'receive' ? 'bg-emerald-500' :
                                     tx.type === 'send' ? 'bg-blue-500' :
                                     tx.type === 'swap' ? 'bg-purple-500' : 'bg-slate-700'
                                  }`}>
                                     {tx.type === 'receive' ? <ArrowDownLeft size={18} /> :
                                      tx.type === 'send' ? <ArrowUpRight size={18} /> :
                                      tx.type === 'swap' ? <RefreshCw size={18} /> : <CreditCard size={18} />}
                                  </div>
                                  <div>
                                     <div className="font-bold text-white text-sm capitalize flex items-center gap-1.5">
                                        {tx.type} {tx.symbol}
                                        {tx.status === 'pending' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" title="Pending"></span>}
                                        {tx.status === 'failed' && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" title="Failed"></span>}
                                     </div>
                                     <div className="text-[10px] text-slate-500 font-medium">
                                        {tx.date} • {tx.counterparty || 'Unknown'}
                                     </div>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <div className={`font-bold text-sm ${tx.type === 'receive' ? 'text-emerald-400' : 'text-white'}`}>
                                     {tx.type === 'receive' ? '+' : '-'}{tx.amount} {tx.symbol}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-medium">{tx.value}</div>
                               </div>
                            </div>
                         ))
                      ) : (
                         <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500">
                            <Filter size={32} className="mb-2 opacity-50" />
                            <p className="text-sm font-bold">No transactions found</p>
                            <p className="text-xs">Try adjusting your filters</p>
                         </div>
                      )}
                   </div>
                </div>
             )}

             {/* SETTINGS VIEW */}
             {viewState === 'settings' && (
                <div className="px-5 h-full flex flex-col animate-in slide-in-from-right duration-300 pb-24">
                   {/* Header */}
                   <div className="flex items-center gap-2 mb-6">
                      <button onClick={() => setViewState('home')} className="p-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                      <h2 className="text-xl font-black text-white">Settings</h2>
                   </div>

                   {/* Profile Card */}
                   <div className="bg-slate-900 rounded-2xl p-4 flex items-center gap-4 mb-6 border border-slate-800 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent pointer-events-none"></div>
                      <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 p-0.5 relative z-10">
                         <img src={userProfile.avatar} alt="User" className="w-full h-full rounded-full" />
                      </div>
                      <div className="relative z-10">
                         <div className="font-bold text-white">{userProfile.name}</div>
                         <div className="text-xs text-slate-500">{userProfile.handle}</div>
                      </div>
                      <button onClick={() => setShowProfileModal(true)} className="ml-auto p-2 bg-slate-950 rounded-full text-slate-400 border border-slate-800 hover:text-white transition-colors relative z-10"><Pen size={14}/></button>
                   </div>

                   {/* Security Score */}
                   <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 p-6 shadow-xl">
                      <div className="flex justify-between items-start relative z-10">
                         <div>
                            <h3 className="text-white font-bold text-lg">Security Score</h3>
                            <p className="text-indigo-300 text-xs mt-1">Wallet protection level</p>
                         </div>
                         <div className="text-3xl font-black text-white">85<span className="text-sm text-indigo-400">/100</span></div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-slate-950/50 h-2 rounded-full mt-4 mb-2 overflow-hidden border border-white/5">
                         <div className="bg-emerald-500 h-full w-[85%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                      </div>
                      
                      {/* Insight */}
                      <div className="flex items-center gap-2 mt-3 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                         <AlertTriangle size={14} className="text-amber-500" />
                         <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wide">Action Required: Cloud Backup</span>
                      </div>
                   </div>

                   {/* Biometric Triggers */}
                   <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-2 flex items-center gap-2">
                      <Fingerprint size={12} /> Biometric Triggers
                   </h3>
                   <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden mb-8 shadow-lg">
                      {Object.entries(biometricSettings).map(([key, value]) => (
                         <div key={key} className="flex items-center justify-between p-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
                            <div className="flex flex-col">
                               <span className="text-sm font-bold text-white capitalize mb-0.5">
                                  {key === 'viewCard' ? 'View Card Number' : key === 'adjustLimits' ? 'Adjust Limits' : key === 'initiateSwap' ? 'Initiate Swaps' : key.replace(/([A-Z])/g, ' $1').trim()}
                               </span>
                               <span className="text-[10px] text-slate-500 font-medium">
                                  Require auth to {key === 'viewCard' ? 'unmask PAN' : key === 'adjustLimits' ? 'increase spend limits' : key === 'initiateSwap' ? 'trade tokens' : key === 'sendCrypto' ? 'outgoing transfers' : 'flat on-ramp'}
                               </span>
                            </div>
                            <button 
                              onClick={() => setBiometricSettings(prev => ({...prev, [key]: !value}))}
                              className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 relative ${value ? 'bg-emerald-500' : 'bg-slate-700'}`}
                            >
                               <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 absolute top-1 ${value ? 'left-6' : 'left-1'}`}></div>
                            </button>
                         </div>
                      ))}
                   </div>

                   {/* Other Settings */}
                   <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 flex items-center justify-between mb-4 shadow-lg">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <Monitor size={20} />
                         </div>
                         <div>
                            <div className="text-sm font-bold text-white">Desktop App</div>
                            <div className="text-[10px] text-slate-500">Sync with Windows/Mac/Linux</div>
                         </div>
                      </div>
                      <button className="px-4 py-2 bg-slate-800 rounded-lg text-[10px] font-bold text-white border border-slate-700">DOWNLOAD</button>
                   </div>

                   <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-lg mb-8">
                      <div className="p-4 flex items-center justify-between border-b border-slate-800">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notifications</span>
                         <button className="text-[10px] text-blue-500 font-bold">Clear All</button>
                      </div>
                      <div className="p-4 space-y-4">
                         <div className="flex justify-between items-start">
                            <div>
                               <div className="text-xs font-bold text-white">Staking Reward</div>
                               <div className="text-[10px] text-slate-500">You received 450 FLD from pooling.</div>
                            </div>
                            <span className="text-[10px] text-slate-600">2m ago</span>
                         </div>
                         <div className="flex justify-between items-start">
                            <div>
                               <div className="text-xs font-bold text-white">Security Alert</div>
                               <div className="text-[10px] text-slate-500">New login detected from Frankfurt, DE.</div>
                            </div>
                            <span className="text-[10px] text-slate-600">1h ago</span>
                         </div>
                         <div className="flex justify-between items-start">
                            <div>
                               <div className="text-xs font-bold text-white">System Update</div>
                               <div className="text-[10px] text-slate-500">Fluid Node V2.1 is live.</div>
                            </div>
                            <span className="text-[10px] text-slate-600">5h ago</span>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {/* SEND VIEW */}
             {viewState === 'send' && (
                <div className="px-5 h-full flex flex-col animate-in slide-in-from-right duration-300">
                   <div className="flex items-center gap-2 mb-6">
                      <button onClick={() => setViewState('home')} className="p-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                      <h2 className="text-xl font-black text-white">Send Crypto</h2>
                   </div>

                   <div className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800 mb-4 text-center">
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Enter Amount</span>
                      <div className="text-4xl font-black text-white my-2">$0.00</div>
                      <span className="text-slate-500 text-xs font-bold">Balance: $22,500.00</span>
                   </div>

                   <div className="space-y-4">
                      <div>
                         <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Recipient Address</label>
                         <div className="flex items-center gap-2 mt-2">
                            <input type="text" placeholder="0x..." className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white text-sm font-mono focus:border-blue-500 outline-none" />
                            <button className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-blue-500"><ScanFace size={20}/></button>
                         </div>
                      </div>

                      <div>
                         <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Select Asset</label>
                         <div className="mt-2 space-y-2">
                            {ASSETS.slice(0,2).map((asset) => (
                               <button key={asset.symbol} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-colors">
                                  <div className="flex items-center gap-3">
                                     <div className={`w-8 h-8 rounded-lg ${asset.color} flex items-center justify-center text-white text-xs font-bold`}>{asset.symbol[0]}</div>
                                     <span className="font-bold text-white text-sm">{asset.name}</span>
                                  </div>
                                  <span className="text-xs font-bold text-slate-400">{asset.amount} {asset.symbol}</span>
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-black text-lg shadow-lg shadow-blue-500/20 mt-auto mb-4 flex items-center justify-center gap-2">
                      Send Now <ArrowUpRight size={20}/>
                   </button>
                </div>
             )}

             {/* RECEIVE VIEW */}
             {viewState === 'receive' && (
                <div className="px-5 h-full flex flex-col animate-in slide-in-from-right duration-300">
                   <div className="flex items-center gap-2 mb-6">
                      <button onClick={() => setViewState('home')} className="p-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                      <h2 className="text-xl font-black text-white">Receive</h2>
                   </div>

                   <div className="bg-white p-6 rounded-[2rem] mx-auto mb-8 shadow-2xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none"></div>
                      <QrCode size={200} className="text-slate-900 relative z-10" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm z-20">
                         <span className="text-slate-900 font-bold text-sm">Scan to Pay</span>
                      </div>
                   </div>

                   <div className="text-center mb-8">
                      <h3 className="text-white font-bold mb-1">Alex Fluid</h3>
                      <div className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 py-2 px-4 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
                         <span className="text-slate-400 text-xs font-mono">0x71C...92A</span>
                         <Copy size={12} className="text-blue-500" />
                      </div>
                      <p className="text-slate-500 text-[10px] mt-4 max-w-[200px] mx-auto">
                         Send only ERC-20 tokens or Layer 1 assets to this address.
                      </p>
                   </div>
                   
                   <div className="space-y-2 mt-auto mb-4">
                      <button className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl border border-slate-700">Share Address</button>
                      <button className="w-full py-3 bg-transparent text-slate-500 font-bold rounded-xl hover:text-white">Request Payment</button>
                   </div>
                </div>
             )}

             {/* BUY VIEW */}
             {viewState === 'buy' && (
                <div className="px-5 h-full flex flex-col animate-in slide-in-from-right duration-300">
                   <div className="flex items-center gap-2 mb-6">
                      <button onClick={() => setViewState('home')} className="p-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                      <h2 className="text-xl font-black text-white">Buy Crypto</h2>
                   </div>

                   <div className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800 mb-6 relative overflow-hidden">
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">You Pay</span>
                         <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg">
                            <span className="text-white text-xs font-bold">USD</span>
                            <ChevronDown size={12} className="text-slate-500" />
                         </div>
                      </div>
                      <div className="text-4xl font-black text-white mb-2">$1,000.00</div>
                      <div className="w-full h-px bg-slate-800 my-4"></div>
                      <div className="flex justify-between items-center">
                         <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">You Get</span>
                         <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg">
                            <span className="text-white text-xs font-bold">ETH</span>
                            <ChevronDown size={12} className="text-slate-500" />
                         </div>
                      </div>
                      <div className="text-4xl font-black text-emerald-400 mt-2">0.345 ETH</div>
                   </div>

                   <div className="space-y-3 mb-6">
                      <h3 className="text-slate-400 text-xs font-bold uppercase ml-2">Payment Method</h3>
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="w-5" alt="Mastercard" /></div>
                            <div>
                               <div className="text-white text-sm font-bold">Mastercard</div>
                               <div className="text-slate-500 text-xs">**** 4242</div>
                            </div>
                         </div>
                         <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                         </div>
                      </div>
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center"><Apple size={16} className="text-black"/></div>
                            <div>
                               <div className="text-white text-sm font-bold">Apple Pay</div>
                            </div>
                         </div>
                         <div className="w-4 h-4 rounded-full border border-slate-600"></div>
                      </div>
                   </div>

                   <button className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-lg shadow-lg shadow-blue-500/20 mt-auto mb-4">
                      Purchase ETH
                   </button>
                </div>
             )}

             {/* FIAT (BANK) VIEW */}
             {viewState === 'fiat' && (
                <div className="px-5 h-full flex flex-col animate-in slide-in-from-right duration-300">
                   <div className="flex items-center gap-2 mb-6">
                      <button onClick={() => setViewState('home')} className="p-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                      <h2 className="text-xl font-black text-white">Fiat Accounts</h2>
                   </div>

                   <div className="space-y-4">
                      {FIAT_ACCOUNTS.map((account, i) => (
                         <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center gap-3">
                                  <div className="text-2xl">{account.flag}</div>
                                  <div>
                                     <div className="text-white font-bold">{account.currency} Account</div>
                                     <div className="text-slate-500 text-xs">{account.bankName}</div>
                                  </div>
                               </div>
                               <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded uppercase">Active</span>
                            </div>
                            <div className="text-3xl font-black text-white mb-4">{account.symbol}{account.balance}</div>
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                               <div className="font-mono text-xs text-slate-400">{account.iban}</div>
                               <Copy size={12} className="text-slate-500" />
                            </div>
                         </div>
                      ))}
                   </div>
                   
                   <button className="mt-6 w-full py-3 border border-dashed border-slate-700 rounded-xl text-slate-400 font-bold hover:text-white hover:bg-slate-900 transition-colors">
                      + Add New Currency
                   </button>
                </div>
             )}

             {/* SWAP TAB */}
             {viewState === 'swap' && (
               <div className="px-5 h-full flex flex-col animate-in slide-in-from-right duration-300">
                  <h2 className="text-xl font-black text-white mb-6">Fluid DEX</h2>
                  
                  <div className="bg-slate-900 rounded-[2rem] p-4 border border-slate-800 mb-2">
                     <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>Pay</span>
                        <span>Bal: 4.2 ETH</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <input type="number" placeholder="0" className="bg-transparent text-3xl font-bold text-white outline-none w-1/2" />
                        <button className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                           <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[8px] font-bold text-white">E</div>
                           <span className="text-sm font-bold text-white">ETH</span>
                           <ChevronRight size={14} className="text-slate-400 rotate-90" />
                        </button>
                     </div>
                  </div>

                  <div className="flex justify-center -my-4 relative z-10">
                     <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 text-blue-500 shadow-xl">
                        <RefreshCw size={20} />
                     </div>
                  </div>

                  <div className="bg-slate-900 rounded-[2rem] p-4 border border-slate-800 mb-6 pt-6">
                     <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>Receive</span>
                        <span>Bal: 0 FLD</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <input type="number" placeholder="0" className="bg-transparent text-3xl font-bold text-white outline-none w-1/2" readOnly />
                        <button className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                           <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] font-bold text-white">
                              <FluidLogo className="w-3 h-3" />
                           </div>
                           <span className="text-sm font-bold text-white">FLD</span>
                           <ChevronRight size={14} className="text-slate-400 rotate-90" />
                        </button>
                     </div>
                  </div>

                  <button className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-lg shadow-lg shadow-blue-500/20 mb-8">
                     Swap Tokens
                  </button>

                  <div className="mt-auto mb-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                     <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-500">Rate</span>
                        <span className="text-white font-bold">1 ETH = 3,420 FLD</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Network Fee</span>
                        <span className="text-white font-bold">$1.20</span>
                     </div>
                  </div>
               </div>
             )}

             {/* CARDS TAB */}
             {viewState === 'cards' && (
               <div className="px-5 h-full flex flex-col animate-in slide-in-from-right duration-300 pb-20">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-4">
                      {cardViewMode !== 'main' && (
                          <button onClick={() => { setCardViewMode('main'); setOrderStep(1); }} className="p-2 -ml-2 text-slate-400 hover:text-white">
                              <ChevronLeft size={20} />
                          </button>
                      )}
                      <h2 className="text-xl font-black text-white">
                          {cardViewMode === 'history' ? 'Transaction History' : 
                           cardViewMode === 'manage' ? 'Card Settings' : 
                           cardViewMode === 'order' ? 'Order Physical Card' : 'My Cards'}
                      </h2>
                  </div>

                  {/* Main Card View */}
                  {cardViewMode === 'main' && (
                      <>
                          {/* Tabs */}
                          <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 mb-6">
                              <button 
                                  onClick={() => setCardTab('digital')}
                                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${cardTab === 'digital' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                              >
                                  DIGITAL
                              </button>
                              <button 
                                  onClick={() => setCardTab('metal')}
                                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${cardTab === 'metal' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                              >
                                  METAL
                              </button>
                          </div>

                          {/* Card Display */}
                          <div className="relative perspective-1000 mb-6">
                              {cardTab === 'metal' ? (
                                  hasPhysicalCard ? (
                                    <div className={`aspect-[1.58/1] ${getCardStyle(selectedDesign)} rounded-2xl p-5 border relative overflow-hidden shadow-2xl transition-all duration-500`}>
                                        <FluidLogo className="absolute -bottom-12 -right-12 w-48 h-48 opacity-10 pointer-events-none" />
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                                        
                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                            <div className="flex items-center gap-2">
                                              <FluidLogo className="w-8 h-8" />
                                              {selectedDesign === 'gold' && <span className="text-[10px] font-black uppercase border border-yellow-700/50 px-1 rounded text-yellow-900">24K</span>}
                                            </div>
                                            <CardChip size={32} className="opacity-80 rotate-90" />
                                        </div>
                                        
                                        <div className="relative z-10 mt-auto">
                                            <div className="font-mono text-xl tracking-widest mb-4 opacity-90 drop-shadow-md">
                                                {showCardDetails ? '4829 1029 4482 1029' : '**** **** **** 1029'}
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <div className="text-[8px] opacity-60 uppercase font-bold mb-0.5">Card Holder</div>
                                                    <div className="text-sm font-bold uppercase tracking-wider">{userProfile.name}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-bold uppercase opacity-80">Fluid {selectedDesign}</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Metal sheen effect */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
                                    </div>
                                  ) : (
                                    <div className="aspect-[1.58/1] rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-6 text-center shadow-2xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                                        <div className="relative z-10">
                                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500 border border-slate-700">
                                                <CreditCard size={32} />
                                            </div>
                                            <h3 className="text-white font-bold text-lg mb-2">Upgrade to Metal</h3>
                                            <p className="text-slate-400 text-xs mb-6 max-w-[200px] mx-auto">Get the premium Fluid Metal card. Worldwide shipping included.</p>
                                            <button 
                                                onClick={() => setCardViewMode('order')}
                                                className="px-6 py-2 bg-white text-slate-900 rounded-full text-xs font-black uppercase tracking-wider hover:scale-105 transition-transform"
                                            >
                                                Order Now
                                            </button>
                                        </div>
                                    </div>
                                  )
                              ) : (
                                  <div className={`aspect-[1.58/1] ${getCardStyle('black')} rounded-2xl p-5 border relative overflow-hidden shadow-2xl transition-all duration-500 ${isFrozen ? 'grayscale opacity-75' : ''}`}>
                                      {/* Watermark */}
                                      <FluidLogo className="absolute -bottom-12 -right-12 w-48 h-48 opacity-5 pointer-events-none" />
                                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                                      
                                      <div className="flex justify-between items-start mb-8 relative z-10">
                                          <FluidLogo className="w-8 h-8" />
                                          <Signal size={20} className="opacity-50" />
                                      </div>
                                      
                                      <div className="relative z-10 mb-6">
                                          {showCardDetails ? (
                                              <div className="font-mono text-xl tracking-widest animate-in fade-in">
                                                  4829 1029 4482 1029
                                              </div>
                                          ) : (
                                              <div className="font-mono text-xl tracking-widest">
                                                  **** **** **** 1029
                                              </div>
                                          )}
                                      </div>
                                      
                                      <div className="flex justify-between items-end relative z-10">
                                          <div>
                                              <div className="text-[8px] opacity-60 uppercase font-bold mb-1">Card Holder</div>
                                              <div className="text-sm font-bold uppercase">{userProfile.name}</div>
                                          </div>
                                          <div className="text-right">
                                              <div className="text-[8px] opacity-60 uppercase font-bold mb-1">Expires</div>
                                              <div className="text-sm font-mono font-bold">{showCardDetails ? '12/28' : '**/**'}</div>
                                          </div>
                                          {showCardDetails && (
                                              <div className="text-right ml-4">
                                                  <div className="text-[8px] opacity-60 uppercase font-bold mb-1">CVV</div>
                                                  <div className="text-sm font-mono font-bold">842</div>
                                              </div>
                                          )}
                                      </div>
                                      
                                      {isFrozen && (
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px] z-20">
                                              <div className="flex flex-col items-center gap-2">
                                                  <Lock size={32} className="text-white" />
                                                  <span className="text-xs font-bold text-white uppercase tracking-widest">Frozen</span>
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              )}
                          </div>

                          {/* Action Grid */}
                          <div className="grid grid-cols-4 gap-2 mb-6">
                              <button onClick={() => setShowCardDetails(!showCardDetails)} className="flex flex-col items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
                                  {showCardDetails ? <EyeOff size={20} className="text-slate-400" /> : <Eye size={20} className="text-slate-400" />}
                                  <span className="text-[9px] font-bold text-slate-400">{showCardDetails ? 'Hide' : 'Details'}</span>
                              </button>
                              <button onClick={() => setCardViewMode('manage')} className="flex flex-col items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
                                  <Sliders size={20} className="text-slate-400" />
                                  <span className="text-[9px] font-bold text-slate-400">Limits</span>
                              </button>
                              <button onClick={() => setIsFrozen(!isFrozen)} className="flex flex-col items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
                                  {isFrozen ? <Unlock size={20} className="text-emerald-500" /> : <Lock size={20} className="text-slate-400" />}
                                  <span className={`text-[9px] font-bold ${isFrozen ? 'text-emerald-500' : 'text-slate-400'}`}>{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
                              </button>
                              <button onClick={() => setCardViewMode('manage')} className="flex flex-col items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-colors">
                                  <Delete size={20} className="text-rose-500" />
                                  <span className="text-[9px] font-bold text-rose-500">Block</span>
                              </button>
                          </div>

                          {/* Recent Activity Snippet - Scrollable via parent container */}
                          <div className="flex justify-between items-center mb-3 px-1">
                              <h3 className="text-sm font-bold text-white">Recent Activity</h3>
                              <button onClick={() => setCardViewMode('history')} className="text-xs font-bold text-blue-500">View All</button>
                          </div>
                          <div className="space-y-3">
                              {CARD_TXS.slice(0, 2).map((tx) => (
                                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
                                      <div className="flex items-center gap-3">
                                          <div className={`w-10 h-10 rounded-xl ${tx.bg} flex items-center justify-center text-white font-bold text-xs`}>
                                              {tx.icon}
                                          </div>
                                          <div>
                                              <div className="font-bold text-white text-sm">{tx.merchant}</div>
                                              <div className="text-[10px] text-slate-500">{tx.type} • {tx.date}</div>
                                          </div>
                                      </div>
                                      <span className="font-bold text-white text-sm">{tx.amount}</span>
                                  </div>
                              ))}
                          </div>
                      </>
                  )}

                  {/* History View */}
                  {cardViewMode === 'history' && (
                      <div className="animate-in slide-in-from-right duration-300 h-full">
                          <div className="space-y-3">
                              {CARD_TXS.map((tx) => (
                                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
                                      <div className="flex items-center gap-4">
                                          <div className={`w-10 h-10 rounded-xl ${tx.bg} flex items-center justify-center text-white font-bold text-xs shadow-lg`}>
                                              {tx.icon}
                                          </div>
                                          <div>
                                              <div className="font-bold text-white text-sm">{tx.merchant}</div>
                                              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{tx.type}</div>
                                          </div>
                                      </div>
                                      <div className="text-right">
                                          <div className="font-bold text-white text-sm">{tx.amount}</div>
                                          <div className="text-[10px] text-slate-500">{tx.date}</div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* Manage View */}
                  {cardViewMode === 'manage' && (
                      <div className="animate-in slide-in-from-right duration-300 space-y-6">
                          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                  <span className="font-bold text-white text-sm">Freeze Card</span>
                                  <button onClick={() => setIsFrozen(!isFrozen)} className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 relative ${isFrozen ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 absolute top-1 ${isFrozen ? 'left-6' : 'left-1'}`}></div>
                                  </button>
                              </div>
                              <p className="p-4 text-[10px] text-slate-500 bg-slate-950/50">Temporarily disable all transactions. Recurring subscriptions may still be processed.</p>
                          </div>

                          <div>
                              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-2">Security</h3>
                              <div className="space-y-2">
                                  {['View Card Number', 'Adjust Limits', 'Change PIN', 'Reset CVV'].map(item => (
                                      <button key={item} className="w-full flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-colors">
                                          <span className="text-sm font-bold text-white">{item}</span>
                                          <ChevronRight size={16} className="text-slate-500" />
                                      </button>
                                  ))}
                              </div>
                          </div>

                          <button className="w-full py-4 text-rose-500 font-bold text-sm bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center gap-2 hover:bg-rose-500/10 transition-colors">
                              <Delete size={16} /> Delete Virtual Card
                          </button>
                      </div>
                  )}

                  {/* Order Physical View */}
                  {cardViewMode === 'order' && (
                      <div className="animate-in slide-in-from-right duration-300 flex flex-col h-full">
                          {/* Step Indicator */}
                          <div className="flex items-center gap-2 mb-6 justify-center">
                              <div className={`h-1 w-8 rounded-full ${orderStep >= 1 ? 'bg-white' : 'bg-slate-800'}`}></div>
                              <div className={`h-1 w-8 rounded-full ${orderStep >= 2 ? 'bg-white' : 'bg-slate-800'}`}></div>
                              <div className={`h-1 w-8 rounded-full ${orderStep >= 3 ? 'bg-white' : 'bg-slate-800'}`}></div>
                          </div>

                          {orderStep === 1 && (
                              <div className="flex-1 flex flex-col min-h-0">
                                  <div className="text-center mb-4 flex-shrink-0">
                                      <h3 className="text-lg font-black text-white">Choose Material</h3>
                                      <p className="text-xs text-slate-500">Select your premium card finish</p>
                                  </div>
                                  
                                  {/* Scrollable Design List */}
                                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 px-1 pb-4">
                                      {['black', 'steel', 'gold'].map((design) => (
                                          <button 
                                              key={design}
                                              onClick={() => setSelectedDesign(design as any)}
                                              className={`w-full p-4 rounded-2xl border transition-all relative overflow-hidden group ${selectedDesign === design ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-800 bg-slate-900 opacity-60 hover:opacity-100'}`}
                                          >
                                              <div className={`aspect-[2.5/1] ${getCardStyle(design)} rounded-xl mb-3 relative overflow-hidden flex items-center justify-center`}>
                                                  <FluidLogo className="absolute -right-4 -bottom-8 w-24 h-24 opacity-10" />
                                                  <div className="font-bold uppercase tracking-widest text-lg opacity-90">{design}</div>
                                              </div>
                                              <div className="flex justify-between items-center">
                                                  <span className="font-bold text-white capitalize text-sm">{design} Metal</span>
                                                  <span className="text-xs font-bold text-slate-400">{design === 'black' ? 'Free' : design === 'steel' ? '$49.99' : '$99.99'}</span>
                                              </div>
                                          </button>
                                      ))}
                                  </div>
                                  <div className="pt-4 flex-shrink-0">
                                      <button onClick={() => setOrderStep(2)} className="w-full py-4 bg-white text-black font-black rounded-xl">Continue</button>
                                  </div>
                              </div>
                          )}

                          {orderStep === 2 && (
                              <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                                  <div className="text-center mb-4">
                                      <h3 className="text-lg font-black text-white">Shipping Details</h3>
                                      <p className="text-xs text-slate-500">Where should we send your card?</p>
                                  </div>

                                  <div className="space-y-4">
                                      <div>
                                          <label className="text-xs font-bold text-slate-500 ml-2 uppercase">Full Name</label>
                                          <div className="flex items-center gap-2 mt-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                                              <User size={16} className="text-slate-500" />
                                              <input type="text" defaultValue={userProfile.name} className="bg-transparent text-white text-sm font-bold w-full outline-none" />
                                          </div>
                                      </div>
                                      <div>
                                          <label className="text-xs font-bold text-slate-500 ml-2 uppercase">Street Address</label>
                                          <div className="flex items-center gap-2 mt-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
                                              <MapPin size={16} className="text-slate-500" />
                                              <input type="text" placeholder="123 Blockchain Blvd" className="bg-transparent text-white text-sm font-bold w-full outline-none" />
                                          </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                          <div>
                                              <label className="text-xs font-bold text-slate-500 ml-2 uppercase">City</label>
                                              <input type="text" placeholder="Crypto City" className="mt-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm font-bold w-full outline-none" />
                                          </div>
                                          <div>
                                              <label className="text-xs font-bold text-slate-500 ml-2 uppercase">Zip Code</label>
                                              <input type="text" placeholder="10101" className="mt-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm font-bold w-full outline-none" />
                                          </div>
                                      </div>
                                  </div>
                                  <button onClick={() => setOrderStep(3)} className="w-full py-4 bg-white text-black font-black rounded-xl mt-auto">Confirm Order</button>
                              </div>
                          )}

                          {orderStep === 3 && (
                              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                  <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-2 border border-emerald-500/20 animate-in zoom-in duration-500">
                                      <Truck size={40} />
                                  </div>
                                  <div>
                                      <h3 className="text-2xl font-black text-white mb-2">Order Confirmed!</h3>
                                      <p className="text-slate-400 text-sm max-w-[200px] mx-auto">Your {selectedDesign} card is being prepared. Estimated delivery: 5-7 business days.</p>
                                  </div>
                                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 w-full">
                                      <div className="flex justify-between text-xs mb-2">
                                          <span className="text-slate-500">Order ID</span>
                                          <span className="text-white font-mono">#ORD-992-882</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                          <span className="text-slate-500">Status</span>
                                          <span className="text-emerald-500 font-bold uppercase">Processing</span>
                                      </div>
                                  </div>
                                  <button 
                                    onClick={() => { setHasPhysicalCard(true); setCardTab('metal'); setCardViewMode('main'); }} 
                                    className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors"
                                  >
                                    Back to Wallet
                                  </button>
                              </div>
                          )}
                      </div>
                  )}
               </div>
             )}

             {/* DAPPS TAB */}
             {viewState === 'dapps' && (
               <div className="px-5 space-y-4 animate-in slide-in-from-right duration-300">
                  <h2 className="text-xl font-black text-white">dApp Browser</h2>
                  <div className="relative">
                     <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                     <input type="text" placeholder="Search or type URL" className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     {DAPPS_EXPANDED.map((app, i) => (
                        <button key={i} onClick={app.action} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col items-center gap-3 hover:bg-slate-800 cursor-pointer transition-colors group">
                           <div className={`p-3 rounded-full bg-slate-950 text-indigo-400 group-hover:text-white transition-colors`}>
                              <app.icon size={20} />
                           </div>
                           <span className="text-xs font-bold text-white">{app.name}</span>
                        </button>
                     ))}
                  </div>
               </div>
             )}
             
             {/* FLUID HOSTING VIEW (DApp Integration) */}
             {viewState === 'hosting' && (
                <div className="px-5 h-full flex flex-col animate-in slide-in-from-right duration-300">
                   <div className="flex items-center gap-2 mb-6">
                      <button onClick={() => setViewState('dapps')} className="p-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white"><ChevronLeft size={20}/></button>
                      <h2 className="text-xl font-black text-white">Fluid Host</h2>
                   </div>

                   <div className="bg-indigo-600 rounded-[2rem] p-6 mb-6 text-center shadow-lg shadow-indigo-500/20">
                      <Cloud size={40} className="text-white mx-auto mb-2 opacity-80" />
                      <h3 className="text-white font-black text-lg">Permanent Storage</h3>
                      <p className="text-indigo-200 text-xs mt-1">Deploy unstoppable websites.</p>
                      <button className="mt-4 bg-white text-indigo-600 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                         Deploy New
                      </button>
                   </div>

                   <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Your Deployments</h3>
                   <div className="space-y-3">
                      {DEPLOYED_SITES.map((site) => (
                         <div key={site.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-950 rounded-lg flex items-center justify-center text-slate-500 border border-slate-800">
                                  <Globe size={18} />
                               </div>
                               <div>
                                  <div className="text-white font-bold text-sm">{site.name}</div>
                                  <div className="text-slate-500 text-xs">{site.domain}</div>
                               </div>
                            </div>
                            <div className="flex flex-col items-end">
                               <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                  <span className="text-[10px] text-emerald-500 font-bold uppercase">Active</span>
                               </div>
                               <span className="text-[10px] text-slate-600 font-mono mt-1">{site.visits} visits</span>
                            </div>
                         </div>
                      ))}
                   </div>
                   
                   <div className="mt-auto mb-4 bg-slate-900 rounded-xl p-4 border border-slate-800">
                       <div className="flex items-center gap-3 mb-2">
                           <Terminal size={16} className="text-slate-500" />
                           <span className="text-xs font-bold text-slate-400">Recent Activity</span>
                       </div>
                       <div className="font-mono text-[10px] text-slate-500 space-y-1">
                           <p>> Updated <span className="text-blue-400">index.html</span> (2m ago)</p>
                           <p>> Syncing to Shard #4... Done.</p>
                       </div>
                   </div>
                </div>
             )}

             {/* CHAT TAB */}
             {viewState === 'chat' && (
               <div className="h-full">
                  <SecureChatApp onBack={() => setViewState('home')} />
               </div>
             )}

          </div>

          {/* Bottom Navigation (Hidden if in Chat or certain views) */}
          {activeTab !== 'chat' && viewState !== 'chat' && (
            <div className="absolute bottom-0 inset-x-0 h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 pb-4">
               {[
                 { id: 'home', icon: Home, label: 'Home' },
                 { id: 'swap', icon: RefreshCw, label: 'Swap' },
                 { id: 'cards', icon: CreditCard, label: 'Cards' },
                 { id: 'dapps', icon: Grid, label: 'dApps' },
               ].map((tab) => (
                 <button 
                    key={tab.id} 
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                       getActiveTab() === tab.id ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
                    }`}
                 >
                    <tab.icon size={22} className={getActiveTab() === tab.id ? 'fill-current' : ''} />
                    <span className="text-[9px] font-bold">{tab.label}</span>
                 </button>
               ))}
            </div>
          )}

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50"></div>
       </div>
    </div>
  );
};

export default FluidWalletApp;