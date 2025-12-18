/**
 * Configuration management for Pollster backend
 */

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export interface Config {
  // Server
  port: number;
  nodeEnv: string;

  // Chainhooks
  chainhookApiKey: string;
  chainhookBaseUrl: string;
  webhookUrl: string;

  // Contract
  contractAddress: string;
  contractName: string;
  network: "mainnet" | "testnet";
}

/**
 * Validates and returns the application configuration
 */
export function getConfig(): Config {
  const port = parseInt(process.env.PORT || "3000", 10);
  const nodeEnv = process.env.NODE_ENV || "development";
  
  const chainhookApiKey = process.env.CHAINHOOK_API_KEY;
  if (!chainhookApiKey) {
    throw new Error("CHAINHOOK_API_KEY is required");
  }

  const chainhookBaseUrl = process.env.CHAINHOOK_BASE_URL || "https://api.hiro.so";
  
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("WEBHOOK_URL is required (use ngrok in development)");
  }

  const contractAddress = process.env.CONTRACT_ADDRESS || "SP237HRZEM03XCG4TJMYMBT0J0FPY90MS1HB48YTM";
  const contractName = process.env.CONTRACT_NAME || "pollster";
  
  const network = (process.env.NETWORK || "mainnet") as "mainnet" | "testnet";
  if (network !== "mainnet" && network !== "testnet") {
    throw new Error("NETWORK must be either 'mainnet' or 'testnet'");
  }

  return {
    port,
    nodeEnv,
    chainhookApiKey,
    chainhookBaseUrl,
    webhookUrl,
    contractAddress,
    contractName,
    network,
  };
}

// Export singleton instance
export const config = getConfig();

