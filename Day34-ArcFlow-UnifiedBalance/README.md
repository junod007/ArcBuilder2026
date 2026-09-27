\# Arc Builder — Day 34: Unified Balance



A hands-on Arc Builder project exploring \*\*Circle Unified Balance\*\* with \*\*Circle App Kit\*\*, \*\*Viem\*\*, and \*\*MetaMask\*\*.



This project focuses on reading and displaying a wallet's unified USDC balance across supported testnet networks, including Arc Testnet.



\---



\## Overview



Day 34 extends the Arc Builder journey into multichain balance aggregation.



Instead of checking a wallet balance on a single network, the application uses Circle Unified Balance to retrieve:



\- Total confirmed USDC balance

\- Depositor information

\- Per-network USDC balance breakdown

\- Supported testnet network data



The current implementation is \*\*read-only\*\*. No USDC is deposited, transferred, or spent by this application.



\---



\## Architecture



```text

MetaMask

&#x20;  │

&#x20;  ▼

EIP-1193 Provider

&#x20;  │

&#x20;  ▼

Viem Adapter

&#x20;  │

&#x20;  ▼

Circle App Kit

&#x20;  │

&#x20;  ▼

Unified Balance

&#x20;  │

&#x20;  ├── Total USDC Balance

&#x20;  │

&#x20;  └── Per-Chain Breakdown

