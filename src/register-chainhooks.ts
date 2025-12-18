/**
 * Script to register Chainhooks for the Pollster contract using the official Hiro SDK
 */

import {
  ChainhooksClient,
  CHAINHOOKS_BASE_URL,
  type ChainhookDefinition,
} from "@hirosystems/chainhooks-client";
import { config } from "./config.js";

/**
 * Creates the Chainhooks client
 */
function createClient(): ChainhooksClient {
  return new ChainhooksClient({
    baseUrl:
      config.network === "mainnet"
        ? CHAINHOOKS_BASE_URL.mainnet
        : CHAINHOOKS_BASE_URL.testnet,
    apiKey: config.chainhookApiKey,
  });
}

/**
 * Creates a Chainhook definition for the Pollster contract
 */
function createChainhookDefinition(): ChainhookDefinition {
  const contractIdentifier = `${config.contractAddress}.${config.contractName}`;

  return {
    name: "Pollster Contract Events",
    version: "1",
    chain: "stacks",
    network: config.network,
    filters: {
      events: [
        // Listen for contract calls to the pollster contract
        {
          type: "contract_call",
          contract_identifier: contractIdentifier,
        },
        // Listen for contract logs (print events) from the pollster contract
        {
          type: "contract_log",
          contract_identifier: contractIdentifier,
        },
      ],
    },
    action: {
      type: "http_post",
      url: config.webhookUrl,
    },
    options: {
      enable_on_registration: true,
      decode_clarity_values: true, // This will help decode Clarity values automatically
    },
  };
}

/**
 * Registers the Chainhook with Hiro's API
 */
async function registerChainhook(): Promise<void> {
  const client = createClient();
  const definition = createChainhookDefinition();

  console.log("\n📝 Registering Chainhook");
  console.log("========================");
  console.log(`Contract: ${config.contractAddress}.${config.contractName}`);
  console.log(`Network: ${config.network}`);
  console.log(`Webhook URL: ${config.webhookUrl}`);
  console.log("\nDefinition:");
  console.log(JSON.stringify(definition, null, 2));

  try {
    const result = await client.registerChainhook(definition);
    console.log("\n✅ Chainhook registered successfully!");
    console.log("Response:", JSON.stringify(result, null, 2));
    console.log(`\n💾 Save this UUID for future reference: ${result.uuid}`);
  } catch (error) {
    console.error("\n❌ Failed to register Chainhook:");
    console.error(error);
    process.exit(1);
  }
}

/**
 * Lists all registered Chainhooks
 */
async function listChainhooks(): Promise<void> {
  const client = createClient();

  console.log("\n📋 Listing Chainhooks");
  console.log("=====================");

  try {
    const result = await client.getChainhooks();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\n❌ Failed to list Chainhooks:");
    console.error(error);
    process.exit(1);
  }
}

/**
 * Gets a specific Chainhook by UUID
 */
async function getChainhook(uuid: string): Promise<void> {
  const client = createClient();

  console.log(`\n🔍 Getting Chainhook: ${uuid}`);
  console.log("==========================");

  try {
    const result = await client.getChainhook(uuid);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\n❌ Failed to get Chainhook:");
    console.error(error);
    process.exit(1);
  }
}

/**
 * Deletes a Chainhook by UUID
 */
async function deleteChainhook(uuid: string): Promise<void> {
  const client = createClient();

  console.log(`\n🗑️  Deleting Chainhook: ${uuid}`);
  console.log("==========================");

  try {
    await client.deleteChainhook(uuid);
    console.log("✅ Chainhook deleted successfully!");
  } catch (error) {
    console.error("\n❌ Failed to delete Chainhook:");
    console.error(error);
    process.exit(1);
  }
}

/**
 * Gets API status
 */
async function getStatus(): Promise<void> {
  const client = createClient();

  console.log("\n📊 API Status");
  console.log("=============");

  try {
    const result = await client.getStatus();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\n❌ Failed to get status:");
    console.error(error);
    process.exit(1);
  }
}

// Main CLI
const command = process.argv[2];

switch (command) {
  case "register":
    registerChainhook();
    break;
  case "list":
    listChainhooks();
    break;
  case "get":
    const getUuid = process.argv[3];
    if (!getUuid) {
      console.error("Usage: npm run register-hooks get <uuid>");
      process.exit(1);
    }
    getChainhook(getUuid);
    break;
  case "delete":
    const deleteUuid = process.argv[3];
    if (!deleteUuid) {
      console.error("Usage: npm run register-hooks delete <uuid>");
      process.exit(1);
    }
    deleteChainhook(deleteUuid);
    break;
  case "status":
    getStatus();
    break;
  default:
    console.log("Pollster Chainhooks Management");
    console.log("==============================\n");
    console.log("Usage:");
    console.log(
      "  npm run register-hooks register      - Register a new Chainhook"
    );
    console.log("  npm run register-hooks list          - List all Chainhooks");
    console.log(
      "  npm run register-hooks get <uuid>    - Get a specific Chainhook"
    );
    console.log("  npm run register-hooks delete <uuid> - Delete a Chainhook");
    console.log("  npm run register-hooks status        - Get API status");
    process.exit(0);
}
