
import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, Settings, DollarSign, Lock, Unlock, 
  Users, Activity, Loader2, Landmark, RefreshCw, 
  AlertTriangle, CheckCircle, Database, Coins, Briefcase
} from 'lucide-react';
import { useReadContract, useSendTransaction, useActiveAccount } from "thirdweb/react";
import { prepareContractCall, toEther } from "thirdweb";
import { presaleContract, PRESALE_CONTRACT_ADDRESS } from "../contracts/presale";

// Fixed Deployer Address as a secondary safety check
const DEPLOYER_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"; 

const AdminDashboard: React.FC = () => {
  const account = useActiveAccount();
  const [newPrice, setNewPrice] = useState('');
  const [newTokenAddress, setNewTokenAddress] = useState('');
  const [isTokenAllowed, setIsTokenAllowed] = useState(true);

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

  const isOwner = useMemo(() => {
    if (!account?.address) return false;
    const addr = account.address.toLowerCase();
    const owner = (contractOwner as string)?.toLowerCase();
    // Allow if current owner OR hardcoded deployer (for genesis setup)
    return addr === owner || addr === DEPLOYER_ADDRESS.toLowerCase();
  }, [account, contractOwner]);

  const { mutate: sendTx, isPending: isProcessing } = useSendTransaction();

  const handleSetPrice = () => {
    if (!newPrice) return;
    const priceUsd6Value = Math.floor(parseFloat(newPrice) * 1000000);
    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function setPrice(uint256 p)",
      params: [BigInt(priceUsd6Value)],
    });
    sendTx(tx, { onSuccess: () => alert("Price updated successfully!") });
  };

  const handleToggleEmergency = () => {
    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function setEmergency(bool s)",
      params: [!emergencyState],
    });
    sendTx(tx, { onSuccess: () => alert(`Emergency mode ${!emergencyState ? 'Enabled' : 'Disabled'}`) });
  };

  const handleSetPaymentToken = () => {
    if (!newTokenAddress) return;
    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function setPaymentToken(address t, bool ok)",
      params: [newTokenAddress, isTokenAllowed],
    });
    sendTx(tx, { onSuccess: () => alert("Payment token status updated!") });
  };

  const handleClaim = (method: "claimTeam" | "claimFoundation" | "unlockLiquidity") => {
    const tx = prepareContractCall({
      contract: presaleContract,
      method: `function ${method}()`,
      params: [],
    });
    sendTx(tx, { onSuccess: () => alert("Action completed successfully!") });
  };

  if (isLoadingOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-nebula font-black uppercase tracking-widest text-[10px]">Verifying Genesis Authority...</p>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
        <div className="bg-slate-900 border border-white/5 p-12 rounded-[3rem] text-center max-w-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
          <ShieldAlert size={64} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-nebula font-black text-white uppercase mb-4">Genesis Restricted</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed mb-6">
            This administrative module is strictly bound to the protocol deployer's address. <br/>
            Unauthorized access detected.
          </p>
          <div className="bg-black/40 p-4 rounded-2xl border border-white/5 mb-8">
            <span className="text-[8px] text-slate-600 uppercase block mb-1">Your Identity</span>
            <span className="text-[10px] font-mono text-red-400 break-all">{account?.address || 'Anonymous'}</span>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-white text-slate-900 rounded-xl font-nebula font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Return to Mainnet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div className="flex items-center gap-6">
              <div className="p-4 bg-indigo-500/10 rounded-3xl text-indigo-400 border border-indigo-500/20 shadow-xl">
                 <Settings size={32} />
              </div>
              <div>
                 <h1 className="text-4xl md:text-6xl font-nebula font-black text-white uppercase tracking-tighter">Genesis <span className="text-fluid-gradient">Control</span></h1>
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Authorized Protocol Administrator Dashboard</p>
              </div>
           </div>
           <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl flex items-center gap-3">
              <CheckCircle size={16} className="text-emerald-500" />
              <div>
                <span className="text-[8px] text-slate-500 uppercase font-black block">Status</span>
                <span className="text-[10px] text-emerald-500 font-nebula font-black uppercase">Authority Verified</span>
              </div>
           </div>
        </div>

        {/* Key Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           {[
             { label: "Price (USD)", value: `$${Number(tokenPrice || 0) / 1000000}`, icon: DollarSign, color: "text-indigo-400" },
             { label: "Presale Sold", value: `${sold ? Number(toEther(sold as bigint)).toLocaleString() : 0} FLD`, icon: Activity, color: "text-emerald-400" },
             { label: "Emergency Stop", value: emergencyState ? "ENABLED" : "OFF", icon: AlertTriangle, color: emergencyState ? "text-red-500" : "text-slate-500" },
             { label: "Protocol Owner", value: "Verified Key", icon: CheckCircle, color: "text-blue-400" },
           ].map((stat, i) => (
             <div key={i} className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-2 hover:border-white/10 transition-all">
                <stat.icon size={20} className={stat.color} />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <span className="text-xl font-nebula font-black text-white uppercase">{stat.value}</span>
             </div>
           ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
           {/* Section 1: Price & Emergency */}
           <div className="space-y-8">
              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                 <h3 className="text-lg font-nebula font-black text-white uppercase mb-8 flex items-center gap-3">
                   <DollarSign size={20} className="text-indigo-400" />
                   Market Valuation
                 </h3>
                 <div className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Target Price (USD)</label>
                       <div className="relative">
                          <input 
                            type="number" 
                            step="0.01" 
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            placeholder="e.g. 1.00" 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-indigo-500 transition-all font-nebula font-black"
                          />
                          <button 
                            onClick={handleSetPrice}
                            disabled={isProcessing}
                            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white font-nebula font-black px-6 rounded-xl text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                          >
                             {isProcessing ? <Loader2 size={14} className="animate-spin" /> : "Update Price"}
                          </button>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                       <div>
                          <h4 className="text-white font-nebula font-black uppercase text-sm">Emergency Protocol</h4>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Toggle all buys and transfers</p>
                       </div>
                       <button 
                         onClick={handleToggleEmergency}
                         disabled={isProcessing}
                         className={`px-8 py-3 rounded-full font-nebula font-black text-[10px] uppercase tracking-widest transition-all ${emergencyState ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-red-500 text-white hover:bg-red-400'}`}
                       >
                          {emergencyState ? <><Unlock size={14} className="inline mr-2" /> Resume Protocol</> : <><Lock size={14} className="inline mr-2" /> Enable Lockout</>}
                       </button>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                 <h3 className="text-lg font-nebula font-black text-white uppercase mb-8 flex items-center gap-3">
                   <RefreshCw size={20} className="text-blue-400" />
                   Payment Channels
                 </h3>
                 <div className="space-y-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">ERC20 Contract Address</label>
                       <input 
                         type="text" 
                         value={newTokenAddress}
                         onChange={(e) => setNewTokenAddress(e.target.value)}
                         placeholder="0x..." 
                         className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-sm"
                       />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                       <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setIsTokenAllowed(true)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-nebula font-black uppercase tracking-widest border transition-all ${isTokenAllowed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-800 border-white/5 text-slate-500'}`}
                          >
                             Allow
                          </button>
                          <button 
                            onClick={() => setIsTokenAllowed(false)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-nebula font-black uppercase tracking-widest border transition-all ${!isTokenAllowed ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-slate-800 border-white/5 text-slate-500'}`}
                          >
                             Disable
                          </button>
                       </div>
                       <button 
                          onClick={handleSetPaymentToken}
                          disabled={isProcessing}
                          className="px-8 py-3 bg-white text-slate-950 rounded-xl font-nebula font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                       >
                          Sync Status
                       </button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 2: Ecosystem & Claims */}
           <div className="space-y-8">
              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                 <h3 className="text-lg font-nebula font-black text-white uppercase mb-8 flex items-center gap-3">
                   <Landmark size={20} className="text-amber-400" />
                   Vesting Management
                 </h3>
                 <div className="grid grid-cols-1 gap-4">
                    {[
                      { label: "Team Allocation", method: "claimTeam", claimed: teamClaimed, pool: "TEAM_POOL", icon: Users },
                      { label: "Foundation Reserve", method: "claimFoundation", claimed: foundationClaimed, pool: "FOUND_POOL", icon: Database },
                      { label: "Protocol Liquidity", method: "unlockLiquidity", claimed: null, pool: "LIQ_POOL", icon: RefreshCw },
                    ].map((item, i) => (
                      <div key={i} className="p-6 bg-black/30 border border-white/5 rounded-3xl flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-800 rounded-2xl text-slate-400 group-hover:text-indigo-400">
                               <item.icon size={20} />
                            </div>
                            <div>
                               <h4 className="text-white font-nebula font-black uppercase text-sm">{item.label}</h4>
                               {item.claimed !== undefined && item.claimed !== null && (
                                 <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                                    Claimed: {Number(toEther(item.claimed as bigint)).toLocaleString()} FLD
                                 </p>
                               )}
                            </div>
                         </div>
                         <button 
                           onClick={() => handleClaim(item.method as any)}
                           disabled={isProcessing}
                           className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-nebula font-black rounded-xl text-[9px] uppercase tracking-widest shadow-lg transition-all"
                         >
                            {item.claimed !== undefined && item.claimed !== null ? "Claim Vested" : "Unlock Liquidity"}
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                 <h3 className="text-lg font-nebula font-black text-white uppercase mb-8 flex items-center gap-3">
                   <Briefcase size={20} className="text-purple-400" />
                   Protocol Reserve
                 </h3>
                 <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] flex items-center justify-center">
                    <div className="text-center">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Presale Pool Capacity</span>
                       <span className="text-3xl font-nebula font-black text-white uppercase">
                          {totalPool ? Number(toEther(totalPool as bigint)).toLocaleString() : 0} FLD
                       </span>
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
