# Day 05 — Treasury Contract

Simple Treasury smart contract built with Solidity and deployed on Arc Network Testnet.

## Overview

This contract demonstrates basic native ETH treasury management.

Features:

- Accept native ETH deposits
- Check treasury balance
- Owner-only withdrawals
- Deposit and withdrawal events
- Native ETH transfer

## Contract

`Treasury.sol`

## Functions

### deposit()

Allows users to deposit native ETH into the Treasury.

```solidity
function deposit() external payable
