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
  ShoppingBag, Coins, Monitor, Play, RotateCw, Check, LayoutGrid, MessageSquare, Send, Paperclip, Smile, Phone,
  Trash2, Asterisk
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
  action?: () => void;
}

interface Deployment {
  id: string;
  name: string;
  hash: string;
  status: 'active' | 'deploying' | 'error';
  url: string;
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

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'alert' | 'success';
  read: boolean;
}

interface NetworkOption {
  id: string;
  name: string;
  short: string;
  icon: string;
  color: string;
}

// --- Mock Data ---
const NETWORKS: NetworkOption[] = [
  { id: 'eth', name: 'Ethereum', short: 'ETH', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026', color: 'bg-indigo-500' },
  { id: 'sol', name: 'Solana', short: 'SOL', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=026', color: 'bg-purple-500' },
  { id: 'btc', name: 'Bitcoin', short: 'BTC', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026', color: 'bg-orange-500' },
  { id: 'bsc', name: 'BNB Chain', short: 'BSC', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026', color: 'bg-yellow-500' },
  { id: 'poly', name: 'Polygon', short: 'MATIC', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=026', color: 'bg-violet-500' },
];

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

const CONTACTS: ChatContact[] = [
  { id: '1', name: 'Sarah DeFi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', lastMessage: 'Did you see the new APY on Fluid?', time: '2m', unread: 2, online: true },
  { id: '2', name: 'Dev Team', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev', lastMessage: 'Deployment successful! 🚀', time: '1h', unread: 0, online: false },
  { id: '3', name: 'Crypto Dad', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dad', lastMessage: 'How do I bridge to L2?', time: '3h', unread: 0, online: true },
];

const DAPPS: DApp[] = [
  { id: '1', name: 'Fluid DEX', url: 'https://fluid.link/dex', icon: RefreshCw, category: 'DeFi', status: 'online', description: 'Swap tokens instantly with zero slippage.' },
  { id: '2', name: 'Fluid Host', url: 'https://fluid.link/host', icon: Server, category: 'Utils', status: 'online', description: 'Decentralized hosting for your dApps.' },
  { id: '3', name: 'SecureChat', url: 'https://chat.fluid.link', icon: MessageSquare, category: 'Social', status: 'online', description: 'End-to-end encrypted wallet messaging.' },
  { id: '4', name: 'NFT Market', url: 'https://nft.fluid.link', icon: Layers, category: 'NFT', status: 'online', description: 'Trade digital collectibles on Fluid.' },
  { id: '5', name: 'Fluid Lend', url: 'https://lend.fluid.link', icon: Coins, category: 'DeFi', status: 'online', description: 'Borrow and lend assets.' },
  { id: '6', name: 'Name Service', url: 'https://fns.fluid.link', icon: Globe, category: 'Utils', status: 'online', description: 'Register your .fluid domain.' },
];

const NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Staking Reward', message: 'You received 450 FLD from pooling.', time: '2m ago', type: 'success', read: false },
  { id: '2', title: 'Security Alert', message: 'New login detected from Frankfurt, DE.', time: '1h ago', type: 'alert', read: false },
  { id: '3', title: 'System Update', message: 'Fluid Node V2.1 is live.', time: '5h ago', type: 'info', read: true },
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
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'verifying' | 'error' | 'welcome'>('idle');

  const handleDirectAuth = (method: 'biometric' | 'passkey') => {
    if (method === 'passkey') setView('passkey_scan');
    
    setStatus('scanning');
    
    setTimeout(() => {
      setStatus('success');
      // Transition to Welcome screen
      setTimeout(() => {
        setStatus('welcome');
        setTimeout(onUnlock, 1800); // Allow time to read welcome message
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
                <img src={activeChat.avatar} className="w-10 h-10 rounded-full bg-slate-800" />
                {activeChat.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{activeChat.name}</div>
                <div className="text-[10px] text-emerald-500 flex items-center gap-1 font-bold"><Lock size={8} /> Encrypted</div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">SecureChat</h2>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck size={10} className="text-emerald-500" /> Wallet-to-Wallet
              </div>
            </div>
          )}
        </div>
        {activeChat && (
          <div className="flex gap-2">
             <button className="p-2 text-slate-400 hover:text-white"><Phone size={20}/></button>
             <button className="p-2 text-slate-400 hover:text-white"><MoreHorizontal size={20}/></button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto no-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-90">
        {!activeChat ? (
          <div className="p-2">
             <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Recent Chats</div>
             <div className="space-y-1">
               {CONTACTS.map(contact => (
                 <button key={contact.id} onClick={() => setActiveChat(contact)} className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group text-left">
                    <div className="relative">
                       <img src={contact.avatar} className="w-12 h-12 rounded-full bg-slate-800" />
                       {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>}
                    </div>
                    <div className="flex-grow min-w-0">
                       <div className="flex justify-between items-center mb-0.5">
                          <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{contact.name}</span>
                          <span className="text-[10px] font-medium text-slate-500">{contact.time}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <p className="text-xs text-slate-400 truncate pr-4">{contact.lastMessage}</p>
                          {contact.unread > 0 && <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">{contact.unread}</div>}
                       </div>
                    </div>
                 </button>
               ))}
             </div>
          </div>
        ) : (
          <div className="p-4 space-y-4 min-h-full flex flex-col justify-end">
             <div className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest my-4">Today</div>
             {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'me' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
                      <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                      <div className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${msg.sender === 'me' ? 'text-indigo-200' : 'text-slate-500'}`}>
                         {msg.time}
                         {msg.sender === 'me' && <Check size={10} />}
                      </div>
                   </div>
                </div>
             ))}
             <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area (Only in Chat) */}
      {activeChat && (
        <form onSubmit={sendMessage} className="p-3 bg-slate-900 border-t border-white/5 flex items-center gap-2">
           <button type="button" className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"><Paperclip size={18}/></button>
           <input 
             type="text" 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder="Type a message..." 
             className="flex-grow bg-black/20 border border-white/10 rounded-full py-2.5 px-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
           />
           <button type="submit" className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-colors shadow-lg disabled:opacity-50" disabled={!inputText.trim()}>
              <Send size={18} className={inputText.trim() ? 'ml-0.5' : ''} />
           </button>
        </form>
      )}
    </div>
  );
};

// --- Main Wallet Application ---
const FluidWalletApp: React.FC<{ onNavigate: (page: string) => void, initialView?: string }> = ({ onNavigate, initialView = 'assets' }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState(initialView);
  const [activeApp, setActiveApp] = useState<string | null>(null); // 'chat', etc.
  const [lastActiveTab, setLastActiveTab] = useState('assets');
  const [network, setNetwork] = useState('Fluid Mainnet');
  const [cardMode, setCardMode] = useState<'virtual' | 'physical'>('virtual');
  const [cardFrozen, setCardFrozen] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [activeModal, setActiveModal] = useState<'send' | 'receive' | 'buy' | 'editProfile' | 'domainRegistrar' | 'cardLimits' | 'deploy' | 'dappStore' | 'notifications' | 'requestCard' | 'changePin' | 'deleteCard' | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Send / Receive Chain State
  const [selectedChain, setSelectedChain] = useState<NetworkOption>(NETWORKS[0]);

  // Card & Security State
  const [hasCard, setHasCard] = useState(true);
  const [cardPin, setCardPin] = useState('');
  const [confirmCardPin, setConfirmCardPin] = useState('');
  const [actualCardPin, setActualCardPin] = useState('1234');
  const [cvv, setCvv] = useState('***');
  const [isCvvVisible, setIsCvvVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Change PIN Flow State
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState('');

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
  const [deployStep, setDeployStep] = useState(0); 
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
    generateCvv: true,
  });
  
  const securityScore = useMemo(() => {
    let score = 50; 
    if (!isLocked) score += 10;
    if (securitySettings.viewCardDetails) score += 10;
    if (securitySettings.initiateSwap) score += 10;
    if (securitySettings.changeLimits) score += 10;
    if (securitySettings.sendCrypto) score += 5;
    if (securitySettings.buyCrypto) score += 5;
    if (profile.handle.endsWith('.fluid')) score += 10; 
    return Math.min(score, 100);
  }, [securitySettings, isLocked, profile.handle]);

  // Auth Simulation
  const [verifyingAction, setVerifyingAction] = useState<string | null>(null);

  const handleSecureAction = (actionType: keyof typeof securitySettings | 'generic', callback: () => void) => {
    const shouldVerify = actionType === 'generic' ? true : securitySettings[actionType];
    
    if (shouldVerify) {
      setVerifyingAction(typeof actionType === 'string' ? actionType : 'Verify');
      setTimeout(() => {
        setVerifyingAction(null);
        callback();
      }, 1500);
    } else {
      callback();
    }
  };

  const handleGenerateCvv = () => {
    handleSecureAction('generateCvv', () => {
        // Generate random 3 digit number
        const randomCvv = Math.floor(100 + Math.random() * 900).toString();
        setCvv(randomCvv);
        setIsCvvVisible(true);
        // Hide after 30 seconds
        setTimeout(() => {
            setIsCvvVisible(false);
            setCvv('***');
        }, 30000);
    });
  };

  const handleCreateCard = () => {
    if (cardPin.length !== 4 || cardPin !== confirmCardPin) return;
    setActualCardPin(cardPin);
    setHasCard(true);
    setActiveModal(null);
    setCardPin('');
    setConfirmCardPin('');
  };

  const handleChangePin = () => {
    if (oldPinInput !== actualCardPin) {
      alert("Incorrect current PIN.");
      return;
    }
    if (newPinInput.length !== 4 || newPinInput !== confirmNewPinInput) {
      alert("New PINs do not match or are invalid length.");
      return;
    }
    setActualCardPin(newPinInput);
    setActiveModal(null);
    setOldPinInput('');
    setNewPinInput('');
    setConfirmNewPinInput('');
    alert("PIN Updated Successfully");
  };

  const handleDeleteCard = () => {
    setHasCard(false);
    setCardMode('virtual'); // Reset to virtual default
    setCardFrozen(false);
    setActiveModal(null);
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

  // Prepare DApps with Actions
  const DAPPS_WITH_ACTIONS: DApp[] = DAPPS.map(app => {
    if (app.id === '3') { // SecureChat ID
        return { ...app, action: () => { setActiveModal(null); setActiveApp('chat'); } };
    }
    return app;
  });
  
  // Navigation
  const tabs = [
    { id: 'assets', label: 'Wallet', icon: WalletIcon },
    { id: 'dex', label: 'DEX', icon: RefreshCw },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'fiat', label: 'Fiat', icon: Landmark },
    { id: 'hosting', label: 'Fluid Host', icon: Server },
  ];

  const unreadNotifications = NOTIFICATIONS.filter(n => !n.read).length;

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
          <div className="w-full max-w-[420px] h-[850px] bg-[#020617] rounded-[3.5rem] border-[8px] border-[#1e232f] relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col mx-auto transition-colors duration-500">
          
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

          {/* App Header (Glass) - Hide if Active App is Full Screen */}
          {!activeApp && (
            <header className="px-6 pt-16 pb-4 flex justify-between items-center z-40 bg-slate-950/50 backdrop-blur-md border-b border-white/5 relative">
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
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${showNotifications ? 'bg-slate-800 text-white border-white/30' : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}
                        >
                            <Bell size={18} />
                            {unreadNotifications > 0 && <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border border-slate-900"></span>}
                        </button>
                        
                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 origin-top-right">
                                <div className="px-3 py-2 border-b border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Notifications</span>
                                    <button className="text-[9px] text-indigo-400 font-bold hover:text-white">Clear All</button>
                                </div>
                                <div className="max-h-48 overflow-y-auto no-scrollbar py-1">
                                    {NOTIFICATIONS.map(n => (
                                        <div key={n.id} className="p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{n.title}</span>
                                                <span className="text-[9px] text-slate-600">{n.time}</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 leading-tight">{n.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>
          )}

          {/* Main Scrollable Content */}
          <div className={`flex-grow overflow-y-auto no-scrollbar relative bg-[#020617] scroll-smooth ${activeApp ? 'pt-10' : ''}`}>
             {!activeApp && <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>}

             {/* === MODULE: SECURE CHAT (SUPER APP) === */}
             {activeApp === 'chat' ? (
                <SecureChatApp onBack={() => setActiveApp(null)} />
             ) : (
             <>
             {/* === MODULE A: DASHBOARD === */}
             {activeTab === 'assets' && (
               <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Portfolio Card */}
                  <div className="relative">
                     <div className="text-center mb-6">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1 block">Total Balance</span>
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
                   {!hasCard ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full flex items-center justify-center border border-indigo-500/20 mb-4 animate-pulse">
                                <CreditCard size={48} className="text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">No Active Card</h2>
                                <p className="text-slate-400 text-sm mt-2 max-w-[200px] mx-auto">Get a virtual card instantly to spend your crypto anywhere.</p>
                            </div>
                            <button 
                                onClick={() => setActiveModal('requestCard')}
                                className="px-8 py-4 bg-white text-slate-900 font-black rounded-xl uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                            >
                                <Lock size={16} /> Request Card
                            </button>
                        </div>
                   ) : (
                   <>
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

                         {/* Watermark Logo */}
                         <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                            <FluidLogo className="w-64 h-64 text-white" />
                         </div>

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
                                     <div className="flex items-center gap-4">
                                        <span className="font-mono text-lg text-white tracking-widest">4920 1928 4492 1029</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400 font-bold">CVV</span>
                                            {isCvvVisible ? (
                                                <span className="font-mono text-white font-bold">{cvv}</span>
                                            ) : (
                                                <button onClick={(e) => { e.stopPropagation(); handleGenerateCvv(); }} className="px-1.5 py-0.5 bg-white/10 rounded text-[9px] text-white hover:bg-white/20">Show</button>
                                            )}
                                        </div>
                                     </div>
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
                      <div className="grid grid-cols-4 gap-2">
                         <button 
                           onClick={handleGenerateCvv}
                           className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors group"
                         >
                            <RotateCw size={20} className="text-slate-400 group-hover:text-white transition-colors group-active:rotate-180 duration-500" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase group-hover:text-white transition-colors">CVV</span>
                         </button>
                         <button 
                           onClick={() => handleSecureAction('changeLimits', () => {
                              setTempCardLimits(cardLimits);
                              setActiveModal('cardLimits');
                           })}
                           className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors group"
                         >
                            <Settings size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase group-hover:text-white transition-colors">Limits</span>
                         </button>
                         <button 
                            onClick={() => setActiveModal('changePin')}
                            className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-colors group"
                         >
                            <Lock size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase group-hover:text-white transition-colors">Pin</span>
                         </button>
                         <button 
                            onClick={() => setActiveModal('deleteCard')}
                            className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/5 transition-colors group"
                         >
                            <Trash2 size={20} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
                            <span className="text-[9px] font-bold text-slate-500 group-hover:text-rose-500 uppercase transition-colors">Delete</span>
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
                   </>
                   )}
                </div>
             )}

             {/* === MODULE F: FIAT === */}
             {activeTab === 'fiat' && (
                <div className="p-6 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
                   <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight">Fiat Gateway</h2>
                      <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                         <Landmark size={10} /> Multi-Currency
                      </div>
                   </div>

                   <div className="space-y-4">
                      {FIAT_ACCOUNTS.map((account, idx) => (
                         <div key={account.currency} className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-5 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                            {/* Background Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] group-hover:bg-indigo-500/10 transition-colors pointer-events-none"></div>
                            
                            <div className="flex justify-between items-start mb-4 relative z-10">
                               <div className="flex items-center gap-3">
                                  <div className="text-2xl">{account.flag}</div>
                                  <div>
                                     <div className="text-sm font-black text-white">{account.currency} Account</div>
                                     <div className="text-[10px] text-slate-500 font-bold">{account.bank} • {account.type}</div>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <div className="text-lg font-black text-white">{account.symbol}{account.balance}</div>
                                  <div className="text-[9px] font-bold text-emerald-500 flex items-center justify-end gap-1"><CheckCircle2 size={10}/> Active</div>
                               </div>
                            </div>

                            <div className="bg-black/20 rounded-xl p-3 border border-white/5 relative z-10">
                               <div className="flex justify-between items-center">
                                  <div className="flex flex-col">
                                     <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1">Account Details</span>
                                     {showAccountDetails && activeFiatIndex === idx ? (
                                        <div className="text-xs font-mono text-white tracking-wide">
                                           <div className="flex justify-between w-full gap-4">
                                              <span>R: {account.details.route}</span>
                                              <span>A: {account.details.acct}</span>
                                           </div>
                                        </div>
                                     ) : (
                                        <div className="flex gap-2">
                                           <div className="h-4 w-12 bg-slate-800 rounded animate-pulse"></div>
                                           <div className="h-4 w-20 bg-slate-800 rounded animate-pulse"></div>
                                        </div>
                                     )}
                                  </div>
                                  <button 
                                    onClick={() => {
                                       if (showAccountDetails && activeFiatIndex === idx) {
                                          setShowAccountDetails(false);
                                       } else {
                                          setActiveFiatIndex(idx);
                                          handleSecureAction('viewCardDetails', () => setShowAccountDetails(true));
                                       }
                                    }}
                                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                  >
                                     {showAccountDetails && activeFiatIndex === idx ? <EyeOff size={14} /> : <Eye size={14} />}
                                  </button>
                               </div>
                            </div>

                            <div className="flex gap-2 mt-4 relative z-10">
                               <button className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white border border-white/5 transition-colors flex items-center justify-center gap-2">
                                  <ArrowDownLeft size={12} className="text-emerald-500" /> Deposit
                               </button>
                               <button className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white border border-white/5 transition-colors flex items-center justify-center gap-2">
                                  <ArrowUpRight size={12} className="text-rose-500" /> Withdraw
                               </button>
                            </div>
                         </div>
                      ))}
                   </div>

                   <div className="mt-6 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-4">
                      <div className="p-2 bg-indigo-500 rounded-xl text-white shadow-lg"><Globe size={18}/></div>
                      <div>
                         <h4 className="text-xs font-bold text-white mb-0.5">Global Transfers</h4>
                         <p className="text-[10px] text-indigo-200/70">Send fiat internationally with low fees using Fluid Bridge.</p>
                      </div>
                      <button className="ml-auto px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold rounded-lg uppercase tracking-wider transition-colors">Start</button>
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

                   {/* Node Status Card - Modernized */}
                   <div className="bg-gradient-to-br from-[#0B0F19] to-[#02040A] border border-blue-500/10 rounded-[2rem] p-6 mb-6 relative overflow-hidden shadow-2xl group">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/10 transition-colors duration-700 pointer-events-none"></div>
                       <div className="absolute bottom-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
                       
                       <div className="flex justify-between items-start mb-6 relative z-10">
                           <div>
                               <div className="flex items-center gap-2 mb-2">
                                 <span className="relative flex h-2 w-2">
                                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                   <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                 </span>
                                 <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">System Online</span>
                               </div>
                               <h3 className="text-3xl font-black text-white tracking-tighter mb-1">Validator Node</h3>
                               <p className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                                 <Activity size={10} className="text-blue-500" /> 
                                 Latency: 12ms
                               </p>
                           </div>
                           <div className="w-12 h-12 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-center text-blue-500 shadow-lg backdrop-blur-sm">
                              <Server size={24} />
                           </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3 relative z-10">
                           <div className="p-3 bg-slate-900/40 rounded-xl border border-white/5 backdrop-blur-md hover:border-blue-500/20 transition-colors">
                               <div className="flex justify-between items-center mb-3">
                                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Storage</span>
                                  <Database size={12} className="text-slate-500"/>
                               </div>
                               <div className="flex items-baseline gap-1">
                                  <span className="text-lg font-black text-white">45.2</span>
                                  <span className="text-[10px] font-bold text-slate-500">GB</span>
                               </div>
                               <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                   <div className="w-[15%] h-full bg-blue-500 rounded-full"></div>
                               </div>
                           </div>
                           <div className="p-3 bg-slate-900/40 rounded-xl border border-white/5 backdrop-blur-md hover:border-blue-500/20 transition-colors">
                               <div className="flex justify-between items-center mb-3">
                                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Bandwidth</span>
                                  <Zap size={12} className="text-slate-500"/>
                               </div>
                               <div className="flex items-baseline gap-1">
                                  <span className="text-lg font-black text-white">1.2</span>
                                  <span className="text-[10px] font-bold text-slate-500">TB</span>
                               </div>
                               <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                                   <div className="w-[42%] h-full bg-emerald-500 rounded-full"></div>
                               </div>
                           </div>
                       </div>
                   </div>

                   {/* Domains Section - Enhanced */}
                   <div className="mb-8">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Globe size={12} /> Your Domains
                         </h3>
                         <button 
                           onClick={() => setActiveModal('domainRegistrar')}
                           className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider hover:text-white transition-colors flex items-center gap-1 group"
                         >
                            <span className="w-4 h-4 rounded bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500/50 text-xs">+</span> Register
                         </button>
                      </div>
                      
                      <div className="relative group overflow-hidden rounded-2xl cursor-pointer border border-white/5 hover:border-indigo-500/30 transition-all bg-slate-900/30">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative p-4 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-indigo-400 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                      <AtSign size={18} />
                                  </div>
                                  <div>
                                      <div className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                                        alex.fluid 
                                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-bold uppercase tracking-wider border border-emerald-500/10">Active</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 mt-1">
                                         <Lock size={10} className="text-slate-500" />
                                         <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">Permanent Lease</span>
                                      </div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Expires</div>
                                    <div className="text-xs font-black text-white">Never</div>
                                </div>
                                <ChevronRight size={16} className="text-slate-600 group-hover:text-white transition-colors" />
                              </div>
                          </div>
                      </div>
                   </div>

                   {/* Deployed dApps - Enhanced */}
                   <div className="mb-8">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Rocket size={12} /> Deployments
                      </h3>
                      <div className="space-y-3">
                          {myDeployments.map((deploy) => (
                            <div key={deploy.id} className="group relative p-3 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-all cursor-default overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-1 bg-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center justify-between mb-3 pl-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white border border-white/5 shadow-inner">
                                            <Layout size={18} className="text-slate-300 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                              {deploy.name}
                                              <span className={`w-1.5 h-1.5 rounded-full ${deploy.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`}></span>
                                            </div>
                                            <div className="flex items-center gap-1 mt-0.5">
                                               <span className="text-[9px] text-slate-500 font-mono truncate max-w-[100px]">{deploy.url}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <a href={deploy.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                          <ExternalLink size={14} />
                                      </a>
                                      <button className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                          <Settings size={14} />
                                      </button>
                                    </div>
                                </div>
                                <div className="pl-[54px] pr-2">
                                   <div className="p-1.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[9px] text-slate-500 flex items-center justify-between group-hover:border-white/10 transition-colors">
                                      <span className="truncate">{deploy.hash}</span>
                                      <Copy size={10} className="hover:text-white cursor-pointer shrink-0 ml-2" />
                                   </div>
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
                            className="w-full py-4 rounded-2xl border border-dashed border-slate-700 hover:border-blue-500/50 text-slate-500 hover:text-blue-400 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 group"
                          >
                               <div className="w-6 h-6 rounded-lg bg-slate-800 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors"><UploadCloud size={14} /></div>
                               Deploy New Project
                          </button>
                      </div>
                   </div>

                   {/* dApp Browser - Enhanced Grid */}
                   <div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <LayoutGrid size={12} /> App Store
                      </h3>
                      <div className="grid grid-cols-4 gap-3">
                          {DAPPS_WITH_ACTIONS.map(app => (
                              <button 
                                key={app.id} 
                                onClick={app.action ? app.action : () => {
                                    if (app.id === '6') {
                                        setActiveModal('domainRegistrar');
                                    } else {
                                        setActiveModal('dappStore');
                                    }
                                }}
                                className="flex flex-col items-center gap-2 group relative"
                              >
                                  <div className="w-14 h-14 bg-slate-900 rounded-[18px] flex items-center justify-center text-white border border-white/10 shadow-lg group-hover:scale-105 group-hover:border-blue-500/50 transition-all relative overflow-hidden group-hover:shadow-blue-500/20">
                                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                      <app.icon size={24} className="text-slate-300 group-hover:text-white transition-colors" />
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-500 group-hover:text-white line-clamp-1 transition-colors">{app.name}</span>
                              </button>
                          ))}
                          <button 
                            onClick={() => setActiveModal('dappStore')}
                            className="flex flex-col items-center gap-2 group"
                          >
                              <div className="w-14 h-14 rounded-[18px] border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-white group-hover:border-white/30 group-hover:bg-white/5 transition-all">
                                  <Search size={20} />
                              </div>
                              <span className="text-[9px] font-bold text-slate-600 group-hover:text-white transition-colors">Browse</span>
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
             </>
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
                       {activeModal === 'requestCard' && 'Request Card'}
                       {activeModal === 'changePin' && 'Change PIN'}
                       {activeModal === 'deleteCard' && 'Destroy Card'}
                     </h3>
                     <button onClick={() => { setActiveModal(null); setDomainSearchStatus('idle'); setDomainQuery(''); }} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                        <X size={16} />
                     </button>
                  </div>

                  {activeModal === 'send' && (
                     <div className="space-y-4 flex-grow">
                        {/* Network Selection */}
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Select Network</label>
                           <div className="grid grid-cols-5 gap-2 mb-2">
                              {NETWORKS.map((net) => (
                                 <button 
                                    key={net.id}
                                    onClick={() => setSelectedChain(net)}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${selectedChain.id === net.id ? 'bg-slate-800 border-white/20' : 'bg-transparent border-transparent hover:bg-slate-800/50'}`}
                                 >
                                    <img src={net.icon} alt={net.short} className="w-6 h-6 rounded-full mb-1" />
                                    <span className={`text-[8px] font-bold ${selectedChain.id === net.id ? 'text-white' : 'text-slate-500'}`}>{net.short}</span>
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Recipient Address</label>
                           <div className="flex items-center bg-black/20 rounded-xl border border-white/10 p-3">
                              <input type="text" placeholder={`0x... (${selectedChain.name})`} className="bg-transparent w-full text-sm text-white outline-none font-mono" />
                              <ScanFace size={16} className="text-slate-500" />
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Amount</label>
                           <div className="flex items-center justify-between bg-black/20 rounded-xl border border-white/10 p-3">
                              <input type="number" placeholder="0.0" className="bg-transparent w-full text-xl font-black text-white outline-none" />
                              <button className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-xs font-bold text-white">
                                 {selectedChain.short} <ChevronDown size={10} />
                              </button>
                           </div>
                           <div className="text-right mt-1 text-[10px] text-slate-500 font-bold">Balance: 12.45 {selectedChain.short}</div>
                        </div>
                        <button 
                          onClick={() => handleSecureAction('sendCrypto', () => alert("Transaction Sent"))}
                          className={`w-full py-4 mt-auto text-white font-black rounded-xl uppercase tracking-widest transition-colors shadow-lg ${selectedChain.color}`}
                        >
                          Confirm Send
                        </button>
                     </div>
                  )}

                  {activeModal === 'receive' && (
                     <div className="space-y-6 flex-col flex items-center flex-grow justify-center">
                        {/* Network Selection for Receive */}
                        <div className="w-full">
                           <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block text-center">Select Network</label>
                           <div className="flex justify-center gap-3">
                              {NETWORKS.map((net) => (
                                 <button 
                                    key={net.id}
                                    onClick={() => setSelectedChain(net)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedChain.id === net.id ? 'bg-slate-800 ring-2 ring-offset-2 ring-offset-slate-900 ring-white/20' : 'bg-slate-900 opacity-50'}`}
                                 >
                                    <img src={net.icon} alt={net.short} className="w-6 h-6 rounded-full" />
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div className={`p-1 bg-gradient-to-br rounded-[1.5rem] ${selectedChain.id === 'btc' ? 'from-orange-500 to-yellow-500' : selectedChain.id === 'sol' ? 'from-purple-500 to-cyan-500' : 'from-indigo-500 to-blue-500'}`}>
                           <div className="bg-white p-4 rounded-[1.3rem] relative">
                              <QrCode size={160} className="text-slate-900" />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                 <img src={selectedChain.icon} className="w-10 h-10 rounded-full bg-white p-1 shadow-lg" />
                              </div>
                           </div>
                        </div>
                        <div className="w-full">
                           <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block text-center">Your {selectedChain.name} Address</label>
                           <button className="w-full flex items-center justify-between bg-black/20 rounded-xl border border-white/10 p-3 group hover:border-white/20 transition-colors">
                              <span className="text-xs text-slate-300 font-mono truncate mr-2">
                                 {selectedChain.id === 'btc' ? 'bc1q...8z92' : selectedChain.id === 'sol' ? 'An...3k9z' : '0x71C...92aF'}
                              </span>
                              <Copy size={14} className="text-slate-500 group-hover:text-white" />
                           </button>
                           {selectedChain.id !== 'eth' && selectedChain.id !== 'bsc' && selectedChain.id !== 'poly' && (
                              <p className="text-[9px] text-rose-500 text-center mt-2 font-bold">Only send {selectedChain.name} assets to this address.</p>
                           )}
                        </div>
                        <div className="flex gap-2 w-full">
                           <button className="flex-1 py-3 bg-slate-800 rounded-xl text-xs font-bold text-white">Share</button>
                           <button className="flex-1 py-3 bg-slate-800 rounded-xl text-xs font-bold text-white">Save Image</button>
                        </div>
                     </div>
                  )}

                  {activeModal === 'requestCard' && (
                    <div className="space-y-6 flex-grow flex flex-col">
                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-3">
                            <ShieldCheck size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-indigo-200/80 leading-relaxed">
                                Set a secure 4-digit PIN for your new virtual card. This PIN will be required for transactions.
                            </p>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Set New PIN</label>
                            <div className="flex items-center bg-black/20 rounded-xl border border-white/10 p-3">
                                <input 
                                    type="password" 
                                    maxLength={4}
                                    placeholder="****" 
                                    value={cardPin}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        setCardPin(val);
                                    }}
                                    className="bg-transparent w-full text-center text-2xl font-black text-white outline-none tracking-[1em]" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Confirm PIN</label>
                            <div className="flex items-center bg-black/20 rounded-xl border border-white/10 p-3">
                                <input 
                                    type="password" 
                                    maxLength={4}
                                    placeholder="****" 
                                    value={confirmCardPin}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        setConfirmCardPin(val);
                                    }}
                                    className="bg-transparent w-full text-center text-2xl font-black text-white outline-none tracking-[1em]" 
                                />
                            </div>
                        </div>

                        <button 
                            disabled={cardPin.length !== 4 || cardPin !== confirmCardPin}
                            onClick={handleCreateCard}
                            className="w-full py-4 mt-auto bg-white text-slate-900 font-black rounded-xl uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Create Virtual Card
                        </button>
                    </div>
                  )}

                  {activeModal === 'changePin' && (
                    <div className="space-y-6 flex-grow flex flex-col">
                        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-3">
                            <Lock size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-indigo-200/80 leading-relaxed">
                                Enter your current PIN to authenticate changes.
                            </p>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Current PIN</label>
                            <div className="flex items-center bg-black/20 rounded-xl border border-white/10 p-3">
                                <input 
                                    type="password" 
                                    maxLength={4}
                                    placeholder="****" 
                                    value={oldPinInput}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        setOldPinInput(val);
                                    }}
                                    className="bg-transparent w-full text-center text-2xl font-black text-white outline-none tracking-[1em]" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">New PIN</label>
                            <div className="flex items-center bg-black/20 rounded-xl border border-white/10 p-3">
                                <input 
                                    type="password" 
                                    maxLength={4}
                                    placeholder="****" 
                                    value={newPinInput}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        setNewPinInput(val);
                                    }}
                                    className="bg-transparent w-full text-center text-2xl font-black text-white outline-none tracking-[1em]" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Confirm New PIN</label>
                            <div className="flex items-center bg-black/20 rounded-xl border border-white/10 p-3">
                                <input 
                                    type="password" 
                                    maxLength={4}
                                    placeholder="****" 
                                    value={confirmNewPinInput}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        setConfirmNewPinInput(val);
                                    }}
                                    className="bg-transparent w-full text-center text-2xl font-black text-white outline-none tracking-[1em]" 
                                />
                            </div>
                        </div>

                        <button 
                            disabled={oldPinInput.length !== 4 || newPinInput.length !== 4 || newPinInput !== confirmNewPinInput}
                            onClick={handleChangePin}
                            className="w-full py-4 mt-auto bg-white text-slate-900 font-black rounded-xl uppercase tracking-widest hover:bg-slate-200 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Update PIN
                        </button>
                    </div>
                  )}

                  {activeModal === 'deleteCard' && (
                    <div className="space-y-6 flex-grow flex flex-col justify-center text-center">
                        <div className="w-24 h-24 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                            <Trash2 size={48} className="text-rose-500" />
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Danger Zone</h3>
                            <p className="text-slate-400 text-sm">
                                Are you sure you want to permanently delete your virtual card? This action cannot be undone.
                            </p>
                        </div>

                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-left flex gap-3">
                            <AlertTriangle size={20} className="text-rose-500 shrink-0" />
                            <span className="text-[10px] font-bold text-rose-300">Any active subscriptions linked to this card will fail. Funds remain in your wallet.</span>
                        </div>

                        <div className="mt-auto space-y-3">
                            <button 
                                onClick={handleDeleteCard}
                                className="w-full py-4 bg-rose-600 text-white font-black rounded-xl uppercase tracking-widest hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/20"
                            >
                                Confirm Deletion
                            </button>
                            <button 
                                onClick={() => setActiveModal(null)}
                                className="w-full py-4 bg-slate-800 text-slate-300 font-black rounded-xl uppercase tracking-widest hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
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

                  {/* Buy Modal */}
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

               </div>
            </div>
          )}

          {/* Bottom Navigation */}
          {!activeApp && (
            <nav className="px-6 py-4 bg-slate-900/90 backdrop-blur-xl border-t border-white/5 absolute bottom-0 w-full z-40">
                <div className="flex justify-between items-center">
                    {tabs.map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === tab.id ? 'text-white scale-110' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                        <span className="text-[9px] font-bold tracking-wide">{tab.label}</span>
                    </button>
                    ))}
                </div>
            </nav>
          )}
          
          {/* Home Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50"></div>
          </div>
       )}

       {/* Interactive Features Guide */}
       {!isLocked && (
         <div className="mt-16 max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-6 text-center md:text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 transition-all hover:-translate-y-1 group">
               <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  <Fingerprint size={24} />
               </div>
               <h3 className="text-sm font-bold text-white mb-2">Smart Auth</h3>
               <p className="text-xs text-slate-500 leading-relaxed font-medium">Experience biometric security. Toggle "Biometric Triggers" in Settings to protect sensitive actions.</p>
            </div>
            
            <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition-all hover:-translate-y-1 group">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  <CreditCard size={24} />
               </div>
               <h3 className="text-sm font-bold text-white mb-2">Instant Issuance</h3>
               <p className="text-xs text-slate-500 leading-relaxed font-medium">Request a virtual card, set your PIN, and generate dynamic CVV codes for secure spending.</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all hover:-translate-y-1 group">
               <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  <Globe size={24} />
               </div>
               <h3 className="text-sm font-bold text-white mb-2">Fiat Gateway</h3>
               <p className="text-xs text-slate-500 leading-relaxed font-medium">Manage multi-currency accounts (USD, EUR, GBP). Tap "Reveal" to see banking details.</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 transition-all hover:-translate-y-1 group">
               <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
               </div>
               <h3 className="text-sm font-bold text-white mb-2">Secure Chat</h3>
               <p className="text-xs text-slate-500 leading-relaxed font-medium">Launch the SecureChat app to send encrypted messages and assets to other wallets.</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-orange-500/30 transition-all hover:-translate-y-1 group">
               <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  <Server size={24} />
               </div>
               <h3 className="text-sm font-bold text-white mb-2">Fluid Host</h3>
               <p className="text-xs text-slate-500 leading-relaxed font-medium">Deploy real websites to the permanent web using the simulated Fluid CLI terminal.</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-pink-500/30 transition-all hover:-translate-y-1 group">
               <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 mb-4 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  <AtSign size={24} />
               </div>
               <h3 className="text-sm font-bold text-white mb-2">Domain Registrar</h3>
               <p className="text-xs text-slate-500 leading-relaxed font-medium">Search and register .fluid handles or traditional domains directly within the app.</p>
            </div>
         </div>
       )}
    </div>
  );
};

export default FluidWalletApp;