import React from 'react';
import { Shield, Rocket } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-16">
      
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 text-center mb-20">
         <span className="text-cyan-400 font-bold uppercase tracking-widest text-sm">Mission & Vision</span>
         <h1 className="text-5xl font-extrabold text-white mt-4 mb-8">About Fluid</h1>
         <div className="prose dark:prose-invert max-w-none text-slate-400 text-lg leading-relaxed">
            <p className="mb-6">
               At Fluid, we're driven by a simple yet powerful mission: to empower individuals by making cryptocurrency accessible, secure, and intuitive. Our journey began with the belief that managing digital assets shouldn't be complex or intimidating.
            </p>
            <p>
               Fluid was founded by a team of blockchain enthusiasts, developers, and security experts with years of experience in the crypto and web3 industry. We've seen the challenges users face: fragmented tools, confusing interfaces, and security risks. We created Fluid to set a new standard for convenience and trust.
            </p>
         </div>
      </section>

      {/* Vision & Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <h2 className="text-3xl font-bold text-center text-white mb-12">What We Stand For</h2>
         
         <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] hover:border-emerald-500/50 transition-colors">
               <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
                  <Shield size={32} />
               </div>
               <h3 className="text-2xl font-bold text-white mb-4">Security</h3>
               <p className="text-slate-400 leading-relaxed">
                  Your assets deserve uncompromising protection. Fluid Wallet is built with advanced encryption and a non-custodial design to ensure your private keys remain yours alone.
               </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] hover:border-cyan-500/50 transition-colors">
               <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 text-cyan-500">
                  <Rocket size={32} />
               </div>
               <h3 className="text-2xl font-bold text-white mb-4">Innovation</h3>
               <p className="text-slate-400 leading-relaxed">
                  The crypto space evolves rapidly, and so do we. From our existing tools to exceptional upcoming features, we are always working to push the boundaries of what's possible for a seasoned trader.
               </p>
            </div>
         </div>
      </section>

      {/* Philosophy Section */}
      <section className="text-center px-4 py-20 bg-slate-100 dark:bg-slate-900/30 rounded-[3rem]">
         <h2 className="text-3xl font-bold text-white mb-6">Our Philosophy</h2>
         <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We believe that decentralization is not just a technology, but a path towards financial sovereignty. Fluid is built on the principle that users should always be in control, with no middlemen and absolute transparency.
         </p>
      </section>

    </div>
  );
};

export default AboutPage;