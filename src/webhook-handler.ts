/**
 * Webhook handler for processing Pollster contract events
 */

import type { Request, Response } from "express";
import type { ChainhookEvent } from "@hirosystems/chainhooks-client";
import type { PollsterEvent } from "./types.js";

/**
 * Parses Clarity value from event data
 */
function parseClarityValue(value: any): any {
  if (!value) return null;

  // Handle different Clarity types
  if (typeof value === "object" && value.hex && value.repr) {
    // Decoded Clarity value with hex and repr
    return value.repr;
  }

  if (typeof value === "object") {
    // Recursively parse nested objects
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = parseClarityValue(val);
    }
    return result;
  }

  // Primitive value
  return value;
}

/**
 * Extracts Pollster events from the Chainhook payload
 */
function extractPollsterEvents(payload: ChainhookEvent): PollsterEvent[] {
  const events: PollsterEvent[] = [];

  for (const block of payload.event.apply) {
    for (const tx of block.transactions) {
      // Only process successful transactions
      if (tx.metadata.status !== "success") continue;

      // Look for contract_log operations (print events)
      for (const operation of tx.operations) {
        if (operation.type === "contract_log") {
          try {
            const value = parseClarityValue(operation.metadata.value);

            // Validate it's a Pollster event
            if (value && typeof value === "object" && "event" in value) {
              events.push(value as PollsterEvent);
            }
          } catch (error) {
            console.error("Failed to parse event:", error);
          }
        }
      }
    }
  }

  return events;
}

/**
 * Handles poll-created events
 */
async function handlePollCreated(event: any): Promise<void> {
  console.log("📊 New Poll Created:");
  console.log(`  Poll ID: ${event["poll-id"]}`);
  console.log(`  Title: ${event.title}`);
  console.log(`  Creator: ${event.creator}`);
  console.log(`  Options: ${event["option-count"]}`);
  console.log(`  Block: ${event["block-height"]}`);

  // TODO: Store in database
  // await db.polls.create({
  //   pollId: event["poll-id"],
  //   title: event.title,
  //   creator: event.creator,
  //   optionCount: event["option-count"],
  //   blockHeight: event["block-height"],
  // });
}

/**
 * Handles vote-cast events
 */
async function handleVoteCast(event: any): Promise<void> {
  console.log("🗳️  Vote Cast:");
  console.log(`  Poll ID: ${event["poll-id"]}`);
  console.log(`  Voter: ${event.voter}`);
  console.log(`  Option: ${event["option-id"]}`);
  console.log(`  Total Votes: ${event["total-votes"]}`);
  console.log(`  Block: ${event["block-height"]}`);

  // TODO: Store in database
  // await db.votes.create({
  //   pollId: event["poll-id"],
  //   voter: event.voter,
  //   optionId: event["option-id"],
  //   blockHeight: event["block-height"],
  // });
}

/**
 * Handles poll-closed events
 */
async function handlePollClosed(event: any): Promise<void> {
  console.log("🔒 Poll Closed:");
  console.log(`  Poll ID: ${event["poll-id"]}`);
  console.log(`  Closed By: ${event.closer}`);
  console.log(`  Block: ${event["block-height"]}`);

  // TODO: Update database
  // await db.polls.update(event["poll-id"], {
  //   isActive: false,
  //   closedAt: event["block-height"],
  //   closedBy: event.closer,
  // });
}

/**
 * Handles counter events (decoration)
 */
async function handleCounterEvent(event: any): Promise<void> {
  console.log(
    `🔢 Counter ${event.event === "counter-incremented" ? "+" : "-"}`
  );
  console.log(`  Block: ${event["block-height"]}`);
}

/**
 * Main webhook handler
 */
export async function handleWebhook(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const payload: ChainhookEvent = req.body;

    console.log("\n🔔 Webhook received");
    console.log(`  Chainhook UUID: ${payload.chainhook.uuid}`);
    console.log(`  Chain: ${payload.event.chain}`);
    console.log(`  Network: ${payload.event.network}`);
    console.log(`  Blocks: ${payload.event.apply.length}`);

    // Extract and process events
    const events = extractPollsterEvents(payload);
    console.log(`  Events found: ${events.length}`);

    for (const event of events) {
      switch (event.event) {
        case "poll-created":
          await handlePollCreated(event);
          break;
        case "vote-cast":
          await handleVoteCast(event);
          break;
        case "poll-closed":
          await handlePollClosed(event);
          break;
        case "counter-incremented":
        case "counter-decremented":
          await handleCounterEvent(event);
          break;
        default:
          console.log(`  Unknown event type: ${(event as any).event}`);
      }
    }

    // Respond with 200 OK
    res.status(200).json({
      success: true,
      eventsProcessed: events.length,
    });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
