import {
  createPublicClient,
  http,
  getAddress,
} from "viem";

const RPC_URL = "https://rpc.testnet.arc.network";

const VALIDATION_REGISTRY =
  "0x8004Cb1BF31DAf7788923b405b754f57acEB4272";

const REQUEST_HASH =
  "0x600110c45879f58b27e68b8f126561843cd3a0391099ed509e8819cb6b2ddb6f";

const abi = [
  {
    type: "function",
    name: "getValidationStatus",
    stateMutability: "view",
    inputs: [
      {
        name: "requestHash",
        type: "bytes32",
      },
    ],
    outputs: [
      {
        name: "validatorAddress",
        type: "address",
      },
      {
        name: "agentId",
        type: "uint256",
      },
      {
        name: "response",
        type: "uint8",
      },
      {
        name: "responseHash",
        type: "bytes32",
      },
      {
        name: "tag",
        type: "string",
      },
      {
        name: "lastUpdate",
        type: "uint256",
      },
    ],
  },
] as const;

const client = createPublicClient({
  transport: http(RPC_URL),
});

async function main() {
  console.log("========================================");
  console.log(" ERC-8004 VALIDATION STATUS");
  console.log("========================================");

  console.log(`Request Hash: ${REQUEST_HASH}`);
  console.log("");

  const result = await client.readContract({
    address: getAddress(VALIDATION_REGISTRY),
    abi,
    functionName: "getValidationStatus",
    args: [REQUEST_HASH],
  });

  const [
    validatorAddress,
    agentId,
    response,
    responseHash,
    tag,
    lastUpdate,
  ] = result;

  console.log("========================================");
  console.log(" ON-CHAIN VALIDATION RESULT");
  console.log("========================================");

  console.log(`Validator:    ${validatorAddress}`);
  console.log(`Agent ID:     ${agentId}`);
  console.log(`Response:     ${response}/100`);
  console.log(`ResponseHash: ${responseHash}`);
  console.log(`Tag:          ${tag}`);
  console.log(`Last Update:  ${lastUpdate}`);

  console.log("");

  if (response === 100) {
    console.log("🔥 VALIDATION VERIFIED: 100/100 🔥");
    console.log("Agent is officially validated on-chain.");
  } else {
    console.log(`Validation response: ${response}/100`);
  }

  console.log("========================================");
}

main().catch((error) => {
  console.error("");
  console.error("Verification failed:");
  console.error(error);
  process.exit(1);
});