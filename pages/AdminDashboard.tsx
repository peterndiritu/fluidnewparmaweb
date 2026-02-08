
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldAlert, Settings, DollarSign, Lock, Unlock, 
  Users, Activity, Loader2, Landmark, RefreshCw, 
  AlertTriangle, CheckCircle, Database, Coins, Briefcase,
  Send, UserPlus, Link as LinkIcon, Shield, Trash2, Power
} from 'lucide-react';
import { useReadContract, useSendTransaction, useActiveAccount } from "thirdweb/react";
import { prepareContractCall, toEther, toWei } from "thirdweb";
import { presaleContract } from "../contracts/presale";

// Strict Deployer Authority Address
const DEPLOYER_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"; 

const AdminDashboard: React.FC = () => {
  const account = useActiveAccount();
  const { mutate: sendTx, isPending: isProcessing } = useSendTransaction();

  // Form States
  const [newPrice, setNewPrice] = useState('');
  const [newTokenAddress, setNewTokenAddress] = useState('');
  const [isTokenAllowed, setIsTokenAllowed] = useState(true);
  const [incentiveTo, setIncentiveTo] = useState('');
  const [incentiveAmt, setIncentiveAmt] = useState('');
  const [liqTo, setLiqTo] = useState('');
  const [liqAmt, setLiqAmt] = useState('');
  const [newFeed, setNewFeed] = useState('');
  const [newOwner, setNewOwner] = useState('');

  // Read State from Contract
  const { data: contractOwner, isLoading: isLoadingOwner } = useReadContract({ 
    contract: presaleContract, 
    method: "function owner() view returns (address)", 
    params: [] 
  });
  
  const { data: tokenPrice } = useReadContract({ contract: presaleContract, method: "function tokenPriceUsd6() view returns (uint256)", params: [] });
  const { data: emergencyState } = useReadContract({ contract: presaleContract, method: "function emergencyStop() view returns (bool)", params: [] });
  const { data: sold } = useReadContract({ contract: presaleContract, method: "function presaleSold() view returns (uint256)", params: [] });
  const { data: totalPool } = useReadContract({ contract: presaleContract, method: "function PRESALE_POOL() view returns (uint256)", params: [] });
  const { data: teamClaimed } = useReadContract({ contract: presaleContract, method: "function teamClaimed() view returns (uint256)", params: [] });
  const { data: foundationClaimed } = useReadContract({ contract: presaleContract, method: "function foundationClaimed() view returns (uint256)", params: [] });

  const isAuthorized = useMemo(() => {
    if (!account?.address) return false;
    const addr = account.address.toLowerCase();
    const owner = (contractOwner as string)?.toLowerCase();
    return addr === owner || addr === DEPLOYER_ADDRESS.toLowerCase();
  }, [account, contractOwner]);

  // Admin Actions with Guards
  const executeCall = (tx: any, successMsg: string) => {
    sendTx(tx, {
      onSuccess: () => alert(successMsg),
      onError: (err) => alert(`Error: ${err.message}`)
    });
  };

  const handleSetPrice = () => {
    if (!newPrice || isNaN(parseFloat(newPrice))) return alert("Invalid price");
    const priceUsd6Value = BigInt(Math.floor(parseFloat(newPrice) * 1000000));
    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function setPrice(uint256 p)",
      params: [priceUsd6Value],
    });
    executeCall(tx, "Token price updated successfully.");
  };

  const handleToggleEmergency = () => {
    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function setEmergency(bool s)",
      params: [!emergencyState],
    });
    executeCall(tx, `Emergency protocol ${!emergencyState ? 'ACTIVATED' : 'DEACTIVATED'}.`);
  };

  const handleSetPaymentToken = () => {
    if (!newTokenAddress || !newTokenAddress.startsWith('0x')) return alert("Invalid address");
    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function setPaymentToken(address t, bool ok)",
      params: [newTokenAddress, isTokenAllowed],
    });
    executeCall(tx, "Payment gateway updated.");
  };

  const handleSendIncentive = () => {
    if (!incentiveTo || !incentiveAmt) return alert("Missing inputs");
    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function sendIncentive(address to, uint256 amt)",
      params: [incentiveTo, toWei(incentiveAmt)],
    });
    executeCall(tx, "Incentive distribution completed.");
  };

  const handleClaimLiquidity = () => {
    if (!liqTo || !liqAmt) return alert("Missing inputs");
    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function claimLiquidity(address to, uint256 amt)",
      params: [liqTo, toWei(liqAmt)],
    });
    executeCall(tx, "Liquidity pool funds claimed.");
  };

  const handleSetFeed = () => {
    if (!newFeed || !newFeed.startsWith('0x')) return alert("Invalid address");
    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function setFeed(address f)",
      params: [newFeed],
    });
    executeCall(tx, "Oracle price feed updated.");
  };

  const handleTransferOwnership = () => {
    if (!newOwner || !newOwner.startsWith('0x')) return alert("Invalid address");
    if (!window.confirm("CRITICAL: This will transfer control of the entire protocol. Continue?")) return;
    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function transferOwnership(address newOwner)",
      params: [newOwner],
    });
    executeCall(tx, "Genesis authority transferred.");
  };

  const handleRenounceOwnership = () => {
    if (!window.confirm("FATAL: This will permanently remove admin access. This cannot be undone!")) return;
    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function renounceOwnership()",
      params: [],
    });
    executeCall(tx, "Ownership renounced. Protocol is now fully autonomous.");
  };

  const handleClaimVesting = (method: "claimTeam" | "claimFoundation" | "unlockLiquidity") => {
    const tx = prepareContractCall({
      contract: presaleContract,
      method: `function ${method}()`,
      params: [],
    });
    executeCall(tx, "Vested tokens released.");
  };

  if (isLoadingOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-nebula font-black uppercase tracking-widest text-[10px]">Authorizing Access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="bg-slate-900 border border-white/5 p-12 rounded-[3rem] text-center max-w-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
          <ShieldAlert size={64} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-nebula font-black text-white uppercase mb-4">Access Denied</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed mb-6">
            Administrative modules are strictly bound to the protocol deployer's address. <br/>
            Your identity is not recognized as Genesis Authority.
          </p>
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5 mb-8">
            <span className="text-[8px] text-slate-600 uppercase block mb-1">Your Wallet</span>
            <span className="text-[10px] font-mono text-red-400 break-all">{account?.address || 'Disconnected'}</span>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-white text-slate-900 rounded-xl font-nebula font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all shadow-lg"
          >
            Return to Protocol
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-slate-950 relative">
      <div className="fixed inset-0 bg-tech-grid opacity-30 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div className="flex items-center gap-6">
              <div className="p-4 bg-indigo-500/10 rounded-3xl text-indigo-400 border border-indigo-500/20 shadow-xl">
                 <Settings size={32} />
              </div>
              <div>
                 <h1 className="text-4xl md:text-6xl font-nebula font-black text-white uppercase tracking-tighter leading-none mb-1">Genesis <span className="text-fluid-gradient">Control</span></h1>
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Protocol Administrator Dashboard</p>
              </div>
           </div>
           <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
              <CheckCircle size={16} className="text-emerald-500" />
              <div>
                <span className="text-[8px] text-slate-500 uppercase font-black block">Status</span>
                <span className="text-[10px] text-emerald-500 font-nebula font-black uppercase tracking-widest">Authority Verified</span>
              </div>
           </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           {[
             { label: "Token Price", value: `$${tokenPrice ? Number(tokenPrice) / 1000000 : '0.00'}`, icon: DollarSign, color: "text-indigo-400" },
             { label: "Presale Sold", value: `${sold ? Number(toEther(sold as bigint)).toLocaleString() : 0} FLD`, icon: Activity, color: "text-emerald-400" },
             { label: "Circuit Breaker", value: emergencyState ? "HALTED" : "ACTIVE", icon: Power, color: emergencyState ? "text-red-500" : "text-emerald-500" },
             { label: "Genesis Pool", value: `${totalPool ? Number(toEther(totalPool as bigint)).toLocaleString() : 0} FLD`, icon: Database, color: "text-blue-400" },
           ].map((stat, i) => (
             <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-2 hover:border-white/10 transition-all group">
                <stat.icon size={20} className={`${stat.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <span className="text-xl font-nebula font-black text-white uppercase">{stat.value}</span>
             </div>
           ))}
        </div>

        {/* Action Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
           {/* Section 1: Market & Emergency */}
           <div className="space-y-8">
              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                 <h3 className="text-lg font-nebula font-black text-white uppercase mb-8 flex items-center gap-3">
                   <DollarSign size={20} className="text-indigo-400" />
                   Market Configuration
                 </h3>
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Set New Token Price (USD)</label>
                       <div className="relative">
                          <input 
                            type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)}
                            placeholder="e.g. 1.50" 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-indigo-500 transition-all font-nebula font-black"
                          />
                          <button onClick={handleSetPrice} disabled={isProcessing} className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white font-nebula font-black px-6 rounded-xl text-[10px] uppercase tracking-widest transition-all">
                             {isProcessing ? <Loader2 size={14} className="animate-spin" /> : "Update"}
                          </button>
                       </div>
                    </div>
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                       <div>
                          <h4 className="text-white font-nebula font-black uppercase text-sm">Protocol Circuit Breaker</h4>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Halt all transactions immediately</p>
                       </div>
                       <button onClick={handleToggleEmergency} disabled={isProcessing} className={`px-8 py-3 rounded-full font-nebula font-black text-[10px] uppercase tracking-widest transition-all ${emergencyState ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'}`}>
                          {emergencyState ? <Unlock size={14} className="inline mr-2" /> : <Lock size={14} className="inline mr-2" />}
                          {emergencyState ? "RESUME" : "HALT"}
                       </button>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                 <h3 className="text-lg font-nebula font-black text-white uppercase mb-8 flex items-center gap-3">
                   <LinkIcon size={20} className="text-blue-400" />
                   Oracle & Gateways
                 </h3>
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Chainlink Price Feed Address</label>
                       <div className="relative">
                          <input type="text" value={newFeed} onChange={(e) => setNewFeed(e.target.value)} placeholder="0x..." className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none font-mono text-sm" />
                          <button onClick={handleSetFeed} className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-4 rounded-xl text-[8px] font-black uppercase">Update</button>
                       </div>
                    </div>
                    <div className="pt-6 border-t border-white/5">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Payment Token Permission</label>
                       <div className="flex flex-col sm:flex-row gap-4">
                          <input type="text" value={newTokenAddress} onChange={(e) => setNewTokenAddress(e.target.value)} placeholder="Token Contract" className="flex-grow bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none font-mono text-sm" />
                          <div className="flex gap-2">
                             <button onClick={() => setIsTokenAllowed(true)} className={`px-4 py-2 rounded-xl text-[8px] font-black border transition-all ${isTokenAllowed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-800 border-transparent text-slate-500'}`}>Allow</button>
                             <button onClick={() => setIsTokenAllowed(false)} className={`px-4 py-2 rounded-xl text-[8px] font-black border transition-all ${!isTokenAllowed ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-slate-800 border-transparent text-slate-500'}`}>Block</button>
                          </div>
                       </div>
                       <button onClick={handleSetPaymentToken} className="w-full mt-4 py-3 bg-white text-slate-950 rounded-xl font-nebula font-black text-[10px] uppercase tracking-widest shadow-xl">Apply Token Rules</button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 2: Distribution & Ownership */}
           <div className="space-y-8">
              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                 <h3 className="text-lg font-nebula font-black text-white uppercase mb-8 flex items-center gap-3">
                   <Landmark size={20} className="text-amber-400" />
                   Distribution Tools
                 </h3>
                 <div className="space-y-6">
                    <div className="p-6 bg-black/30 border border-white/5 rounded-3xl space-y-4">
                       <h4 className="text-white font-nebula font-black uppercase text-xs flex items-center gap-2"><Send size={12}/> Send Incentive Distribution</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input type="text" placeholder="Wallet 0x..." value={incentiveTo} onChange={e => setIncentiveTo(e.target.value)} className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 text-xs font-mono" />
                          <input type="number" placeholder="Amount FLD" value={incentiveAmt} onChange={e => setIncentiveAmt(e.target.value)} className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 text-xs font-mono" />
                       </div>
                       <button onClick={handleSendIncentive} className="w-full py-3 bg-amber-600 text-white rounded-xl font-nebula font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-amber-500 transition-all">Distribute Tokens</button>
                    </div>

                    <div className="p-6 bg-black/30 border border-white/5 rounded-3xl space-y-4">
                       <h4 className="text-white font-nebula font-black uppercase text-xs flex items-center gap-2"><Briefcase size={12}/> Liquidity Withdrawal</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input type="text" placeholder="Wallet 0x..." value={liqTo} onChange={e => setLiqTo(e.target.value)} className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 text-xs font-mono" />
                          <input type="number" placeholder="Amount FLD" value={liqAmt} onChange={e => setLiqAmt(e.target.value)} className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 text-xs font-mono" />
                       </div>
                       <button onClick={handleClaimLiquidity} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-nebula font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-indigo-500 transition-all">Claim Liquidity</button>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                 <h3 className="text-lg font-nebula font-black text-white uppercase mb-8 flex items-center gap-3">
                   <Shield size={20} className="text-red-500" />
                   Genesis Authority
                 </h3>
                 <div className="space-y-4">
                    <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl">
                       <h4 className="text-white font-nebula font-black uppercase text-xs mb-4">Transfer Protocol Ownership</h4>
                       <div className="relative">
                          <input type="text" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} placeholder="New Root Address" className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none font-mono text-sm pr-32" />
                          <button onClick={handleTransferOwnership} className="absolute right-2 top-2 bottom-2 bg-red-600 text-white px-4 rounded-xl text-[8px] font-black uppercase hover:bg-red-500 transition-all">Migrate</button>
                       </div>
                       <p className="mt-4 text-[7px] text-red-500 font-black uppercase tracking-widest flex items-center gap-2">
                          <AlertTriangle size={10} /> CRITICAL: This action is permanent. Correct address is required.
                       </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => handleClaimVesting('claimTeam')} className="p-4 bg-slate-800/50 border border-white/5 rounded-2xl hover:bg-slate-800 transition-all text-center flex flex-col items-center gap-2">
                          <Users size={20} className="text-indigo-400" />
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Team Vesting</span>
                       </button>
                       <button onClick={() => handleClaimVesting('claimFoundation')} className="p-4 bg-slate-800/50 border border-white/5 rounded-2xl hover:bg-slate-800 transition-all text-center flex flex-col items-center gap-2">
                          <Landmark size={20} className="text-amber-400" />
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Found. Vesting</span>
                       </button>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => handleClaimVesting('unlockLiquidity')} className="flex-1 py-3 bg-white text-slate-900 rounded-xl font-nebula font-black text-[9px] uppercase tracking-widest">Unlock LP Pool</button>
                       <button onClick={handleRenounceOwnership} className="p-3 bg-red-600/10 border border-red-600/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="mt-12 p-8 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[3rem] text-center shadow-inner">
            <span className="text-[8px] text-slate-500 uppercase font-black tracking-[0.4em] mb-4 block">Genesis Protocol Reserve Capacity</span>
            <span className="text-4xl md:text-5xl font-nebula font-black text-white uppercase tracking-tighter">
                {totalPool ? Number(toEther(totalPool as bigint)).toLocaleString() : 0} FLD
            </span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
