import { getContract } from "thirdweb";
import { client } from "../client";
import { 
  defineChain, 
  ethereum, 
  bsc, 
  polygon, 
  base, 
  arbitrum, 
  avalanche, 
  optimism, 
  linea, 
  scroll
} from "thirdweb/chains";

// Fluid Network / Target Chain (e.g., Sepolia for testing or Fluid Mainnet)
export const chain = defineChain(11155111); // Using Sepolia as a placeholder for the presale contract

// Updated with the user provided contract address
export const PRESALE_CONTRACT_ADDRESS = "0xae28aff9e9d6362c4d83817cf0cb37b907bb495a";
// Placeholder for FLUID token address (usually the reward token)
// If the presale contract has a function to return the token address, it should be used.
export const FLUID_TOKEN_ADDRESS = "0xae28aff9e9d6362c4d83817cf0cb37b907bb495a"; // Assuming token logic might be in the same contract for this instance or needs to be fetched

export const presaleContract = getContract({
  client,
  chain,
  address: PRESALE_CONTRACT_ADDRESS,
});

export const fluidTokenContract = getContract({
  client,
  chain,
  address: FLUID_TOKEN_ADDRESS,
});

export interface TokenInfo {
  symbol: string;
  name: string;
  icon: string;
  address?: string; // Optional for native tokens
  priceUsd: number; // Mock price for UI estimation
}

export interface NetworkInfo {
  id: number;
  name: string;
  chain: any;
  icon: string;
  tokens: TokenInfo[];
}

export const SUPPORTED_NETWORKS: NetworkInfo[] = [
  { 
    id: ethereum.id, 
    name: "Ethereum", 
    chain: ethereum, 
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    tokens: [
      { symbol: "ETH", name: "Ethereum", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png", priceUsd: 2450 },
      { symbol: "USDT", name: "Tether", icon: "https://cryptologos.cc/logos/tether-usdt-logo.png", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", priceUsd: 1 },
      { symbol: "USDC", name: "USD Coin", icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", priceUsd: 1 },
    ]
  },
  { 
    id: bsc.id, 
    name: "BNB Chain", 
    chain: bsc, 
    icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    tokens: [
      { symbol: "BNB", name: "Binance Coin", icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png", priceUsd: 600 },
      { symbol: "USDT", name: "Tether", icon: "https://cryptologos.cc/logos/tether-usdt-logo.png", address: "0x55d398326f99059fF775485246999027B3197955", priceUsd: 1 },
    ]
  },
  { 
    id: polygon.id, 
    name: "Polygon", 
    chain: polygon, 
    icon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    tokens: [
      { symbol: "POL", name: "Polygon", icon: "https://cryptologos.cc/logos/polygon-matic-logo.png", priceUsd: 0.5 },
      { symbol: "USDT", name: "Tether", icon: "https://cryptologos.cc/logos/tether-usdt-logo.png", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", priceUsd: 1 },
    ]
  },
];

export const PRESALE_ABI_FUNCTIONS = {
  getPrice: "function tokenPrice() view returns (uint256)",
  getSold: "function totalTokensSold() view returns (uint256)",
  getCap: "function hardCap() view returns (uint256)",
  getEndTime: "function endTime() view returns (uint256)",
  buy: "function buyTokens() payable",
  // Standard ERC20 for dynamic data fetching
  getName: "function name() view returns (string)",
  getSymbol: "function symbol() view returns (string)",
  getDecimals: "function decimals() view returns (uint8)",
};