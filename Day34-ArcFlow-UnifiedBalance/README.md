# Day 34 — ArcFlow Unified Balance

## Objective

Build a testnet proof-of-concept for cross-chain USDC payments using Circle Unified Balance Kit.

## Concept

Day 33 established the ArcFlow payment orchestration layer.

Day 34 extends the concept toward a unified USDC balance:

Frontend / Agent
→ Unified Balance Kit
→ Source USDC Balance
→ Destination Chain
→ USDC Recipient

## Planned Flow

1. Connect MetaMask
2. Read unified USDC balance
3. Display confirmed and pending balances
4. Estimate the cost of a cross-chain spend
5. Execute a small testnet USDC spend
6. Verify the destination transaction
7. Document the transaction evidence

## Network

- Arc Testnet
- Base Sepolia
- Testnet USDC only

## Status

🟡 In progress

Implementation and on-chain execution will be documented after the testnet flow is verified.

## Safety

No mainnet funds are used.

Transactions will only be executed after the route, balance, fee estimate, recipient, and transaction parameters are verified.
