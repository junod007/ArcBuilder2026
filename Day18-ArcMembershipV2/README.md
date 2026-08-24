# 🪪 Day 18 - Arc Membership V2

## 📌 Project Overview

This project is part of my **ArcBuilder2026 learning journey**.

On Day 18, I built and deployed an upgraded membership smart contract on the **Arc Network Testnet**.

The contract allows users to purchase a membership using USDC and provides membership expiration tracking.

---

## ✨ Features

- 💳 USDC-based membership payment
- 🪪 Join membership
- 🔄 Renew membership
- ⏳ Membership expiration tracking
- 👤 Membership status verification
- 💰 Configurable membership price
- ⏱️ Configurable membership duration

---

## 🌐 Network

| Item | Details |
|---|---|
| Network | Arc Network Testnet |
| Chain ID | `5042002` |
| Contract | `ArcMembershipV2` |
| Contract Address | `0x108e72322B20b894179768D27A6E97469E999357` |
| USDC Address | `0x3600000000000000000000000000000000000000` |

---

## ⚙️ Contract Configuration

| Parameter | Value |
|---|---|
| Membership Price | `1000000` |
| Membership Price | 1 USDC |
| Membership Duration | `2592000` seconds |
| Membership Duration | 30 days |

---

## 🔧 Main Functions

### `joinMembership()`

Allows a user to purchase a membership by paying the configured USDC membership price.

### `renewMembership()`

Allows an existing member to renew their membership.

### `isMember(address)`

Checks whether an address currently has an active membership.

### `membershipExpiry(address)`

Returns the expiration timestamp of a user's membership.

### `membershipPrice()`

Returns the current membership price.

### `membershipDuration()`

Returns the configured membership duration.

---

## 🧪 Testing

### 1. USDC Approval

Before joining, the membership contract must be approved to spend the required amount of USDC.

```text
USDC approve
↓
Spender: ArcMembershipV2
Amount: 1000000
