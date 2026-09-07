import { AppKit } from "@circle-fin/app-kit";
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

const bridgeButton =
  document.querySelector<HTMLButtonElement>("#bridgeButton")!;

const status =
  document.querySelector<HTMLPreElement>("#status")!;

let walletProvider: EIP1193Provider | null = null;
let connectedAddress: string | null = null;

function setStatus(message: string) {
  status.textContent = message;
}

function formatResult(value: unknown) {
  return JSON.stringify(
    value,
    (_, item) =>
      typeof item === "bigint" ? item.toString() : item,
    2,
  );
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

  await selectedWallet.provider.request({
    method: "eth_requestAccounts",
    params: undefined,
  });

  const accounts = (await selectedWallet.provider.request({
    method: "eth_accounts",
    params: undefined,
  })) as string[];

  return {
    provider: selectedWallet.provider,
    walletName: selectedWallet.info.name,
    address: accounts[0] ?? null,
  };
}

connectButton.addEventListener("click", async () => {
  try {
    setStatus("Connecting MetaMask...");

    const result = await connectBrowserWallet();

    walletProvider = result.provider;
    connectedAddress = result.address;

    if (!connectedAddress) {
      throw new Error("No wallet address returned");
    }

    connectButton.textContent = `Connected: ${result.walletName}`;
    bridgeButton.disabled = false;

    setStatus(
      `Wallet connected\n\n` +
      `Wallet: ${result.walletName}\n` +
      `Address: ${connectedAddress}\n\n` +
      `Ready to bridge USDC from Ethereum Sepolia to Arc Testnet.`,
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
      `Preparing CCTP bridge...\n\n` +
      `Source: Ethereum Sepolia\n` +
      `Destination: Arc Testnet\n` +
      `Amount: ${amount} USDC\n\n` +
      `Creating MetaMask adapter...`,
    );

    const bridgeAdapter =
      await createViemAdapterFromProvider({
        provider: walletProvider,
      });

    setStatus(
      `Starting bridge...\n\n` +
      `Ethereum Sepolia → Arc Testnet\n` +
      `Amount: ${amount} USDC\n` +
      `Provider: CCTP V2\n\n` +
      `Waiting for MetaMask approval...`,
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
        `Bridge returned an error state.\n\n` +
        `Attempting retry...`,
      );

      result = await kit.retryBridge(result, {
        from: bridgeAdapter,
        to: bridgeAdapter,
      });
    }

    console.log("Final bridge result:", result);

    const successfulSteps =
      "steps" in result && Array.isArray(result.steps)
        ? result.steps
            .filter((step) => step.state === "success")
            .map((step) => ({
              name: step.name,
              txHash: "txHash" in step ? step.txHash : undefined,
              explorerUrl:
                "explorerUrl" in step
                  ? step.explorerUrl
                  : undefined,
            }))
        : [];

    setStatus(
      `Bridge completed!\n\n` +
      `Ethereum Sepolia → Arc Testnet\n` +
      `Amount: ${amount} USDC\n\n` +
      `Successful steps:\n` +
      `${formatResult(successfulSteps)}\n\n` +
      `Full result:\n` +
      `${formatResult(result)}`,
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
