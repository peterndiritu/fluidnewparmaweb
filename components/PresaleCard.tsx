import React, { useState, useEffect, useMemo } from 'react';
import { Coins, Zap, ShieldCheck, Timer, ChevronDown, TrendingUp, ArrowRight, Loader2, Globe, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';
import { useReadContract, useSendTransaction, useActiveAccount, useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";
import { prepareContractCall, toEther, toWei } from "thirdweb";
import { presaleContract, fluidTokenContract, chain as presaleChain, SUPPORTED_NETWORKS } from "../contracts/presale";

const PresaleCard: React.FC = () => {
  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  
  const [payAmount, setPayAmount] = useState('0.1');
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [selectedPayAsset, setSelectedPayAsset] = useState({ symbol: 'ETH', name: 'Ethereum', ethPrice: 2450 }); // Mock ETH price for UI estimates

  const isWrongNetwork = useMemo(() => {
    if (!account || !activeChain) return false;
    return activeChain.id !== presaleChain.id;
  }, [account, activeChain]);

  // --- Contract Data Fetching ---

  // 1. FLUID Balance for connected user
  const { data: fluidBalanceData, isLoading: isLoadingBalance } = useReadContract({
    contract: fluidTokenContract,
    method: "function balanceOf(address) view returns (uint256)",
    params: [account?.address || "0x0000000000000000000000000000000000000000"],
  });

  // 2. Token Price in USD (Assuming contract returns USD value in 18 decimals)
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

  const fluidBalance = useMemo(() => {
    if (!fluidBalanceData) return "0";
    return parseFloat(toEther(fluidBalanceData as bigint)).toLocaleString(undefined, { maximumFractionDigits: 2 });
  }, [fluidBalanceData]);

  // Token Price in USD - Default 1.00 if not set or failing
  const fldUsdPrice = useMemo(() => {
    if (!priceData || priceData === 0n) return 1.00; 
    try {
        return parseFloat(toEther(priceData as bigint));
    } catch (e) {
        return 1.00;
    }
  }, [priceData]);

  const sold = useMemo(() => (soldData ? Number(toEther(soldData as bigint)) : 0), [soldData]);
  const cap = useMemo(() => (capData ? Number(toEther(capData as bigint)) : 1000000), [capData]);
  const progress = useMemo(() => Math.min(Math.round((sold / cap) * 100), 100), [sold, cap]);
  
  // Estimate tokens received based on ETH/USD price and FLUID/USD price
  const receiveAmount = useMemo(() => {
    const val = parseFloat(payAmount) || 0;
    const usdValue = val * selectedPayAsset.ethPrice;
    return fldUsdPrice > 0 ? usdValue / fldUsdPrice : 0;
  }, [payAmount, fldUsdPrice, selectedPayAsset.ethPrice]);

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
    if (!account) return alert("Please connect your wallet first.");
    if (isWrongNetwork) {
      try {
        await switchChain(presaleChain);
      } catch (e) {
        console.error("Failed to switch chain", e);
      }
      return;
    }
    if (!payAmount || parseFloat(payAmount) <= 0) return alert("Enter a valid amount.");

    const tx = prepareContractCall({
      contract: presaleContract,
      method: "function buyTokens() payable",
      value: toWei(payAmount),
    });

    sendTx(tx, {
      onSuccess: () => alert("Contribution successful! Allocation secured."),
      onError: (err) => console.error("Presale Error:", err),
    });
  };

  const handleNetworkSelect = (network: any) => {
    switchChain(network.chain);
    // Mock prices for various assets
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
    <div className="w-full max-w-lg bg-slate-