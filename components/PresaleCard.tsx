
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Timer, ChevronDown, ArrowRight, Loader2, AlertCircle, Briefcase, Gift, Copy, Check, ShieldCheck, TrendingUp, Info, PieChart } from 'lucide-react';
import { useReadContract, useSendTransaction, useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain, ConnectButton } from "thirdweb/react";
import { prepareContractCall, toEther, toWei, getContract } from "thirdweb";
import { client, wallets } from "../client";
import { presaleContract, fluidTokenContract, SUPPORTED_NETWORKS, TokenInfo, NetworkInfo, PRESALE_CONTRACT_ADDRESS } from "../contracts/presale";
import { ethereum, polygon, bsc, arbitrum, optimism, base, avalanche, linea, scroll } from "thirdweb/chains";

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M55 20 H90 A5 5 0 0 1 90 35 H55 A5 5 0 0 1 55 20 Z" transform="skewX(-20)" />
    <path d="M40 42 H85 A5 5 0 0 1 85 57 H40 A5 5 0 0 1 40 42 Z" transform="skewX(-20)" />
    <path d="M25 64 H60 A5 5 0 0 1 60 79 H25 A5 5 0 0 1 25 64 Z" transform="skewX(-20)" />
  </svg>
);

const ALL_CHAINS = [ethereum, polygon, bsc, arbitrum, optimism, base, avalanche, linea, scroll];

const PresaleCard: React.FC = () => {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  
  const [usdAmount, setUsdAmount] = useState('100');
  const [fldAmount, setFldAmount] = useState('100');
  const [copied, setCopied] = useState(false);
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const networkRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLDivElement>(null);

  const [selectedNetwork, setSelectedNetwork] = useState<NetworkInfo>(SUPPORTED_NETWORKS[0]);
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(SUPPORTED_NETWORKS[0].tokens[0]);

  // Read Price from Contract
  const { data: priceUsd6, isLoading: isLoadingPrice } = useReadContract({
    contract: presaleContract,
    method: "function tokenPriceUsd6() view returns (uint256)",
    params: [],
  });

  const FLD_USD_PRICE = useMemo(() => {
    if (priceUsd6) return Number(priceUsd6) / 1000000;
    return 1.00; // Fallback
  }, [priceUsd6]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (networkRef.current && !networkRef.current.contains(event.target as Node)) setShowNetworkSelector(false);
      if (tokenRef.current && !tokenRef.current.contains(event.target as Node)) setShowTokenSelector(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(PRESALE_CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { data: contractTokenName } = useReadContract({
    contract: fluidTokenContract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: contractTokenSymbol } = useReadContract({
    contract: fluidTokenContract,
    method: "function symbol() view returns (string)",
    params: [],
  });

  const { data: fluidBalanceData, isLoading: isLoadingBalance } = useReadContract({
    contract: fluidTokenContract,
    method: "function balanceOf(address) view returns (uint256)",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
  });

  const { data: soldData, isLoading: isLoadingSold } = useReadContract({
    contract: presaleContract,
    method: "function presaleSold() view returns (uint256)",
    params: [],
  });

  const { data: poolData, isLoading: isLoadingPool } = useReadContract({
    contract: presaleContract,
    method: "function PRESALE_POOL() view returns (uint256)",
    params: [],
  });

  const { data: isEmergency } = useReadContract({
    contract: presaleContract,
    method: "function emergencyStop() view returns (bool)",
    params: [],
  });

  const tokenName = (contractTokenName as string) || "Fluid";
  const tokenSymbol = (contractTokenSymbol as string) || "FLD";
  const purchasedBalance = useMemo(() => fluidBalanceData ? parseFloat(toEther(fluidBalanceData as bigint)) : 0, [fluidBalanceData]);
  const airdropAllocation = useMemo(() => purchasedBalance * 0.5, [purchasedBalance]);
  const totalClaimable = purchasedBalance + airdropAllocation;
  
  const sold = useMemo(() => soldData ? parseFloat(toEther(soldData as bigint)) : 0, [soldData]);
  const pool = useMemo(() => poolData ? parseFloat(toEther(poolData as bigint)) : 3000000, [poolData]);
  
  const progress = useMemo(() => pool > 0 ? Math.min((sold / pool) * 100, 100) : 0, [sold, pool]);
  const remainingPercentage = useMemo(() => 100 - progress, [progress]);
  const remainingTokens = useMemo(() => Math.max(pool - sold, 0), [pool, sold]);

  const handleUsdChange = (val: string) => {
    setUsdAmount(val);
    const num = parseFloat(val) || 0;
    setFldAmount((num / FLD_USD_PRICE).toFixed(2));
  };

  const handleFldChange = (val: string) => {
    setFldAmount(val);
    const num = parseFloat(val) || 0;
    setUsdAmount((num * FLD_USD_PRICE).toFixed(2));
  };

  const paymentAmountNeeded = useMemo(() => {
    const usd = parseFloat(usdAmount) || 0;
    return (usd / selectedToken.priceUsd).toFixed(selectedToken.address ? 6 : 18);
  }, [usdAmount, selectedToken]);

  const { mutate: sendTx, isPending: isProcessing } = useSendTransaction();

  const handleBuy = async () => {
    if (isEmergency) return alert("Presale is currently paused.");
    if (!account) return;
    if (activeChain?.id !== selectedNetwork.id) {
      try { await switchChain(selectedNetwork.chain); } catch (e) { return; }
    }

    const fldToBuy = parseFloat(fldAmount);
    if (isNaN(fldToBuy) || fldToBuy <= 0) return alert("Invalid amount");

    if (selectedToken.address) {
      const approveTx = prepareContractCall({
        contract: getContract({ client, chain: selectedNetwork.chain, address: selectedToken.address }),
        method: "function approve(address spender, uint256 value) returns (bool)",
        params: [PRESALE_CONTRACT_ADDRESS, toWei(paymentAmountNeeded)],
      });

      sendTx(approveTx, {
        onSuccess: () => {
          const buyTx = prepareContractCall({
            contract: presaleContract,
            method: "function buyWithERC20(address payToken, uint256 amount)",
            params: [selectedToken.address!, toWei(fldAmount)],
          });
          sendTx(buyTx, { onSuccess: () => alert("Purchase successful!") });
        }
      });
    } else {
      const buyTx = prepareContractCall({
        contract: presaleContract,
        method: "function buyWithNative(uint256 amount) payable",
        params: [toWei(fldAmount)],
        value: toWei(paymentAmountNeeded),
      });
      sendTx(buyTx, { onSuccess: () => alert("Purchase successful!") });
    }
  };

  return (
    <div className="w-full max-w-lg bg-slate-900 border border-white/5 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden animate-fade-in-up">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-[8px] font-nebula font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Genesis Phase</span>
            <h3 className="text-lg md:text-xl font-nebula font-black text-white uppercase tracking-tighter">Public <span className="text-fluid-gradient">Allocation</span></h3>
          </div>
          <div className="flex flex-col items-end">
            <div className={`${isEmergency ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} px-3 py-1 rounded-full flex items-center gap-1.5 mb-1`}>
              <div className={`w-1 h-1 ${isEmergency ? 'bg-red-500' : 'bg-emerald-500'} rounded-full animate-pulse`}></div>
              <span className={`text-[8px] font-nebula font-black ${isEmergency ? 'text-red-500' : 'text-emerald-500'} uppercase tracking-widest`}>
                {isEmergency ? 'Paused' : 'Active'}
              </span>
            </div>
            <span className="text-[9px] font-nebula font-black text-white/40 uppercase tracking-widest">
              1 {tokenSymbol} = ${FLD_USD_PRICE.toFixed(2)} USD
            </span>
          </div>
        </div>

        <div className="mb-6 bg-black/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
          <span className="text-[7px] font-nebula font-black text-slate-500 uppercase tracking-[0.2em]">Fluid Token Genesis Contract</span>
          <div className="flex items-center justify-between gap-3">
             <span className="text-[9px] font-mono text-white/70 truncate">{PRESALE_CONTRACT_ADDRESS}</span>
             <button onClick={handleCopyAddress} className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-1.5">
                {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                <span className="text-[7px] font-nebula font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
             </button>
          </div>
        </div>

        {/* POOL PROGRESS SECTION */}
        <div className="mb-8 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem]">
           <div className="flex justify-between items-end mb-4">
              <div>
                 <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">Sale Progress</span>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-nebula font-black text-white">{isLoadingSold ? '...' : progress.toFixed(1)}%</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Sold</span>
                 </div>
              </div>
              <div className="text-right">
                 <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">Remaining</span>
                 <div className="flex items-baseline gap-2 justify-end">
                    <span className="text-lg font-nebula font-black text-indigo-400">{isLoadingSold ? '...' : remainingPercentage.toFixed(1)}%</span>
                 </div>
              </div>
           </div>
           
           <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5 p-0.5 mb-4 relative">
              <div 
                 className="h-full bg-fluid-gradient rounded-full transition-all duration-[2s] ease-out shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
                 style={{ width: `${progress}%` }}
              ></div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 rounded-xl px-4 py-3 border border-white/5 flex flex-col gap-1">
                 <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Tokens Sold</span>
                 <span className="text-[10px] font-nebula font-black text-white">{isLoadingSold ? '...' : sold.toLocaleString()} {tokenSymbol}</span>
              </div>
              <div className="bg-black/20 rounded-xl px-4 py-3 border border-white/5 flex flex-col gap-1">
                 <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Tokens Left</span>
                 <span className="text-[10px] font-nebula font-black text-indigo-400">{isLoadingSold || isLoadingPool ? '...' : remainingTokens.toLocaleString()} {tokenSymbol}</span>
              </div>
           </div>
        </div>

        {/* USER ALLOCATION SECTION */}
        {account && (
          <div className="space-y-3 mb-6">
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                  <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-[0.2em]">My Allocation Details</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full">
                     <PieChart size={10} className="text-emerald-500" />
                     <span className="text-[7px] font-black text-emerald-500 uppercase">150% Value Distribution</span>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] flex flex-col gap-1 transition-all hover:bg-indigo-500/15">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase size={10} className="text-indigo-400" />
                    <span className="text-[7px] font-nebula font-black text-slate-400 uppercase tracking-widest">Purchased (100%)</span>
                  </div>
                  <div className="text-white font-nebula font-black text-sm">
                    {isLoadingBalance ? <Loader2 size={12} className="animate-spin" /> : `${purchasedBalance.toLocaleString()} ${tokenSymbol}`}
                  </div>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-[2rem] flex flex-col gap-1 transition-all hover:bg-purple-500/15">
                  <div className="flex items-center gap-2 mb-1">
                    <Gift size={10} className="text-purple-400" />
                    <span className="text-[7px] font-nebula font-black text-slate-400 uppercase tracking-widest">Airdropped (50%)</span>
                  </div>
                  <div className="text-white font-nebula font-black text-sm">
                    {isLoadingBalance ? <Loader2 size={12} className="animate-spin" /> : `${airdropAllocation.toLocaleString()} ${tokenSymbol}`}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center px-4 py-2 bg-black/20 rounded-2xl border border-white/5">
                <span className="text-[8px] font-nebula font-black text-slate-400 uppercase tracking-widest">Total Position</span>
                <span className="text-emerald-400 font-nebula font-black text-sm">
                  {isLoadingBalance ? <Loader2 size={14} className="animate-spin" /> : `${totalClaimable.toLocaleString()} ${tokenSymbol}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Informational Alert */}
        <div className="mb-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3 items-start relative group">
          <AlertCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight relative z-10">
            Airdrop allocation is <span className="text-fluid-cyan">50% of purchased amount</span>. <br/>
            Both are locked in the smart contract and <span className="text-white">claimable post-presale</span>.
          </p>
        </div>

        {/* Input Area */}
        <div className="space-y-3 mb-8">
          <div className="bg-black/20 border border-white/10 rounded-[2rem] p-6 focus-within:border-indigo-500/50 transition-colors relative">
            <div className="flex justify-between mb-2">
              <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest">Contribution Amount</span>
              <span className="text-[8px] font-nebula font-black text-slate-400 uppercase tracking-widest">
                ≈ {parseFloat(paymentAmountNeeded).toLocaleString(undefined, { maximumFractionDigits: 6 })} {selectedToken.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 w-full">
                <span className="text-xl font-nebula font-black text-white/50">$</span>
                <input type="number" value={usdAmount} onChange={(e) => handleUsdChange(e.target.value)} className="bg-transparent text-xl font-nebula font-black text-white outline-none w-full placeholder:text-slate-800" />
              </div>
            </div>
          </div>

          <div className="bg-black/20 border border-white/10 rounded-[2rem] p-6 focus-within:border-indigo-500/50 transition-colors">
            <div className="flex justify-between mb-2">
              <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest">Estimated Receive ({tokenSymbol})</span>
              <span className="text-[8px] font-nebula font-black text-indigo-400 uppercase tracking-widest">Price Protected</span>
            </div>
            <div className="flex justify-between items-center">
              <input type="number" value={fldAmount} onChange={(e) => handleFldChange(e.target.value)} className="bg-transparent text-xl font-nebula font-black text-white outline-none w-1/2" />
              <div className="flex items-center gap-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2">
                <FluidLogo className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px] font-nebula font-black text-indigo-400">{tokenSymbol}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!account ? (
          <ConnectButton client={client} wallets={wallets} theme="dark" chains={ALL_CHAINS} connectButton={{ label: "Join Genesis", className: "!w-full !py-4 !bg-white !text-slate-950 !rounded-[1.5rem] !font-nebula !font-black !text-[10px] !uppercase !tracking-[0.3em] !shadow-2xl hover:!scale-105 transition-all" }} />
        ) : (
          <button onClick={handleBuy} disabled={isProcessing || isEmergency} className="w-full py-4 bg-white text-slate-950 rounded-[1.5rem] font-nebula font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {isProcessing ? <>Finalizing Order <Loader2 size={12} className="animate-spin" /></> : <>Secure Allocation <ArrowRight size={12} /></>}
          </button>
        )}

        <div className="mt-6 flex justify-center gap-8 opacity-60">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={10} className="text-emerald-500" />
            <span className="text-[7px] font-nebula font-black text-slate-500 uppercase tracking-widest">Security Audited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp size={10} className="text-indigo-400" />
            <span className="text-[7px] font-nebula font-black text-slate-500 uppercase tracking-widest">Mainnet Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresaleCard;
