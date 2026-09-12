# Day 30 — ArcFlow + Arc App Kit

## Overview

Day 30 focuses on documenting how the Arc App Kit application layer connects conceptually with the payment, agent, authorization, escrow, and orchestration components developed throughout the ArcBuilder2026 journey.

This milestone does not duplicate the previous implementations. Instead, it connects the different development stages into a clear builder workflow and preserves the evidence of successful Arc App Kit operations.

## Objective

- Document the relationship between Arc App Kit and the previous ArcBuilder milestones.
- Record successful token operations performed through Arc App Kit.
- Connect the application layer with the payment and orchestration concepts developed in Days 26–29.
- Preserve transaction evidence.
- Prepare the project structure for future Arc mainnet development.

## Arc App Kit Application

The Arc App Kit implementation was developed during Day 23.

The application uses:

- Circle Arc App Kit
- Viem adapter
- MetaMask
- EIP-6963 wallet discovery
- Arc Testnet

Day 23 implementation:

[Day 23 — Arc App Kit](../Day23-Arc-AppKit/)

The application currently demonstrates three main operations:

```text
MetaMask
    │
    ▼
Arc App Kit
    │
    ├── Send USDC
    │
    ├── Swap USDC → EURC
    │
    └── Bridge Ethereum Sepolia → Arc Testnet
