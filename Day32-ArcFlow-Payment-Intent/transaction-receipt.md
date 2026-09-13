# Day 32 — ArcFlow Payment Intent Transaction Receipt

## Execution Summary

The Payment Intent created in Day 32 was successfully executed on Arc Testnet.

| Item | Value |
|------|-------|
| Network | Arc Testnet |
| Contract | `ArcFlowPaymentIntent` |
| Contract Address | `0x4F610857679075E3fd5ecCD046C8FA98159312DD` |
| Intent ID | `0` |
| Payment Reference | `ArcFlow-Day32-Test-001` |
| Asset | USDC |
| Amount | `1 USDC` |
| Status Before | Pending |
| Status After | Completed |
| Executor | `0xA128a89295926939B3CB161e8990E74f4D365093` |

---

## Contract Deployment

The `ArcFlowPaymentIntent` contract was deployed successfully on Arc Testnet.

| Item | Value |
|------|-------|
| Contract | `ArcFlowPaymentIntent` |
| Address | `0x4F610857679075E3fd5ecCD046C8FA98159312DD` |
| Network | Arc Testnet |
| Deployment Block | `61894868` |
| Compiler | Solidity `0.8.34` |
| Tool | Remix 2.5.7 |
| Wallet | Rabby |

---

## Payment Intent Creation

Intent `#0` was created with the following parameters:

```text
Payer:
0xA128a89295926939B3CB161e8990E74f4D365093

Payee:
0xA128a89295926939B3CB161e8990E74f4D365093

Asset:
0x3600000000000000000000000000000000000000

Amount:
1000000
(1 USDC, 6 decimals)

Executor:
0xA128a89295926939B3CB161e8990E74f4D365093

Payment Reference:
ArcFlow-Day32-Test-001
```

The initial on-chain state was:

```text
Intent ID: 0
Status: Pending
Created At: 1789301347
Executed At: 0
```

---

## USDC Approval

Before execution, the payer approved the `ArcFlowPaymentIntent` contract to spend `1 USDC`.

### Approval Transaction

```text
0x07e7d92c20bd5767d79e2e34a183b6c57c14abfe5a2969b7489ff0d2989d9857
```

| Item | Value |
|------|-------|
| Token | USDC |
| Owner | `0xA128a89295926939B3CB161e8990E74f4D365093` |
| Spender | `0x4F610857679075E3fd5ecCD046C8FA98159312DD` |
| Allowance | `1000000` |
| Amount | `1 USDC` |
| Block | `61896490` |
| Gas Used | `55438` |

The approval transaction emitted the expected ERC20 `Approval` event.

---

## Payment Intent Execution

The authorized executor then called:

```solidity
executePaymentIntent(0)
```

### Execution Transaction

```text
0xf0b8cee11bd29c419949016defc8b4d6f9cf501c181e50b8df4841a9226111b9
```

[View transaction on ArcScan](https://testnet.arcscan.app/tx/0xf0b8cee11bd29c419949016defc8b4d6f9cf501c181e50b8df4841a9226111b9)

| Item | Value |
|------|-------|
| Status | Success |
| Method | `executePaymentIntent` |
| Block | `61896621` |
| Gas Used | `106992` |
| Value | `0 USDC` |
| Fee | `0.0026961984 USDC` |
| Timestamp | Sep 13, 2026 19:14:23 +07 |

---

## State Transition

Before execution:

```text
Status = Pending
executedAt = 0
```

After successful execution:

```text
Status = Completed
executedAt = 1789301663
```

The state transition confirms that the payment intent moved from:

```text
Pending → Completed
```

---

## ERC20 Transfer Evidence

The execution transaction emitted an ERC20 `Transfer` event.

```text
From:
0xA128a89295926939B3CB161e8990E74f4D365093

To:
0xA128a89295926939B3CB161e8990E74f4D365093

Amount:
1000000
(1 USDC)
```

This was intentionally configured as a **self-payment test**.

The purpose was not to simulate a payment between two different users, but to verify that the Payment Intent mechanism correctly performs:

```text
Intent
↓
Authorization
↓
USDC transferFrom
↓
State transition
↓
Event emission
```

---

## ArcFlow Event Evidence

The execution transaction also emitted:

```text
PaymentIntentExecuted
```

Event data:

```text
intentId:
0

executor:
0xA128a89295926939B3CB161e8990E74f4D365093

executedAt:
1789301663
```

This provides on-chain evidence that the Payment Intent execution was completed by the authorized executor.

---

## Final On-Chain State

Calling:

```solidity
getPaymentIntent(0)
```

returned:

```text
Payer:
0xA128a89295926939B3CB161e8990E74f4D365093

Payee:
0xA128a89295926939B3CB161e8990E74f4D365093

Asset:
0x3600000000000000000000000000000000000000

Amount:
1000000

Executor:
0xA128a89295926939B3CB161e8990E74f4D365093

Created At:
1789301347

Executed At:
1789301663

Status:
1 (Completed)

Payment Reference:
ArcFlow-Day32-Test-001
```

---

## Verification Checklist

- [x] Contract compiled successfully.
- [x] Contract deployed on Arc Testnet.
- [x] Payment Intent `#0` created.
- [x] Initial state verified as `Pending`.
- [x] USDC allowance approved.
- [x] Authorized executor executed the intent.
- [x] USDC `transferFrom` executed successfully.
- [x] Intent state changed to `Completed`.
- [x] `executedAt` recorded on-chain.
- [x] `PaymentIntentExecuted` event emitted.
- [x] Execution transaction verified on ArcScan.

---

## Result

Day 32 successfully demonstrates a complete **on-chain Payment Intent lifecycle** on Arc Testnet:

```text
Create Intent
      ↓
Pending
      ↓
USDC Approval
      ↓
Authorized Execution
      ↓
transferFrom
      ↓
Completed
      ↓
On-chain Evidence
```

This test establishes the Payment Intent primitive as another building block for the ArcFlow architecture.

> Don't just build the payment flow. Verify the state transition and the on-chain evidence.
