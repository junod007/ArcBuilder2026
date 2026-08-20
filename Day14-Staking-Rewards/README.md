# Day 14 - Staking & Rewards

## Overview

This project implements a simple Staking & Rewards smart contract using Solidity.

Users can stake ETH, earn time-based rewards, claim their rewards, and unstake their ETH.

## Features

- Stake ETH
- Track individual staking balances
- Calculate rewards based on staking duration
- Claim accumulated rewards
- Unstake partially or fully
- Owner can update the reward rate
- Owner can fund the contract for rewards
- Track total staked ETH
- Event logging for staking, unstaking, and reward claims

## Smart Contract

`StakingRewards.sol`

## Main Functions

| Function | Description |
|----------|-------------|
| `stake()` | Stake ETH into the contract |
| `pendingReward(address)` | Check pending rewards |
| `claimReward()` | Claim accumulated rewards |
| `unstake(uint256)` | Withdraw staked ETH |
| `setRewardRate(uint256)` | Update reward rate (owner only) |
| `fundRewards()` | Fund the contract with ETH for rewards |
| `contractBalance()` | Check contract ETH balance |

## Deployment

1. Open Remix IDE
2. Create `StakingRewards.sol`
3. Paste the smart contract code
4. Compile using Solidity `0.8.20` or compatible version
5. Deploy the contract
6. Test staking
7. Test reward calculation
8. Claim rewards
9. Test unstaking

## Learning Objectives

This project covers:

- Solidity structs
- Mappings
- Payable functions
- ETH transfers
- Time-based reward calculations
- Smart contract events
- Access control with modifiers
- Owner permissions
- State management

## ARC Builder 2026

Day 14 completed as part of the ARC Builder 2026 learning journey.

**Next Step:** Deploy and interact with the Staking & Rewards contract using Remix IDE.
