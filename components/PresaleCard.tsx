import React, { useEffect, useState, useMemo } from 'react';
import { ChevronDown, Wallet, Check, Info, ShieldAlert, ShieldCheck, X, Loader2, ScanEye, History, HelpCircle, Unlock } from 'lucide-react';
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

const PRESALE_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
const FALLBACK_FLUID_PRICE = 0.05;

interface PaymentOption {
  id: string;
  symbol: string;
  name: string;
  network: string;
  chainId: number;
  icon: string;
  isNative: boolean;
  address?: string;
  decimals: number;
  description: string;
}

const FluidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M45 22H80C83.3137 22 86 24.6863 86 28V32C86 35.3137 83.3137 38 80 38H40L45 22Z" fill="currentColor" />
    <path d="M30 44H70C73.3137 44 76 46.6863 76 50V54C76 57.3137 73.3137 60 70 60H25L30 44Z" fill="currentColor" />
    <path d="M15 66H60C63.3137 66 66 68.6863 66 72V76C66 79.3137 83.3137 82 60 82H10L15 66Z" fill="currentColor" />
  </svg>
);

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', network: 'ERC-20', chainId: 1, icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026', isNative: true, decimals: 18, description: 'Pay using native Ethereum on the main execution layer.' },
  { id: 'bnb', symbol: 'BNB', name: 'BNB Smart Chain', network: 'BEP-20', chainId: 56, icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026', isNative: true, decimals: 18, description: 'Pay using BNB on the Binance Smart Chain for lower fees.' },
  { id: 'usdt_eth', symbol: 'USDT', name: 'Tether (ERC20)', network: 'ERC-20', chainId: 1, icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=026', isNative: false, address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6, description: 'Pay with Tether stablecoin on the Ethereum network.' },
  { id: 'usdc_poly', symbol: 'USDC', name: 'USD Coin (Polygon)', network: 'Polygon', chainId: 137, icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026', isNative: false, address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6, description: 'Pay with USDC stablecoin on the Polygon network.' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', network: 'Solana', chainId: -1, icon: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=026', isNative: true, decimals: 9, description: 'Pay using native SOL. Requires a cross-chain bridge (Beta).' },
  { id: 'matic', symbol: 'MATIC', name: 'Polygon', network: 'Polygon', chainId: 137, icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=026', isNative: true, decimals: 18, description: 'Pay using native MATIC on the Polygon PoS network.' },
];

const Tooltip = ({ content, children }: { content: string, children?: React.ReactNode }) => (
  <div className="relative group custom-tooltip-trigger">
    {children}
    <div className="custom-tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-slate-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible transform translate-y-2 transition-all duration-200 z-[60] pointer-events-none">
      <p className="text-[10px] text-slate-300 leading-relaxed font-medium">{content}</p>
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-slate-900"></div>
    </div>
  </div>
);

// Added interface for PaymentOptionButton props to improve type safety
interface PaymentOptionButtonProps {
  opt: PaymentOption;
  isSelected: boolean;
  onSelect: (opt: PaymentOption) => void;
  isSmall?: boolean;
}

// Fixed PaymentOptionButton by using React.FC which includes 'key' in intrinsic props
const PaymentOptionButton: React.FC<PaymentOptionButtonProps> = ({ opt, isSelected, onSelect, isSmall = false }) => (
  <Tooltip content={opt.description}>
    <button
        onClick={() => onSelect(opt)}
        className={`group relative flex flex-col items-center justify-center transition-all duration-300 rounded-2xl border ${
            isSmall ? 'p-2.5' : 'p-3'
        } ${
            isSelected 
            ? 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.4)] scale-[1.05] z-10' 
            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
        }`}
    >
        {isSelected && (
            <div className="absolute -top-1.5 -right-1.5 bg-fluid-gradient rounded-full p-1 shadow-lg animate-fade-in-up">
                <Check size={8} className="text-white font-black" />
            </div>
        )}
        <img 
          src={opt.icon} 
          alt={opt.symbol} 
          className={`${isSmall ? 'w-5 h-5' : 'w-7 h-7'} rounded-full mb-1.5 transition-transform group-hover:scale-110`} 
        />
        <span className={`font-nebula uppercase tracking-tighter ${isSmall ? 'text-[8px]' : 'text-[10px]'} ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
          {opt.symbol}
        </span>
        {!isSmall && (
            <span className="absolute -top-1 -right-1 bg-slate-900 text-[6px] text-slate-500 border border-white/5 px-1 rounded uppercase font-nebula font-black tracking-tighter">
                {opt.network}
            </span>
        )}
    </button>
  </Tooltip>
);

const PresaleCard: React.FC = () => {
  const account = useActiveAccount();
  const { mutateAsync: switchChain } = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const chainId = activeChain?.id;
  const { mutateAsync: sendTransaction } = useSendTransaction();

  const [selectedPayment, setSelectedPayment] = useState<PaymentOption>(PAYMENT_OPTIONS[0]);
  const [usdAmount, setUsdAmount] = useState<string>('1000');
  const [cryptoPrice, setCryptoPrice] = useState<number>(0);
  const [fluidPrice, setFluidPrice] = useState<number>(FALLBACK_FLUID_PRICE);
  const [showMore, setShowMore] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'PENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<TransactionRiskAnalysis | null>(null);
  const [agreements, setAgreements] = useState({ responsibility: false, irreversible: false });
  
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('fluid_recent_payments');
    return saved ? JSON.parse(saved) : [];
  });

  const recentPayments = useMemo(() => {
    return recentIds
      .map(id => PAYMENT_OPTIONS.find(opt => opt.id === id))
      .filter((opt): opt is PaymentOption => !!opt);
  }, [recentIds]);

  const selectPayment = (opt: PaymentOption) => {
    setSelectedPayment(opt);
    setRecentIds(prev => {
      const filtered = prev.filter(id => id !== opt.id);
      const updated = [opt.id, ...filtered].slice(0, 3);
      localStorage.setItem('fluid_recent_payments', JSON.stringify(updated));
      return updated;
    });
  };

  const cryptoAmount = useMemo(() => 
    cryptoPrice > 0 && usdAmount ? parseFloat(usdAmount) / cryptoPrice : 0
  , [cryptoPrice, usdAmount]);

  const fluidAmount = useMemo(() => 
    usdAmount ? parseFloat(usdAmount) / fluidPrice : 0
  , [usdAmount, fluidPrice]);

  const dummyContract = useMemo(() => getContract({
    client,
    chain: defineChain(1),
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
      return undefined;
    }
  }, [selectedPayment]);

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    contract: tokenContract || dummyContract, 
    method: "function allowance(address owner, address spender) view returns (uint256)",
    params: [account?.address || "", PRESALE_CONTRACT_ADDRESS],
    queryOptions: {
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

  useEffect(() => {
    const fetchPrice = async () => {
      let symbol = selectedPayment.symbol;
      if (symbol === 'USDT' || symbol === 'USDC') {
        setCryptoPrice(1);
        return;
      }
      try {
        const res = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`);
        const data = await res.json();
        if (data && data.USD) {
          setCryptoPrice(parseFloat(data.USD));
        }
      } catch (e) {
        if (selectedPayment.symbol === 'ETH') setCryptoPrice(2450);
        if (selectedPayment.symbol === 'BNB') setCryptoPrice(580);
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [selectedPayment]);

  const handleInitiateBuy = async () => {
    if (!account || !usdAmount || parseFloat(usdAmount) < 10) return;
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
      setStatus('ERROR');
    }
  };

  const allAgreed = agreements.responsibility && agreements.irreversible;

  return (
    <div className="w-full max-w-[440px] mx-auto z-10">
      <div className="bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="p-8 pb-4 text-center">
            <h2 className="text-2xl md:text-3xl font-nebula font-black text-white uppercase italic tracking-tighter text-fluid-gradient">
                Buy $FLUID Genesis
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 text-[10px] font-nebula font-bold uppercase tracking-widest">Genesis Round Live</span>
            </div>
        </div>
        
        <div className="p-8 space-y-6">
            {recentPayments.length > 0 && (
                <div className="space-y-2 animate-fade-in-up">
                    <div className="flex items-center gap-2 text-[10px] font-nebula font-black uppercase tracking-widest text-slate-500 ml-1">
                        <History size={12} /> Recently Used
                    </div>
                    <div className="flex gap-2">
                        {recentPayments.map(opt => (
                            <div key={`recent-${opt.id}`} className="flex-1">
                                <PaymentOptionButton opt={opt} isSelected={selectedPayment.id === opt.id} onSelect={selectPayment} isSmall={true} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-nebula font-black uppercase tracking-widest text-slate-500">
                    <span>Payment Method</span>
                    <span className="flex items-center gap-1 opacity-60">
                        <HelpCircle size={10} /> Multi-Chain
                    </span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                    {PAYMENT_OPTIONS.slice(0, 3).map(opt => (
                        <PaymentOptionButton key={opt.id} opt={opt} isSelected={selectedPayment.id === opt.id} onSelect={selectPayment} />
                    ))}
                    <button 
                        onClick={() => setShowMore(!showMore)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border border-dashed transition-all text-slate-500 hover:text-white ${
                            showMore ? 'bg-indigo-500/10 border-indigo-500/30 text-white' : 'border-white/10 bg-transparent hover:bg-white/5'
                        }`}
                    >
                        <ChevronDown size={18} className={`mb-1 transition-transform ${showMore ? 'rotate-180' : ''}`} />
                        <span className="text-[9px] font-nebula font-black uppercase">{showMore ? 'Hide' : 'More'}</span>
                    </button>
                </div>
                {showMore && (
                    <div className="grid grid-cols-4 gap-2.5 animate-fade-in-up">
                        {PAYMENT_OPTIONS.slice(3).map(opt => (
                             <PaymentOptionButton key={opt.id} opt={opt} isSelected={selectedPayment.id === opt.id} onSelect={selectPayment} />
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-[1.5rem] flex items-center justify-between group shadow-inner">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5">
                        <img src={selectedPayment.icon} className="w-6 h-6" alt={selectedPayment.symbol} />
                    </div>
                    <div>
                        <div className="text-xs font-nebula font-black text-white leading-none uppercase tracking-tight">{selectedPayment.name}</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{selectedPayment.network} Network</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-nebula font-black text-indigo-400">1 {selectedPayment.symbol} = ${cryptoPrice.toLocaleString()}</div>
                    <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Live Rate</div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-nebula font-black text-slate-500 uppercase tracking-widest ml-1">Deposit Amount (USD)</label>
                    <div className="relative group">
                        <input 
                            type="number" 
                            value={usdAmount}
                            onChange={(e) => setUsdAmount(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-5 pr-32 text-2xl font-nebula font-black text-white placeholder-slate-800 focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                            placeholder="0.00"
                        />
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/5 px-2.5 py-2 rounded-xl border border-white/10 backdrop-blur-md">
                            <img src={selectedPayment.icon} className="w-5 h-5 rounded-full" />
                            <span className="text-[10px] font-nebula font-black text-white">{selectedPayment.symbol}</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-nebula font-black text-slate-500 uppercase tracking-widest ml-1">Receive FLUID</label>
                    <div className="relative">
                        <div className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-5 pr-32 text-2xl font-nebula font-black text-white min-h-[66px] flex items-center shadow-inner">
                            {fluidAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-purple-500/10 px-2.5 py-2 rounded-xl border border-purple-500/20 backdrop-blur-md">
                            <FluidLogo className="w-5 h-5 text-purple-400" />
                            <span className="text-[10px] font-nebula font-black text-purple-400">FLUID</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="pt-2">
                {!account ? (
                    <ConnectButton 
                        client={client}
                        wallets={wallets}
                        theme={"dark"}
                        connectButton={{
                            label: "Connect Vault",
                            className: "!w-full !py-4 !rounded-2xl !text-sm !font-nebula !font-black !bg-white !text-slate-950 !border-none hover:!brightness-90 transition-all uppercase !tracking-widest !shadow-xl"
                        }}
                    />
                ) : !isAllowanceSufficient ? (
                    <button
                        onClick={async () => {
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
                                setStatus('ERROR');
                            }
                        }}
                        disabled={status === 'PENDING'}
                        className="w-full py-4 rounded-2xl text-sm font-nebula font-black bg-white text-slate-950 hover:brightness-90 transition-all uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl"
                    >
                        {status === 'PENDING' ? <Loader2 className="animate-spin" size={18} /> : <Unlock size={18} />}
                        {status === 'PENDING' ? 'Unlocking...' : `Approve ${selectedPayment.symbol}`}
                    </button>
                ) : (
                    <button
                        onClick={handleInitiateBuy}
                        disabled={status === 'PENDING' || isSimulating}
                        className="w-full py-4 rounded-2xl text-sm font-nebula font-black bg-white text-slate-950 hover:brightness-90 transition-all uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl"
                    >
                        {isSimulating ? (
                            <>
                                <ScanEye className="animate-pulse" size={18} />
                                Auditing...
                            </>
                        ) : status === 'PENDING' ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Wallet size={18} />
                                Purchase FLUID
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
        
        {showSecurityModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/98 backdrop-blur-3xl flex flex-col p-8 animate-fade-in-up">
              <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3 text-white">
                      <ShieldAlert size={24} className="text-indigo-400" />
                      <h3 className="text-xl font-nebula font-black uppercase tracking-tight italic">AI Audit Review</h3>
                  </div>
                  <button onClick={() => setShowSecurityModal(false)} className="text-slate-500 hover:text-white transition-colors p-1">
                      <X size={24} />
                  </button>
              </div>
              <div className="space-y-5 flex-grow overflow-y-auto pr-1 custom-scrollbar">
                  {simulationResult && (
                      <div className={`p-5 rounded-[2rem] border ${
                          simulationResult.riskLevel === 'HIGH' ? 'bg-red-500/10 border-red-500/30' :
                          simulationResult.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/30' :
                          'bg-emerald-500/10 border-emerald-500/30'
                      }`}>
                          <div className="flex justify-between items-center mb-3">
                              <span className="text-[10px] font-nebula font-black uppercase tracking-widest text-slate-400">Security Score</span>
                              <span className={`text-[10px] font-nebula font-black px-3 py-1 rounded-full ${
                                  simulationResult.riskLevel === 'HIGH' ? 'bg-red-500 text-white' :
                                  simulationResult.riskLevel === 'MEDIUM' ? 'bg-amber-500 text-black' :
                                  'bg-emerald-500 text-white'
                              }`}>{simulationResult.score}/100</span>
                          </div>
                          <p className="text-sm font-bold text-white mb-3">{simulationResult.summary}</p>
                          <ul className="space-y-1.5">
                              {simulationResult.warnings.map((w, i) => (
                                  <li key={i} className="text-[10px] text-slate-400 flex items-start gap-2">
                                      <span className="text-indigo-500 mt-1">•</span> {w}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  )}
                  <div className="space-y-5 pt-2">
                      <label className="flex gap-4 cursor-pointer group select-none items-start">
                          <div className="relative mt-1">
                              <input 
                                type="checkbox" 
                                className="peer appearance-none w-5 h-5 rounded-lg border-2 border-slate-700 bg-slate-900 checked:bg-indigo-500 checked:border-indigo-500 transition-all cursor-pointer" 
                                checked={agreements.responsibility}
                                onChange={(e) => setAgreements(prev => ({...prev, responsibility: e.target.checked}))}
                              />
                              <Check className="absolute top-1 left-1 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" size={12} strokeWidth={4} />
                          </div>
                          <div className="flex-1">
                              <span className="font-nebula font-black text-white block uppercase text-[10px] tracking-widest mb-1">Non-Custodial Awareness</span>
                              <span className="text-[10px] text-slate-500 leading-relaxed">I confirm that Fluid is a non-custodial protocol. I alone am responsible for the safety of my private keys.</span>
                          </div>
                      </label>
                      <label className="flex gap-4 cursor-pointer group select-none items-start">
                         <div className="relative mt-1">
                              <input 
                                type="checkbox" 
                                className="peer appearance-none w-5 h-5 rounded-lg border-2 border-slate-700 bg-slate-900 checked:bg-indigo-500 checked:border-indigo-500 transition-all cursor-pointer" 
                                checked={agreements.irreversible}
                                onChange={(e) => setAgreements(prev => ({...prev, irreversible: e.target.checked}))}
                              />
                              <Check className="absolute top-1 left-1 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" size={12} strokeWidth={4} />
                          </div>
                          <div className="flex-1">
                              <span className="font-nebula font-black text-white block uppercase text-[10px] tracking-widest mb-1">On-Chain Finality</span>
                              <span className="text-[10px] text-slate-500 leading-relaxed">I understand that blockchain transactions are immutable and cannot be reversed or refunded once broadcast.</span>
                          </div>
                      </label>
                  </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                  <button
                      disabled={!allAgreed}
                      onClick={handleConfirmBuy}
                      className="w-full py-4 rounded-2xl text-sm font-nebula font-black bg-white text-slate-950 hover:brightness-90 transition-all uppercase tracking-widest disabled:opacity-20 flex items-center justify-center gap-2 shadow-2xl"
                  >
                      <ShieldCheck size={20} />
                      Finalize & Broadcast
                  </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PresaleCard;