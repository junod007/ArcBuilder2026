import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  defineChain,
  parseUnits,
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

const AGENT_ESCROW_ADDRESS =
  "0xDf9E632a5CC8ED46dB4e5F893129056f489d4088" as `0x${string}`;

const AGENT_PAYMENT_AUTH_ADDRESS =
  "0x3beD780d808aB5048244ccD166520aA8aD7995D1" as `0x${string}`;

const AGENT_WALLET =
  "0x6dd76aa8b3d36cef43df4520fa458fbd3b7cd33e" as `0x${string}`;

const AGENT_ID = 892242;

const PAYMENT_AUTH_ABI = [
    {
    type: "function",
    name: "createAuthorization",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "agent",
        type: "address",
      },
      {
        name: "limit",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "authorizationId",
        type: "uint256",
      },
    ],
  },
    type: "function",
    name: "getAuthorization",
    stateMutability: "view",
    inputs: [
      {
        name: "authorizationId",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "owner",
        type: "address",
      },
      {
        name: "agent",
        type: "address",
      },
      {
        name: "limit",
        type: "uint256",
      },
      {
        name: "spent",
        type: "uint256",
      },
      {
        name: "active",
        type: "bool",
      },
    ],
  },
  {
    type: "function",
    name: "remainingAllowance",
    stateMutability: "view",
    inputs: [
      {
        name: "authorizationId",
        type: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
  },
] as const;

const connectButton = document.getElementById(
  "connectButton",
) as HTMLButtonElement;

const createAuthButton = document.getElementById(
  "createAuthButton",
) as HTMLButtonElement;

const executeButton = document.getElementById(
  "executeButton",
) as HTMLButtonElement;

const paymentMode = document.getElementById(
  "paymentMode",
) as HTMLSelectElement;

const recipientInput = document.getElementById(
  "recipient",
) as HTMLInputElement;

const amountInput = document.getElementById(
  "amount",
) as HTMLInputElement;

const status = document.getElementById(
  "status",
) as HTMLElement;

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

    setStatus(
      "Connecting MetaMask...\n\n" +
      "Checking Arc Testnet...",
    );

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
    executeButton.disabled = false;
    createAuthButton.disabled = false;

    setStatus(
      "ArcFlow Connected\n\n" +
      `Wallet: ${connectedAddress}\n` +
      "Network: Arc Testnet\n" +
      "Chain ID: 5042002\n\n" +
      "Agent: AOKAH Arc AI Agent\n" +
      `Agent ID: ${AGENT_ID}\n\n` +
      `Payment Mode: ${paymentMode.value}\n\n` +
      "Ready.",
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

createAuthButton.addEventListener("click", async () => {
  try {
    const ethereum = (window as any).ethereum;

    if (!ethereum || !connectedAddress) {
      throw new Error("Connect MetaMask first.");
    }

    createAuthButton.disabled = true;

    const walletClient = createWalletClient({
      account: connectedAddress,
      chain: ARC_TESTNET,
      transport: custom(ethereum),
    });

    const limit = parseUnits("1", 6);

    setStatus(
      "Creating Day28 Authorization...\n\n" +
      "Owner: " +
      `${connectedAddress}\n\n` +
      "Agent: " +
      `${connectedAddress}\n\n` +
      "Limit: 1 USDC\n\n" +
      "Waiting for MetaMask approval...",
    );

    const txHash = await walletClient.writeContract({
      address: AGENT_PAYMENT_AUTH_ADDRESS,
      abi: PAYMENT_AUTH_ABI,
      functionName: "createAuthorization",
      args: [connectedAddress, limit],
    });

    setStatus(
      "Authorization transaction submitted!\n\n" +
      `TX:\n${txHash}\n\n` +
      "Waiting for confirmation...",
    );

    const publicClient = createPublicClient({
      chain: ARC_TESTNET,
      transport: http(),
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    if (receipt.status !== "success") {
      throw new Error("Authorization transaction reverted.");
    }

    setStatus(
      "Day28 Authorization Created Successfully!\n\n" +
      "Owner: " +
      `${connectedAddress}\n\n` +
      "Agent: " +
      `${connectedAddress}\n\n` +
      "Limit: 1 USDC\n\n" +
      `TX:\n${txHash}\n\n` +
      `https://testnet.arcscan.app/tx/${txHash}`,
    );
  } catch (error) {
    console.error("AUTHORIZATION ERROR:", error);

    setStatus(
      `Authorization failed:\n\n${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  } finally {
    createAuthButton.disabled = false;
  }
});

paymentMode.addEventListener("change", () => {
  setStatus(
    "ArcFlow Mode Selected\n\n" +
    `Mode: ${paymentMode.value}\n\n` +
    "Day27 AgentEscrow:\n" +
    `${AGENT_ESCROW_ADDRESS}\n\n` +
    "Day28 AgentPaymentAuth:\n" +
    `${AGENT_PAYMENT_AUTH_ADDRESS}\n\n` +
    "Contract integration is being enabled step-by-step.",
  );
});

executeButton.addEventListener("click", async () => {
  try {
    if (!connectedAddress) {
      throw new Error("Connect MetaMask first.");
    }

    const recipient = recipientInput.value.trim();
    const amount = amountInput.value.trim();

    if (!recipient) {
      throw new Error("Enter a recipient address.");
    }

    if (!amount || Number(amount) <= 0) {
      throw new Error("Enter a valid USDC amount.");
    }

    if (paymentMode.value === "authorized") {
      const publicClient = createPublicClient({
        chain: ARC_TESTNET,
        transport: http(),
      });

      setStatus(
        "Checking Day28 AgentPaymentAuth...\n\n" +
        `Contract:\n${AGENT_PAYMENT_AUTH_ADDRESS}\n\n` +
        "Read-only test.\n" +
        "No USDC will be transferred.",
      );

      const authorizationId = 0n;

      const authorization = await publicClient.readContract({
        address: AGENT_PAYMENT_AUTH_ADDRESS,
        abi: PAYMENT_AUTH_ABI,
        functionName: "getAuthorization",
        args: [authorizationId],
      });

      const remaining = await publicClient.readContract({
        address: AGENT_PAYMENT_AUTH_ADDRESS,
        abi: PAYMENT_AUTH_ABI,
        functionName: "remainingAllowance",
        args: [authorizationId],
      });

      setStatus(
        "Day28 Authorization Read Successful\n\n" +
        `Authorization ID: ${authorizationId}\n\n` +
        `Owner: ${authorization[0]}\n` +
        `Agent: ${authorization[1]}\n` +
        `Limit: ${authorization[2].toString()}\n` +
        `Spent: ${authorization[3].toString()}\n` +
        `Active: ${authorization[4]}\n\n` +
        `Remaining: ${remaining.toString()}\n\n` +
        "No transaction was sent.",
      );

      return;
    }

    setStatus(
      "ArcFlow Execution Request\n\n" +
      `Mode: ${paymentMode.value}\n` +
      `Recipient: ${recipient}\n` +
      `Amount: ${amount} USDC\n\n` +
      "This payment path has not been enabled yet.",
    );
  } catch (error) {
    console.error("EXECUTION ERROR:", error);

    setStatus(
      `Execution failed:\n\n${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
});
