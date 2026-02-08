
import React, { useState, useEffect } from 'react';
import { Menu, X, Activity, ShieldCheck, Lock } from 'lucide-react';
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client, wallets } from "../client";
import {
  ethereum, polygon, bsc, arbitrum, optimism, base, avalanche, linea, scroll
} from "thirdweb/chains";

const ALL_CHAINS = [ethereum, polygon, bsc, arbitrum, optimism, base, avalanche, linea, scroll];

interface HeaderProps { onNavigate: (page: string) => void; currentPage: string; }

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const account = useActiveAccount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Vault', id: 'wallet' },
    { label: 'Roadmap', id: 'roadmap' },
    { label: 'Blockchain', id: 'blockchain' },
    { label: 'Genesis', id: 'home' },
  ];

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 py-4 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center cursor-pointer group" onClick={() => handleLinkClick('home')}>
             <div className="w-8 h-8 text-fluid-cyan mr-2 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 100 100" fill="currentColor"><path d="M55 20 H90 A5 5 0 0 1 90 35 H55 A5 5 0 0 1 55 20 Z" transform="skewX(-20)" /><path d="M40 42 H85 A5 5 0 0 1 85 57 H40 A5 5 0 0 1 40 42 Z" transform="skewX(-20)" /><path d="M25 64 H60 A5 5 0 0 1 60 79 H25 A5 5 0 0 1 25 64 Z" transform="skewX(-20)" /></svg>
             </div>
             <div className="flex flex-col">
                <span className="font-nebula font-black text-lg tracking-tighter text-white uppercase leading-none">Fluid</span>
                <span className="text-[7px] font-nebula font-black uppercase tracking-[0.2em] leading-none mt-1 text-fluid-gradient">Genesis</span>
             </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(item => (
              <button key={item.id} onClick={() => handleLinkClick(item.id)} className={`px-4 py-2 text-[10px] font-nebula font-black transition-all uppercase tracking-[0.2em] rounded-lg ${currentPage === item.id ? 'text-fluid-cyan bg-white/5' : 'text-white/60 hover:text-white'}`}>
                {item.label}
              </button>
            ))}
            <button onClick={() => handleLinkClick('admin')} className={`px-4 py-2 text-[10px] font-nebula font-black transition-all uppercase tracking-[0.2em] rounded-lg flex items-center gap-2 ${currentPage === 'admin' ? 'text-amber-400 bg-amber-500/5' : 'text-slate-500 hover:text-amber-400'}`}>
                <Lock size={10} /> Admin
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <Activity size={10} className="text-emerald-500 animate-pulse" />
                <span className="text-[8px] font-nebula font-black text-slate-400 uppercase tracking-widest">Syncing</span>
            </div>
            <div className="hidden md:block">
              <ConnectButton client={client} wallets={wallets} theme="dark" chains={ALL_CHAINS} connectButton={{ label: "Connect", className: "!py-2.5 !px-6 !rounded-full !text-[10px] !font-nebula !font-black !bg-white !text-slate-950 hover:!scale-105 !transition-all !uppercase !tracking-[0.2em]" }} />
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 bg-slate-900 border border-white/10 rounded-xl text-white">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950 border-b border-white/10 p-4 animate-fade-in-up shadow-2xl backdrop-blur-3xl">
           <div className="flex flex-col space-y-1">
              {navItems.map(item => (
                <button key={item.id} onClick={() => handleLinkClick(item.id)} className="text-left text-xs font-nebula font-black text-white/60 p-3 rounded-xl hover:bg-white/5 hover:text-fluid-cyan transition-all uppercase tracking-[0.2em]">{item.label}</button>
              ))}
              <button onClick={() => handleLinkClick('admin')} className="text-left text-xs font-nebula font-black text-amber-500/60 p-3 rounded-xl hover:bg-white/5 hover:text-amber-400 transition-all uppercase tracking-[0.2em] flex items-center gap-2"><Lock size={12} /> Genesis Control</button>
              <div className="pt-4 border-t border-white/10"><ConnectButton client={client} wallets={wallets} theme="dark" chains={ALL_CHAINS} connectButton={{ className: "!w-full !py-4 !rounded-xl !text-xs !font-nebula !font-black !bg-white !text-black !uppercase", label: "Connect Vault" }} /></div>
           </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
