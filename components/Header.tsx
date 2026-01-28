import React, { useState, useEffect } from 'react';
import { Menu, X, Activity } from 'lucide-react';
import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "../client";

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const FLUID_LOGO_SVG = (
  <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <path d="M55 20 H90 A5 5 0 0 1 90 35 H55 A5 5 0 0 1 55 20 Z" transform="skewX(-20)" />
    <path d="M40 42 H85 A5 5 0 0 1 85 57 H40 A5 5 0 0 1 40 42 Z" transform="skewX(-20)" />
    <path d="M25 64 H60 A5 5 0 0 1 60 79 H25 A5 5 0 0 1 25 64 Z" transform="skewX(-20)" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (page: string, anchor?: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Economy', action: () => handleLinkClick('home', 'economy') },
    { label: 'Token', action: () => handleLinkClick('home', 'token') },
    { label: 'Vault', action: () => handleLinkClick('wallet') },
    { label: 'Hosting', action: () => handleLinkClick('home', 'hosting') },
    { label: 'Roadmap', action: () => handleLinkClick('roadmap') },
  ];

  return (
    <nav 
      className={`fixed w-full z-[100] transition-all duration-300 py-4 ${
        isScrolled ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group" onClick={() => handleLinkClick('home')}>
             <div className="w-8 h-8 text-cyan-400 mr-2 group-hover:scale-110 transition-transform">
                {FLUID_LOGO_SVG}
             </div>
             <div className="flex flex-col">
                <span className="font-nebula font-black text-lg tracking-tighter text-white uppercase leading-none">Fluid</span>
                <span className="text-[7px] font-nebula font-black uppercase tracking-[0.2em] leading-none mt-1 text-fluid-gradient">Genesis</span>
             </div>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(item => (
              <button 
                key={item.label} 
                onClick={item.action} 
                className="px-4 py-2 text-[10px] font-nebula font-black text-white/60 hover:text-white hover:text-cyan-400 transition-all uppercase tracking-[0.2em] rounded-lg"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Connect & Status */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <Activity size={10} className="text-emerald-500 animate-pulse" />
                <span className="text-[8px] font-nebula font-black text-slate-400 uppercase tracking-widest">Mainnet Live</span>
            </div>
            
            <div className="hidden md:block">
              <ConnectButton 
                client={client}
                wallets={wallets}
                theme="dark"
                connectButton={{
                  label: "Connect",
                  className: "!py-2.5 !px-6 !rounded-full !text-[10px] !font-nebula !font-black !bg-white !text-slate-950 hover:!bg-cyan-50 !transition-all !uppercase !tracking-[0.2em] !shadow-xl active:!scale-95"
                }}
              />
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-slate-900 border border-white/10 rounded-xl text-white">
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-slate-950 border-b border-white/10 p-4 animate-fade-in-up shadow-2xl backdrop-blur-3xl">
           <div className="flex flex-col space-y-1">
              {navItems.map(item => (
                <button 
                  key={item.label} 
                  onClick={item.action} 
                  className="text-left text-xs font-nebula font-black text-white/60 p-3 rounded-xl hover:bg-white/5 hover:text-cyan-400 transition-all uppercase tracking-[0.2em]"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10">
                 <ConnectButton 
                  client={client}
                  wallets={wallets}
                  theme="dark"
                  connectButton={{ 
                    className: "!w-full !py-4 !rounded-xl !text-xs !font-nebula !font-black !bg-white !text-black !uppercase !tracking-widest",
                    label: "Connect Vault" 
                  }}
                 />
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};

export default Header;