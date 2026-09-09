// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(
        address to,
        uint256 amount
    ) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function approve(
        address spender,
        uint256 amount
    ) external returns (bool);

    function balanceOf(
        address account
    ) external view returns (uint256);
}

contract AgentPaymentAuth {

    IERC20 public immutable usdc;

    uint256 public nextAuthorizationId;

    struct Authorization {
        address owner;
        address agent;
        uint256 limit;
        uint256 spent;
        bool active;
    }

    mapping(uint256 => Authorization) public authorizations;

    event AuthorizationCreated(
        uint256 indexed authorizationId,
        address indexed owner,
        address indexed agent,
        uint256 limit
    );

    event PaymentExecuted(
        uint256 indexed authorizationId,
        address indexed recipient,
        uint256 amount
    );

    event AuthorizationRevoked(
        uint256 indexed authorizationId
    );

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
    }

    function createAuthorization(
        address agent,
        uint256 limit
    ) external returns (uint256 authorizationId) {

        require(agent != address(0), "Invalid agent");
        require(limit > 0, "Limit must be greater than zero");

        authorizationId = nextAuthorizationId++;

        authorizations[authorizationId] = Authorization({
            owner: msg.sender,
            agent: agent,
            limit: limit,
            spent: 0,
            active: true
        });

        emit AuthorizationCreated(
            authorizationId,
            msg.sender,
            agent,
            limit
        );
    }

    function executePayment(
        uint256 authorizationId,
        address recipient,
        uint256 amount
    ) external {

        Authorization storage auth = authorizations[authorizationId];

        require(auth.active, "Authorization inactive");
        require(msg.sender == auth.agent, "Not authorized agent");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than zero");
        require(
            auth.spent + amount <= auth.limit,
            "Spending limit exceeded"
        );

        auth.spent += amount;

        require(
            usdc.transferFrom(
                auth.owner,
                recipient,
                amount
            ),
            "USDC transfer failed"
        );

        emit PaymentExecuted(
            authorizationId,
            recipient,
            amount
        );
    }

    function revokeAuthorization(
        uint256 authorizationId
    ) external {

        Authorization storage auth = authorizations[authorizationId];

        require(auth.owner == msg.sender, "Not authorization owner");
        require(auth.active, "Already revoked");

        auth.active = false;

        emit AuthorizationRevoked(authorizationId);
    }

    function remainingAllowance(
        uint256 authorizationId
    ) external view returns (uint256) {

        Authorization memory auth = authorizations[authorizationId];

        if (auth.spent >= auth.limit) {
            return 0;
        }

        return auth.limit - auth.spent;
    }

    function getAuthorization(
        uint256 authorizationId
    )
        external
        view
        returns (
            address owner,
            address agent,
            uint256 limit,
            uint256 spent,
            bool active
        )
    {
        Authorization memory auth = authorizations[authorizationId];

        return (
            auth.owner,
            auth.agent,
            auth.limit,
            auth.spent,
            auth.active
        );
    }
}
