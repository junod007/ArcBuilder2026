# VestingWallet

A simple smart contract deployed and tested on the Arc Network Testnet.

## Overview

This project implements a basic token vesting mechanism where an allocation is assigned to a beneficiary and can be released after the configured vesting conditions are met.

The contract was deployed and tested using:

- Remix IDE
- Rabby Wallet
- Arc Network Testnet

## Contract Features

- Set a beneficiary address
- Configure a cliff duration
- Configure a vesting duration
- Configure a total allocation
- Check the beneficiary address
- Check the claimable amount
- Execute the `claim()` function

## Deployment Configuration

The contract was deployed with the following test configuration:

| Parameter | Value |
|---|---:|
| Beneficiary | Wallet used for testing |
| Start | `0` |
| Cliff Duration | `0` |
| Vesting Duration | `86400` seconds |
| Total Allocation | `1000000` |
| Transaction Value | `0 wei` |
| Network | Arc Network Testnet |

## Deployment

The `VestingWallet` contract was successfully deployed to the Arc Network Testnet.

After deployment, the contract was added to the deployed contracts section in Remix and its public functions were tested.

## Verification and Testing

### 1. Check Beneficiary

The `beneficiary()` function was called successfully.

The returned address matched the beneficiary address configured during deployment.

### 2. Check Claimable Amount

The `claimableAmount()` function returned:

```text
1000000
