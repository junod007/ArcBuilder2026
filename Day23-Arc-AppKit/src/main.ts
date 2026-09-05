import { AppKit } from "@circle-fin/app-kit";
import type { SendParams } from "@circle-fin/app-kit";
import { createViemAdapterFromProvider } from "@circle-fin/adapter-viem-v2";
import type { EIP1193Provider } from "viem";

type EIP6963ProviderInfo = {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
};

type EIP6963ProviderDetail = {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
};

declare global {
  interface WindowEventMap {
    "eip6963:announceProvider": CustomEvent<EIP6963ProviderDetail>;
  }
}

const kit = new AppKit();

const connectButton =
  document.querySelector<HTMLButtonElement>("#connectButton")!;
const sendButton =
  document.querySelector<HTMLButtonElement>("#sendButton")!;
const swapButton =
  document.querySelector<HTMLButtonElement>("#swapButton")!;
const bridgeButton =
  document.querySelector<HTMLButtonElement>("#bridgeButton")!;
const status =
  document.querySelector<HTMLPreElement>("#status")!;

let adapter: Awaited<ReturnType<typeof createViemAdapterFromProvider>> | null =
  null;
let connectedAddress: string | null = null;
let walletProvider: EIP1193Provider | null = null;

function setStatus(message: string) {
  status.textContent = message;
}

async function discoverBrowserWallets(): Promise<
  EIP6963ProviderDetail[]
> {
  const providers = new Map<string, EIP6963ProviderDetail>();

  const handleProviderAnnouncement = (
    event: WindowEventMap["eip6963:announceProvider"],
  ) => {
    providers.set(event.detail.info.uuid, event.detail);
  };

  window.addEventListener(
    "eip6963:announceProvider",
    handleProviderAnnouncement,
  );

  window.dispatchEvent(new Event("eip6963:requestProvider"));

  await new Promise((resolve) => window.setTimeout(resolve, 250));

  window.removeEventListener(
    "eip6963:announceProvider",
    handleProviderAnnouncement,
  );

  return [...providers.values()];
}

async function connectWallet(provider: EIP1193Provider) {
  await provider.request({
    method: "eth_requestAccounts",
    params: undefined,
  });

  const accounts = (await provider.request({
    method: "eth_accounts",
    params: undefined,
  })) as string[];

  return {
    connectedAddress: accounts[0] ?? null,
  };
}

async function connectBrowserWallet() {
  const providers = await discoverBrowserWallets();

  const selectedWallet =
    providers.find(
      ({ info }) =>
        info.rdns === "io.metamask" ||
        info.name === "MetaMask",
    ) ?? providers[0];

  if (!selectedWallet) {
    throw new Error("No EIP-6963 browser wallet found");
  }

  const wallet = await connectWallet(selectedWallet.provider);

  const walletAdapter = await createViemAdapterFromProvider({
    provider: selectedWallet.provider,
  });

 return {
  adapter: walletAdapter,
  connectedAddress: wallet.connectedAddress,
  walletName: selectedWallet.info.name,
  provider: selectedWallet.provider,
};
}

connectButton.addEventListener("click", async () => {
  try {
    setStatus("Connecting wallet...");

    const result = await connectBrowserWallet();

   adapter = result.adapter;
connectedAddress = result.connectedAddress;
walletProvider = result.provider;

    connectButton.textContent = `Connected: ${result.walletName}`;
    sendButton.disabled = false;
    swapButton.disabled = false;
    bridgeButton.disabled = false;

    setStatus(
      `Wallet connected\n\n` +
      `Wallet: ${result.walletName}\n` +
      `Address: ${connectedAddress}\n\n` +
      `Ready to send USDC on Arc Testnet.`,
    );
  } catch (error) {
    console.error(error);
    setStatus(
      `Connection failed:\n${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
});

sendButton.addEventListener("click", async () => {
  try {
    if (!adapter || !connectedAddress) {
      throw new Error("Connect a wallet first");
    }

    setStatus("Preparing USDC transfer...");

    const recipient = prompt(
      "Enter recipient address:",
      connectedAddress,
    );

    if (!recipient) {
      setStatus("Transfer cancelled.");
      return;
    }

    const amount = prompt(
      "Enter USDC amount:",
      "1.00",
    );

    if (!amount) {
      setStatus("Transfer cancelled.");
      return;
    }

    const sendParams: SendParams = {
      from: {
        adapter,
        chain: "Arc_Testnet",
      },
      to: recipient,
      amount,
      token: "USDC",
    };

    setStatus("Estimating transaction...");

    const estimate = await kit.estimateSend(sendParams);

    setStatus(
  `Estimate complete\n\n${JSON.stringify(
    estimate,
    (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    2,
    )}\n\nWaiting for wallet approval...`,
     );

    const result = await kit.send(sendParams);

console.log("Submitted transaction", {
  connectedAddress,
  estimate,
  result,
});

setStatus(
  `Transaction submitted!\n\n${JSON.stringify(
    result,
    (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
    2,
  )}`,
);
  } catch (error) {
    console.error(error);
    setStatus(
      `Transaction failed:\n${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
});

swapButton.addEventListener("click", async () => {
  try {
  if (!adapter || !connectedAddress) {
    throw new Error("Connect a wallet first");
  }

  setStatus("Preparing swap USDC → EURC...");

  const amount = prompt(
    "Enter USDC amount to swap:",
    "1.00",
  );

  if (!amount) {
    setStatus("Swap cancelled.");
    return;
  }

  const result = await kit.swap({
    from: {
      adapter,
      chain: "Arc_Testnet",
    },
    tokenIn: "USDC",
    tokenOut: "EURC",
    amountIn: amount,
  });

  console.log("Swap result:", result);

  setStatus(
    `Swap submitted!\n\n${JSON.stringify(
      result,
      (_, value) =>
        typeof value === "bigint" ? value.toString() : value,
      2,
    )}`,
  );
} catch (error) {
  console.error(error);

  setStatus(
    `Swap failed:\n${
      error instanceof Error ? error.message : String(error)
    }`,
  );
}
});

bridgeButton.addEventListener("click", async () => {
  try {
    if (!walletProvider || !connectedAddress) {
      throw new Error("Connect MetaMask first");
    }

    const amount = prompt(
      "Enter USDC amount to bridge:",
      "1.00",
    );

    if (!amount || Number(amount) <= 0) {
      setStatus("Bridge cancelled.");
      return;
    }

    bridgeButton.disabled = true;

    setStatus(
      "Preparing Ethereum Sepolia → Arc Testnet...\n\n" +
      "Creating fresh MetaMask adapter...",
    );

    const bridgeAdapter = await createViemAdapterFromProvider({
      provider: walletProvider,
    });

    setStatus(
      "Starting bridge...\n\n" +
      "Source: Ethereum Sepolia\n" +
      "Destination: Arc Testnet\n\n" +
      "Waiting for MetaMask approval...",
    );

    let result = await kit.bridge({
      from: {
        adapter: bridgeAdapter,
        chain: "Ethereum_Sepolia",
      },
      to: {
        adapter: bridgeAdapter,
        chain: "Arc_Testnet",
      },
      amount,
    });

    console.log("Bridge result:", result);

    if (result.state === "error") {
      setStatus(
        "Bridge returned an error state.\n\n" +
        "Trying retryBridge...",
      );

      result = await kit.retryBridge(result, {
        from: bridgeAdapter,
        to: bridgeAdapter,
      });
    }

    console.log("Final bridge result:", result);

    setStatus(
      `Bridge result!\n\n${JSON.stringify(
        result,
        (_, value) =>
          typeof value === "bigint" ? value.toString() : value,
        2,
      )}`,
    );
  } catch (error) {
    console.error("BRIDGE ERROR:", error);

    setStatus(
      `Bridge failed:\n\n${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  } finally {
    bridgeButton.disabled = false;
  }
});
