# Day 6 — Inheritance & Whitelist

## Objective
Implement and deploy a Whitelist smart contract using Solidity inheritance.

## Contract Structure

The project consists of:

- `BaseWhitelist` — stores whitelist status and provides `isWhitelisted()`
- `Whitelist` — inherits `BaseWhitelist`
- `owner` — wallet that has permission to manage the whitelist

## Functions Tested

- `addToWhitelist(address user)`
- `removeFromWhitelist(address user)`
- `isWhitelisted(address user)`

## Deployment

Network: Arc Network Testnet

The contracts were successfully compiled and deployed through Remix IDE.

## Test Result

The test wallet was successfully added to the whitelist.

Final verification:

`isWhitelisted(address) → true`

## Evidence

Screenshots documenting the deployment and whitelist verification are included in this Day 6 folder.
