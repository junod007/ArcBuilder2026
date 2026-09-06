\# Day 24 — ERC-8004 AI Agent on Arc



\## Overview



Day 24 explores ERC-8004 on Arc Testnet by creating, registering,

building reputation for, and validating an AI agent identity on-chain.



The agent was registered through Circle Developer-Controlled Wallets

and the ERC-8004 registries deployed on Arc Testnet.



\## Network



\- Network: Arc Testnet

\- Chain ID: 5042002

\- RPC: https://rpc.testnet.arc.network

\- Explorer: https://testnet.arcscan.app



\## ERC-8004 Contracts



\### Identity Registry



`0x8004A818BFB912233c491871b3d84c89A494BD9e`



\### Reputation Registry



`0x8004B663056A597Dffe9eCcC1965A193B7388713`



\### Validation Registry



`0x8004Cb1BF31DAf7788923b405b754f57acEB4272`



\## Agent



\- Agent Name: AOKAH Arc AI Agent

\- Agent ID: `892242`

\- Agent Type: General

\- Version: `1.0.0`



\### Owner Wallet



`0x6dd76aa8b3d36cef43df4520fa458fbd3b7cd33e`



\### Validator Wallet



`0x9d961ff957121ebcfd77e0349078d3d768f56d90`



\## On-chain Activity



\### 1. Identity Registration



Agent identity successfully registered on Arc Testnet.



Transaction:



`0x1d4e5a36abf08afb1345fcd0432dcb88bea6e2d000e8a75d3f02f6d9d626a1fa`



\[View on ArcScan](https://testnet.arcscan.app/tx/0x1d4e5a36abf08afb1345fcd0432dcb88bea6e2d000e8a75d3f02f6d9d626a1fa)



Result:



\- Identity registered

\- Agent ID: `892242`



\### 2. Reputation



A reputation score of 95 was submitted by the validator wallet.



\- Score: `95/100`

\- Tag: `successful\_agent\_registration`



Transaction:



`0xf3e77b5f6ab55305fbcebf786092515d624ddbaba564c5aa67ac45141868c914`



\[View on ArcScan](https://testnet.arcscan.app/tx/0xf3e77b5f6ab55305fbcebf786092515d624ddbaba564c5aa67ac45141868c914)



\### 3. Validation Request



The owner wallet requested validation from the designated validator.



Request Hash:



`0x600110c45879f58b27e68b8f126561843cd3a0391099ed509e8819cb6b2ddb6f`



Transaction:



`0xdc2c604d1a8577edaf9472e070d57f4c8a1ca947f3fd037377610dada3200753`



\[View on ArcScan](https://testnet.arcscan.app/tx/0xdc2c604d1a8577edaf9472e070d57f4c8a1ca947f3fd037377610dada3200753)



\### 4. Validation Response



The designated validator responded with a full validation score.



\- Response: `100/100`

\- Tag: `arc\_agent\_verified`



Transaction:



`0x93fd9e618416caede70a39adafc555b5ad289fb8f47c092a3cf95430eb2bc25b`



\[View on ArcScan](https://testnet.arcscan.app/tx/0x93fd9e618416caede70a39adafc555b5ad289fb8f47c092a3cf95430eb2bc25b)



\### 5. On-chain Verification



The final validation state was read directly from the Validation Registry.



Result:



```text

Agent ID:   892242

Response:   100/100

Tag:        arc\_agent\_verified

