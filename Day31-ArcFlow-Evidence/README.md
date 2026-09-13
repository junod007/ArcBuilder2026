# Day 31 — ArcFlow Evidence & On-Chain Verification

## Overview

Day 31 focuses on verifying the on-chain execution of the ArcFlow AppKit swap completed on Arc Testnet.

Instead of relying only on the application interface, this transaction was inspected directly through ArcScan to verify:

- Transaction status
- Transaction method
- Token transfers
- USDC input
- EURC output
- Final ERC-20 transfer event
- Recipient wallet
- On-chain settlement amount

This step is part of the process of turning ArcFlow from a testnet experiment into a properly documented developer project.

---

## Transaction

**Network:** Arc Testnet

**Action:** USDC → EURC Swap

**Input:** 1 USDC

**Actual On-Chain Output:** 0.810662 EURC

**Status:** Success

**Method:** `execute`

**Block:** `61742601`

**Transaction Hash:**

```text
0xe3c6d88465d9ab56fdbfc590d2aaa6f09a9e2961dd18d9cc78fab3e53adf4148
