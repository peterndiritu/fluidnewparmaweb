import { getContract } from "thirdweb";
import { client } from "../client";
import { 
  defineChain, 
  ethereum, 
  bsc, 
  polygon, 
} from "thirdweb/chains";

// Fluid Network / Target Chain
export const chain = defineChain(11155111); // Placeholder chain (Sepolia)

// Official contract address from user
export const PRESALE_CONTRACT_ADDRESS = "0xae28aff9e9d6362c4d83817cf0cb37b907bb495a";

export const presaleContract = getContract({
  client,
  chain,
  address: PRESALE_CONTRACT_ADDRESS,
});

// For Fluid, the token logic and presale logic are in the same contract provided
export const fluidTokenContract = presaleContract;

export interface TokenInfo {
  symbol: string;
  name: string;
  icon: string;
  address?: string; 
  priceUsd: number; 
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
    ]
  },
  { 
    id: bsc.id, 
    name: "BNB Chain", 
    chain: bsc, 
    icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
    tokens: [
      { symbol: "BNB", name: "Binance Coin", icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png", priceUsd: 600 },
    ]
  },
  { 
    id: polygon.id, 
    name: "Polygon", 
    chain: polygon, 
    icon: "https://cryptologos.cc/logos/polygon-matic-logo.png",
    tokens: [
      { symbol: "POL", name: "Polygon", icon: "https://cryptologos.cc/logos/polygon-matic-logo.png", priceUsd: 0.5 },
    ]
  },
];

// Mapped from the provided fluid1.sol JSON
export const PRESALE_ABI = [
  "function buyWithNative(uint256 amount) payable",
  "function buyWithERC20(address payToken, uint256 amount)",
  "function presaleSold() view returns (uint256)",
  "function PRESALE_POOL() view returns (uint256)",
  "function tokenPriceUsd6() view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)"
] as const;
