import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  parseUnits,
  defineChain,
} from "viem";

const ARC_TESTNET = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: "https://testnet.arcscan.app",
    },
  },
  testnet: true,
});

const USDC_ADDRESS =
  "0x3600000000000000000000000000000000000000" as `0x${string}`;

const AGENT_WALLET =
  "0x6dd76aa8b3d36cef43df4520fa458fbd3b7cd33e" as `0x${string}`;

const USDC_ABI = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
  },
] as const;

const connectButton = document.getElementById(
  "connectButton",
) as HTMLButtonElement;

const payButton = document.getElementById(
  "payButton",
) as HTMLButtonElement;

const status = document.getElementById("status") as HTMLElement;

let connectedAddress: `0x${string}` | undefined;

function setStatus(message: string) {
  status.textContent = message;
}

connectButton.addEventListener("click", async () => {
  try {
    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      throw new Error("MetaMask is not installed.");
    }

    setStatus("Connecting MetaMask...");

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    connectedAddress = accounts[0] as `0x${string}`;

    const chainId = await ethereum.request({
      method: "eth_chainId",
    });

    if (chainId !== "0x4cef52") {
      throw new Error(
        "Please switch MetaMask to Arc Testnet (Chain ID 5042002).",
      );
    }

    connectButton.textContent = "Connected: MetaMask";
    payButton.disabled = false;

    setStatus(
      `Wallet connected\n\n` +
        `Address: ${connectedAddress}\n` +
        `Network: Arc Testnet\n` +
        `Agent ID: 892242\n` +
        `Agent wallet: ${AGENT_WALLET}\n\n` +
        `Ready to pay 0.10 USDC.`,
    );
  } catch (error) {
    console.error("CONNECT ERROR:", error);

    setStatus(
      `Connection failed:\n\n${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
});

payButton.addEventListener("click", async () => {
  try {
    const ethereum = (window as any).ethereum;

    if (!ethereum || !connectedAddress) {
      throw new Error("Connect MetaMask first.");
    }

    payButton.disabled = true;

    setStatus(
      "Preparing Agent payment...\n\n" +
        "Network: Arc Testnet\n" +
        "Agent ID: 892242\n" +
        "Amount: 0.10 USDC\n\n" +
        "Waiting for MetaMask approval...",
    );

    const walletClient = createWalletClient({
      account: connectedAddress,
      chain: ARC_TESTNET,
      transport: custom(ethereum),
    });

    const amount = parseUnits("0.10", 6);

    const txHash = await walletClient.writeContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: "transfer",
      args: [AGENT_WALLET, amount],
    });

    setStatus(
      `Payment transaction submitted!\n\n` +
        `Amount: 0.10 USDC\n` +
        `Agent ID: 892242\n` +
        `TX: ${txHash}\n\n` +
        `Waiting for confirmation...`,
    );

    const publicClient = createPublicClient({
      chain: ARC_TESTNET,
      transport: http(),
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    if (receipt.status !== "success") {
      throw new Error("Payment transaction reverted.");
    }

    setStatus(
      `Payment Successful!\n\n` +
        `Agent: AOKAH Arc AI Agent\n` +
        `Agent ID: 892242\n` +
        `Amount: 0.10 USDC\n` +
        `Network: Arc Testnet\n\n` +
        `TX:\n${txHash}\n\n` +
        `https://testnet.arcscan.app/tx/${txHash}`,
    );
  } catch (error) {
    console.error("PAYMENT ERROR:", error);

    setStatus(
      `Payment failed:\n\n${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  } finally {
    payButton.disabled = false;
  }
});