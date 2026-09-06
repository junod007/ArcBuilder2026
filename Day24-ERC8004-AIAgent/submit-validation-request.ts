import {
  initiateDeveloperControlledWalletsClient,
} from "@circle-fin/developer-controlled-wallets";

const circleClient = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY!,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
});

const VALIDATION_REGISTRY =
  "0x8004Cb1BF31DAf7788923b405b754f57acEB4272";

const OWNER_WALLET_ID =
  "3bc2c111-a130-5ede-9d3c-bac887eceda1";

const VALIDATOR_ADDRESS =
  "0x9d961ff957121ebcfd77e0349078d3d768f56d90";

const AGENT_ID = "892242";

const REQUEST_URI =
  "ipfs://bafkreiexamplevalidationrequest";

const REQUEST_HASH =
  "0x600110c45879f58b27e68b8f126561843cd3a0391099ed509e8819cb6b2ddb6f";

async function main() {
  console.log("========================================");
  console.log(" ERC-8004 VALIDATION REQUEST");
  console.log("========================================");

  console.log(`Agent ID:   ${AGENT_ID}`);
  console.log(`Validator:  ${VALIDATOR_ADDRESS}`);
  console.log(`Request:    ${REQUEST_URI}`);
  console.log(`Hash:       ${REQUEST_HASH}`);
  console.log("");

  console.log("Submitting validation request...");

  const tx =
    await circleClient.createContractExecutionTransaction({
      walletId: OWNER_WALLET_ID,
      contractAddress: VALIDATION_REGISTRY,
      abiFunctionSignature:
        "validationRequest(address,uint256,string,bytes32)",
      abiParameters: [
        VALIDATOR_ADDRESS,
        AGENT_ID,
        REQUEST_URI,
        REQUEST_HASH,
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
      console.log(" VALIDATION REQUEST SUCCESSFUL!");
      console.log("========================================");
      console.log(`Agent ID:        ${AGENT_ID}`);
      console.log(`Transaction Hash: ${txHash}`);
      console.log(
        `ArcScan: https://testnet.arcscan.app/tx/${txHash}`
      );
      console.log("");
      console.log(`Request Hash: ${REQUEST_HASH}`);
      console.log("========================================");

      return;
    }

    if (state === "FAILED") {
      console.log("");
      console.log("VALIDATION REQUEST FAILED.");

      console.log(
        JSON.stringify(result.data?.transaction, null, 2)
      );

      process.exit(1);
    }
  }

  throw new Error("Validation request did not complete.");
}

main().catch((error) => {
  console.error("");
  console.error("Validation request failed:");
  console.error(error);
  process.exit(1);
});