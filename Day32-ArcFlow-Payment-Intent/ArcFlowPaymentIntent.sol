// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ArcFlowPaymentIntent {
    enum Status {
        Pending,
        Completed,
        Cancelled
    }

    struct PaymentIntent {
        address payer;
        address payee;
        address asset;
        uint256 amount;
        address executor;
        uint256 createdAt;
        uint256 executedAt;
        Status status;
        string reference;
    }

    uint256 public nextIntentId;

    mapping(uint256 => PaymentIntent) public paymentIntents;

    event PaymentIntentCreated(
        uint256 indexed intentId,
        address indexed payer,
        address indexed payee,
        address asset,
        uint256 amount,
        address executor,
        string reference
    );

    event PaymentIntentExecuted(
        uint256 indexed intentId,
        address indexed executor,
        uint256 executedAt
    );

    event PaymentIntentCancelled(
        uint256 indexed intentId,
        address indexed payer
    );

    function createPaymentIntent(
        address payee,
        address asset,
        uint256 amount,
        address executor,
        string calldata reference
    ) external returns (uint256 intentId) {
        require(payee != address(0), "Invalid payee");
        require(asset != address(0), "Invalid asset");
        require(executor != address(0), "Invalid executor");
        require(amount > 0, "Amount must be greater than zero");

        intentId = nextIntentId;

        paymentIntents[intentId] = PaymentIntent({
            payer: msg.sender,
            payee: payee,
            asset: asset,
            amount: amount,
            executor: executor,
            createdAt: block.timestamp,
            executedAt: 0,
            status: Status.Pending,
            reference: reference
        });

        nextIntentId++;

        emit PaymentIntentCreated(
            intentId,
            msg.sender,
            payee,
            asset,
            amount,
            executor,
            reference
        );
    }

    function executePaymentIntent(uint256 intentId) external {
        PaymentIntent storage intent = paymentIntents[intentId];

        require(intent.payer != address(0), "Intent does not exist");
        require(intent.status == Status.Pending, "Intent not pending");
        require(msg.sender == intent.executor, "Not authorized executor");

        intent.status = Status.Completed;
        intent.executedAt = block.timestamp;

        bool success = IERC20(intent.asset).transferFrom(
            intent.payer,
            intent.payee,
            intent.amount
        );

        require(success, "Payment transfer failed");

        emit PaymentIntentExecuted(
            intentId,
            msg.sender,
            block.timestamp
        );
    }

    function cancelPaymentIntent(uint256 intentId) external {
        PaymentIntent storage intent = paymentIntents[intentId];

        require(intent.payer != address(0), "Intent does not exist");
        require(intent.status == Status.Pending, "Intent not pending");
        require(msg.sender == intent.payer, "Only payer can cancel");

        intent.status = Status.Cancelled;

        emit PaymentIntentCancelled(
            intentId,
            msg.sender
        );
    }

    function getPaymentIntent(
        uint256 intentId
    ) external view returns (PaymentIntent memory) {
        require(
            paymentIntents[intentId].payer != address(0),
            "Intent does not exist"
        );

        return paymentIntents[intentId];
    }
}
