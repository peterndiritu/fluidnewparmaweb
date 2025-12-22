
import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, ChevronDown, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "../client";

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="currentColor" />
    <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="currentColor" />
    <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 83.3137 82 60 82H10L15 66Z" fill="currentColor" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (page: string, id?: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
    if (page === 'home' && !id) {
       window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id) {
       setTimeout(() => {
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
       }, 100);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleMobileSubmenu = (menu: string) => {
    setMobileSubmenu(mobileSubmenu === menu ? null : menu);
  };

  const navStructure = [
    {
      label: 'Products',
      children: [
        { label: 'Fluid Blockchain', action: () => handleLinkClick('blockchain') },
        { label: 'Fluid Wallet App', action: () => handleLinkClick('wallet') },
        { label: 'Desktop Wallet', action: () => handleLinkClick('desktop') },
      ]
    },
    { 
      label: 'Protocol Economy', 
      action: () => handleLinkClick('economics') 
    },
    { 
      label: 'Fluid Token', 
      action: () => handleLinkClick('token') 
    },
    { 
      label: 'Hosting', 
      action: () => handleLinkClick('host') 
    },
    {
      label: 'Resources',
      children: [
        { label: 'About', action: () => handleLinkClick('about') },
        { label: 'Roadmap', action: () => handleLinkClick('roadmap') },
        { label: 'FAQs', action: () => handleLinkClick('faq') },
      ]
    },
    { label: 'Presale', action: () => handleLinkClick('buy') },
    { label: 'Docs', action: () => handleLinkClick('docs') },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 py-4 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`flex items-center justify-between h-16 rounded-2xl px-6 transition-all duration-300 ${
            isScrolled 
              ? 'bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border border-white/20 dark:border-slate-800/50 shadow-lg' 
              : 'bg-transparent border-transparent'
          }`}
        >
          
          {/* Logo Section - Left */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => handleLinkClick('home')}>
            <FluidLogo className="w-10 h-10 mr-2 transition-transform duration-300 group-hover:scale-110 text-slate-900 dark:text-white" />
            <span className="font-black text-xl tracking-tighter text-slate-900 dark:text-white transition-colors">
              FLUID
            </span>
          </div>

          {/* Right Section Container */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Navigation Links - Desktop Only */}
            <div className="hidden xl:flex items-center space-x-1">
              {navStructure.map((item, index) => (
                <div key={index} className="relative group">
                  {item.children ? (
                    <button className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 font-bold text-sm px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                      {item.label} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                  ) : (
                    <button 
                      onClick={item.action} 
                      className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 font-bold text-sm px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                    >
                      {item.label}
                    </button>
                  )}

                  {item.children && (
                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                      <div className="w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden p-2">
                        {item.children.map((child, cIndex) => (
                          <button
                            key={cIndex}
                            onClick={child.action}
                            className="block w-full text-left px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors font-medium"
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions (Theme & Connect) - Tablet/Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <ConnectButton 
                  client={client} 
                  wallets={wallets}
                  theme={theme}
                  appMetadata={{
                    name: "Fluid",
                    url: "https://fluid.chain",
                    description: "The all-in-one non-custodial ecosystem.",
                    logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
                  }}
              />
            </div>

            {/* Mobile/Tablet Menu Controls */}
            <div className="flex xl:hidden items-center gap-4">
              <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 md:hidden"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 absolute w-full left-0 top-20 shadow-2xl transition-colors max-h-[calc(100vh-80px)] overflow-y-auto rounded-b-3xl">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {navStructure.map((item, index) => (
              <div key={index}>
                {item.children ? (
                  <div>
                    <button 
                      onClick={() => toggleMobileSubmenu(item.label)}
                      className="w-full flex items-center justify-between text-left text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 px-4 py-3 rounded-xl text-base font-bold"
                    >
                      {item.label}
                      <ChevronDown size={16} className={`transition-transform duration-200 ${mobileSubmenu === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileSubmenu === item.label && (
                      <div className="pl-4 pr-2 space-y-1 mt-1 mb-2 border-l-2 border-slate-200 dark:border-slate-800 ml-4">
                        {item.children.map((child, cIndex) => (
                          <button
                            key={cIndex}
                            onClick={() => {
                              child.action();
                              setIsMenuOpen(false);
                            }}
                            className="w-full text-left block px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 font-medium"
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 block px-4 py-3 rounded-xl text-base font-bold"
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
