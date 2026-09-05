\# Day23 — Arc App Kit



Browser-based USDC application built with Circle Arc App Kit and a MetaMask browser wallet.



\## Features



\- Connect MetaMask via EIP-6963

\- Send USDC on Arc Testnet

\- Swap USDC → EURC on Arc Testnet

\- Bridge USDC from Ethereum Sepolia → Arc Testnet

\- CCTP V2 cross-chain transfer

\- FAST transfer mode



\## Cross-Chain Bridge Evidence



\### Transfer



\- Amount: \*\*1.0 USDC\*\*

\- Token: \*\*USDC\*\*

\- Source: \*\*Ethereum Sepolia\*\*

\- Destination: \*\*Arc Testnet\*\*

\- Protocol: \*\*Circle CCTP V2\*\*

\- Transfer Speed: \*\*FAST\*\*

\- Status: \*\*SUCCESS\*\*



\### Burn — Ethereum Sepolia



\- State: \*\*success\*\*

\- Batched: \*\*true\*\*

\- Batch ID:

&#x20; `0x0247fad63717483591d5134ed0648fe3`



\- Transaction:

&#x20; `0x62a5e3f46caf9fefdb55f9e0b73c6d793c3838c2e5c5226b1e16906a1cb96ae7`



\[View Burn Transaction on Sepolia Etherscan](https://sepolia.etherscan.io/tx/0x62a5e3f46caf9fefdb55f9e0b73c6d793c3838c2e5c5226b1e16906a1cb96ae7)



\### Attestation — CCTP V2



\- State: \*\*success\*\*

\- Status: \*\*complete\*\*

\- CCTP Version: \*\*2\*\*



\### Mint — Arc Testnet



\- State: \*\*success\*\*

\- Block: `60577526`

\- Transaction Index: `7`



\- Transaction:

&#x20; `0xae146fb5f18d9ffc2c3b30c84f1b420b8ac6a31487c4568077d6300df115436f`



\[View Mint Transaction on ArcScan](https://testnet.arcscan.app/tx/0xae146fb5f18d9ffc2c3b30c84f1b420b8ac6a31487c4568077d6300df115436f)



\## Bridge Flow



```text

Ethereum Sepolia

&#x20;     │

&#x20;     │ 1.0 USDC

&#x20;     ▼

&#x20;CCTP V2 Burn

&#x20;     │

&#x20;     ▼

&#x20;Attestation

&#x20;     │

&#x20;     ▼

&#x20;Arc Testnet

&#x20;     │

&#x20;     ▼

&#x20;CCTP V2 Mint

&#x20;     │

&#x20;     ▼

&#x20;  SUCCESS

