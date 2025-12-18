import React, { useState } from 'react';
import { 
  Zap, Shield, Layers, Code2, Globe, Cpu, 
  CheckCircle, Wifi, Copy, Check, Wallet, 
  RefreshCw, Smartphone 
} from 'lucide-react';

const BlockchainPage: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const blockchainFeatures = [
    { 
      icon: Zap, 
      label: "Throughput", 
      value: "2,000,000+", 
      trend: "+∞%", 
      color: "cyan",
      desc: "Peak transactions per second"
    },
    { 
      icon: Layers, 
      label: "Scalability", 
      value: "Sharded", 
      trend: "Linear", 
      color: "blue",
      desc: "Horizontal network expansion"
    },
    { 
      icon: RefreshCw, 
      label: "Finality", 
      value: "~1 Second", 
      trend: "Instant", 
      color: "purple",
      desc: "Time to immutable confirmation"
    },
    { 
      icon: Smartphone, 
      label: "Mobile", 
      value: "Native", 
      trend: "Optimized", 
      color: "orange",
      desc: "Direct-to-consumer architecture"
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-16">
      
      {/* Hero */}
      <section className="text-center px-4 mb-24">
        <div className="inline-block px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/30 mb-6">
           <span className="text-blue-500 font-bold uppercase tracking-wider text-sm">Layer 1 Protocol</span>
        </div>
        <h1 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
           Fluid Chain
        </h1>
        <h2 className="text-3xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 mb-10 tracking-tight">
           The Backbone of the New Internet
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
           Fluid Chain is a high-performance Layer-1 blockchain designed for infinite scalability, sub-second finality, and zero-downtime decentralized hosting.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25">
                Start Building
             </button>
             <button className="px-8 py-4 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                Read Whitepaper
             </button>
        </div>
      </section>

      {/* Key Stats - Updated to match requested Blockchain features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blockchainFeatures.map((stat, i) => (
               <div key={i} className="scroll-card bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-8 border border-slate-200/50 dark:border-slate-800/50 hover:border-blue-500/50 transition-all group shadow-xl">
                  <div className={`w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform shadow-lg`}>
                      <stat.icon size={28} />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-2 font-black uppercase tracking-widest">{stat.label}</p>
                  <div className="flex items-end justify-between mb-2">
                     <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</span>
                     <span className="text-xs text-emerald-500 font-black mb-1 tracking-widest uppercase">{stat.trend}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{stat.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* Architecture Features */}
      <section className="bg-white dark:bg-slate-900/50 py-24 border-y border-slate-200 dark:border-slate-800 mb-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center mb-16 text-slate-900 dark:text-white">Technical Innovations</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all group">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform">
                     <Layers size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Dynamic Sharding</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                     The network automatically partitions into shards based on load, allowing for linear scalability. As more nodes join, the network gets faster.
                  </p>
               </div>

               <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all group">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform">
                     <Code2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">EVM Compatibility</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                     Deploy existing Ethereum smart contracts (Solidity/Vyper) instantly with no code changes. Full support for standard Ethereum tooling.
                  </p>
               </div>

               <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all group">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                     <Shield size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Proof of Fluidity</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                     A novel consensus mechanism combining Proof-of-Stake with Proof-of-History, ensuring fair validator selection and energy efficiency.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-5xl mx-auto px-4 mb-24">
         <h2 className="text-3xl font-extrabold text-center mb-12 text-slate-900 dark:text-white">Performance Comparison</h2>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                     <th className="py-4 px-6 text-slate-500 font-bold uppercase text-xs tracking-wider">Metric</th>
                     <th className="py-4 px-6 text-blue-500 font-bold text-lg bg-blue-500/5 rounded-t-xl">Fluid Chain</th>
                     <th className="py-4 px-6 text-slate-900 dark:text-white font-bold text-lg">Ethereum</th>
                     <th className="py-4 px-6 text-slate-900 dark:text-white font-bold text-lg">Solana</th>
                  </tr>
               </thead>
               <tbody className="text-slate-600 dark:text-slate-300">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                     <td className="py-4 px-6 font-bold">Throughput (TPS)</td>
                     <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-bold bg-blue-500/5">2,000,000+</td>
                     <td className="py-4 px-6">~30</td>
                     <td className="py-4 px-6">~65,000</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                     <td className="py-4 px-6 font-bold">Finality</td>
                     <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-bold bg-blue-500/5">~600ms</td>
                     <td className="py-4 px-6">~12 min</td>
                     <td className="py-4 px-6">~400ms</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                     <td className="py-4 px-6 font-bold">Avg. Fee</td>
                     <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-bold bg-blue-500/5">$0.0001</td>
                     <td className="py-4 px-6">$2.00 - $50.00</td>
                     <td className="py-4 px-6">$0.00025</td>
                  </tr>
                  <tr>
                     <td className="py-4 px-6 font-bold">EVM Compatible</td>
                     <td className="py-4 px-6 text-blue-600 dark:text-blue-400 font-bold bg-blue-500/5 rounded-b-xl"><CheckCircle size={20} /></td>
                     <td className="py-4 px-6"><CheckCircle size={20} /></td>
                     <td className="py-4 px-6 text-slate-400">-</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </section>

      {/* Quick Connect Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mb-24">
         <div className="max-w-xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
               <Wifi className="text-cyan-400" />
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quick Connect</h2>
            </div>
            
            <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative shadow-lg">
               <div className="absolute top-6 right-6">
                  <span className="px-3 py-1 bg-cyan-500 text-black text-xs font-bold rounded-full">Fluid Chain</span>
               </div>
               
               <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 group cursor-pointer" onClick={() => copyToClipboard('https://rpc.fluidchain.org', 'rpc')}>
                     <span className="text-slate-500 dark:text-slate-400">RPC URL</span>
                     <div className="flex items-center gap-2">
                        <span className="text-cyan-600 dark:text-cyan-400 font-medium">https://rpc.fluidchain.org</span>
                        {copiedField === 'rpc' ? <Check size={14} className="text-emerald-500"/> : <Copy size={14} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white"/>}
                     </div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                     <span className="text-slate-500 dark:text-slate-400">Chain ID</span>
                     <span className="text-slate-900 dark:text-white font-medium">7777</span>
                  </div>

                  <div className="flex justify-between items-center">
                     <span className="text-slate-500 dark:text-slate-400">Currency Symbol</span>
                     <span className="text-slate-900 dark:text-white font-medium">FLUID</span>
                  </div>
               </div>

               <div className="mt-6 flex flex-col gap-3">
                  <button className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-white dark:text-slate-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                     <Wallet size={18} /> Connect MetaMask
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="text-center px-4">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12 max-w-4xl mx-auto shadow-2xl">
             <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Ready to Build the Future?</h2>
             <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of developers building the next generation of decentralized applications on Fluid Chain.
             </p>
             <button className="px-10 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-lg">
                Developer Documentation
             </button>
          </div>
      </section>

    </div>
  );
};

export default BlockchainPage;