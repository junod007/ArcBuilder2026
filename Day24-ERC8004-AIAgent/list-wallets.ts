import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const apiKey = process.env.CIRCLE_API_KEY;
const entitySecret = process.env.CIRCLE_ENTITY_SECRET;

if (!apiKey) {
  throw new Error("CIRCLE_API_KEY is missing from .env");
}

if (!entitySecret) {
  throw new Error("CIRCLE_ENTITY_SECRET is missing from .env");
}

const circleClient = initiateDeveloperControlledWalletsClient({
  apiKey,
  entitySecret,
});

async function main() {
  console.log("Getting Arc Testnet wallets...\n");

  const response = await circleClient.listWallets();

  const wallets = response.data?.wallets ?? [];

  const arcWallets = wallets.filter(
    (wallet) => wallet.blockchain === "ARC-TESTNET"
  );

  if (arcWallets.length === 0) {
    throw new Error("No Arc Testnet wallets found.");
  }

  console.log("===== ARC TESTNET WALLETS =====");

  for (const wallet of arcWallets) {
    console.log(`\nID:        ${wallet.id}`);
    console.log(`Address:   ${wallet.address}`);
    console.log(`Account:   ${wallet.accountType}`);
    console.log(`State:     ${wallet.state}`);
    console.log(`WalletSet: ${wallet.walletSetId}`);
  }

  console.log("\n===============================");
}

main().catch((error) => {
  console.error("\nFailed to list wallets:");
  console.error(error);
  process.exit(1);
});