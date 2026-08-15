# Day 10 – P2P Payments

## Overview

Pada Day 10, saya mempelajari konsep **Peer-to-Peer (P2P) Payments** menggunakan Smart Contract Solidity.

Contract ini memungkinkan pengguna mengirim ETH secara langsung ke wallet penerima melalui fungsi `sendPayment()`.

Setiap transaksi pembayaran akan menghasilkan event `PaymentSent` yang dapat digunakan untuk melakukan tracking dan logging aktivitas pembayaran.

---

## Smart Contract

File utama:

```text
DionPayment.sol
