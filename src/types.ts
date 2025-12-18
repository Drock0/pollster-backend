/**
 * Type definitions for Pollster backend
 *
 * Note: Chainhook payload types are imported from @hirosystems/chainhooks-client
 */

// Event types emitted by the pollster contract
export type PollsterEventType =
  | "poll-created"
  | "vote-cast"
  | "poll-closed"
  | "counter-incremented"
  | "counter-decremented";

// Base event structure from Clarity print statements
export interface BasePollsterEvent {
  event: PollsterEventType;
  "block-height": number;
}

// Poll Created Event
export interface PollCreatedEvent extends BasePollsterEvent {
  event: "poll-created";
  "poll-id": number;
  title: string;
  creator: string;
  "option-count": number;
}

// Vote Cast Event
export interface VoteCastEvent extends BasePollsterEvent {
  event: "vote-cast";
  "poll-id": number;
  voter: string;
  "option-id": number;
  "total-votes": number;
}

// Poll Closed Event
export interface PollClosedEvent extends BasePollsterEvent {
  event: "poll-closed";
  "poll-id": number;
  closer: string;
}

// Counter Events
export interface CounterIncrementedEvent extends BasePollsterEvent {
  event: "counter-incremented";
}

export interface CounterDecrementedEvent extends BasePollsterEvent {
  event: "counter-decremented";
}

// Union type for all Pollster events
export type PollsterEvent =
  | PollCreatedEvent
  | VoteCastEvent
  | PollClosedEvent
  | CounterIncrementedEvent
  | CounterDecrementedEvent;
