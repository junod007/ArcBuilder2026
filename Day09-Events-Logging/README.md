# Day 09 – Events & Logging

## 📌 Overview

Pada Day 09, saya mempelajari bagaimana Smart Contract menggunakan
Event untuk mencatat aktivitas transaksi di blockchain.

## 📜 Smart Contract

Contract yang dibuat:

DidonLogger.sol

Fitur:

- Menyimpan pesan
- Mengubah pesan menggunakan `setMessage()`
- Mengirim Event `MessageUpdated`
- Membaca pesan menggunakan `getMessage()`

## 🔔 Event

```solidity
event MessageUpdated(
    address indexed user,
    string message,
    uint256 timestamp
);
