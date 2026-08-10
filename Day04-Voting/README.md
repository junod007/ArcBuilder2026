# Day 04 - Voting

## Objective

Build and deploy a simple Voting smart contract on Arc Testnet using Solidity and Remix IDE.

## Smart Contract

The Voting.sol contract contains:

- 3 candidates:
  - Alice
  - Bob
  - Charlie
- Each wallet can vote only once.
- Vote counts are stored on-chain.
- Candidate information can be queried.
- Voting status can be checked using hasVoted.

## Contract Functions

### vote(uint256 candidateIndex)

Allows a wallet to vote for a candidate.

Candidate indexes:

- 0 = Alice
- 1 = Bob
- 2 = Charlie

A wallet can only vote once.

### getCandidateCount()

Returns the total number of candidates.

Expected result: 3

### getCandidate(uint256 candidateIndex)

Returns the candidate name and vote count.

Example results after testing:

- Candidate 0: Alice — 1 vote
- Candidate 1: Bob — 0 votes
- Candidate 2: Charlie — 0 votes

### hasVoted(address)

Checks whether a wallet has already voted.

After voting, the connected wallet returned: true

## Deployment

The contract was compiled successfully using Remix IDE and deployed to Arc Network Testnet.

The deployment transaction was successfully mined and executed.

## Testing

The following tests were performed.

### 1. Check Candidate Count

Called getCandidateCount().

Result: 3

### 2. Check Alice

Called getCandidate(0).

Initial result: Alice — 0 votes.

After voting: Alice — 1 vote.

### 3. Check Bob

Called getCandidate(1).

Result: Bob — 0 votes.

### 4. Check Charlie

Called getCandidate(2).

Result: Charlie — 0 votes.

### 5. Vote for Alice

Called vote(0).

The transaction was successfully mined and executed.

Result: Alice — 1 vote.

### 6. Check Voting Status

Called hasVoted(address).

Result: true

This confirms that the connected wallet has already voted.

## Result

The Voting smart contract was successfully:

- Written in Solidity
- Compiled in Remix IDE
- Deployed to Arc Testnet
- Queried successfully
- Tested with on-chain transactions
- Verified through candidate vote counts
- Verified using the hasVoted function

## Conclusion

Day 04 successfully demonstrates a basic on-chain voting system using a Solidity smart contract on Arc Testnet.

The contract successfully records votes and prevents the same wallet from voting more than once.


