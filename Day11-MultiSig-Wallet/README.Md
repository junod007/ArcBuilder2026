# Day 11 - MultiSig Wallet

A simple Multi-Signature Wallet smart contract built with Solidity.

## Features

- Multiple wallet owners
- Configurable number of required approvals
- Submit transactions
- Approve transactions
- Execute approved transactions
- Prevent duplicate approvals
- Owner-only transaction management

## Smart Contract

File:

`MultiSigWallet.sol`

## How It Works

1. The contract is deployed with multiple owners.
2. A required number of approvals is configured.
3. An owner submits a transaction.
4. Other owners approve the transaction.
5. Once the required number of approvals is reached, the transaction can be executed.

## Built With

- Solidity
- Ethereum Smart Contracts
- Arc Network Builder Journey

## Day 11

MultiSig Wallet implementation as part of the ArcBuilder2026 learning journey.
