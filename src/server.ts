/**
 * Main Express server for Pollster webhook backend
 */

import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { handleWebhook } from "./webhook-handler.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Chainhook payloads can be large

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "pollster-backend",
    network: config.network,
    contract: `${config.contractAddress}.${config.contractName}`,
    timestamp: new Date().toISOString(),
  });
});

// Webhook endpoint for Chainhooks
app.post("/webhook", handleWebhook);

// Root endpoint
app.get("/", (_req, res) => {
  res.json({
    service: "Pollster Backend",
    description: "Webhook server for Pollster voting contract on Stacks",
    endpoints: {
      health: "/health",
      webhook: "/webhook (POST)",
    },
    contract: {
      address: config.contractAddress,
      name: config.contractName,
      network: config.network,
    },
  });
});

// Error handling middleware
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: config.nodeEnv === "development" ? err.message : undefined,
    });
  }
);

// Start server
const server = app.listen(config.port, () => {
  console.log("\n🚀 Pollster Backend Server");
  console.log("========================");
  console.log(`Port: ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Network: ${config.network}`);
  console.log(`Contract: ${config.contractAddress}.${config.contractName}`);
  console.log(`Webhook URL: ${config.webhookUrl}`);
  console.log("\n✅ Server is running!");
  console.log(`   Health: http://localhost:${config.port}/health`);
  console.log(`   Webhook: http://localhost:${config.port}/webhook\n`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n📛 SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n📛 SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

export default app;
