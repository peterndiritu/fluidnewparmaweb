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
export const PRESALE_CONTRACT_ADDRESS = "0xec9123Aa60651ceee7c0E084c884Cd33478c92a5";
// Placeholder for FLUID token address (usually the reward token)
export const FLUID_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

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
    id: polygon.id, 
    name: "Polygon", 
    chain: polygon, 
    icon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    tokens: [
      { symbol: "POL", name: "Polygon", icon: "https://cryptologos.cc/logos/polygon-matic-logo.png", priceUsd: 0.5 },
      { symbol: "USDT", name: "Tether", icon: "https://cryptologos.cc/logos/tether-usdt-logo.png", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", priceUsd: 1 },
      { symbol: "USDC", name: "USD Coin", icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", priceUsd: 1 },
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
    id: arbitrum.id, 
    name: "Arbitrum", 
    chain: arbitrum, 
    icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
    tokens: [
      { symbol: "ETH", name: "Ethereum", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png", priceUsd: 2450 },
      { symbol: "USDC", name: "USD Coin", icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", priceUsd: 1 },
    ]
  },
  { 
    id: optimism.id, 
    name: "Optimism", 
    chain: optimism, 
    icon: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
    tokens: [
      { symbol: "ETH", name: "Ethereum", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png", priceUsd: 2450 },
      { symbol: "OP", name: "Optimism", icon: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png", priceUsd: 3.5 },
    ]
  },
  { 
    id: base.id, 
    name: "Base", 
    chain: base, 
    icon: "https://cryptologos.cc/logos/base-token-logo.png",
    tokens: [
      { symbol: "ETH", name: "Ethereum", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png", priceUsd: 2450 },
      { symbol: "USDC", name: "USD Coin", icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", priceUsd: 1 },
    ]
  },
  { 
    id: avalanche.id, 
    name: "Avalanche", 
    chain: avalanche, 
    icon: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
    tokens: [
      { symbol: "AVAX", name: "Avalanche", icon: "https://cryptologos.cc/logos/avalanche-avax-logo.png", priceUsd: 35 },
      { symbol: "USDT", name: "Tether", icon: "https://cryptologos.cc/logos/tether-usdt-logo.png", address: "0x970b9bb2C0444F5E81e9d0eFb84C8ccdcdcAf84d", priceUsd: 1 },
    ]
  },
  { 
    id: linea.id, 
    name: "Linea", 
    chain: linea, 
    icon: "https://lineascan.build/images/logo.png",
    tokens: [
      { symbol: "ETH", name: "Ethereum", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png", priceUsd: 2450 },
    ]
  },
  { 
    id: scroll.id, 
    name: "Scroll", 
    chain: scroll, 
    icon: "https://scrollscan.com/images/logo.png",
    tokens: [
      { symbol: "ETH", name: "Ethereum", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png", priceUsd: 2450 },
    ]
  },
];

export const PRESALE_ABI_FUNCTIONS = {
  getPrice: "function tokenPrice() view returns (uint256)",
  getSold: "function totalTokensSold() view returns (uint256)",
  getCap: "function hardCap() view returns (uint256)",
  getEndTime: "function endTime() view returns (uint256)",
  buy: "function buyTokens() payable",
};