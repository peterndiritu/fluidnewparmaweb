import { getContract } from "thirdweb";
import { client } from "../client";
import { defineChain, ethereum, bsc, polygon, base, arbitrum } from "thirdweb/chains";

// Fluid Network / Target Chain (e.g., Sepolia for testing or Fluid Mainnet)
export const chain = defineChain(11155111); // Using Sepolia as a placeholder for the presale contract

// Replace with actual deployed contract address
export const PRESALE_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
// Replace with actual FLUID token address
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

export const SUPPORTED_NETWORKS = [
  { id: ethereum.id, name: "Ethereum", chain: ethereum, icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
  { id: bsc.id, name: "BSC", chain: bsc, icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
  { id: polygon.id, name: "Polygon", chain: polygon, icon: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
  { id: base.id, name: "Base", chain: base, icon: "https://cryptologos.cc/logos/base-token-logo.png" },
  { id: arbitrum.id, name: "Arbitrum", chain: arbitrum, icon: "https://cryptologos.cc/logos/arbitrum-arb-logo.png" },
];

/**
 * Common Presale ABI functions
 */
export const PRESALE_ABI_FUNCTIONS = {
  getPrice: "function tokenPrice() view returns (uint256)",
  getSold: "function totalTokensSold() view returns (uint256)",
  getCap: "function hardCap() view returns (uint256)",
  getEndTime: "function endTime() view returns (uint256)",
  buy: "function buyTokens() payable",
};
