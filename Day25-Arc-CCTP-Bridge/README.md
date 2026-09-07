\# Day 25 — Arc CCTP Bridge



Cross-chain USDC transfer from \*\*Ethereum Sepolia\*\* to \*\*Arc Testnet\*\* using \*\*Circle CCTP V2\*\* through the \*\*Circle App Kit\*\*.



\## 🚀 Overview



This project demonstrates a real cross-chain USDC bridge:



```text

Ethereum Sepolia

&#x20;     │

&#x20;     │ 1 USDC

&#x20;     ▼

Circle CCTP V2

&#x20;     │

&#x20;     │ Burn + Attestation

&#x20;     ▼

Arc Testnet

&#x20;     │

&#x20;     ▼

1 USDC Minted



\## On-chain Proof



A successful 1.00 USDC bridge was executed from Ethereum Sepolia to Arc Testnet using Arc App Kit with CCTP V2.



\### Transfer Details



\- Amount: 1.00 USDC

\- Source: Ethereum Sepolia

\- Destination: Arc Testnet

\- Transfer Speed: FAST

\- Provider: CCTPV2BridgingProvider

\- CCTP Version: V2

\- Source Domain: 0

\- Destination Domain: 26

\- Attestation Status: Complete



\### Source Transaction



Approve and burn were executed in a batched transaction:



`0x283159fbe78cbf84e28726d824373f940f57fe303bc2fa9a1073cc2bafdaabaf`



\[View on Etherscan](https://sepolia.etherscan.io/tx/0x283159fbe78cbf84e28726d824373f940f57fe303bc2fa9a1073cc2bafdaabaf)



\### Destination Transaction



The bridged USDC was successfully minted on Arc Testnet:



`0xd4b0036708bbde365deb680bb10b837bebc24f24c1a2058754450f97af325853`



\[View on ArcScan](https://testnet.arcscan.app/tx/0xd4b0036708bbde365deb680bb10b837bebc24f24c1a2058754450f97af325853)



\### Result



The 1.00 USDC transfer successfully completed:



Ethereum Sepolia → CCTP V2 → Circle Attestation → Arc Testnet



Destination mint transaction status: \*\*Success\*\*

