import {
  initiateDeveloperControlledWalletsClient,
} from "@circle-fin/developer-controlled-wallets";

import { keccak256, toHex } from "viem";

const circleClient = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY!,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
});

const REPUTATION_REGISTRY =
  "0x8004B663056A597Dffe9eCcC1965A193B7388713";

const AGENT_ID = "892242";

const VALIDATOR_WALLET_ID =
  "57754793-f755-5306-8ad9-70c744d995f8";

const TAG = "successful_agent_registration";

const FEEDBACK_HASH = keccak256(toHex(TAG));

console.log("========================================");
console.log(" ERC-8004 AGENT REPUTATION");
console.log("========================================");
console.log(`Agent ID:       ${AGENT_ID}`);
console.log(`Validator ID:   ${VALIDATOR_WALLET_ID}`);
console.log(`Score:          95`);
console.log(`Tag:            ${TAG}`);
console.log("");

async function main() {
  console.log("Submitting reputation transaction...");

  const tx =
    await circleClient.createContractExecutionTransaction({
      walletId: VALIDATOR_WALLET_ID,
      contractAddress: REPUTATION_REGISTRY,
      abiFunctionSignature:
        "giveFeedback(uint256,int128,uint8,string,string,string,string,bytes32)",
      abiParameters: [
        AGENT_ID,
        "95",
        "0",
        TAG,
        "",
        "",
        "",
        FEEDBACK_HASH,
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

  let status = "";

  for (let i = 1; i <= 20; i++) {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const result = await circleClient.getTransaction({
      id: tx.data?.id!,
    });

    status = result.data?.transaction?.state ?? "";

    console.log(`Check ${i}: ${status}`);

    if (status === "COMPLETE") {
      const txHash = result.data?.transaction?.txHash;

      console.log("");
      console.log("========================================");
      console.log(" REPUTATION SUBMITTED SUCCESSFULLY!");
      console.log("========================================");
      console.log(`Transaction Hash: ${txHash}`);
      console.log(
        `ArcScan: https://testnet.arcscan.app/tx/${txHash}`
      );
      console.log("========================================");

      return;
    }

    if (status === "FAILED") {
      throw new Error("Reputation transaction FAILED.");
    }
  }

  throw new Error(`Transaction did not complete. Last status: ${status}`);
}

main().catch((error) => {
  console.error("");
  console.error("Reputation submission failed:");
  console.error(error);
  process.exit(1);
});