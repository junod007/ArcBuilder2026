# Day 28 – Arc Agent Payment Authorization

A USDC-based delegated payment authorization smart contract built and tested on Arc Network Testnet.

This project demonstrates how a client can authorize an AI agent to make USDC payments within a predefined spending limit, while retaining the ability to revoke the authorization at any time.

---

## 🎯 Objective

Build a simple on-chain payment authorization system for AI agents.

The client defines:

- Which agent is authorized
- Maximum spending limit
- Payments executed by the agent
- Amount already spent
- Remaining allowance
- Whether the authorization is still active

The client can revoke the authorization when it is no longer needed.

---

## ✨ Features

- Create agent payment authorization
- Define USDC spending limit
- Execute delegated USDC payments
- Track total amount spent
- Calculate remaining allowance
- Revoke authorization
- Prevent payments after revocation
- Emit events for authorization and payment activity

---

## 🏗️ Architecture

```text
Client Wallet
     │
     │ Create Authorization
     │ Limit = 3 USDC
     ▼
AgentPaymentAuth
     │
     │ USDC allowance
     ▼
USDC Contract
     │
     │ transferFrom()
     ▼
Recipient

Client
  │
  └── Revoke Authorization
          │
          ▼
     Authorization inactive
          │
          ▼
     ❌ Future payments blocked
