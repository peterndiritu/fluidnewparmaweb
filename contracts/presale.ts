
import { getContract, defineChain } from "thirdweb";
import { client } from "../client";
import { ethereum, bsc, polygon } from "thirdweb/chains";

export const chain = defineChain(11155111); // Target Chain (e.g., Sepolia for Testing)
export const PRESALE_CONTRACT_ADDRESS = "0xae28aff9e9d6362c4d83817cf0cb37b907bb495a";

export const PRESALE_ABI = [
  {"inputs":[{"internalType":"address","name":"eco","type":"address"},{"internalType":"address","name":"team","type":"address"},{"internalType":"address","name":"foundation","type":"address"},{"internalType":"address","name":"relayer","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[],"name":"AIRDROP_POOL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"ECO_POOL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"FOUND_POOL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"INC_POOL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"LIQ_POOL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"PRESALE_POOL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"TEAM_POOL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"TOTAL_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"payToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyWithERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyWithNative","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"claimFoundation","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amt","type":"uint256"}],"name":"claimLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"claimTeam","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"emergencyStop","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"presaleSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amt","type":"uint256"}],"name":"sendIncentive","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"bool","name":"s","type":"bool"}],"name":"setEmergency","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"f","type":"address"}],"name":"setFeed","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"t","type":"address"},{"internalType":"bool","name":"ok","type":"bool"}],"name":"setPaymentToken","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"p","type":"uint256"}],"name":"setPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"tokenPriceUsd6","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"unlockLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}
] as const;

export const presaleContract = getContract({
  client,
  chain,
  address: PRESALE_CONTRACT_ADDRESS,
  abi: PRESALE_ABI,
});

export const fluidTokenContract = presaleContract;

export interface TokenInfo { symbol: string; name: string; icon: string; address?: string; priceUsd: number; }
export interface NetworkInfo { id: number; name: string; chain: any; icon: string; tokens: TokenInfo[]; }

export const SUPPORTED_NETWORKS: NetworkInfo[] = [
  { 
    id: ethereum.id, 
    name: "Ethereum", 
    chain: ethereum, 
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    tokens: [
      { symbol: "ETH", name: "Ethereum", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png", priceUsd: 2650 },
      { symbol: "USDT", name: "Tether", icon: "https://cryptologos.cc/logos/tether-usdt-logo.png", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", priceUsd: 1 },
    ]
  },
  { 
    id: bsc.id, 
    name: "BNB Chain", 
    chain: bsc, 
    icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    tokens: [
      { symbol: "BNB", name: "Binance Coin", icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png", priceUsd: 610 },
    ]
  },
  { 
    id: polygon.id, 
    name: "Polygon", 
    chain: polygon, 
    icon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    tokens: [
      { symbol: "POL", name: "Polygon", icon: "https://cryptologos.cc/logos/polygon-matic-logo.png", priceUsd: 0.45 },
    ]
  },
];
