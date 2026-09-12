# Day 30 — ArcFlow + Arc App Kit

## Overview

Day 30 focuses on connecting the application-level workflow from Arc App Kit with the payment and orchestration concepts built throughout the ArcBuilder2026 journey.

This milestone brings together the progression from basic smart contracts and payment primitives into a more complete on-chain application workflow.

## Objective

- Connect Arc App Kit with the ArcFlow workflow.
- Demonstrate token interaction on Arc Testnet.
- Document the relationship between swap, payment authorization, agent payment, escrow, and orchestration.
- Preserve transaction evidence for the builder journey.
- Prepare the project structure for future Arc mainnet development.

## Architecture

```text
Arc App Kit
     │
     ▼
Token Swap
USDC → EURC
     │
     ▼
Payment Authorization
     │
     ▼
Agent Payment
     │
     ▼
Agent Escrow
     │
     ▼
ArcFlow Orchestrator
     │
     ▼
On-chain Transaction Proof
