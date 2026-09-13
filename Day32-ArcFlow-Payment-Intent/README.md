# Day 32 — ArcFlow Payment Intent (Arc Testnet)

## Overview

Day 32 extends ArcFlow from a simple token swap into a reusable on-chain payment intent system.

Instead of executing a payment immediately, a payment is represented as a **Payment Intent** that follows a defined lifecycle:

Create Intent
      ↓
Pending
      ↓
Authorized Execution
      ↓
Completed

This design allows a payment to be created by a payer while execution is restricted to an authorized executor.

---

## Objective

Build a smart contract that supports:

- Creating payment intents.
- Executing payments only by an authorized executor.
- Cancelling pending intents by the payer.
- Retrieving payment intent details on-chain.

The contract is written in Solidity and deployed on Arc Testnet using Remix.

---

## Smart Contract

**Contract Name**

`ArcFlowPaymentIntent.sol`

Main components:

| Component | Description |
|----------|-------------|
| `PaymentIntent` | Stores payer, payee, asset, amount, executor, timestamps, status and payment reference. |
| `createPaymentIntent()` | Creates a pending payment intent. |
| `executePaymentIntent()` | Transfers approved USDC and marks the intent as completed. |
| `cancelPaymentIntent()` | Cancels a pending payment. |
| `getPaymentIntent()` | Reads payment intent data from blockchain. |

Status lifecycle:

```solidity
enum Status {
    Pending,
    Completed,
    Cancelled
}
```

---

## Deployment

| Item | Value |
|------|-------|
| Network | Arc Testnet |
| Environment | Remix + Rabby Wallet |
| Token Used | USDC (Native FiatTokenV2) |
| Compiler | Solidity 0.8.20 |
| License | MIT |

Deployment completed successfully on Arc Testnet.

---

## Test Scenario

### Test Payment Intent

| Field | Value |
|------|-------|
| Intent ID | `0` |
| Payment Reference | `ArcFlow-Day32-Test-001` |
| Asset | USDC |
| Amount | `1 USDC` |
| Payer | Same wallet used for deployment |
| Payee | Same wallet (self-transfer test) |
| Executor | Same wallet |

---

## Step 1 — Create Payment Intent

The payment intent was created successfully.

**Input**

- Asset: USDC
- Amount: 1 USDC
- Executor: Authorized wallet
- Reference: `ArcFlow-Day32-Test-001`

Result:

- Status = Pending
- `executedAt = 0`

---

## Step 2 — Verify Pending State

The contract was queried using:

```solidity
getPaymentIntent(0)
```

Decoded output returned:

- payer address
- payee address
- USDC token address
- amount = `1000000`
- executor address
- created timestamp
- executed timestamp = `0`
- status = `Pending`
- payment reference = `ArcFlow-Day32-Test-001`

This confirms the payment intent exists on-chain before execution.

---

## Step 3 — Execute Payment Intent

Authorized executor executed:

```solidity
executePaymentIntent(0)
```

Execution succeeded.

Effects:

- USDC transferred.
- Status changed to Completed.
- `executedAt` populated with block timestamp.

---

## On-Chain Verification

ArcScan transaction confirmed:

- Transaction status: Success
- Method: `executePaymentIntent`
- Network: Arc Testnet

Important events emitted:

### ERC20 Transfer

- 1 USDC transferred from payer to payee.

### PaymentIntentExecuted Event

```text
intentId = 0
executor = payer wallet
status = Completed
```

The payment lifecycle is fully verifiable on-chain.

---

## Security Rules

The contract enforces several authorization rules.

### Executor Only

```solidity
require(msg.sender == intent.executor);
```

Only the authorized executor can execute a pending payment.

### Pending Only

```solidity
require(intent.status == Status.Pending);
```

Completed or cancelled payments cannot be executed twice.

### ERC20 Transfer Required

```solidity
IERC20(intent.asset).transferFrom(...)
```

Execution succeeds only after ERC20 approval exists.

---

## Lessons Learned

This exercise introduced several real-world smart contract concepts:

- ERC20 allowance (`approve` + `transferFrom`)
- Payment authorization model
- State transitions
- Event-driven verification
- Reading contract state through Remix and ArcScan

It also demonstrated how to validate both contract storage and emitted events directly on-chain.

---

## Files

| File | Purpose |
|------|---------|
| `ArcFlowPaymentIntent.sol` | Final Solidity source code used for deployment. |
| `README.md` | Documentation for Day 32 project. |

---

## Builder Notes

Day 32 is the first ArcFlow module that models a payment as a reusable on-chain intent rather than a direct transfer.

This becomes the foundation for future ArcFlow features such as payment requests, escrow, recurring payments, and automated settlement.
