// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ArcSubscription
 * @dev Simple subscription contract for managing user access periods.
 */
contract ArcSubscription {
    address public owner;

    uint256 public subscriptionPrice;
    uint256 public subscriptionDuration;

    struct Subscription {
        uint256 expiresAt;
        bool active;
    }

    mapping(address => Subscription) public subscriptions;

    event Subscribed(
        address indexed user,
        uint256 expiresAt,
        uint256 amount
    );

    event SubscriptionRenewed(
        address indexed user,
        uint256 newExpiresAt,
        uint256 amount
    );

    event SubscriptionPriceUpdated(
        uint256 oldPrice,
        uint256 newPrice
    );

    event SubscriptionDurationUpdated(
        uint256 oldDuration,
        uint256 newDuration
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor(
        uint256 _subscriptionPrice,
        uint256 _subscriptionDuration
    ) {
        owner = msg.sender;
        subscriptionPrice = _subscriptionPrice;
        subscriptionDuration = _subscriptionDuration;
    }

    /**
     * @dev Subscribe for the configured duration.
     */
    function subscribe() external payable {
        require(
            msg.value >= subscriptionPrice,
            "Insufficient payment"
        );

        Subscription storage userSubscription =
            subscriptions[msg.sender];

        require(
            !isSubscribed(msg.sender),
            "Subscription already active"
        );

        userSubscription.expiresAt =
            block.timestamp + subscriptionDuration;

        userSubscription.active = true;

        emit Subscribed(
            msg.sender,
            userSubscription.expiresAt,
            msg.value
        );
    }

    /**
     * @dev Renew an existing or expired subscription.
     */
    function renewSubscription() external payable {
        require(
            msg.value >= subscriptionPrice,
            "Insufficient payment"
        );

        Subscription storage userSubscription =
            subscriptions[msg.sender];

        uint256 newExpiry;

        if (userSubscription.expiresAt > block.timestamp) {
            newExpiry =
                userSubscription.expiresAt +
                subscriptionDuration;
        } else {
            newExpiry =
                block.timestamp +
                subscriptionDuration;
        }

        userSubscription.expiresAt = newExpiry;
        userSubscription.active = true;

        emit SubscriptionRenewed(
            msg.sender,
            newExpiry,
            msg.value
        );
    }

    /**
     * @dev Check whether a user currently has an active subscription.
     */
    function isSubscribed(
        address user
    ) public view returns (bool) {
        return
            subscriptions[user].active &&
            subscriptions[user].expiresAt > block.timestamp;
    }

    /**
     * @dev Returns remaining subscription time in seconds.
     */
    function getRemainingTime(
        address user
    ) external view returns (uint256) {
        if (!isSubscribed(user)) {
            return 0;
        }

        return
            subscriptions[user].expiresAt -
            block.timestamp;
    }

    /**
     * @dev Update subscription price.
     */
    function updateSubscriptionPrice(
        uint256 newPrice
    ) external onlyOwner {
        uint256 oldPrice = subscriptionPrice;

        subscriptionPrice = newPrice;

        emit SubscriptionPriceUpdated(
            oldPrice,
            newPrice
        );
    }

    /**
     * @dev Update subscription duration.
     */
    function updateSubscriptionDuration(
        uint256 newDuration
    ) external onlyOwner {
        uint256 oldDuration = subscriptionDuration;

        subscriptionDuration = newDuration;

        emit SubscriptionDurationUpdated(
            oldDuration,
            newDuration
        );
    }

    /**
     * @dev Withdraw contract balance to the owner.
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;

        require(balance > 0, "No funds available");

        payable(owner).transfer(balance);
    }
}
