# Day 16 – ArcSubscription

## Overview

ArcSubscription is a simple smart contract for managing blockchain-based subscriptions.

Users can pay a subscription fee to activate access for a specified period. After the subscription expires, users can renew it by paying the subscription fee again.

The contract stores each user's subscription status and expiration time directly on-chain.

---

## Features

- Payable subscription system
- Configurable subscription price
- Configurable subscription duration
- On-chain subscription tracking
- Automatic expiration using `block.timestamp`
- Subscription renewal
- Remaining subscription time checker
- Owner-only configuration controls
- Owner-only withdrawal function
- Events for subscription activity

---

## Smart Contract

The main contract is:

```text
ArcSubscription.sol
