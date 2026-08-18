# Day 13 – Escrow Payment

A simple Ethereum smart contract that acts as an escrow between a buyer and a seller.

## 📌 How It Works

1. The buyer deposits ETH into the escrow contract.
2. The funds are securely held by the smart contract.
3. The buyer can release the payment to the seller.
4. The buyer can request a refund before the payment is released.

## ✨ Features

* Secure ETH deposit
* Buyer and seller roles
* Release payment to seller
* Refund mechanism
* Transaction status tracking
* Event logging

## 🔄 Escrow Flow

Buyer → Deposit ETH → Escrow Contract → Release → Seller

Or:

Buyer → Deposit ETH → Escrow Contract → Refund → Buyer

## 🛠 Tech Stack

* Solidity
* Remix IDE
* MetaMask
* Ethereum-compatible Testnet

## 📂 Project Files

```text
Day13-Escrow-Payment/
├── Escrow.sol
└── README.md
```

## 🎯 Learning Goals

* Understand escrow smart contract logic
* Work with multiple user roles
* Handle ETH securely
* Manage contract states
* Emit events for important transactions

---

**Day 13 of my ArcBuilder2026 smart contract learning journey. 🚀**
