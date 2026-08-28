# Day 19 – PaymentSplitter

## Overview

This project demonstrates a USDC payment splitter deployed on the **Arc Network Testnet**.

The contract accepts USDC payments and distributes them according to predefined shares:

- Recipient 1: **70%**
- Recipient 2: **20%**
- Recipient 3: **10%**

## Contract

**Contract:** `PaymentSplitter`

**Network:** Arc Network Testnet

**Contract Address:**
`0x89B24Ad5E7D7dB4FB59e3bB2d53e972ff7ED3293`

## Recipients

| Recipient | Address | Share |
|---|---|---:|
| Recipient 1 | `0xA128a89295926939B3CB161e8990E74f4D365093` | 70% |
| Recipient 2 | `0x9A714f53aF39599F70DB234f52da66FbbaC06714` | 20% |
| Recipient 3 | `0x4E4dE94DE57968E2b33FC17C8B2391c63246EF89` | 10% |

The shares are configured as:

```text
share1 = 7000
share2 = 2000
share3 = 1000
```

Total shares = `10000`.

## Deployment

The PaymentSplitter contract was successfully deployed on Arc Network Testnet.

**Deployment transaction hash:**

`0xca4324d51e77a9be4cfc963f06e3c462d047b3926c50557bd774549e7872c5a8`

**Status:** Success

## Payment Test

A `pay(10000000)` transaction was executed successfully.

Assuming USDC uses 6 decimals, `10000000` units = **10 USDC**.

The payment was distributed according to the configured shares:

- PaymentSplitter received: **10 USDC**
- Recipient 1: **7 USDC**
- Recipient 2: **2 USDC**
- Recipient 3: **1 USDC**

**Payment transaction hash:**

`0x880c542c8ae03e7f950488c8013f098afed5fe46bd1b6b1e04c8fe06bf0fd576`

**Status:** Success

## Verification

The deployed contract was tested through Remix and the following read functions returned the expected values:

- `recipient1()` → Recipient 1 address
- `recipient2()` → Recipient 2 address
- `recipient3()` → Recipient 3 address
- `share1()` → `7000`
- `share2()` → `2000`
- `share3()` → `1000`

The payment transaction also produced the expected `PaymentReceived` and `PaymentDistributed` logs.

## Result

The Day 19 PaymentSplitter implementation was successfully:

1. Compiled in Remix
2. Deployed to Arc Network Testnet
3. Configured with three recipients
4. Configured with 70/20/10 shares
5. Tested with a 10 USDC payment
6. Verified through successful on-chain transactions and logs

## Evidence

### Deployment
`0xca4324d51e77a9be4cfc963f06e3c462d047b3926c50557bd774549e7872c5a8`

### Payment
`0x880c542c8ae03e7f950488c8013f098afed5fe46bd1b6b1e04c8fe06bf0fd576`

### Contract
`0x89B24Ad5E7D7dB4FB59e3bB2d53e972ff7ED3293`
