
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

/**
 * GENESIS AUTHORITY CONFIGURATION
 * Strict access control for protocol governance.
 */
const DEPLOYER_ADDRESS = "0xaf3F7E01631dea1198EF66e069D2A7db9085946b"; 

const AdminDashboard: React.FC = () => {
  const account = useActiveAccount();
  const { mutate: sendTx, isPending: isProcessing } = useSendTransaction();

  // Interface States
  const [newPrice, setNewPrice] = useState('');
  const [newTokenAddress, setNewTokenAddress] = useState('');
  const [isTokenAllowed, setIsTokenAllowed] = useState(true);
  const [incentiveTo, setIncentiveTo] = useState('');
  const [incentiveAmt, setIncentiveAmt] = useState('');
  const [liqTo, setLiqTo] = useState('');
  const [liqAmt, setLiqAmt] = useState('');
  const [newFeed, setNewFeed] = useState('');
  const [newOwner, setNewOwner] = useState('');

  // Protocol Real-time Data
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

  // Validation: Check if connected wallet is Genesis Authority
  const isAuthorized = useMemo(() => {
    if (!account?.address) return false;
    const addr = account.address.toLowerCase();
    const owner = (contractOwner as string)?.toLowerCase();
    return addr === owner || addr === DEPLOYER_ADDRESS.toLowerCase();
  }, [account, contractOwner]);

  const handleAction = (tx: any, msg: string) => {
    sendTx(tx, {
      onSuccess: () => alert(`SUCCESS: ${msg}`),
      onError: (err) => alert(`TRANSACTION FAILED: ${err.message}`)
    });
  };

  if (isLoadingOwner) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <span className="text-[10px] font-nebula font-black text-slate-500 uppercase tracking-[0.3em]">Syncing Authority State...</span>
      </div>
    </div>
  );

  if (!isAuthorized) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <div className="bg-slate-900 border border-white/5 p-12 rounded-[3rem] text-center max-w-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
        <ShieldAlert size={64} className="text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-nebula font-black text-white uppercase mb-4 tracking-tighter">Genesis Restricted</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-8 leading-relaxed">
          The Genesis Control Module is locked to the protocol deployer and root identity.
        </p>
        <div className="bg-black/40 p-5 rounded-2xl border border-white/5 mb-8">
           <span className="text-[8px] text-slate-600 uppercase block mb-2 font-black tracking-widest">Unauthorized Entity</span>
           <span className="text-[10px] font-mono text-red-400 break-all">{account?.address || 'Connection Pending'}</span>
        </div>
        <button onClick={() => window.location.href = '/'} className="w-full py-4 bg-white text-slate-950 rounded-2xl font-nebula font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all">Return to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-slate-950 relative">
      <div className="fixed inset-0 bg-tech-grid opacity-30 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Branding Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 rounded-[2rem] text-indigo-400 border border-indigo-500/20 shadow-2xl">
                 <Settings size={36} />
              </div>
              <div>
                 <h1 className="text-5xl md:text-7xl font-nebula font-black text-white uppercase tracking-tighter leading-none mb-1">Genesis <span className="text-fluid-gradient">Control</span></h1>
                 <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.4em]">Autonomous Protocol Management Console</p>
              </div>
           </div>
           <div className="bg-emerald-500/10 border border-emerald-500/20 px-8 py-4 rounded-3xl flex items-center gap-4">
              <CheckCircle size={20} className="text-emerald-500" />
              <div className="text-[11px] text-emerald-500 font-nebula font-black uppercase tracking-widest">Authority Verified</div>
           </div>
        </div>

        {/* Protocol Health Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           {[
             { label: "Token Price", value: `$${tokenPrice ? Number(tokenPrice) / 1000000 : '0.00'}`, icon: DollarSign, color: "text-indigo-400" },
             { label: "Allocation Sold", value: `${sold ? Number(toEther(sold as bigint)).toLocaleString() : 0} FLD`, icon: Activity, color: "text-emerald-400" },
             { label: "Circuit Breaker", value: emergencyState ? "HALTED" : "OPERATIONAL", icon: Power, color: emergencyState ? "text-red-500" : "text-emerald-500" },
             { label: "Genesis Liquidity", value: `${totalPool ? Number(toEther(totalPool as bigint)).toLocaleString() : 0} FLD`, icon: Database, color: "text-blue-400" },
           ].map((stat, i) => (
             <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-10 rounded-[3rem] flex flex-col gap-2 transition-all group hover:border-white/10 hover:bg-slate-900/80 shadow-xl">
                <stat.icon size={24} className={`${stat.color} group-hover:scale-110 transition-transform mb-2`} />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <span className="text-2xl font-nebula font-black text-white uppercase tracking-tight">{stat.value}</span>
             </div>
           ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
           {/* Column 1: Market & Infrastructure */}
           <div className="space-y-10">
              <div className="bg-slate-900 border border-white/5 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
                 <h3 className="text-xl font-nebula font-black text-white uppercase mb-10 flex items-center gap-4"><DollarSign size={24} className="text-indigo-400" /> Market Dynamics</h3>
                 <div className="space-y-8">
                    <div>
                       <label className="text-[11px] font-black text-slate-500 uppercase block mb-4 tracking-widest">Update Token Value (USD6 Format)</label>
                       <div className="relative">
                          <input type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. 1.50" className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-8 text-white focus:border-indigo-500 transition-all font-nebula font-black text-lg" />
                          <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function setPrice(uint256 p)", params: [BigInt(Math.floor(parseFloat(newPrice) * 1000000))] }), "Token price successfully updated")} className="absolute right-2.5 top-2.5 bottom-2.5 bg-indigo-600 text-white font-nebula font-black px-8 rounded-xl text-[11px] uppercase tracking-widest hover:bg-indigo-500 transition-colors">Apply</button>
                       </div>
                    </div>
                    <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                       <div><h4 className="text-white font-nebula font-black text-base uppercase">System Circuit Breaker</h4><p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Global Transaction Lock</p></div>
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function setEmergency(bool s)", params: [!emergencyState] }), "Circuit status toggled")} className={`px-10 py-4 rounded-full font-nebula font-black text-[11px] uppercase transition-all shadow-2xl ${emergencyState ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                          {emergencyState ? <><Unlock size={16} className="inline mr-2" /> RESUME GENESIS</> : <><Lock size={16} className="inline mr-2" /> HALT ALL TRAFFIC</>}
                       </button>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-[3.5rem] p-12 shadow-2xl">
                 <h3 className="text-xl font-nebula font-black text-white uppercase mb-10 flex items-center gap-4"><LinkIcon size={24} className="text-blue-400" /> Infrastructure Gateways</h3>
                 <div className="space-y-8">
                    <div>
                       <label className="text-[11px] font-black text-slate-500 uppercase block mb-4 tracking-widest">Protocol Price Feed Oracle</label>
                       <div className="relative">
                          <input type="text" value={newFeed} onChange={(e) => setNewFeed(e.target.value)} placeholder="0x..." className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-8 text-white font-mono text-sm" />
                          <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function setFeed(address f)", params: [newFeed] }), "Price feed oracle synchronized")} className="absolute right-2.5 top-2.5 bottom-2.5 bg-blue-600 text-white px-6 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-500 transition-colors">Sync Feed</button>
                       </div>
                    </div>
                    <div className="pt-10 border-t border-white/5 space-y-6">
                       <label className="text-[11px] font-black text-slate-500 uppercase block tracking-widest">EVM Payment Integration</label>
                       <div className="flex flex-col sm:flex-row gap-5">
                          <input type="text" value={newTokenAddress} onChange={(e) => setNewTokenAddress(e.target.value)} placeholder="Contract Address" className="flex-grow bg-black/40 border border-white/10 rounded-2xl px-8 py-5 text-white font-mono text-sm" />
                          <div className="flex gap-3">
                             <button onClick={() => setIsTokenAllowed(true)} className={`px-6 py-3 rounded-xl text-[9px] font-black border transition-all ${isTokenAllowed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-800 border-transparent text-slate-600'}`}>ALLOW</button>
                             <button onClick={() => setIsTokenAllowed(false)} className={`px-6 py-3 rounded-xl text-[9px] font-black border transition-all ${!isTokenAllowed ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-slate-800 border-transparent text-slate-600'}`}>BLOCK</button>
                          </div>
                       </div>
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function setPaymentToken(address t, bool ok)", params: [newTokenAddress, isTokenAllowed] }), "Payment gateway permission updated")} className="w-full py-5 bg-white text-slate-950 rounded-2xl font-nebula font-black text-[11px] uppercase tracking-[0.3em] hover:bg-slate-200 transition-colors shadow-2xl">Deploy Gateway Rules</button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Column 2: Distributions & Governance */}
           <div className="space-y-10">
              <div className="bg-slate-900 border border-white/5 rounded-[3.5rem] p-12 shadow-2xl">
                 <h3 className="text-xl font-nebula font-black text-white uppercase mb-10 flex items-center gap-4"><Landmark size={24} className="text-amber-400" /> Treasury Management</h3>
                 <div className="space-y-8">
                    <div className="p-8 bg-black/30 border border-white/5 rounded-[2.5rem] space-y-6">
                       <h4 className="text-white font-nebula font-black uppercase text-sm flex items-center gap-3"><Send size={16} className="text-amber-500"/> Incentive Distribution</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <input type="text" placeholder="Recipient 0x..." value={incentiveTo} onChange={e => setIncentiveTo(e.target.value)} className="bg-slate-800 border border-white/5 rounded-xl px-5 py-3 text-xs font-mono" />
                          <input type="number" placeholder="Amount FLD" value={incentiveAmt} onChange={e => setIncentiveAmt(e.target.value)} className="bg-slate-800 border border-white/5 rounded-xl px-5 py-3 text-xs font-mono" />
                       </div>
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function sendIncentive(address to, uint256 amt)", params: [incentiveTo, toWei(incentiveAmt)] }), "Incentive distribution finalized")} className="w-full py-4 bg-amber-600 text-white rounded-xl font-nebula font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-amber-500 transition-all">Distribute Allocation</button>
                    </div>

                    <div className="p-8 bg-black/30 border border-white/5 rounded-[2.5rem] space-y-6">
                       <h4 className="text-white font-nebula font-black uppercase text-sm flex items-center gap-3"><Briefcase size={16} className="text-indigo-400"/> Liquidity Pool Extraction</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <input type="text" placeholder="Target 0x..." value={liqTo} onChange={e => setLiqTo(e.target.value)} className="bg-slate-800 border border-white/5 rounded-xl px-5 py-3 text-xs font-mono" />
                          <input type="number" placeholder="Amount FLD" value={liqAmt} onChange={e => setLiqAmt(e.target.value)} className="bg-slate-800 border border-white/5 rounded-xl px-5 py-3 text-xs font-mono" />
                       </div>
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function claimLiquidity(address to, uint256 amt)", params: [liqTo, toWei(liqAmt)] }), "Protocol liquidity funds released")} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-nebula font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-500 transition-all">Execute Withdrawal</button>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-[3.5rem] p-12 shadow-2xl">
                 <h3 className="text-xl font-nebula font-black text-white uppercase mb-10 flex items-center gap-4"><Shield size={24} className="text-red-500" /> Genesis Authority</h3>
                 <div className="space-y-6">
                    <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-[2.5rem]">
                       <h4 className="text-white font-nebula font-black uppercase text-xs mb-5 tracking-widest">Migrate Protocol Ownership</h4>
                       <div className="relative">
                          <input type="text" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} placeholder="New Root Entity (0x...)" className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-8 text-white font-mono text-sm pr-32" />
                          <button onClick={() => { if(window.confirm("FATAL: Transfer governance? This will revoke your access permanently.")) handleAction(prepareContractCall({ contract: presaleContract, method: "function transferOwnership(address newOwner)", params: [newOwner] }), "Genesis authority migrated"); }} className="absolute right-2.5 top-2.5 bottom-2.5 bg-red-600 text-white px-6 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 transition-colors">Migrate</button>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function claimTeam()" }), "Team allocation released")} className="p-6 bg-slate-800 border border-white/5 rounded-[2rem] text-center flex flex-col items-center gap-4 hover:bg-slate-800/80 transition-all shadow-lg">
                          <Users size={24} className="text-indigo-400" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Release Team Vesting</span>
                       </button>
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function claimFoundation()" }), "Foundation allocation released")} className="p-6 bg-slate-800 border border-white/5 rounded-[2rem] text-center flex flex-col items-center gap-4 hover:bg-slate-800/80 transition-all shadow-lg">
                          <Landmark size={24} className="text-amber-400" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Release Foundation</span>
                       </button>
                    </div>
                    <div className="flex gap-4">
                       <button onClick={() => handleAction(prepareContractCall({ contract: presaleContract, method: "function unlockLiquidity()" }), "Liquidity pool unlocked")} className="flex-1 py-5 bg-white text-slate-950 rounded-2xl font-nebula font-black text-[11px] uppercase tracking-[0.3em] hover:scale-[1.02] transition-all">Unlock Protocol LP Pool</button>
                       <button onClick={() => { if(window.confirm("CRITICAL: Permanently renounce ownership? This action is IRREVERSIBLE.")) handleAction(prepareContractCall({ contract: presaleContract, method: "function renounceOwnership()" }), "Authority renounced. Protocol is now fully decentralized."); }} className="p-5 bg-red-600/10 border border-red-600/20 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl"><Trash2 size={24}/></button>
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
