
import React from 'react';
import { ArrowRight, Shield, Globe, Zap, CreditCard, LayoutDashboard, Coins } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-20">
      
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 mb-8 backdrop-blur-sm animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Protocol V2 Live</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
            The Future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-emerald-400">Decentralized Finance</span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Fluid is the all-in-one non-custodial ecosystem. Manage assets, host permanent websites, and spend crypto globally with zero friction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
            <button 
              onClick={() => onNavigate('buy')}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              Join Presale <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => onNavigate('wallet')}
              className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Launch Wallet
            </button>
          </div>
        </div>
      </section>

      {/* Ecosystem Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-black text-center mb-16 text-slate-900 dark:text-white">Integrated Ecosystem</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Wallet */}
          <div onClick={() => onNavigate('wallet')} className="group p-8 rounded-[2.5rem] bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <LayoutDashboard size={100} />
            </div>
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
              <LayoutDashboard size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Super Wallet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Non-custodial, multichain wallet with built-in privacy and biometrics.</p>
            <span className="text-blue-500 font-bold flex items-center gap-2 text-sm group-hover:gap-3 transition-all">Try Wallet <ArrowRight size={16} /></span>
          </div>

          {/* Card 2: Host */}
          <div onClick={() => onNavigate('host')} className="group p-8 rounded-[2.5rem] bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe size={100} />
            </div>
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500">
              <Globe size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Fluid Host</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Deploy permanent, censorship-resistant websites on the blockchain.</p>
            <span className="text-purple-500 font-bold flex items-center gap-2 text-sm group-hover:gap-3 transition-all">Start Hosting <ArrowRight size={16} /></span>
          </div>

          {/* Card 3: Cards */}
          <div onClick={() => onNavigate('cards')} className="group p-8 rounded-[2.5rem] bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <CreditCard size={100} />
            </div>
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
              <CreditCard size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Crypto Cards</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Spend your crypto instantly worldwide with virtual and physical cards.</p>
            <span className="text-emerald-500 font-bold flex items-center gap-2 text-sm group-hover:gap-3 transition-all">Order Card <ArrowRight size={16} /></span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-black text-white mb-2">2M+</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Transactions</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-2">&lt;1s</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Finality</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-2">$0</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Gas (Sponsored)</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-2">100%</div>
            <div className="text-slate-500 text-sm font-bold uppercase tracking-wider">Uptime</div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="max-w-7xl mx-auto px-4 py-32">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-8">Security without Compromise</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Non-Custodial Architecture</h3>
                  <p className="text-slate-600 dark:text-slate-400">Your keys never leave your device. You are the only one with access to your funds.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Lightning Fast</h3>
                  <p className="text-slate-600 dark:text-slate-400">Powered by our Layer-1 sharding technology for instant transaction confirmation.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                  <Coins size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Low Fees</h3>
                  <p className="text-slate-600 dark:text-slate-400">Transactions cost fractions of a cent, making Fluid ideal for everyday payments.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[3rem] blur-3xl opacity-20"></div>
            <img 
              src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop" 
              alt="Security" 
              className="relative rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800"
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
