
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Timer, ChevronDown, ArrowRight, Loader2, AlertCircle, Briefcase, Gift, Copy, Check, ShieldCheck, TrendingUp } from 'lucide-react';
import { useReadContract, useSendTransaction, useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain, ConnectButton } from "thirdweb/react";
// Added missing getContract import from thirdweb
import { prepareContractCall, toEther, toWei, readContract, getContract } from "thirdweb";
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
  
  // Requirement: 1 FLD = 1 USD
  const FLD_USD_PRICE = 1.00;

  const [usdAmount, setUsdAmount] = useState('100');
  const [fldAmount, setFldAmount] = useState('100');
  const [copied, setCopied] = useState(false);
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const networkRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<HTMLDivElement>(null);

  const [selectedNetwork, setSelectedNetwork] = useState<NetworkInfo>(SUPPORTED_NETWORKS[0]);
  const [selectedToken, setSelectedToken] = useState<TokenInfo>(SUPPORTED_NETWORKS[0].tokens[0]);

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

  // --- Contract Reads ---
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

  const tokenName = (contractTokenName as string) || "Fluid";
  const tokenSymbol = (contractTokenSymbol as string) || "FLD";
  const purchasedBalance = useMemo(() => fluidBalanceData ? parseFloat(toEther(fluidBalanceData as bigint)) : 0, [fluidBalanceData]);
  const airdropAllocation = useMemo(() => purchasedBalance * 0.5, [purchasedBalance]);
  const totalClaimable = purchasedBalance + airdropAllocation;
  const sold = useMemo(() => soldData ? parseFloat(toEther(soldData as bigint)) : 0, [soldData]);
  const pool = useMemo(() => poolData ? parseFloat(toEther(poolData as bigint)) : 3000000, [poolData]);
  const progress = useMemo(() => pool > 0 ? Math.min(Math.round((sold / pool) * 100), 100) : 0, [sold, pool]);

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
    if (!account) return;
    if (activeChain?.id !== selectedNetwork.id) {
      try { await switchChain(selectedNetwork.chain); } catch (e) { return; }
    }

    const fldToBuy = parseFloat(fldAmount);
    if (isNaN(fldToBuy) || fldToBuy <= 0) return alert("Invalid amount");

    if (selectedToken.address) {
      // ERC20 Flow: 1. Approve 2. buyWithERC20
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
      // Native Flow: buyWithNative
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
            <span className="text-[8px] font-nebula font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Entry Phase</span>
            <h3 className="text-lg md:text-xl font-nebula font-black text-white uppercase tracking-tighter">Genesis <span className="text-fluid-gradient">Liquidity</span></h3>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 mb-1">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-nebula font-black text-emerald-500 uppercase tracking-widest">Active</span>
            </div>
            <span className="text-[9px] font-nebula font-black text-white/40 uppercase tracking-widest">
              1 {tokenSymbol} = $1.00 USD
            </span>
          </div>
        </div>

        <div className="mb-6 bg-black/30 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
          <span className="text-[7px] font-nebula font-black text-slate-500 uppercase tracking-[0.2em]">Fluid Smart Contract</span>
          <div className="flex items-center justify-between gap-3">
             <span className="text-[9px] font-mono text-white/70 truncate">{PRESALE_CONTRACT_ADDRESS}</span>
             <button onClick={handleCopyAddress} className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-1.5">
                {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                <span className="text-[7px] font-nebula font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
             </button>
          </div>
        </div>

        {account && (
          <div className="space-y-3 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-[2rem] flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase size={10} className="text-indigo-400" />
                  <span className="text-[7px] font-nebula font-black text-slate-400 uppercase tracking-widest">Balance</span>
                </div>
                <div className="text-white font-nebula font-black text-xs">
                  {isLoadingBalance ? <Loader2 size={12} className="animate-spin" /> : `${purchasedBalance.toLocaleString()} ${tokenSymbol}`}
                </div>
              </div>
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-[2rem] flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Gift size={10} className="text-purple-400" />
                  <span className="text-[7px] font-nebula font-black text-slate-400 uppercase tracking-widest">Airdrop</span>
                </div>
                <div className="text-white font-nebula font-black text-xs">
                  {isLoadingBalance ? <Loader2 size={12} className="animate-spin" /> : `${airdropAllocation.toLocaleString()} ${tokenSymbol}`}
                </div>
              </div>
            </div>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] flex justify-between items-center px-6">
              <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-[0.2em]">Claimable Total</span>
              <span className="text-emerald-400 font-nebula font-black text-sm">
                {isLoadingBalance ? <Loader2 size={14} className="animate-spin" /> : `${totalClaimable.toLocaleString()} ${tokenSymbol}`}
              </span>
            </div>
          </div>
        )}

        <div className="mb-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3 items-start relative group">
          <AlertCircle size={14} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight relative z-10">
            Airdrop is <span className="text-fluid-cyan">50% of purchased tokens</span>. <br/>
            Reward allocation is <span className="text-white">claimable with the presale</span>.
          </p>
        </div>

        <div className="flex gap-2 mb-6">
            <div className="relative flex-1" ref={networkRef}>
                <button onClick={() => setShowNetworkSelector(!showNetworkSelector)} className="w-full flex items-center justify-between bg-black/20 border border-white/10 rounded-2xl px-4 py-3 hover:border-indigo-500/50 transition-all">
                    <div className="flex items-center gap-2 max-w-[80%]">
                        <img src={selectedNetwork.icon} alt={selectedNetwork.name} className="w-4 h-4 rounded-full" />
                        <span className="text-[9px] font-nebula font-black text-white uppercase tracking-widest truncate">{selectedNetwork.name}</span>
                    </div>
                    <ChevronDown size={10} className={`text-slate-500 transition-transform ${showNetworkSelector ? 'rotate-180' : ''}`} />
                </button>
                {showNetworkSelector && (
                    <div className="absolute left-0 right-0 top-12 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl z-[60] p-1 animate-fade-in-up">
                        {SUPPORTED_NETWORKS.map((net) => (
                            <button key={net.id} onClick={() => { setSelectedNetwork(net); setSelectedToken(net.tokens[0]); setShowNetworkSelector(false); }} className="w-full flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-all group">
                                <img src={net.icon} alt={net.name} className="w-4 h-4 rounded-full" />
                                <span className="text-[9px] font-nebula font-black text-white uppercase tracking-widest">{net.name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="relative flex-1" ref={tokenRef}>
                <button onClick={() => setShowTokenSelector(!showTokenSelector)} className="w-full flex items-center justify-between bg-black/20 border border-white/10 rounded-2xl px-4 py-3 hover:border-indigo-500/50 transition-all">
                    <div className="flex items-center gap-2">
                        <img src={selectedToken.icon} alt={selectedToken.symbol} className="w-4 h-4 rounded-full" />
                        <span className="text-[9px] font-nebula font-black text-white uppercase tracking-widest">{selectedToken.symbol}</span>
                    </div>
                    <ChevronDown size={10} className={`text-slate-500 transition-transform ${showTokenSelector ? 'rotate-180' : ''}`} />
                </button>
                {showTokenSelector && (
                    <div className="absolute left-0 right-0 top-12 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl z-[60] p-1 animate-fade-in-up">
                        {selectedNetwork.tokens.map((token) => (
                            <button key={token.symbol} onClick={() => { setSelectedToken(token); setShowTokenSelector(false); }} className="w-full flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-xl transition-all group text-left">
                                <img src={token.icon} alt={token.symbol} className="w-4 h-4 rounded-full" />
                                <div>
                                    <div className="text-[9px] font-nebula font-black text-white uppercase tracking-widest">{token.symbol}</div>
                                    <div className="text-[7px] text-slate-500 font-bold uppercase">{token.name}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-black/20 border border-white/10 rounded-[2rem] p-6 focus-within:border-indigo-500/50 transition-colors relative">
            <div className="flex justify-between mb-2">
              <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest">Payment Amount</span>
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
              <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest">You Receive ({tokenSymbol})</span>
              <span className="text-[8px] font-nebula font-black text-indigo-400 uppercase tracking-widest">Fixed: $1.00 USD</span>
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

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[8px] font-nebula font-black text-slate-500 uppercase tracking-widest">Sale Completion</span>
            <span className="text-[8px] font-nebula font-black text-white uppercase tracking-widest">
              {isLoadingSold ? <Loader2 size={10} className="animate-spin" /> : `${progress}%`}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-fluid-gradient rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between mt-2">
             <span className="text-[7px] font-nebula font-black text-slate-500 uppercase tracking-widest">
                {isLoadingSold ? '...' : sold.toLocaleString()} {tokenSymbol} Sold
             </span>
             <span className="text-[7px] font-nebula font-black text-slate-500 uppercase tracking-widest">
                Hard Cap: {isLoadingPool ? '...' : pool.toLocaleString()} {tokenSymbol}
             </span>
          </div>
        </div>

        {!account ? (
          <ConnectButton client={client} wallets={wallets} theme="dark" chains={ALL_CHAINS} connectButton={{ label: "Access Genesis", className: "!w-full !py-4 !bg-white !text-slate-950 !rounded-[1.5rem] !font-nebula !font-black !text-[10px] !uppercase !tracking-[0.3em] !shadow-2xl" }} />
        ) : (
          <button onClick={handleBuy} disabled={isProcessing} className="w-full py-4 bg-white text-slate-950 rounded-[1.5rem] font-nebula font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {isProcessing ? <>Finalizing <Loader2 size={12} className="animate-spin" /></> : <>Buy {tokenName} <ArrowRight size={12} /></>}
          </button>
        )}

        <div className="mt-6 flex justify-center gap-8 opacity-60">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={10} className="text-emerald-500" />
            <span className="text-[7px] font-nebula font-black text-slate-500 uppercase tracking-widest">Audited Layer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp size={10} className="text-indigo-400" />
            <span className="text-[7px] font-nebula font-black text-slate-500 uppercase tracking-widest">Mainnet Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresaleCard;
