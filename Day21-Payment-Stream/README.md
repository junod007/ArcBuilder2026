# Day 21 — Payment Stream

A simple USDC payment streaming contract deployed and tested on **Arc Network Testnet** using Remix.

## Contract

- **Network:** Arc Network Testnet
- **PaymentStream:**
  `0xB54a1047E4EC210B340C43b493D1072fE062a1a6`
- **USDC:**
  `0x3600000000000000000000000000000000000000`

## Contract Features

The `PaymentStream` contract supports:

- Creating a time-based USDC payment stream
- Checking the currently vested amount
- Withdrawing vested tokens
- Canceling an existing stream

## Test Workflow

### 1. Approve USDC

USDC was approved for the PaymentStream contract before creating the stream.

**Spender:**

`0xB54a1047E4EC210B340C43b493D1072fE062a1a6`

**Approval amount:**

`1000000000`

The approval transaction was successfully completed.

### 2. Create Payment Stream

A payment stream was successfully created using the `createStream` function.

**Parameters used:**

- Recipient: `0x9A714f53aF3959F70DB234f52da66FbbAC06714`
- Amount: `1000`
- Start Time: `178264000`
- End Time: `178384680`

### 3. Verify Stream ID

After creating the stream, `nextStreamId()` returned:

`1`

This means the first created stream has:

**Stream ID: `0`**

### 4. Check Vested Amount

The vested amount can be checked with:

```solidity
getVestedAmount(0)

Notes
USDC uses its own token decimals. Approval and streaming amounts should therefore be entered using the contract's expected token base units when interacting directly through Remix.
