# Pollster Backend

Backend webhook server for the [Pollster](https://github.com/YOUR_USERNAME/Pollster) voting smart contract on Stacks blockchain.

## 🎯 Purpose

This Node.js backend integrates with [Hiro Chainhooks](https://docs.hiro.so/chainhooks) to receive real-time notifications when users interact with the Pollster contract (`SP237HRZEM03XCG4TJMYMBT0J0FPY90MS1HB48YTM.pollster`).

## ✨ Features

- 🔔 **Official Hiro SDK** - Uses `@hirosystems/chainhooks-client` for type-safe integration
- 🗳️ **Real-time poll tracking** - Monitor poll creation, voting, and closures
- 📝 **Event processing** - Handles all contract events with proper type definitions
- 🚀 **Production ready** - Built with Express, TypeScript, and proper error handling
- 🔧 **Easy management** - CLI commands for registering and managing chainhooks

## 🏗️ Architecture

The backend registers chainhooks that monitor:
- `create-poll` - New polls created
- `vote` - Votes cast on polls
- `close-poll` - Polls closed by creators
- `increment`/`decrement` - Counter operations (testing)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Hiro API key ([Get one here](https://platform.hiro.so))
- Public webhook URL (use [ngrok](https://ngrok.com) for development)

### Installation

git clone https://github.com/YOUR_USERNAME/pollster-backend.git
cd pollster-backend
npm install### Configuration

Create `.env` file:
HIRO_API_KEY=your_hiro_api_key_here
WEBHOOK_URL=https://your-public-url.ngrok.io
PORT=3000
CONSUMER_SECRET=your_secret_for_webhook_validation### Run the Server

# Start the webhook server
npm start

# In another terminal, register chainhooks
npm run register-chainhooks## 📡 Webhook Endpoints

| Endpoint | Event | Description |
|----------|-------|-------------|
| `POST /webhooks/poll-created` | Poll creation | Triggered when `create-poll` is called |
| `POST /webhooks/vote-cast` | Vote | Triggered when `vote` is called |
| `POST /webhooks/poll-closed` | Poll closure | Triggered when `close-poll` is called |
| `POST /webhooks/counter` | Counter ops | Triggered on increment/decrement |
| `GET /health` | Health check | Server status |

## 📊 Event Storage

Events are stored in `data/events.json`:
{
  "polls": [],
  "votes": [],
  "closures": [],
  "events": []
}## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the webhook server |
| `npm run dev` | Start with auto-reload (nodemon) |
| `npm run register-chainhooks` | Register all chainhooks |
| `npm run list-chainhooks` | List registered chainhooks |
| `npm run delete-chainhooks` | Delete all chainhooks |

## 🔗 Related Projects

- [Pollster Contract](https://github.com/YOUR_USERNAME/Pollster) - The smart contract this backend monitors
- [Hiro Chainhooks](https://docs.hiro.so/chainhooks) - Real-time blockchain webhooks

## 🛠️ Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Chainhooks**: @hirosystems/chainhooks-client
- **Storage**: JSON file (upgradeable to PostgreSQL/MongoDB)

## 📚 Documentation

- [Chainhooks Setup Guide](./docs/chainhooks-setup.md)
- [Webhook Payload Examples](./docs/webhook-payloads.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

This is a challenge submission project. Feel free to fork and improve!

## 📄 License

MIT

## 🔗 Links

- **Contract Address**: `SP237HRZEM03XCG4TJMYMBT0J0FPY90MS1HB48YTM.pollster`
- **Network**: Stacks Mainnet
- **Explorer**: [View on Explorer](https://explorer.stacks.co/txid/SP237HRZEM03XCG4TJMYMBT0J0FPY90MS1HB48YTM.pollster?chain=mainnet)
