import React, { useEffect, useState, useMemo } from 'react';
import { ChevronDown, Lightbulb, Wallet, Check, AlertCircle, Info, ShieldAlert, ShieldCheck, X, AlertTriangle, Unlock, Loader2, ScanEye } from 'lucide-react';
import { 
  useActiveAccount, 
  useSendTransaction, 
  ConnectButton,
  useSwitchActiveWalletChain,
  useActiveWalletChain,
  useReadContract
} from "thirdweb/react";
import { 
  getContract, 
  prepareContractCall, 
  defineChain,
  toWei,
  toUnits
} from "thirdweb";
import { client, wallets } from "../client";
import { analyzeTransactionRisk, TransactionRiskAnalysis } from '../services/geminiService';

// --- Configuration ---
const PRESALE_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; // Placeholder
const FALLBACK_FLUID_PRICE = 0.05; // $0.05 per FLUID

interface PaymentOption {
  id: string;
  symbol: string;
  name: string;
  network: string;
  chainId: number;
  icon: string;
  isNative: boolean;
  address?: string; // Token address
  decimals: number;
}

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="currentColor" />
    <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="currentColor" />
    <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 63.3137 82 60 82H10L15 66Z" fill="currentColor" />
  </svg>
);

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', network: 'ERC-20', chainId: 1, icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026', isNative: true, decimals: 18 },
  { id: 'bnb', symbol: 'BNB', name: 'BNB Smart Chain', network: 'BEP-20', chainId: 56, icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026', isNative: true, decimals: 18 },
  { id: 'usdt_eth', symbol: 'USDT', name: 'Tether', network: 'ERC-20', chainId: 1, icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=026', isNative: false, address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
  { id: 'usdc_poly', symbol: 'USDC', name: 'USD Coin', network: 'Polygon', chainId: 137, icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026', isNative: false, address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6 },
  { id: 'sol', symbol: 'SOL', name: 'Solana', network: 'Solana', chainId: -1, icon: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=026', isNative: true, decimals: 9 },
  { id: 'matic', symbol: 'MATIC', name: 'Polygon', network: 'Polygon', chainId: 137, icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=026', isNative: true, decimals: 18 },
];

const PresaleCard: React.FC = () => {
  const account = useActiveAccount();
  const { mutateAsync: switchChain } = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const chainId = activeChain?.id;
  const { mutateAsync: sendTransaction } = useSendTransaction();

  // State
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>(PAYMENT_OPTIONS[0]);
  const [usdAmount, setUsdAmount] = useState<string>('100');
  const [cryptoPrice, setCryptoPrice] = useState<number>(0);
  const [fluidPrice, setFluidPrice] = useState<number>(FALLBACK_FLUID_PRICE);
  const [showMore, setShowMore] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'PENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  
  // Security & Simulation States
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<TransactionRiskAnalysis | null>(null);
  
  const [agreements, setAgreements] = useState({
    responsibility: false,
    risk: false,
    address: false,
    irreversible: false
  });

  // Calculate amounts
  const cryptoAmount = cryptoPrice > 0 && usdAmount ? parseFloat(usdAmount) / cryptoPrice : 0;
  const fluidAmount = usdAmount ? parseFloat(usdAmount) / fluidPrice : 0;

  // --- Contract Hooks ---
  
  // 1. Define a dummy contract for safe fallbacks
  const dummyContract = useMemo(() => getContract({
    client,
    chain: defineChain(1), // Mainnet as placeholder
    address: "0x0000000000000000000000000000000000000000"
  }), []);

  const tokenContract = useMemo(() => {
    if (selectedPayment.isNative || !selectedPayment.address || selectedPayment.chainId <= 0) {
      return undefined;
    }
    try {
      return getContract({
        client,
        chain: defineChain(selectedPayment.chainId),
        address: selectedPayment.address
      });
    } catch (e) {
      console.error("Failed to create contract instance", e);
      return undefined;
    }
  }, [selectedPayment]);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    // Use dummyContract if tokenContract is undefined to prevent "reading 'chain' of undefined" error
    contract: tokenContract || dummyContract, 
    method: "function allowance(address owner, address spender) view returns (uint256)",
    params: [account?.address || "", PRESALE_CONTRACT_ADDRESS],
    queryOptions: {
      // Only enable the query if we have a valid tokenContract (not the dummy one)
      enabled: !!account && !!tokenContract && !selectedPayment.isNative
    }
  });

  const isAllowanceSufficient = useMemo(() => {
    if (selectedPayment.isNative) return true;
    if (!allowance) return false;
    try {
      const requiredUnits = toUnits(cryptoAmount.toFixed(selectedPayment.decimals), selectedPayment.decimals);
      return BigInt(allowance.toString()) >= BigInt(requiredUnits.toString());
    } catch (e) {
      return false;
    }
  }, [selectedPayment, allowance, cryptoAmount]);

  // --- Fetch Prices ---
  useEffect(() => {
    const fetchPrice = async () => {
      let symbol = selectedPayment.symbol;

      if (symbol === 'USDT' || symbol === 'USDC') {
        setCryptoPrice(1);
        return;
      }

      if (selectedPayment.id === 'sol') {
         setCryptoPrice(145); 
         return;
      }
      
      try {
        const res = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`);
        const data = await res.json();
        
        if (data && data.USD) {
          setCryptoPrice(parseFloat(data.USD));
        } else {
          throw new Error("Invalid price data");
        }
      } catch (e) {
        if (selectedPayment.symbol === 'ETH') setCryptoPrice(2450);
        if (selectedPayment.symbol === 'BNB') setCryptoPrice(580);
        if (selectedPayment.symbol === 'MATIC') setCryptoPrice(0.40);
        console.warn(`Price fetch failed for ${symbol}, using fallback.`);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, [selectedPayment]);

  const handleApprove = async () => {
    if (!tokenContract || !account) return;
    setStatus('PENDING');
    try {
      if (chainId !== selectedPayment.chainId) {
        await switchChain(defineChain(selectedPayment.chainId));
      }
      const amountBigInt = toUnits(cryptoAmount.toFixed(selectedPayment.decimals), selectedPayment.decimals);
      const transaction = prepareContractCall({
        contract: tokenContract,
        method: "function approve(address spender, uint256 amount)",
        params: [PRESALE_CONTRACT_ADDRESS, amountBigInt]
      });
      await sendTransaction(transaction);
      await refetchAllowance();
      setStatus('IDLE');
    } catch (e) {
      console.error(e);
      setStatus('ERROR');
    }
  };

  const handleInitiateBuy = async () => {
    if (!account || !usdAmount || parseFloat(usdAmount) < 10) return;
    
    // Start Simulation
    setIsSimulating(true);
    
    try {
        const result = await analyzeTransactionRisk(
            cryptoAmount.toFixed(4), 
            selectedPayment.symbol, 
            PRESALE_CONTRACT_ADDRESS, 
            selectedPayment.network
        );
        setSimulationResult(result);
    } catch (error) {
        console.error("Simulation failed", error);
    } finally {
        setIsSimulating(false);
        setShowSecurityModal(true);
    }
  };

  const handleConfirmBuy = async () => {
    setShowSecurityModal(false);
    setStatus('PENDING');

    try {
      if (selectedPayment.chainId > 0 && chainId !== selectedPayment.chainId) {
         await switchChain(defineChain(selectedPayment.chainId));
      }

      if (selectedPayment.chainId <= 0) {
          alert("Solana support coming soon. Please use EVM chains.");
          setStatus('IDLE');
          return;
      }

      const activeChainDef = defineChain(selectedPayment.chainId);
      const presaleContract = getContract({
        client,
        chain: activeChainDef,
        address: PRESALE_CONTRACT_ADDRESS,
      });

      const method = selectedPayment.isNative ? "function buyWithNative()" : "function buyWithToken(address token, uint256 amount)";
      const params = selectedPayment.isNative ? [] : [selectedPayment.address, toUnits(cryptoAmount.toFixed(selectedPayment.decimals), selectedPayment.decimals)];
      const value = selectedPayment.isNative ? toWei(cryptoAmount.toFixed(18)) : undefined;

      const transaction = prepareContractCall({
        contract: presaleContract,
        method: method,
        params: params,
        value: value,
      });

      await sendTransaction(transaction);
      setStatus('SUCCESS');
    } catch (e) {
      console.error(e);
      setStatus('ERROR');
    }
  };

  const allAgreed = Object.values(agreements).every(v => v);

  return (
    <div className="w-full max-w-[480px] mx-auto z-10">
      <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">Buy $FLUID Presale</h2>
            <div className="flex items-center gap-2 mt-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Sale is Live</span>
            </div>
        </div>

        <div className="p-6 space-y-6">
            {/* Payment Selector */}
            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Select Payment Method</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Info size={12} /> Supporting {PAYMENT_OPTIONS.length}+ Chains
                    </span>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                    {PAYMENT_OPTIONS.slice(0, 5).map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setSelectedPayment(opt)}
                            className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 group ${
                                selectedPayment.id === opt.id 
                                ? 'bg-white/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                            }`}
                        >
                            <img src={opt.icon} alt={opt.symbol} className="w-8 h-8 rounded-full mb-1.5 shadow-sm" />
                            <span className="text-[10px] font-bold text-slate-300">{opt.symbol}</span>
                            <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-[8px] text-slate-400 border border-slate-700 px-1 rounded-sm scale-75 origin-center">
                                {opt.network}
                            </span>
                        </button>
                    ))}
                    <button 
                        onClick={() => setShowMore(!showMore)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-white/10 bg-transparent hover:bg-white/5 transition-all text-slate-500 hover:text-white"
                    >
                        <ChevronDown size={20} className={`mb-1 transition-transform ${showMore ? 'rotate-180' : ''}`} />
                        <span className="text-[10px] font-bold">More</span>
                    </button>
                </div>

                {showMore && (
                    <div className="grid grid-cols-4 gap-2 animate-fade-in-up">
                        {PAYMENT_OPTIONS.slice(5).map(opt => (
                             <button
                                key={opt.id}
                                onClick={() => setSelectedPayment(opt)}
                                className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                                    selectedPayment.id === opt.id 
                                    ? 'bg-white/10 border-orange-500/50' 
                                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                                }`}
                            >
                                <img src={opt.icon} alt={opt.symbol} className="w-8 h-8 rounded-full mb-1.5" />
                                <span className="text-[10px] font-bold text-slate-300">{opt.symbol}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Input Section */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">You Pay (USD)</label>
                    <div className="relative group">
                        <input 
                            type="number"
                            value={usdAmount}
                            onChange={(e) => setUsdAmount(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-4 pr-32 text-2xl font-bold text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                            placeholder="0.00"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                            <img src={selectedPayment.icon} className="w-5 h-5 rounded-full" />
                            <div className="text-right">
                                <div className="text-xs font-bold text-white leading-none">{selectedPayment.symbol}</div>
                                <div className="text-[10px] text-slate-400 font-mono leading-none mt-0.5">
                                    {cryptoAmount.toFixed(4)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-orange-400/80 pl-1 font-medium">
                        <Lightbulb size={12} /> Min: $10
                    </div>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-slate-800 border border-slate-700 p-1.5 rounded-full text-slate-400">
                        <ChevronDown size={16} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 ml-1 uppercase">You Receive ($FLUID)</label>
                    <div className="relative">
                        <div className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-4 pr-32 text-2xl font-bold text-emerald-400 cursor-default">
                            {fluidAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-1 flex items-center justify-center">
                                <FluidLogo className="w-full h-full text-white" />
                            </div>
                            <span className="text-xs font-bold text-emerald-400">FLUID</span>
                        </div>
                    </div>
                    <div className="flex justify-between px-1 text-xs font-medium text-slate-500">
                        <span>1 FLUID = ${fluidPrice.toFixed(3)}</span>
                        <span>Next Price: ${(fluidPrice * 1.2).toFixed(3)}</span>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
                {!account ? (
                    <ConnectButton 
                        client={client}
                        wallets={wallets}
                        theme={"dark"}
                        connectButton={{
                            label: "Connect Wallet",
                            className: "!w-full !py-4 !rounded-xl !text-lg !font-bold !bg-gradient-to-r !from-orange-500 !to-amber-500 !text-white !border-none hover:!brightness-110 transition-all shadow-lg shadow-orange-500/20"
                        }}
                    />
                ) : !isAllowanceSufficient ? (
                    <button
                        onClick={handleApprove}
                        disabled={status === 'PENDING'}
                        className="w-full py-4 rounded-xl text-lg font-bold bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        {status === 'PENDING' ? (
                            <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                        ) : (
                            <Unlock size={20} />
                        )}
                        {status === 'PENDING' ? 'Approving...' : `Approve ${selectedPayment.symbol}`}
                    </button>
                ) : (
                    <button
                        onClick={handleInitiateBuy}
                        disabled={status === 'PENDING' || isSimulating}
                        className="w-full py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSimulating ? (
                            <>
                                <ScanEye className="animate-pulse" size={20} />
                                Simulating...
                            </>
                        ) : status === 'PENDING' ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Confirming...
                            </>
                        ) : (
                            <>
                                <Wallet size={20} />
                                Buy Tokens
                            </>
                        )}
                    </button>
                )}
            </div>
            
            {status === 'SUCCESS' && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 animate-fade-in-up">
                    <Check size={18} className="text-emerald-500" />
                    <p className="text-sm text-emerald-200">Purchase successful! Tokens will be airdropped.</p>
                </div>
            )}
            {status === 'ERROR' && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-fade-in-up">
                    <AlertCircle size={18} className="text-red-500" />
                    <p className="text-sm text-red-200">Transaction failed. Please check your wallet.</p>
                </div>
            )}
        </div>

        {/* Security Confirmation Modal */}
        {showSecurityModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/98 backdrop-blur-2xl flex flex-col p-6 animate-fade-in-up">
              <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 text-orange-500">
                      <ShieldAlert size={24} />
                      <h3 className="text-xl font-bold uppercase tracking-tight">Final Security Review</h3>
                  </div>
                  <button onClick={() => setShowSecurityModal(false)} className="text-slate-500 hover:text-white transition-colors">
                      <X size={24} />
                  </button>
              </div>

              <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                  
                  {/* Simulation Report */}
                  {simulationResult && (
                      <div className={`p-4 rounded-2xl border ${
                          simulationResult.riskLevel === 'HIGH' ? 'bg-red-500/10 border-red-500/30' :
                          simulationResult.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/30' :
                          'bg-emerald-500/10 border-emerald-500/30'
                      }`}>
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Simulation Report</span>
                              <span className={`text-xs font-black px-2 py-0.5 rounded ${
                                  simulationResult.riskLevel === 'HIGH' ? 'bg-red-500 text-white' :
                                  simulationResult.riskLevel === 'MEDIUM' ? 'bg-amber-500 text-black' :
                                  'bg-emerald-500 text-white'
                              }`}>Score: {simulationResult.score}/100</span>
                          </div>
                          <p className="text-sm font-bold text-white mb-2">{simulationResult.summary}</p>
                          {simulationResult.warnings.length > 0 && (
                              <ul className="text-xs space-y-1">
                                  {simulationResult.warnings.map((w, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                          <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                                          <span className="opacity-80">{w}</span>
                                      </li>
                                  ))}
                              </ul>
                          )}
                      </div>
                  )}

                  <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex gap-3">
                      <AlertTriangle className="text-orange-500 shrink-0" size={20} />
                      <p className="text-xs text-orange-200/90 leading-relaxed">
                        Warning: Blockchain transactions are <strong>permanent and irreversible</strong>. Fluid Protocol cannot refund mistaken payments.
                      </p>
                  </div>

                  <div className="space-y-5">
                      <label className="flex gap-4 cursor-pointer group select-none">
                          <input 
                            type="checkbox" 
                            className="mt-1 w-5 h-5 rounded border-slate-700 bg-slate-900 text-orange-500 focus:ring-orange-500/50 transition-all cursor-pointer" 
                            checked={agreements.responsibility}
                            onChange={(e) => setAgreements(prev => ({...prev, responsibility: e.target.checked}))}
                          />
                          <div className="text-sm">
                              <span className="font-bold text-white block mb-0.5">Custody Awareness</span>
                              <span className="text-slate-500 group-hover:text-slate-400 transition-colors">I accept that Fluid is non-custodial and I am responsible for my own security.</span>
                          </div>
                      </label>

                      <label className="flex gap-4 cursor-pointer group select-none">
                          <input 
                            type="checkbox" 
                            className="mt-1 w-5 h-5 rounded border-slate-700 bg-slate-900 text-orange-500 focus:ring-orange-500/50 transition-all cursor-pointer" 
                            checked={agreements.risk}
                            onChange={(e) => setAgreements(prev => ({...prev, risk: e.target.checked}))}
                          />
                          <div className="text-sm">
                              <span className="font-bold text-white block mb-0.5">High-Risk Notice</span>
                              <span className="text-slate-500 group-hover:text-slate-400 transition-colors">I am aware of the volatility and risks associated with early-stage crypto presales.</span>
                          </div>
                      </label>

                      <label className="flex gap-4 cursor-pointer group select-none">
                          <input 
                            type="checkbox" 
                            className="mt-1 w-5 h-5 rounded border-slate-700 bg-slate-900 text-orange-500 focus:ring-orange-500/50 transition-all cursor-pointer" 
                            checked={agreements.address}
                            onChange={(e) => setAgreements(prev => ({...prev, address: e.target.checked}))}
                          />
                          <div className="text-sm">
                              <span className="font-bold text-white block mb-0.5">Network & Assets Check</span>
                              <span className="text-slate-500 group-hover:text-slate-400 transition-colors">I verified that I am on the <strong>{selectedPayment.network}</strong> network for this <strong>{selectedPayment.symbol}</strong> payment.</span>
                          </div>
                      </label>

                      <label className="flex gap-4 cursor-pointer group select-none">
                          <input 
                            type="checkbox" 
                            className="mt-1 w-5 h-5 rounded border-slate-700 bg-slate-900 text-orange-500 focus:ring-orange-500/50 transition-all cursor-pointer" 
                            checked={agreements.irreversible}
                            onChange={(e) => setAgreements(prev => ({...prev, irreversible: e.target.checked}))}
                          />
                          <div className="text-sm">
                              <span className="font-bold text-white block mb-0.5">Irreversibility Acknowledgement</span>
                              <span className="text-slate-500 group-hover:text-slate-400 transition-colors">I understand this transaction cannot be cancelled once signed by my wallet.</span>
                          </div>
                      </label>
                  </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                  <div className="mb-4 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase px-1">
                      <span>Network Gas Fee</span>
                      <span className="text-slate-300">~0.0002 {selectedPayment.chainId === 1 ? 'ETH' : selectedPayment.chainId === 56 ? 'BNB' : 'MATIC'}</span>
                  </div>
                  <button
                      disabled={!allAgreed}
                      onClick={handleConfirmBuy}
                      className="w-full py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                      <ShieldCheck size={20} />
                      Sign Transaction
                  </button>
                  <p className="text-center text-[9px] text-slate-600 mt-4 uppercase tracking-[0.2em] font-black">Fluid Secure Bridge Engine</p>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresaleCard;