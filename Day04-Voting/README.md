# Day 04 - Voting

## Objective

Build and deploy a simple Voting smart contract on Arc Testnet using Solidity and Remix IDE.

## Smart Contract

The `Voting.sol` contract contains:

- 3 candidates:
  - Alice
  - Bob
  - Charlie
- Vote counting
- Prevention of double voting
- Candidate lookup
- Vote status verification

## Deployment

The Voting smart contract was compiled and deployed successfully to **Arc Testnet** using Remix IDE.

### 1. Compile Contract

![Compile](screenshot/01-compile.png)

### 2. Deploy Contract

![Deploy](screenshot/02-deploy.png)

## Candidate Verification

### 3. Candidate Count

The contract returns **3 candidates**.

![Candidate Count](screenshot/03-candidate-count.png)

### 4. Alice

![Alice](screenshot/04-alice.png)

### 5. Bob

![Bob](screenshot/05-bob.png)

### 6. Charlie

![Charlie](screenshot/06-charlie.png)

## Voting

### 7. Vote for Alice

A vote was successfully submitted for Alice.

![Vote Alice](screenshot/07-vote-alice.png)

### 8. Verify Vote Count

The candidate data was queried again after voting.

![Verify Vote](screenshot/08-verify-vote.png)

### 9. Verify Voting Status

The `hasVoted` function confirms that the wallet address has already voted.

![Has Voted](screenshot/09-hasvoted.png)

## Result

The Voting smart contract was successfully:

- Compiled with Solidity
- Deployed on Arc Testnet
- Tested with 3 candidates
- Used to cast a vote
- Verified through contract read functions

## Network

**Arc Testnet**

## Tools

- Solidity
- Remix IDE
- Arc Testnet
- Rabby Wallet




