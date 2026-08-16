# Day 11 - MultiSig Wallet

A simple Multi-Signature Wallet smart contract built with Solidity.

## Features

- Multiple wallet owners
- Configurable number of required approvals
- Submit transactions
- Approve transactions
- Execute approved transactions
- Prevent duplicate approvals
- Track transaction status

## Smart Contract Functions

### submitTransaction

Creates a new transaction.

```solidity
submitTransaction(address _to, uint256 _value)
