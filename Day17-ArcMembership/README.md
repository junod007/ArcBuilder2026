# 🔐 Day 17 - Arc Membership

## 📌 Project Overview

This project is part of my Arc Builder 2026 learning journey.

On Day 17, I built and deployed an **ArcMembership** smart contract on the Arc Network Testnet.

The contract implements a simple on-chain membership system where users can:

- Join the membership
- Renew an existing membership
- Check membership status
- Pay membership fees in USDC
- Configure membership price and duration
- Withdraw contract funds as the owner

---

## 🎯 Learning Goals

- Build a membership smart contract
- Work with ERC-20 USDC payments
- Implement membership expiration
- Use access control with `onlyOwner`
- Handle membership renewals
- Store membership data on-chain
- Emit events for contract activity
- Deploy and interact with a contract on Arc Testnet
- Verify transactions using ArcScan

---

## ⚙️ Contract Features

### `joinMembership()`

Allows a user to join the membership by paying the required USDC membership price.

### `renewMembership()`

Allows an existing member to renew their membership.

### `membershipPrice()`

Returns the current membership price.

### `membershipDuration()`

Returns the configured membership duration.

### `setMembershipPrice(uint256)`

Owner-only function to update the membership price.

### `setMembershipDuration(uint256)`

Owner-only function to update the membership duration.

### `withdraw()`

Owner-only function that withdraws the contract balance.

---

## 🌐 Network

**Network:** Arc Network Testnet

**Contract Address:**

`0x4cB9d4EdCF4d458496127F4FC0b3f1B2CdD2e439`

---

## 💰 Membership Price

The deployed contract was tested with a membership price of:

`0.001 USDC`

---

## 🧪 Contract Interaction

### Join Membership

The `joinMembership()` function was successfully executed.

The transaction transferred:

`0.001 USDC`

from the user wallet to the `ArcMembership` contract.

**Transaction Hash:**

`0x61c55be6edf1b4aae65631c3b3933ac2ddd345d0fdc7b93b310ef82821dd48db`

**Status:** ✅ Success

---

## 🔎 On-Chain Evidence

The successful `joinMembership()` transaction can be verified on ArcScan.

The transaction shows:

- Method: `joinMembership`
- Status: `Success`
- Contract: `ArcMembership`
- USDC transferred: `0.001 USDC`

---

## 📚 What I Learned

This project helped me understand how a real-world membership system can be implemented using a smart contract.

The contract combines:

- ERC-20 token payments
- Membership state
- Expiration logic
- Owner-controlled configuration
- Events
- On-chain verification

---

## 🚀 Day 17 Status

- [x] Create ArcMembership contract
- [x] Compile contract
- [x] Deploy to Arc Testnet
- [x] Verify contract
- [x] Test membership price
- [x] Execute `joinMembership()`
- [x] Confirm USDC transfer
- [x] Verify transaction on ArcScan
- [x] Document deployment

**Day 17 completed successfully.** ✅
