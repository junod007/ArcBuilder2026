import './style.css'
import { AppKit } from '@circle-fin/app-kit'
import { createViemAdapterFromProvider } from '@circle-fin/adapter-viem-v2'
import type { EIP1193Provider } from 'viem'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <main class="app">
    <header class="header">
      <div>
        <p class="eyebrow">ARC BUILDER — DAY 34</p>
        <h1>Unified Balance</h1>
        <p class="subtitle">
          Explore Circle Unified Balance on Arc Testnet.
        </p>
      </div>

      <div class="status">
        <span class="status-dot"></span>
        <span id="status-text">Disconnected</span>
      </div>
    </header>

    <section class="card">
      <div class="card-header">
        <div>
          <p class="label">Wallet</p>
          <h2 id="wallet-address">Not connected</h2>
        </div>

        <button id="connect-button" type="button">
          Connect Wallet
        </button>
      </div>
    </section>

    <section class="card balance-card">
      <div class="card-header">
        <div>
          <p class="label">Unified Balance</p>
          <h2 id="balance">—</h2>
        </div>

        <span class="network">Testnet</span>
      </div>

      <button
        id="balance-button"
        type="button"
        disabled
      >
        Check Unified Balance
      </button>

      <p id="balance-status" class="muted">
        Connect your wallet to continue.
      </p>
    </section>

    <section class="card">
      <div class="card-header">
        <div>
          <p class="label">Chain Breakdown</p>
          <h2>USDC by Network</h2>
        </div>

        <span id="chain-count" class="network">0 chains</span>
      </div>

      <div id="chain-list" class="chain-list">
        <p class="muted">
          Unified Balance breakdown will appear here.
        </p>
      </div>
    </section>

    <section class="info">
      <p>
        Day 34 — Unified Balance using Circle App Kit.
      </p>
    </section>
  </main>
`

const connectButton =
  document.querySelector<HTMLButtonElement>('#connect-button')!

const balanceButton =
  document.querySelector<HTMLButtonElement>('#balance-button')!

const statusText =
  document.querySelector<HTMLSpanElement>('#status-text')!

const walletAddress =
  document.querySelector<HTMLHeadingElement>('#wallet-address')!

const balance =
  document.querySelector<HTMLHeadingElement>('#balance')!

const balanceStatus =
  document.querySelector<HTMLParagraphElement>('#balance-status')!

const chainList =
  document.querySelector<HTMLDivElement>('#chain-list')!

const chainCount =
  document.querySelector<HTMLSpanElement>('#chain-count')!

const kit = new AppKit()

let viemAdapter:
  Awaited<ReturnType<typeof createViemAdapterFromProvider>> | null = null

connectButton.addEventListener('click', async () => {
  try {
    statusText.textContent = 'Connecting...'
    balanceStatus.textContent = 'Connecting to browser wallet...'

    const ethereum = (window as Window & {
      ethereum?: EIP1193Provider
    }).ethereum

    if (!ethereum) {
      throw new Error(
        'No EVM wallet detected. Please install or unlock MetaMask.'
      )
    }

    await ethereum.request({
      method: 'eth_requestAccounts',
    })

    const accounts = await ethereum.request({
      method: 'eth_accounts',
    })

    const account = accounts[0]

    if (!account) {
      throw new Error('No wallet account was returned.')
    }

    viemAdapter = await createViemAdapterFromProvider({
      provider: ethereum,
      capabilities: {
        addressContext: 'user-controlled',
      },
    })

    walletAddress.textContent = shortenAddress(account)
    statusText.textContent = 'Connected'
    connectButton.textContent = 'Connected'

    balanceButton.disabled = false

    balanceStatus.textContent =
      'Wallet connected. Click Check Unified Balance.'
  } catch (error) {
    console.error(error)

    statusText.textContent = 'Error'

    balanceStatus.textContent =
      error instanceof Error
        ? error.message
        : 'Failed to connect wallet.'
  }
})

balanceButton.addEventListener('click', async () => {
  try {
    if (!viemAdapter) {
      throw new Error('Connect your wallet first.')
    }

    balanceButton.disabled = true
    balanceButton.textContent = 'Checking...'
    balanceStatus.textContent = 'Reading Unified Balance...'

    const balances = await kit.unifiedBalance.getBalances({
      sources: {
        adapter: viemAdapter,
      },
      networkType: 'testnet',
    })

    console.log('Unified Balance response:', balances)

    const totalBalance = balances.totalConfirmedBalance ?? '0'

    balance.textContent = `${totalBalance} USDC`

    renderChainBreakdown(balances)

    balanceStatus.textContent =
      'Unified Balance successfully retrieved from Circle.'

    balanceButton.textContent = 'Refresh Balance'
  } catch (error) {
    console.error('Unified Balance error:', error)

    balanceStatus.textContent =
      error instanceof Error
        ? error.message
        : 'Failed to retrieve Unified Balance.'

    balanceButton.textContent = 'Try Again'
  } finally {
    balanceButton.disabled = false
  }
})

function renderChainBreakdown(
  balances: Awaited<
    ReturnType<typeof kit.unifiedBalance.getBalances>
  >
): void {
  const depositorBreakdown = balances.breakdown?.[0]

  if (!depositorBreakdown?.breakdown) {
    chainCount.textContent = '0 chains'
    chainList.innerHTML = `
      <p class="muted">
        No chain breakdown was returned.
      </p>
    `
    return
  }

  const chains = depositorBreakdown.breakdown

  chainCount.textContent = `${chains.length} chains`

  chainList.innerHTML = chains
    .map(
      (chain) => `
        <div class="chain-row">
          <div>
            <strong>${formatChainName(chain.chain)}</strong>
            <span>USDC</span>
          </div>

          <strong>${chain.confirmedBalance} USDC</strong>
        </div>
      `
    )
    .join('')
}

function formatChainName(chain: string): string {
  return chain.replace(/_/g, ' ')
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}