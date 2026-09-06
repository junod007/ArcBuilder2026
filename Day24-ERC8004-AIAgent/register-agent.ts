import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const IDENTITY_REGISTRY =
  "0x8004A818BFB912233c491871b3d84c89A494BD9e";

const OWNER_WALLET_ID =
  "3bc2c111-a130-5ede-9d3c-bac887eceda1";

const METADATA_URI =
  "ipfs://bafkreibdi6623n3xpf7ymk62ckb4bo75o3qemwkpfvp5i25j66itxvsoei";

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
  console.log("========================================");
  console.log(" ERC-8004 AGENT REGISTRATION");
  console.log("========================================");

  console.log(`Owner Wallet ID: ${OWNER_WALLET_ID}`);
  console.log(`Metadata: ${METADATA_URI}`);
  console.log("\nSubmitting registration transaction...");

  const registerTx =
  await circleClient.createContractExecutionTransaction({
    walletId: OWNER_WALLET_ID,
      contractAddress: IDENTITY_REGISTRY,
      abiFunctionSignature: "register(string)",
      abiParameters: [METADATA_URI],
      fee: {
        type: "level",
        config: {
          feeLevel: "MEDIUM",
        },
      },
    });

  const transactionId = registerTx.data?.id;

  if (!transactionId) {
    throw new Error("Transaction ID was not returned.");
  }

  console.log(`Transaction ID: ${transactionId}`);
  console.log("\nWaiting for blockchain confirmation...");

  for (let i = 0; i < 30; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const result = await circleClient.getTransaction({
      id: transactionId,
    });

    const transaction = result.data?.transaction;
    const state = transaction?.state;

    console.log(`Check ${i + 1}: ${state ?? "PENDING"}`);

    if (state === "COMPLETE") {
      const txHash = transaction?.txHash;

      console.log("\n========================================");
      console.log(" ERC-8004 REGISTRATION SUCCESSFUL!");
      console.log("========================================");
      console.log(`Transaction Hash: ${txHash}`);
      console.log(
        `ArcScan: https://testnet.arcscan.app/tx/${txHash}`,
      );
      console.log("========================================");

      return;
    }

    if (state === "FAILED") {
      throw new Error("Registration transaction FAILED.");
    }
  }

  throw new Error("Transaction confirmation timed out.");
}

main().catch((error) => {
  console.error("\nRegistration failed:");
  console.error(error);
  process.exit(1);
});