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

const USDC_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [
      { name: "", type: "bool" },
    ],
  },
] as const;

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
  {
    type: "function",
    name: "createAuthorization",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agent", type: "address" },
      { name: "limit", type: "uint256" },
    ],
    outputs: [
      { name: "authorizationId", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "executePayment",
    stateMutability: "nonpayable",
    inputs: [
      { name: "authorizationId", type: "uint256" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
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

const approveButton = document.getElementById(
  "approveButton",
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
    approveButton.disabled = false;

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


approveButton.addEventListener("click", async () => {
  try {
    const ethereum = (window as any).ethereum;

    if (!ethereum || !connectedAddress) {
      throw new Error("Connect MetaMask first.");
    }

    approveButton.disabled = true;

    const walletClient = createWalletClient({
      account: connectedAddress,
      chain: ARC_TESTNET,
      transport: custom(ethereum),
    });

    const approvalAmount = parseUnits("1", 6);

    setStatus(
      "Approving 1 USDC for Day28...\\n\\n" +
      `Owner: ${connectedAddress}\\n\\n` +
      `Spender: ${AGENT_PAYMENT_AUTH_ADDRESS}\\n\\n` +
      "Waiting for MetaMask approval...",
    );

    const txHash = await walletClient.writeContract({
      address: USDC_ADDRESS,
      abi: USDC_ABI,
      functionName: "approve",
      args: [AGENT_PAYMENT_AUTH_ADDRESS, approvalAmount],
    });

    setStatus(
      "USDC Approval transaction submitted!\\n\\n" +
      `TX:\\n${txHash}\\n\\n` +
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
      throw new Error("USDC approval transaction reverted.");
    }

    setStatus(
      "1 USDC Approved Successfully!\\n\\n" +
      `Spender: ${AGENT_PAYMENT_AUTH_ADDRESS}\\n\\n` +
      `TX:\\n${txHash}\\n\\n` +
      `https://testnet.arcscan.app/tx/${txHash}`,
    );
  } catch (error) {
    console.error("APPROVAL ERROR:", error);

    setStatus(
      `Approval failed:\\n\\n${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  } finally {
    approveButton.disabled = false;
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
      `Owner: ${connectedAddress}\n\n` +
      `Agent: ${connectedAddress}\n\n` +
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
      `Owner: ${connectedAddress}\n\n` +
      `Agent: ${connectedAddress}\n\n` +
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
      const ethereum = (window as any).ethereum;

      if (!ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      const authorizationId = 1n;
      const paymentAmount = parseUnits(amount, 6);

      if (paymentAmount <= 0n) {
        throw new Error("Payment amount must be greater than zero.");
      }

      const walletClient = createWalletClient({
        account: connectedAddress,
        chain: ARC_TESTNET,
        transport: custom(ethereum),
      });

      setStatus(
        "Preparing Authorized Agent Payment...\\n\\n" +
        `Authorization ID: ${authorizationId}\\n` +
        `Recipient: ${recipient}\\n` +
        `Amount: ${amount} USDC\\n\\n` +
        "Waiting for MetaMask approval...",
      );

      const txHash = await walletClient.writeContract({
        address: AGENT_PAYMENT_AUTH_ADDRESS,
        abi: PAYMENT_AUTH_ABI,
        functionName: "executePayment",
        args: [authorizationId, recipient as `0x${string}`, paymentAmount],
      });

      setStatus(
        "Authorized Payment Submitted!\\n\\n" +
        `Authorization ID: ${authorizationId}\\n` +
        `Recipient: ${recipient}\\n` +
        `Amount: ${amount} USDC\\n\\n` +
        `TX:\\n${txHash}\\n\\n` +
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
        throw new Error("Authorized payment transaction reverted.");
      }

      const updatedAuthorization = await publicClient.readContract({
        address: AGENT_PAYMENT_AUTH_ADDRESS,
        abi: PAYMENT_AUTH_ABI,
        functionName: "getAuthorization",
        args: [authorizationId],
      });

      const updatedRemaining = await publicClient.readContract({
        address: AGENT_PAYMENT_AUTH_ADDRESS,
        abi: PAYMENT_AUTH_ABI,
        functionName: "remainingAllowance",
        args: [authorizationId],
      });

      setStatus(
        "Authorized Agent Payment Successful!\n\n" +
        `Authorization ID: ${authorizationId}\n` +
        `Recipient: ${recipient}\n` +
        `Amount: ${amount} USDC\n\n` +
        "Updated Authorization State\n\n" +
        `Limit: ${updatedAuthorization[2].toString()}\n` +
        `Spent: ${updatedAuthorization[3].toString()}\n` +
        `Active: ${updatedAuthorization[4]}\n` +
        `Remaining: ${updatedRemaining.toString()}\n\n` +
        `TX:\n${txHash}\n\n` +
        `https://testnet.arcscan.app/tx/${txHash}`,
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
