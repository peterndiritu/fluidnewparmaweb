
import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, Settings, DollarSign, Lock, Unlock, 
  Users, Activity, Loader2, Landmark, RefreshCw, 
  AlertTriangle, CheckCircle, Database, Briefcase,
  Send, Link as LinkIcon, Shield, Trash2, Power
} from 'lucide-react';
import { useReadContract, useSendTransaction, useActiveAccount } from "thirdweb/react";
import { prepareContractCall, toEther, toWei } from "thirdweb";
import { presaleContract } from "../contracts/presale";

// Strict Deployer Authority Address provided by user
const DEPLOYER_ADDRESS = "0xaf3F7E01631dea1198EF66e069D2A7db9085946b"; 

const AdminDashboard: React.FC = () => {
  const account = useActiveAccount();
  const { mutate: sendTx, isPending: isProcessing } = useSendTransaction();

  // Input States
  const [newPrice, setNewPrice] = useState('');
  const [newTokenAddress, setNewTokenAddress] = useState('');
  const [isTokenAllowed, setIsTokenAllowed] = useState(true);
  const [incentiveTo, setIncentiveTo] = useState('');
  const [incentiveAmt, setIncentiveAmt] = useState('');
  const [liqTo, setLiqTo] = useState('');
  const [liqAmt, setLiqAmt] = useState('');
  const [newFeed, setNewFeed] = useState('');
  const [newOwner, setNewOwner] = useState('');

  // Contract Readings
  const { data: contractOwner, isLoading: isLoadingOwner } = useReadContract({ 
    contract: presaleContract, 
    method: "function owner() view returns (address)", 
    params: [] 
  });
  
  const { data: tokenPrice } = useReadContract({ 
    contract: presaleContract, 
    method: "function tokenPriceUsd6() view returns (uint256)", 
    params: [] 
  });
  
  const { data: emergencyState } = useReadContract({ 
    contract: presaleContract, 
    method: "function emergencyStop() view returns (bool)", 
    params: [] 
  });
  
  const { data: sold } = useReadContract({ 
    contract: presaleContract, 
    method: "function presaleSold() view returns (uint256)", 
    params: [] 
  });
  
  const { data: totalPool } = useReadContract({ 
    contract: presaleContract, 
    method: "function PRESALE_POOL() view returns (uint256)", 
    params: [] 
  });

  const isAuthorized = useMemo(() => {
    if (!account?.address) return false;
    const addr = account.address.toLowerCase();
    const owner = (contractOwner as string)?.toLowerCase();
    // Authorized if user is the contract owner OR the specific deployer address
    return addr === owner || addr === DEPLOYER_ADDRESS.toLowerCase();
  }, [account, contractOwner]);

  const handleAction = (tx: any, msg: string) => {
    sendTx(tx, {
      onSuccess: () => alert(msg),
      onError: (err) => alert(`Execution Failed: ${err.message}`)
    });
  };

  if (isLoadingOwner) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <span className="text-[10px] font-nebula font-black text-slate-500 uppercase tracking-widest">Querying Authority State...</span>
      </div>
    </div>
  );

  if (!isAuthorized) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="bg-slate-900 border border-white/5 p-12 rounded-[3rem] text-center max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
        <ShieldAlert size={64} className="text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-nebula font-black text-white uppercase mb-4">Genesis Restricted</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8 leading-relaxed">
          Access to this terminal is limited to the protocol deployer and designated root authority.
        </p>
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 mb-8">
           <span className="text-[8px] text-slate-600 uppercase block mb-1">Authenticated Wallet</span>
           <span className="text-[10px] font-mono text-red-400 break-all">{account?.address || 'Unknown'}</span>
        </div>
        <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-white text-slate-900 rounded-xl font-nebula font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Return to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-slate-950 relative">
      <div className="fixed inset-0 bg-tech-grid opacity-30 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header UI */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div className="flex items-center gap-6">
              <div className="p-4 bg-indigo-500/10 rounded-3xl text-indigo-400 border border-indigo-500/20 shadow-xl">
                 <Settings size={32} />
              </div>
              <div>
                 <h1 className="text-4xl md:text-6xl font-nebula font-black text-white uppercase tracking-tighter leading-none mb-1">Genesis <span className="text-fluid-gradient">Control</span></h1>
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Protocol Management Console</p>
              </div>
           </div>
           <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
              <CheckCircle size={16} className="text-emerald-500" />
              <div className="text-[10px] text-emerald-500 font-nebula font-black uppercase tracking-widest">Authority Synchronized</div>
           </div>
        </div>

        {/* Real-time Protocol Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           {[
             { label: "Token Price", value: `$${tokenPrice ? Number(tokenPrice) / 1000000 : '0.00'}`, icon: DollarSign, color: "text-indigo-400" },
             { label: "Genesis Sold", value: `${sold ? Number(toEther(sold as bigint)).toLocaleString() : 0} FLD`, icon: Activity, color: "text-emerald-400" },
             { label: "Circuit Breaker", value: emergencyState ? "HALTED" : "ACTIVE", icon: Power, color: emergencyState ? "text-red-500" : "text-emerald-500" },
             { label: "Genesis Pool", value: `${totalPool ? Number(toEther(totalPool as bigint)).toLocaleString() : 0} FLD`, icon: Database, color: "text-blue-400" },
           ].map((stat, i) => (
             <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-2 transition-all group hover:border-white/10 hover:bg-slate-900/80">
                <stat.icon size={20} className={`${stat.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <span className="text-xl font-nebula font-black text-white uppercase tracking-tight">{stat.value}</span>
             </div>
           ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
           {/* Section 1: Market Dynamics */}
           <div className="space-y-8">
              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                 <h3 className="text-lg font-nebula font-black text-white uppercase mb-8 flex items-center gap-3"><DollarSign size={20} className="text-indigo-400" /> Market Configuration</h3>
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase block mb-3">Update Token Price (USD6 Scale)</label>
                       <div className="relative">
                          <input type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. 1.50" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-indigo-500 transition-all font-nebula font-black" />
                          <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function setPrice(uint256 p)", params: [BigInt(Math.floor(parseFloat(newPrice) * 1000000))] }), "Price updated successfully")} className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white font-nebula font-black px-6 rounded-xl text-[10px] uppercase hover:bg-indigo-500 transition-colors">Apply</button>
                       </div>
                    </div>
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                       <div><h4 className="text-white font-nebula font-black text-sm uppercase">Protocol Circuit Breaker</h4><p className="text-[9px] text-slate-500 uppercase tracking-widest">Toggle all protocol transactions</p></div>
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function setEmergency(bool s)", params: [!emergencyState] }), "Emergency state toggled")} className={`px-8 py-3 rounded-full font-nebula font-black text-[10px] uppercase transition-all shadow-lg ${emergencyState ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                          {emergencyState ? <><Unlock size={14} className="inline mr-2" /> RESUME OPERATIONS</> : <><Lock size={14} className="inline mr-2" /> HALT PROTOCOL</>}
                       </button>
                    </div>
                 </div>
              </div>

              {/* Section 2: Infrastructure Gateways */}
              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                 <h3 className="text-lg font-nebula font-black text-white uppercase mb-8 flex items-center gap-3"><LinkIcon size={20} className="text-blue-400" /> Protocol Infrastructure</h3>
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase block mb-3 tracking-widest">Chainlink Price Feed Oracle</label>
                       <div className="relative">
                          <input type="text" value={newFeed} onChange={(e) => setNewFeed(e.target.value)} placeholder="0x..." className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono text-xs" />
                          <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function setFeed(address f)", params: [newFeed] }), "Price feed updated")} className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-4 rounded-xl text-[8px] font-black uppercase hover:bg-blue-500 transition-colors">Sync Feed</button>
                       </div>
                    </div>
                    <div className="pt-6 border-t border-white/5 space-y-4">
                       <label className="text-[10px] font-black text-slate-500 uppercase block tracking-widest">EVM Payment Gateways</label>
                       <div className="flex flex-col sm:flex-row gap-4">
                          <input type="text" value={newTokenAddress} onChange={(e) => setNewTokenAddress(e.target.value)} placeholder="Token Contract Address" className="flex-grow bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-xs" />
                          <div className="flex gap-2">
                             <button onClick={() => setIsTokenAllowed(true)} className={`px-4 py-2 rounded-xl text-[8px] font-black border transition-all ${isTokenAllowed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-800 border-transparent text-slate-600'}`}>Allow</button>
                             <button onClick={() => setIsTokenAllowed(false)} className={`px-4 py-2 rounded-xl text-[8px] font-black border transition-all ${!isTokenAllowed ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-slate-800 border-transparent text-slate-600'}`}>Block</button>
                          </div>
                       </div>
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function setPaymentToken(address t, bool ok)", params: [newTokenAddress, isTokenAllowed] }), "Gateway rules updated")} className="w-full py-4 bg-white text-slate-950 rounded-xl font-nebula font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors">Apply Payment Logic</button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 3: Distribution & Treasury */}
           <div className="space-y-8">
              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                 <h3 className="text-lg font-nebula font-black text-white uppercase mb-8 flex items-center gap-3"><Landmark size={20} className="text-amber-400" /> Genesis Treasury</h3>
                 <div className="space-y-6">
                    <div className="p-6 bg-black/30 border border-white/5 rounded-3xl space-y-4">
                       <h4 className="text-white font-nebula font-black uppercase text-xs flex items-center gap-2"><Send size={12}/> Execute Incentive Distribution</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input type="text" placeholder="Recipient 0x..." value={incentiveTo} onChange={e => setIncentiveTo(e.target.value)} className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-mono" />
                          <input type="number" placeholder="Amount FLD" value={incentiveAmt} onChange={e => setIncentiveAmt(e.target.value)} className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-mono" />
                       </div>
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function sendIncentive(address to, uint256 amt)", params: [incentiveTo, toWei(incentiveAmt)] }), "Tokens distributed successfully")} className="w-full py-3 bg-amber-600 text-white rounded-xl font-nebula font-black text-[9px] uppercase tracking-[0.2em] shadow-lg hover:bg-amber-500 transition-all">Distribute Allocation</button>
                    </div>

                    <div className="p-6 bg-black/30 border border-white/5 rounded-3xl space-y-4">
                       <h4 className="text-white font-nebula font-black uppercase text-xs flex items-center gap-2"><Briefcase size={12}/> Protocol Liquidity Withdrawal</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input type="text" placeholder="Target 0x..." value={liqTo} onChange={e => setLiqTo(e.target.value)} className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-mono" />
                          <input type="number" placeholder="Amount FLD" value={liqAmt} onChange={e => setLiqAmt(e.target.value)} className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-mono" />
                       </div>
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function claimLiquidity(address to, uint256 amt)", params: [liqTo, toWei(liqAmt)] }), "Liquidity funds released")} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-nebula font-black text-[9px] uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-500 transition-all">Claim Pool Funds</button>
                    </div>
                 </div>
              </div>

              {/* Section 4: Authority & Security */}
              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                 <h3 className="text-lg font-nebula font-black text-white uppercase mb-8 flex items-center gap-3"><Shield size={20} className="text-red-500" /> Genesis Authority</h3>
                 <div className="space-y-4">
                    <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl">
                       <h4 className="text-white font-nebula font-black uppercase text-xs mb-4 tracking-widest">Transfer Root Ownership</h4>
                       <div className="relative">
                          <input type="text" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} placeholder="New Root Identity (0x...)" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono text-xs pr-32" />
                          <button onClick={() => { if(window.confirm("CRITICAL: Transfer ownership? You will lose terminal access.")) handleAction(prepareContractCall({ contract: presaleContract, method: "function transferOwnership(address newOwner)", params: [newOwner] }), "Ownership migrated successfully"); }} className="absolute right-2 top-2 bottom-2 bg-red-600 text-white px-4 rounded-xl text-[8px] font-black uppercase hover:bg-red-500 transition-colors">Migrate</button>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function claimTeam()" }), "Team distribution finalized")} className="p-5 bg-slate-800 border border-white/5 rounded-2xl text-center flex flex-col items-center gap-3 hover:bg-slate-800/80 transition-all">
                          <Users size={20} className="text-indigo-400" />
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Release Team Vesting</span>
                       </button>
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function claimFoundation()" }), "Foundation distribution finalized")} className="p-5 bg-slate-800 border border-white/5 rounded-2xl text-center flex flex-col items-center gap-3 hover:bg-slate-800/80 transition-all">
                          <Landmark size={20} className="text-amber-400" />
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Release Foundation</span>
                       </button>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function unlockLiquidity()" }), "Liquidity pool unlocked")} className="flex-1 py-4 bg-white text-slate-950 rounded-xl font-nebula font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors">Unlock Protocol LP Pool</button>
                       <button onClick={() => { if(window.confirm("FATAL: This permanently removes admin control. This is irreversible.")) handleAction(prepareContractCall({ contract: presaleContract, method: "function renounceOwnership()" }), "Authority renounced. Protocol is now decentralized."); }} className="p-4 bg-red-600/10 border border-red-600/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
