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
  console.log("Creating ERC-8004 wallet set...");

  const walletSet = await circleClient.createWalletSet({
    name: "ERC8004 Agent Wallets",
  });

  const walletSetId = walletSet.data?.walletSet?.id;

  if (!walletSetId) {
    throw new Error("Wallet Set ID was not returned.");
  }

  console.log("Wallet Set created.");
  console.log(`Wallet Set ID: ${walletSetId}`);

  console.log("Creating 2 Arc Testnet wallets...");

  const walletsResponse = await circleClient.createWallets({
    blockchains: ["ARC-TESTNET"],
    count: 2,
    walletSetId,
    accountType: "SCA",
  });

  const wallets = walletsResponse.data?.wallets;

  if (!wallets || wallets.length < 2) {
    throw new Error("Expected 2 wallets, but they were not returned.");
  }

  const ownerWallet = wallets[0];
  const validatorWallet = wallets[1];

  console.log("\n===== ERC-8004 WALLETS =====");
  console.log(`Owner:     ${ownerWallet.address}`);
  console.log(`Validator: ${validatorWallet.address}`);
  console.log("============================");
}

main().catch((error) => {
  console.error("\nFailed to create wallets:");
  console.error(error);
  process.exit(1);
});