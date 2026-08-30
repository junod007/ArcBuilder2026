Arc Testnet Crowdfunding

A simple Solidity crowdfunding smart contract deployed and tested on
Arc Network Testnet using Remix IDE and a browser wallet.

Overview

The contract allows users to contribute funds toward a campaign goal.
Once the campaign duration ends:

If the funding goal is reached, the owner can claim the raised
funds.

If the funding goal is not reached, contributors can claim a refund.

Campaign Parameters

Parameter                              Value

Campaign goal               10,000,000,000
Campaign duration            3,600 seconds
Initial contribution        10,000,000,000
Network                  Arc Network Testnet

Contract Functions

contribute()

Allows users to contribute funds while the campaign is still active.

claimFunds()

Allows the campaign owner to claim the raised funds after:

The campaign duration has ended.

The campaign goal has been reached.

The owner has not already claimed the funds.

refund()

Allows contributors to request a refund after the campaign has ended if
the funding goal was not reached.

getCampaignStatus()

Returns the current campaign state:

campaignGoal

amountRaised

campaignDeadline

goalReached

campaignEnded

ownerHasClaimed

Test Results

The complete campaign flow was tested successfully:

Contract deployed successfully.

A contribution of 10,000,000,000 was sent successfully.

An early claimFunds() attempt correctly reverted with:

Campaign is still active

After the 3,600-second campaign duration ended, claimFunds() was
executed successfully with:

Value: 0 wei

Final status verification showed:

campaignGoal   = 10000000000
amountRaised   = 10000000000
goalReached    = true
campaignEnded  = true
ownerHasClaimed = true

Deployment Transactions

First successful deployment

Transaction hash:
0xeca3c891cef7aba763ca97206fe114edc8a51dc92de46ba60dc0e1ad4bb0cf22

Status: Success

Second successful deployment

Transaction hash:
0x39fd6f938b6e1ccda7e1f0a0ab69db36eba588f48a711ae224e3555844aa433e

Status: Success

This is the later deployment used for the successful end-to-end test
flow.

Test Flow

Deploy
  ↓
contribute()
  ↓
Goal reached
  ↓
Attempt claimFunds() before deadline
  ↓
Reverts: "Campaign is still active"
  ↓
Wait until campaign ends
  ↓
claimFunds() with 0 wei
  ↓
Success
  ↓
Verify getCampaignStatus()
  ↓
ownerHasClaimed = true

Technology

Solidity

Remix IDE

Arc Network Testnet

Rabby Wallet

ArcScan

Notes

This project was tested on a testnet. The deployment and transaction
records are intended as development and test evidence.

Status: End-to-end test completed successfully.
