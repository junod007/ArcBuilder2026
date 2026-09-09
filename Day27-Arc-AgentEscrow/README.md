# Day 27 – Arc Agent Escrow

A simple USDC escrow smart contract built and tested on Arc Network Testnet.

This project demonstrates an on-chain escrow payment flow for AI agents, where a client can create a job, fund it with USDC, and release or refund the payment.

## Objective

Build a simple on-chain escrow mechanism for agent payments using USDC on Arc Network Testnet.

## Features

- Job creation
- USDC deposit
- Escrow balance tracking
- Payment release
- Payment refund
- Job status tracking
- On-chain transaction verification

## Workflow

Client
   │
   │ createJob()
   ▼
AgentEscrow
   │
   │ deposit USDC
   ▼
Funded Job
   │
   ├── release() ──► Agent
   │
   └── refund() ───► Client

## Test Results

The contract was deployed and tested successfully on Arc Network Testnet.

Test flow:

1. Deploy `AgentEscrow`
2. Create Job #0
3. Job amount: `1,000,000` USDC base units
4. Deposit `1,000,000` USDC
5. Verify escrow balance
6. Verify Job #0
7. Release Job #0
8. Confirm status changed to `Released`

### Final Job Status

```text
Job ID: 0
Client: Test wallet
Agent: Test wallet
Amount: 1,000,000
Status: Released
