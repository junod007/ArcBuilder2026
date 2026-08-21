# ArcInvoice

A simple smart contract for managing invoices on the blockchain.

Built and tested on Arc Network Testnet.

## Features

- Create invoices
- Store recipient address
- Store invoice description
- Store invoice amount
- Track invoice status
- View invoice details
- Cancel invoices
- Track total invoice count

## Smart Contract

**Network:** Arc Network Testnet

**Contract Address:**

`0x3B477e84e5D9D2C7436BAA9922E0614B52ea2d1`

## Contract Functions

### createInvoice

Creates a new invoice.

Parameters:

- `recipient` — Recipient wallet address
- `description` — Invoice description
- `amount` — Invoice amount

### invoiceCount

Returns the total number of invoices created.

### invoices

Returns invoice details including:

- Invoice ID
- Recipient
- Description
- Amount
- Status
- Created timestamp
- Paid timestamp

### cancelInvoice

Cancels an existing invoice.

## Testing

The contract was tested successfully on Arc Network Testnet.

### Test 1 — Create Invoice

Invoice #1 was created successfully.

Status:

`Pending`

### Test 2 — Create and Cancel Invoice

Invoice #2 was created successfully and then cancelled.

Final status:

`Cancelled`

## On-Chain Transactions

### createInvoice

Transaction Hash:

`0x32ad2d2396cdaca07fd8e78fa39b60267cd12d1f1491ccf327a66a3135cb15be`

Status: **Success**

### cancelInvoice

Transaction Hash:

`0x892806fb52728d98bfa2f83c40a8fb80ec3bfc5cb7ece2fd6b4f15190c99092`

Status: **Success**

## Deployment

The ArcInvoice smart contract was deployed and tested using Remix IDE with Rabby Wallet connected to Arc Network Testnet.

## Project Status

Completed and successfully tested on Arc Network Testnet.
