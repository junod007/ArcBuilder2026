# Day 32 — ArcFlow Payment Intent

## Overview

Day 32 introduces the **Payment Intent** primitive to ArcFlow.

Instead of treating every payment as a direct transaction, ArcFlow now represents a payment as an on-chain intent that can move through a defined lifecycle:

```text
Create Intent
      ↓
Pending
      ↓
Authorized Execution
      ↓
Completed
