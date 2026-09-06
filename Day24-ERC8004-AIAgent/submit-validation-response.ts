import {
  initiateDeveloperControlledWalletsClient,
} from "@circle-fin/developer-controlled-wallets";

const circleClient = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY!,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
});

const VALIDATION_REGISTRY =
  "0x8004Cb1BF31DAf7788923b405b754f57acEB4272";

const VALIDATOR_WALLET_ID =
  "57754793-f755-5306-8ad9-70c744d995f8";

const REQUEST_HASH =
  "0x600110c45879f58b27e68b8f126561843cd3a0391099ed509e8819cb6b2ddb6f";

const RESPONSE = "100";

const RESPONSE_HASH =
  "0x" + "0".repeat(64);

const TAG = "arc_agent_verified";

async function main() {
  console.log("========================================");
  console.log(" ERC-8004 VALIDATION RESPONSE");
  console.log("========================================");

  console.log(`Request Hash: ${REQUEST_HASH}`);
  console.log(`Response:     ${RESPONSE}/100`);
  console.log(`Tag:          ${TAG}`);
  console.log("");

  console.log("Submitting validator response...");

  const tx =
    await circleClient.createContractExecutionTransaction({
      walletId: VALIDATOR_WALLET_ID,
      contractAddress: VALIDATION_REGISTRY,
      abiFunctionSignature:
        "validationResponse(bytes32,uint8,string,bytes32,string)",
      abiParameters: [
        REQUEST_HASH,
        RESPONSE,
        "",
        RESPONSE_HASH,
        TAG,
      ],
      fee: {
        type: "level",
        config: {
          feeLevel: "MEDIUM",
        },
      },
    });

  console.log(`Transaction ID: ${tx.data?.id}`);

  console.log("");
  console.log("Waiting for blockchain confirmation...");

  for (let i = 1; i <= 20; i++) {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const result = await circleClient.getTransaction({
      id: tx.data?.id!,
    });

    const state = result.data?.transaction?.state ?? "";

    console.log(`Check ${i}: ${state}`);

    if (state === "COMPLETE") {
      const txHash = result.data?.transaction?.txHash;

      console.log("");
      console.log("========================================");
      console.log(" VALIDATION RESPONSE SUCCESSFUL!");
      console.log("========================================");
      console.log(`Response:          ${RESPONSE}/100`);
      console.log(`Transaction Hash:  ${txHash}`);
      console.log(
        `ArcScan: https://testnet.arcscan.app/tx/${txHash}`
      );
      console.log("");
      console.log(`Request Hash:      ${REQUEST_HASH}`);
      console.log(`Tag:               ${TAG}`);
      console.log("========================================");

      return;
    }

    if (state === "FAILED") {
      console.log("");
      console.log("VALIDATION RESPONSE FAILED.");

      console.log(
        JSON.stringify(result.data?.transaction, null, 2)
      );

      process.exit(1);
    }
  }

  throw new Error("Validation response did not complete.");
}

main().catch((error) => {
  console.error("");
  console.error("Validation response failed:");
  console.error(error);
  process.exit(1);
});