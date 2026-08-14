# Day 09 – Events & Logging

## 📌 Overview

Pada Day 09, saya mempelajari bagaimana Smart Contract menggunakan **Event** untuk mencatat aktivitas yang terjadi di blockchain.

Event berguna untuk memberikan informasi kepada aplikasi, frontend, atau pengguna ketika sebuah transaksi atau perubahan data terjadi di dalam Smart Contract.

---

## 📜 Smart Contract

Contract yang dibuat:

`DidonLogger.sol`

Fitur utama:

- 💾 Menyimpan pesan
- 🖊️ Mengubah pesan menggunakan `setMessage()`
- 📢 Mengirim Event `MessageUpdated`
- 🔍 Membaca pesan menggunakan `getMessage()`

---

## 📸 Screenshots

### 1. Source Code

![Source Code](01-source-code.png)

### 2. Deploy Contract

![Deploy Contract](02-deploy-contract.png)

### 3. Deployment Success

![Deployment Success](03-deployment-success.png)

### 4. Set Message

![Set Message](04-set-message.png)

### 5. Event Logged

![Event Logged](05-event-logged.png)

### 6. Get Message Success

![Get Message Success](06-get-message-success.png)
