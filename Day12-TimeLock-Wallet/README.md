# Day 12 - TimeLock Wallet

## Overview

This project implements a simple TimeLock Wallet smart contract on Arc Testnet.

The contract allows ERC-20 tokens to be withdrawn only after a specified unlock time.

## Features

- ERC-20 token support
- Time-based withdrawal lock
- Token allowance using approve()
- Balance checking
- Unlock status checking
- Secure withdrawal after unlock time

## Smart Contract

Contract: `TimeLockWallet.sol`

Main functions:

- `getBalance()` - Check the token balance held by the contract
- `isUnlocked()` - Check whether the unlock time has been reached
- `withdraw(address to, uint256 amount)` - Withdraw tokens after the unlock time

## Testing

The contract was tested on Arc Testnet using USDC.

Test results:

1. Contract deployed successfully
2. USDC approved successfully
3. Withdrawal attempted before unlock time
4. Transaction correctly reverted with `Still locked`
5. Unlock time passed successfully
6. `isUnlocked()` returned `true`
7. USDC withdrawal completed successfully

## Token

USDC on Arc Testnet:

`0x3600000000000000000000000000000000000000`

Decimals: `6`

Example:

`1000000 = 1 USDC`

## Network

Arc Testnet

## Status

Completed successfully.
