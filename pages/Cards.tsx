
import React, { useState } from 'react';
import { CreditCard, Globe, Lock, Sliders, Smartphone, Check, MapPin, Truck, ChevronRight, CheckCircle2 } from 'lucide-react';

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 20 H78 C83.5 20 88 24.5 88 30 C88 35.5 83.5 40 78 40 H38 L48 20 Z" fill="currentColor" />
    <path d="M35 45 H65 C70.5 45 75 49.5 75 55 C75 60.5 70.5 65 65 65 H25 L35 45 Z" fill="currentColor" />
    <path d="M22 70 H52 C57.5 70 62 74.5 62 80 C62 85.5 57.5 90 52 90 H12 L22 70 Z" fill="currentColor" />
  </svg>
);

const CARD_TIERS = [
  { id: 'black', name: 'Fluid Black', bg: 'bg-slate-950', border: 'border-slate-800', text: 'text-white', watermark: 'text-white/5' },
  { id: 'steel', name: 'Fluid Steel', bg: 'bg-slate-600', border: 'border-slate-500', text: 'text-white', watermark: 'text-white/10' },
  { id: 'silver', name: 'Fluid Silver', bg: 'bg-slate-300', border: 'border-slate-400', text: 'text-slate-900', watermark: 'text-slate-900/5' },
  { id: 'bronze', name: 'Fluid Bronze', bg: 'bg-amber-700', border: 'border-amber-600', text: 'text-white', watermark: 'text-white/10' },
  { id: 'platinum', name: 'Fluid Platinum', bg: 'bg-slate-400', border: 'border-slate-300', text: 'text-white', watermark: 'text-white/10' },
  { id: 'gold', name: 'Fluid Gold', bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-white', watermark: 'text-white/10' },
];

const CardsPage: React.FC = () => {
  const [cardType, setCardType] = useState<'virtual' | 'physical'>('virtual');
  const [selectedTier, setSelectedTier] = useState(CARD_TIERS[0]);
  const [orderStep, setOrderStep] = useState<'config' | 'shipping' | 'success'>('config');
  const [shipping, setShipping] = useState({ address: '', city: '', zip: '', country: '' });

  const handleOrder = () => {
    if (cardType === 'physical' && orderStep === 'config') {
      setOrderStep('shipping');
    } else {
      // Simulate API call
      setTimeout(() => setOrderStep('success'), 1000);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16">
      
      {/* Hero Section */}
      <section className="text-center mb-20 px-4">
        <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Fluid Cards</span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-4 mb-6 leading-tight">
           Spend Crypto like <br/> you Spend Fiat
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg mb-12">
           Experience the convenience of spending your crypto anywhere with Fluid Cards. Link your digital assets and enjoy fast, secure transactions without traditional banking bottlenecks.
        </p>

        {/* Dynamic Card Visual */}
        <div className="relative max-w-md mx-auto perspective-1000 group">
           {/* Glow */}
           <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
           
           {/* Card Object */}
           <div className={`relative aspect-[1.586/1] rounded-2xl ${selectedTier.bg} ${selectedTier.border} border shadow-2xl p-6 flex flex-col justify-between transform transition-all duration-500 group-hover:rotate-y-6 group-hover:rotate-x-6 overflow-hidden`}>
               
               {/* Decorative patterns */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
               <div className="absolute bottom-0 left-0 w-full h-32 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
               
               {/* Watermark Logo */}
               <div className={`absolute -bottom-8 -left-8 ${selectedTier.watermark} opacity-20 transform rotate-12`}>
                  <FluidLogo className="w-48 h-48" />
               </div>

               <div className={`flex justify-between items-start z-10 ${selectedTier.text}`}>
                  <div className="flex items-center gap-2">
                    <FluidLogo className="w-8 h-8 text-current" />
                    <span className="font-bold text-2xl tracking-tighter">Fluid</span>
                  </div>
                  {cardType === 'virtual' ? <Smartphone size={24} /> : <CreditCard size={24} />}
               </div>

               <div className={`z-10 ${selectedTier.text}`}>
                   <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-6 bg-amber-200/20 rounded border border-amber-200/40"></div>
                      <div className="opacity-50 text-xs font-mono">((( )))</div>
                   </div>
                   <div className="font-mono text-xl tracking-widest mb-2 text-shadow-sm">**** **** **** 4289</div>
                   <div className="flex justify-between items-end">
                      <div>
                         <span className="text-[10px] opacity-70 uppercase block">Card Holder</span>
                         <span className="text-sm font-bold">ALEXANDER FLUID</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${selectedTier.text === 'text-white' ? 'border-white/30' : 'border-black/30'}`}>
                        {selectedTier.name.replace('Fluid ', '')}
                      </span>
                   </div>
               </div>
           </div>
        </div>
      </section>

      {/* Main Feature Box */}
      <section className="max-w-4xl mx-auto px-4 mb-24">
         <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
                  <CreditCard size={32} />
               </div>
               <h2 className="text-3xl font-bold text-white mb-6">Multichain Fluid Payments</h2>
               <p className="text-slate-400 leading-relaxed max-w-2xl mb-8">
                  Use your native Fluid card to make instant payments across multiple blockchain networks. Whether you're spending Bitcoin, Ethereum, or stablecoins, Fluid ensures smooth transaction processing with automatic currency conversion and zero hidden fees.
               </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8 border-t border-slate-800 pt-8">
               <div className="flex gap-4 items-start">
                   <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 mt-1"><Globe size={20} /></div>
                   <div>
                      <h4 className="text-white font-bold mb-1">Global Access</h4>
                      <p className="text-sm text-slate-400">Accepted anywhere major merchant networks are supported worldwide, powered by Fluid settlement.</p>
                   </div>
               </div>
               <div className="flex gap-4 items-start">
                   <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500 mt-1"><Sliders size={20} /></div>
                   <div>
                      <h4 className="text-white font-bold mb-1">Total Control</h4>
                      <p className="text-sm text-slate-400">Set spending limits, approve transactions, and freeze card instantly from your non-custodial wallet.</p>
                   </div>
               </div>
            </div>
         </div>
      </section>
      
      {/* Design & Order Section */}
      <section id="order" className="max-w-3xl mx-auto px-4 pb-20">
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-2xl">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 text-center">Design Your Card</h2>
              
              {orderStep === 'success' ? (
                  <div className="text-center py-12 animate-fade-in-up">
                      <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                          <CheckCircle2 size={48} />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">You're on the list!</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                          Your request for the <strong>{selectedTier.name} {cardType === 'physical' ? 'Physical' : 'Virtual'} Card</strong> has been received. 
                          {cardType === 'physical' ? ' We will notify you when shipping begins.' : ' It will be available in your wallet shortly.'}
                      </p>
                      <button 
                          onClick={() => setOrderStep('config')}
                          className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
                      >
                          Design Another
                      </button>
                  </div>
              ) : (
                  <div className="space-y-8 animate-fade-in-up">
                      
                      {/* 1. Type Selection */}
                      {orderStep === 'config' && (
                        <>
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">1. Choose Format</label>
                              <div className="grid grid-cols-2 gap-4">
                                  <button 
                                      onClick={() => setCardType('virtual')}
                                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                          cardType === 'virtual' 
                                          ? 'border-blue-500 bg-blue-500/5 text-blue-500' 
                                          : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                                      }`}
                                  >
                                      <Smartphone size={24} />
                                      <span className="font-bold text-sm">Virtual</span>
                                  </button>
                                  <button 
                                      onClick={() => setCardType('physical')}
                                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                          cardType === 'physical' 
                                          ? 'border-blue-500 bg-blue-500/5 text-blue-500' 
                                          : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                                      }`}
                                  >
                                      <CreditCard size={24} />
                                      <span className="font-bold text-sm">Physical</span>
                                  </button>
                              </div>
                          </div>

                          {/* 2. Tier Selection */}
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">2. Select Plate</label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                  {CARD_TIERS.map((tier) => (
                                      <button
                                          key={tier.id}
                                          onClick={() => setSelectedTier(tier)}
                                          className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                                              selectedTier.id === tier.id
                                              ? 'border-blue-500 bg-slate-900 text-white shadow-lg'
                                              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'
                                          }`}
                                      >
                                          {tier.name}
                                      </button>
                                  ))}
                              </div>
                          </div>
                        </>
                      )}

                      {/* 3. Shipping (Conditional) */}
                      {orderStep === 'shipping' && (
                          <div className="animate-fade-in-up">
                              <button 
                                onClick={() => setOrderStep('config')}
                                className="mb-4 text-xs font-bold text-slate-500 hover:text-blue-500 flex items-center gap-1"
                              >
                                &larr; Back to Design
                              </button>
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">3. Shipping Details</label>
                              <div className="space-y-4">
                                  <div className="relative">
                                      <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                      <input 
                                          type="text" 
                                          placeholder="Street Address"
                                          value={shipping.address}
                                          onChange={(e) => setShipping({...shipping, address: e.target.value})}
                                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
                                      />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                      <input 
                                          type="text" 
                                          placeholder="City"
                                          value={shipping.city}
                                          onChange={(e) => setShipping({...shipping, city: e.target.value})}
                                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
                                      />
                                      <input 
                                          type="text" 
                                          placeholder="ZIP Code"
                                          value={shipping.zip}
                                          onChange={(e) => setShipping({...shipping, zip: e.target.value})}
                                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
                                      />
                                  </div>
                                  <input 
                                      type="text" 
                                      placeholder="Country"
                                      value={shipping.country}
                                      onChange={(e) => setShipping({...shipping, country: e.target.value})}
                                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-all"
                                  />
                              </div>
                          </div>
                      )}

                      {/* Action Button */}
                      <button 
                          onClick={handleOrder}
                          className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                      >
                          {orderStep === 'config' 
                            ? (cardType === 'physical' ? 'Next: Shipping' : 'Confirm Order')
                            : 'Complete Request'
                          }
                          <ChevronRight size={20} />
                      </button>
                  </div>
              )}
          </div>
      </section>

    </div>
  );
};

export default CardsPage;
