import React from 'react';
import HowItWorks from '../components/HowItWorks';
import { Server, Database, Cloud, Lock, Terminal, Cpu, Globe, ArrowRight } from 'lucide-react';

const HostPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-16">
      
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 text-center">
         <div className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-6 animate-pulse">
            <span className="text-indigo-500 font-bold uppercase tracking-wider text-sm">Parmaweb Protocol V1</span>
         </div>
         <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6">
            The Permanent Web. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Unstoppable Hosting.</span>
         </h1>
         <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Deploy full-stack applications to the Fluid Blockchain. Censorship-resistant, 100% uptime, and one-time payment for eternal storage.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25">
                <Terminal size={20} /> Start Deploying
             </button>
             <button className="px-8 py-4 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                Read Documentation
             </button>
         </div>
      </section>

      {/* HOW HOSTING WORKS - Deep Dive Architecture Section */}
      <HowItWorks />

      {/* Terminal Visual */}
      <section className="max-w-5xl mx-auto px-4 mb-24">
         <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm">
            <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
               <div className="ml-4 text-slate-400">user@dev:~/my-fluid-app</div>
            </div>
            <div className="p-6 text-slate-300 space-y-2">
               <div className="flex">
                  <span className="text-green-400 mr-2">$</span>
                  <span>npm install -g fluid-cli</span>
               </div>
               <div className="text-slate-500">
                  + fluid-cli@1.0.4 <br/>
                  added 12 packages in 2s
               </div>
               <div className="flex">
                  <span className="text-green-400 mr-2">$</span>
                  <span>fluid init</span>
               </div>
               <div className="text-blue-400">
                  ? Project name: <span className="text-white">awesome-dapp</span> <br/>
                  ? Framework: <span className="text-white">React / Next.js</span> <br/>
                  ? Storage: <span className="text-white">Permanent (Parmaweb)</span>
               </div>
               <div className="flex">
                  <span className="text-green-400 mr-2">$</span>
                  <span>fluid deploy</span>
               </div>
               <div className="text-slate-300">
                  > Building project... <br/>
                  > Uploading assets to Shard 1... <br/>
                  > Uploading assets to Shard 2... <br/>
                  > Verifying integrity...
               </div>
               <div className="text-emerald-400 font-bold mt-4">
                  ✔ Deployment Successful! <br/>
                  Access your app at: <a href="#" className="underline">https://fluid.link/awesome-dapp</a>
               </div>
               <div className="flex animate-pulse">
                  <span className="text-green-400 mr-2">$</span>
                  <span className="w-3 h-5 bg-slate-500 block"></span>
               </div>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-24 border-y border-slate-200 dark:border-slate-800">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center mb-16 text-slate-900 dark:text-white">Why Host on Fluid?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               
               <div className="p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 text-indigo-500 group-hover:scale-110 transition-transform">
                     <Lock size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Censorship Resistant</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                     Data is stored immutably across a distributed network of nodes. No central authority can take your site down.
                  </p>
               </div>

               <div className="p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                     <Cloud size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">100% Uptime</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                     Redundant sharding ensures your content is always available, even if multiple nodes go offline simultaneously.
                  </p>
               </div>

               <div className="p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform">
                     <Database size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">One-Time Payment</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                     Pay once in $FLUID tokens to store data forever. No monthly subscription fees for storage.
                  </p>
               </div>

               <div className="p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                     <Globe size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Global CDN</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                     Built-in content delivery network serves your dApp from the node closest to the user for blazing fast speeds.
                  </p>
               </div>

               <div className="p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform">
                     <Cpu size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Serverless Compute</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                     Run serverless functions directly on-chain for dynamic applications and backend logic.
                  </p>
               </div>

               <div className="p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6 text-pink-500 group-hover:scale-110 transition-transform">
                     <ArrowRight size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Instant Deployment</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                     CI/CD integration allows you to deploy from GitHub automatically with every commit.
                  </p>
               </div>

            </div>
         </div>
      </section>

    </div>
  );
};

export default HostPage;