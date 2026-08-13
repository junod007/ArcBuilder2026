# Day 08 — Access Control

## Arc Builder Journey 2026

Today I learned how to implement access control in a Solidity smart contract on Arc Testnet.

## Goals

- Understand contract ownership
- Use `msg.sender`
- Create and use modifiers
- Restrict functions with `onlyOwner`
- Deposit ETH into a smart contract
- Withdraw personal balances
- Transfer contract ownership

## Smart Contract

The contract created for this exercise is:

`DidonVault.sol`

### Main Features

#### Owner

The wallet that deploys the contract automatically becomes the owner.

```solidity
address public owner;
