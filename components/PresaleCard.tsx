import React, { useState, useEffect, useMemo } from 'react';
import { Coins, Zap, ShieldCheck, Timer, ChevronDown, TrendingUp, ArrowRight, Loader2, Globe, AlertCircle, DollarSign, Gift, Briefcase } from 'lucide-react';
import { useReadContract, useSendTransaction, useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain, ConnectButton } from "thirdweb/react";
import { prepareContractCall, toEther, toWei } from "thirdweb";
import { client, wallets } from "../client";
import { presaleContract, fluidTokenContract, chain as presaleChain, SUPPORTED_NETWORKS } from "../contracts/presale";

const PresaleCard: React.FC = () => {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  
  // State for dual-way inputs
  const [usdAmount, setUsdAmount] = useState('100');
  const [fldAmount, setFldAmount] = useState('100');
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  
  // Mock asset prices for UI estimation relative to USD
  const [selectedPayAsset, setSelectedPayAsset] = useState({ 
    symbol: 'ETH', 
    name: 'Ethereum', 
    ethPrice: 2450 
  });

  // --- Contract Data Fetching ---

  // 1. FLUID Balance (Tokens already purchased/minted)
  const { data: fluidBalanceData, isLoading: isLoadingBalance } = useReadContract({
    contract: fluidTokenContract,
    method: "function balanceOf(address) view returns (uint256)",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
  });

  // 2. Token Price in USD (Assuming 18 decimals from contract)
  const { data: priceData, isLoading: isLoadingPrice } = useReadContract({
    contract: presaleContract,
    method: "function tokenPrice() view returns (uint256)",
    params: [],
  });

  // 3. Tokens Sold
  const { data: soldData, isLoading: isLoadingSold } = useReadContract({
    contract: presaleContract,
    method: "function totalTokensSold() view returns (uint256)",
    params: [],
  });

  // 4. Hard Cap
  const { data: capData } = useReadContract({
    contract: presaleContract,
    method: "function hardCap() view returns (uint256)",
    params: [],
  });

  // 5. End Time
  const { data: endTimeData } = useReadContract({
    contract: presaleContract,
    method: "function endTime() view returns (uint256)",
    params: [],
  });

  // --- Derived State & Formatting ---

  // Price of 1 FLD in USD. Default is 1.00 USD if not found.
  const fldUsdPrice = useMemo(() => {
    if (!priceData || priceData === 0n) return 1.00; 
    try {
        return parseFloat(toEther(priceData as bigint));
    } catch (e) {
        return 1.00;
    }
  }, [priceData]);

  // Sync inputs whenever price or other input changes
  const handleUsdChange = (val: string) => {
    setUsdAmount(val);
    const num = parseFloat(val) || 0;
    if (fldUsdPrice > 0) {
      setFldAmount((num / fldUsdPrice).toFixed(2));
    }
  };

  const handleFldChange = (val: string) => {
    setFldAmount(val);
    const num = parseFloat(val) || 0;
    setUsdAmount((num * fldUsdPrice).toFixed(2));
  };

  // Sync FLD when price data arrives initially or when fldUsdPrice updates
  useEffect(() => {
    const num = parseFloat(usdAmount) || 0;
    setFldAmount((num / fldUsdPrice).toFixed(2));
  }, [fldUsdPrice, usdAmount]);

  // Purchased Balance
  const purchasedBalance = useMemo(() => {
    if (!fluidBalanceData) return 0;
    return parseFloat(toEther(fluidBalanceData as bigint));
  }, [fluidBalanceData]);

  // Airdrop is 50% of purchased
  const airdropAllocation = useMemo(() => {
    return purchasedBalance * 0.5;
  }, [purchasedBalance]);

  const sold = useMemo(() => (soldData ? Number(toEther(soldData as bigint)) : 0), [soldData]);
  const cap = useMemo(() => (capData ? Number(toEther(capData as bigint)) : 1000000), [capData]);
  const progress = useMemo(() => Math.min(Math.round((sold / cap) * 100), 100), [sold, cap]);
  
  // Calculate native amount to send (e.g. ETH) based on USD input
  const nativeAmountToSend = useMemo(() => {
    const usd = parseFloat(usdAmount) || 0;
    return (usd / selectedPayAsset.ethPrice).toFixed(18);
  }, [usdAmount, selectedPayAsset.ethPrice]);

  // --- Timer Logic ---
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  
  useEffect(() => {
    if (!endTimeData) return;
    const target = Number(endTimeData as bigint) * 1000;
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setTimeLeft({ h: 0, m: 0, s: 0 });
        clearInterval(interval);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ h, m, s });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTimeData]);

  // --- Transaction Execution ---
  const { mutate: sendTx, isPending: isBuying } = useSendTransaction();

  const handleBuy = async () => {
    if (!account) return; 
    
    const val = parseFloat(nativeAmountToSend);
    if (!usdAmount || isNaN(val) || val <= 0) return alert("Enter a valid amount.");

    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function buyTokens() payable",
      value: toWei(nativeAmountToSend),
    });

    sendTx(tx, {
      onSuccess: () => alert("Contribution successful! Allocation secured."),
      onError: (err) => console.error("Presale Error:", err),
    });
  };

  const handleNetworkSelect = (network: any) => {
    switchChain(network.chain);
    const prices: Record<string, number> = { 'Ethereum': 2450, 'BSC': 600, 'Polygon': 0.50, 'Base': 2450, 'Arbitrum': 2450 };
    setSelectedPayAsset({ 
        symbol: network.name === 'BSC' ? 'BNB' : network.name === 'Polygon' ? 'MATIC' : 'ETH', 
        name: network.name,
        ethPrice: prices[network.name] || 2450
    });
    setShowNetworkSelector(false);
  };

  const isDataLoading = isLoadingPrice || isLoadingSold;

  return (
    <div className="w-full max-w-lg bg-slate-900 border border-white/5 rounded-[3rem] p-8 md:p-10 shadow-2xl relative overflow-hidden animate-fade-in-up">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-[8px] font-nebula font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Current Phase</span>
            <h3 className="text-lg md:text-xl font-nebula font-black text-white uppercase">Genesis <span className="text-fluid-gradient">Sale</span></h3>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 mb-1">
              <div className={`w-1 h-1 bg-emerald-500 rounded-full ${!isDataLoading ? 'animate-pulse' : ''}`}></div>
              <span className="text-[8px] font-nebula font-black text-emerald-500 uppercase tracking-widest">Live</span>
            </div>
            <span className="text-[9px] font-nebula font-black text-white/40 uppercase tracking-widest">1 FLD = ${fldUsdPrice.toFixed(2)} USD</span>
          </div>
        </div>

        {/* Enhanced Balance Display */}
        {account && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] flex flex-col gap-1 transition-all hover:bg-indigo-500/15">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase size={10} className="text-indigo-400" />
                <span className="text-[7px] font-nebula font-black text-slate-400 uppercase tracking-widest">Purchased</span>
              </div>
              <div className="text-white font-nebula font-black text-xs">
                {isLoadingBalance ? <Loader2 size={12} className="animate-spin" /> : `${purchasedBalance.toLocaleString()} FLD`}
              </div>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-[2rem] flex flex-col gap-1 transition-all hover:bg-purple-500/15">
              <div className="flex items-center gap-2 mb-1">
                <Gift size={10} className="text-purple-400" />
                <span className="text-[7px] font-nebula font-black text-slate-400 uppercase tracking-widest">Airdrop Bonus</span>
              </div>
              <div className="text-white font-nebula font-black text-xs">
                {isLoadingBalance ? <Loader2 size={12} className="animate-spin" /> : `${airdropAllocation.toLocaleString()} FLD`}
              </div>
            </div>
          </div>
        )}

        {/* Note about Airdrop */}
        <div className="mb-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3 items-start">
          <AlertCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
            Note: Airdrop is <span className="text-blue-400">50% of the purchased tokens</span>, claimable after presale ends.
          </p>
        </div>

        {/* Timer */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Timer size={10} className="text-slate-500" />
            <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest">Ending In</span>
          </div>
          <div className="flex gap-3 text-white font-nebula font-black text-[10px]">
            <span className="tracking-widest">{timeLeft.h}H</span>
            <span className="tracking-widest">{timeLeft.m}M</span>
            <span className="tracking-widest">{timeLeft.s}S</span>
          </div>
        </div>

        {/* Swap Inputs */}
        <div className="space-y-3 mb-6">
          <div className="bg-black/20 border border-white/10 rounded-[2rem] p-6 focus-within:border-indigo-500/50 transition-colors relative">
            <div className="flex justify-between mb-2">
              <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest">You Pay (USD)</span>
              <span className="text-[8px] font-nebula font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                ≈ {parseFloat(nativeAmountToSend).toLocaleString(undefined, { maximumFractionDigits: 6 })} {selectedPayAsset.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 w-1/2">
                <span className="text-xl font-nebula font-black text-white/50">$</span>
                <input 
                  type="number" 
                  value={usdAmount}
                  onChange={(e) => handleUsdChange(e.target.value)}
                  className="bg-transparent text-xl font-nebula font-black text-white outline-none w-full placeholder:text-slate-800"
                  placeholder="0.0"
                />
              </div>
              <button 
                onClick={() => setShowNetworkSelector(!showNetworkSelector)}
                className="flex items-center gap-2.5 bg-slate-800/80 border border-white/10 rounded-xl px-4 py-2 hover:bg-slate-700 transition-colors"
              >
                <div className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center text-white"><Globe size={10}/></div>
                <span className="text-[10px] font-nebula font-black text-white uppercase tracking-widest">{selectedPayAsset.symbol}</span>
                <ChevronDown size={10} className={`text-slate-500 transition-transform ${showNetworkSelector ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showNetworkSelector && (
              <div className="absolute right-6 top-20 w-48 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl z-50 p-2 animate-fade-in-up">
                <div className="text-[7px] font-nebula font-black text-slate-500 uppercase tracking-[0.2em] p-2 mb-1">Select Network</div>
                {SUPPORTED_NETWORKS.map((net) => (
                  <button
                    key={net.id}
                    onClick={() => handleNetworkSelect(net)}
                    className="w-full flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-all group"
                  >
                    <img src={net.icon} alt={net.name} className="w-5 h-5" />
                    <span className="text-[9px] font-nebula font-black text-white uppercase tracking-widest group-hover:text-indigo-400">{net.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center -my-6 relative z-20">
             <div className="w-10 h-10 bg-indigo-600 border-4 border-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl">
               <ChevronDown size={16} />
             </div>
          </div>

          <div className="bg-black/20 border border-white/10 rounded-[2rem] p-6 focus-within:border-indigo-500/50 transition-colors">
            <div className="flex justify-between mb-2">
              <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest">You Receive (FLD)</span>
              <span className="text-[8px] font-nebula font-black text-indigo-400 uppercase tracking-widest">Price: ${fldUsdPrice.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between items-center">
              <input 
                type="number" 
                value={fldAmount}
                onChange={(e) => handleFldChange(e.target.value)}
                className="bg-transparent text-xl font-nebula font-black text-white outline-none w-1/2 placeholder:text-slate-800"
                placeholder="0.0"
              />
              <div className="flex items-center gap-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2">
                <Zap size={12} className="text-indigo-400" />
                <span className="text-[10px] font-nebula font-black text-indigo-400">FLD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest">Allocation Progress</span>
            <span className="text-[8px] font-nebula font-black text-white uppercase tracking-widest">
              {isDataLoading ? '...' : `${progress}%`}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-fluid-gradient rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {!account ? (
          <ConnectButton
            client={client}
            wallets={wallets}
            theme="dark"
            connectButton={{
              label: "Secure Allocation",
              className: "!w-full !py-4 !bg-white !text-slate-950 !rounded-[1.5rem] !font-nebula !font-black !text-[10px] !uppercase !tracking-[0.3em] !shadow-2xl hover:!scale-105 active:!scale-95 !transition-all !flex !items-center !justify-center !gap-2"
            }}
          />
        ) : (
          <button 
            onClick={handleBuy}
            disabled={isBuying || isDataLoading}
            className="w-full py-4 bg-white text-slate-950 rounded-[1.5rem] font-nebula font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
          >
            {isBuying ? (
              <>Processing <Loader2 size={12} className="animate-spin" /></>
            ) : (
              <>Secure Allocation <ArrowRight size={12} /></>
            )}
          </button>
        )}

        <div className="mt-6 flex justify-center gap-8">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={10} className="text-emerald-500" />
            <span className="text-[7px] font-nebula font-black text-slate-500 uppercase tracking-widest">Verified Contract</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp size={10} className="text-indigo-400" />
            <span className="text-[7px] font-nebula font-black text-slate-500 uppercase tracking-widest">Live On Chain</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresaleCard;