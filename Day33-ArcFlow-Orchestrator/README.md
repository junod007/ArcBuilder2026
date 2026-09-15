# Day 29 → Day 33 — ArcFlow Orchestrator

ArcFlow is an agentic payment orchestration layer built on Arc Network.

The project brings together the payment primitives developed throughout the ArcBuilder2026 journey and provides a unified interface for executing agent-driven payment workflows on Arc Testnet.

## Project Evolution

ArcFlow started as an orchestration concept in Day 29 and evolved into a working payment interface connected to Arc Testnet.

The project integrates:

- Arc Agent Pay
- Arc Agent Escrow
- Arc Agent Payment Authorization

## Objective

Create a unified interface for AI-agent payment workflows on Arc Testnet, connecting:

**Frontend → Backend → Arc Testnet → Agent Payment Infrastructure**

## Current Milestone

### Day 33 — ArcFlow Orchestrator

The ArcFlow interface is now running as a Vite + TypeScript application with:

- MetaMask wallet connection
- Arc Testnet integration
- Agent identification
- Authorized Agent Payment workflow
- Escrow payment workflow
- Direct payment workflow
- ArcFlow backend connectivity
- On-chain transaction handling
- Transaction status reporting
- ArcScan transaction references

## Architecture

```text
User
 │
 ▼
ArcFlow Orchestrator
 │
 ├── MetaMask
 │
 ├── Frontend
 │
 └── Backend
       │
       ▼
   Arc Testnet
       │
       ├── Agent Payment Authorization
       ├── Agent Escrow
       └── Agent Payment
