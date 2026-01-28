import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Coins, Zap, ShieldCheck, Timer, ChevronDown, TrendingUp, ArrowRight, Loader2, Globe, AlertCircle, DollarSign, Gift, Briefcase, ChevronRight, Copy, Check } from 'lucide-react';
import { useReadContract, useSendTransaction, useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain, ConnectButton } from "thirdweb/react";
import { prepareContractCall, toEther, toWei } from "thirdweb";
import { client, wallets } from "../client";
import { presaleContract, fluidTokenContract, chain as presaleChain, SUPPORTED_NETWORKS, TokenInfo, NetworkInfo, PRESALE_CONTRACT_ADDRESS } from "../contracts/presale";
import {
  ethereum, polygon, bsc, arbitrum, optimism, base, avalanche, fantom, gnosis, celo, moonbeam, moonriver, cronos, metis, kava, core, klaytn, linea, scroll
} from "thirdweb/chains";

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M55 20 H90 A5 5 0 0 1 90 35 H55 A5 5 0 0 1 55 20 Z" transform="skewX(-20)" />
    <path d="M40 42 H85 A5 5 0 0 1 85 57 H40 A5 5 0 0 1 40 42 Z" transform="skewX(-20)" />
    <path d="M25 64 H60 A5 5 0 0 1 60 79 H25 A5 5 0 0 1 25 64 Z" transform="skewX(-20)" />
  </svg>
);

const ALL_CHAINS = [
  ethereum, polygon, bsc, arbitrum, optimism, base, avalanche, fantom, gnosis, celo, moonbeam, moonriver, cronos, metis, kava, core, klaytn, linea, scroll
];

const PresaleCard: React.FC = () => {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  
  // State for dual-way inputs
  const [usdAmount, setUsdAmount] = useState('100');
  const [fldAmount, setFldAmount] = useState('200');
  const [copied, setCopied] = useState(false);
  
  // Selectors visibility
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  
  // Ref for handling clicks outside
  const networkRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLDivElement>(null);

  // Default to first network and its first token (Ethereum -> ETH)
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkInfo>(SUPPORTED_NETWORKS[0]);
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(SUPPORTED_NETWORKS[0].tokens[0]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (networkRef.current && !networkRef.current.contains(event.target as Node)) {
        setShowNetworkSelector(false);
      }
      if (tokenRef.current && !tokenRef.current.contains(event.target as Node)) {
        setShowTokenSelector(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(PRESALE_CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Contract Data Fetching ---

  // 1. FLUID Balance
  const { data: fluidBalanceData, isLoading: isLoadingBalance } = useReadContract({
    contract: fluidTokenContract,
    method: "function balanceOf(address) view returns (uint256)",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
  });

  // 2. Token Price in USD
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

  // 5. End Time
  const { data: endTimeData } = useReadContract({
    contract: presaleContract,
    method: "function endTime() view returns (uint256)",
    params: [],
  });

  // --- Derived State & Formatting ---

  const fldUsdPrice = useMemo(() => {
    if (!priceData || priceData === 0n) return 0.50; 
    try {
        return parseFloat(toEther(priceData as bigint));
    } catch (e) {
        return 0.50;
    }
  }, [priceData]);

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

  useEffect(() => {
    const num = parseFloat(usdAmount) || 0;
    setFldAmount((num / fldUsdPrice).toFixed(2));
  }, [fldUsdPrice, usdAmount]);

  const purchasedBalance = useMemo(() => {
    if (!fluidBalanceData) return 0;
    return parseFloat(toEther(fluidBalanceData as bigint));
  }, [fluidBalanceData]);

  const airdropAllocation = useMemo(() => {
    return purchasedBalance * 0.5;
  }, [purchasedBalance]);

  const sold = useMemo(() => (soldData ? Number(toEther(soldData as bigint)) : 1250000), [soldData]);
  const cap = 5000000;
  const progress = useMemo(() => Math.min(Math.round((sold / cap) * 100), 100), [sold, cap]);
  
  // Calculate amount of selected token to send based on USD input
  const tokenAmountToSend = useMemo(() => {
    const usd = parseFloat(usdAmount) || 0;
    return (usd / selectedToken.priceUsd).toFixed(selectedToken.address ? 6 : 18);
  }, [usdAmount, selectedToken]);

  // --- Timer Logic ---
  const [timeLeft, setTimeLeft] = useState({ h: 24, m: 0, s: 0 });
  
  useEffect(() => {
    const target = endTimeData ? Number(endTimeData as bigint) * 1000 : Date.now() + 1000 * 60 * 60 * 24;
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
    
    // Check if network matches
    if (activeChain?.id !== selectedNetwork.id) {
        try {
            await switchChain(selectedNetwork.chain);
        } catch (e) {
            console.error("Failed to switch chain", e);
            return;
        }
    }

    const val = parseFloat(tokenAmountToSend);
    if (!usdAmount || isNaN(val) || val <= 0) return alert("Enter a valid amount.");

    if (selectedToken.address) {
        alert("ERC20 token purchase requires a different flow. This is a mockup.");
        return;
    }

    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function buyTokens() payable",
      value: toWei(tokenAmountToSend),
    });

    sendTx(tx, {
      onSuccess: () => alert("Purchase successful! Your Fluid tokens have been allocated."),
      onError: (err) => console.error("Presale Error:", err),
    });
  };

  const handleNetworkSelect = (network: NetworkInfo) => {
    setSelectedNetwork(network);
    setSelectedToken(network.tokens[0]);
    setShowNetworkSelector(false);
  };

  const handleTokenSelect = (token: TokenInfo) => {
    setSelectedToken(token);
    setShowTokenSelector(false);
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
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-nebula font-black text-emerald-500 uppercase tracking-widest">Live</span>
            </div>
            <span className="text-[9px] font-nebula font-black text-white/40 uppercase tracking-widest">1 FLD = ${fldUsdPrice.toFixed(2)} USD</span>
          </div>
        </div>

        {/* Smart Contract Address Section */}
        <div className="mb-6 bg-black/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
          <span className="text-[7px] font-nebula font-black text-slate-500 uppercase tracking-[0.2em]">Official Presale Contract</span>
          <div className="flex items-center justify-between gap-3">
             <span className="text-[9px] font-mono text-white/70 truncate">{PRESALE_CONTRACT_ADDRESS}</span>
             <button 
               onClick={handleCopyAddress}
               className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
             >
                {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                <span className="text-[7px] font-nebula font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
             </button>
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
            Note: Airdrop is <span className="text-fluid-cyan">50% of the purchased tokens</span>, claimable after presale ends.
          </p>
        </div>

        {/* Selection Row */}
        <div className="flex gap-2 mb-6">
            {/* Network Selector */}
            <div className="relative flex-1" ref={networkRef}>
                <button 
                    onClick={() => setShowNetworkSelector(!showNetworkSelector)}
                    className="w-full flex items-center justify-between bg-black/20 border border-white/10 rounded-2xl px-4 py-3 hover:border-indigo-500/50 transition-all"
                >
                    <div className="flex items-center gap-2 max-w-[80%]">
                        <img src={selectedNetwork.icon} alt={selectedNetwork.name} className="w-4 h-4 rounded-full" />
                        <span className="text-[9px] font-nebula font-black text-white uppercase tracking-widest truncate">{selectedNetwork.name}</span>
                    </div>
                    <ChevronDown size={10} className={`text-slate-500 transition-transform ${showNetworkSelector ? 'rotate-180' : ''}`} />
                </button>
                {showNetworkSelector && (
                    <div className="absolute left-0 right-0 top-12 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl z-[60] p-1 animate-fade-in-up max-h-60 overflow-y-auto custom-scrollbar">
                        {SUPPORTED_NETWORKS.map((net) => (
                            <button
                                key={net.id}
                                onClick={() => handleNetworkSelect(net)}
                                className="w-full flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-all group"
                            >
                                <img src={net.icon} alt={net.name} className="w-4 h-4 rounded-full" />
                                <span className="text-[9px] font-nebula font-black text-white uppercase tracking-widest group-hover:text-indigo-400">{net.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Token Selector */}
            <div className="relative flex-1" ref={tokenRef}>
                <button 
                    onClick={() => setShowTokenSelector(!showTokenSelector)}
                    className="w-full flex items-center justify-between bg-black/20 border border-white/10 rounded-2xl px-4 py-3 hover:border-indigo-500/50 transition-all"
                >
                    <div className="flex items-center gap-2">
                        <img src={selectedToken.icon} alt={selectedToken.symbol} className="w-4 h-4 rounded-full" />
                        <span className="text-[9px] font-nebula font-black text-white uppercase tracking-widest">{selectedToken.symbol}</span>
                    </div>
                    <ChevronDown size={10} className={`text-slate-500 transition-transform ${showTokenSelector ? 'rotate-180' : ''}`} />
                </button>
                {showTokenSelector && (
                    <div className="absolute left-0 right-0 top-12 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl z-[60] p-1 animate-fade-in-up">
                        {selectedNetwork.tokens.map((token) => (
                            <button
                                key={token.symbol}
                                onClick={() => handleTokenSelect(token)}
                                className="w-full flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-all group"
                            >
                                <img src={token.icon} alt={token.symbol} className="w-4 h-4 rounded-full" />
                                <div className="text-left">
                                    <div className="text-[9px] font-nebula font-black text-white uppercase tracking-widest group-hover:text-indigo-400">{token.symbol}</div>
                                    <div className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">{token.name}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
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
                ≈ {parseFloat(tokenAmountToSend).toLocaleString(undefined, { maximumFractionDigits: 6 })} {selectedToken.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 w-full">
                <span className="text-xl font-nebula font-black text-white/50">$</span>
                <input 
                  type="number" 
                  value={usdAmount}
                  onChange={(e) => handleUsdChange(e.target.value)}
                  className="bg-transparent text-xl font-nebula font-black text-white outline-none w-full placeholder:text-slate-800"
                  placeholder="0.0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-6 relative z-20">
             <div className="w-10 h-10 bg-indigo-600 border-4 border-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl">
               <ArrowRight size={16} className="rotate-90" />
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
                <FluidLogo className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px] font-nebula font-black text-indigo-400">FLD</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest">Allocation Progress</span>
            <span className="text-[8px] font-nebula font-black text-white uppercase tracking-widest">
              {progress}%
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
            chains={ALL_CHAINS}
            connectButton={{
              label: "Secure Allocation",
              className: "!w-full !py-4 !bg-white !text-slate-950 !rounded-[1.5rem] !font-nebula !font-black !text-[10px] !uppercase !tracking-[0.3em] !shadow-2xl hover:!scale-105 active:!scale-95 !transition-all !flex !items-center !justify-center !gap-2"
            }}
          />
        ) : (
          <button 
            onClick={handleBuy}
            disabled={isBuying}
            className="w-full py-4 bg-white text-slate-950 rounded-[1.5rem] font-nebula font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
          >
            {isBuying ? (
              <>Processing <Loader2 size={12} className="animate-spin" /></>
            ) : (
              <>Buy Fluid <ArrowRight size={12} /></>
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