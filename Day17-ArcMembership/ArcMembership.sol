// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArcMembership {
    address public owner;

    uint256 public membershipPrice = 0.001 ether;
    uint256 public membershipDuration = 30 days;

    mapping(address => uint256) public membershipExpiry;

    event MembershipJoined(
        address indexed member,
        uint256 expiry,
        uint256 amount
    );

    event MembershipRenewed(
        address indexed member,
        uint256 expiry,
        uint256 amount
    );

    event PriceUpdated(uint256 newPrice);
    event DurationUpdated(uint256 newDuration);
    event Withdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function joinMembership() external payable {
        require(msg.value >= membershipPrice, "Insufficient payment");

        uint256 newExpiry;

        if (membershipExpiry[msg.sender] > block.timestamp) {
            newExpiry = membershipExpiry[msg.sender] + membershipDuration;
        } else {
            newExpiry = block.timestamp + membershipDuration;
        }

        membershipExpiry[msg.sender] = newExpiry;

        emit MembershipJoined(
            msg.sender,
            newExpiry,
            msg.value
        );
    }

    function renewMembership() external payable {
        require(
            membershipExpiry[msg.sender] > block.timestamp,
            "Membership expired"
        );

        require(msg.value >= membershipPrice, "Insufficient payment");

        uint256 newExpiry =
            membershipExpiry[msg.sender] + membershipDuration;

        membershipExpiry[msg.sender] = newExpiry;

        emit MembershipRenewed(
            msg.sender,
            newExpiry,
            msg.value
        );
    }

    function isMember(address user) external view returns (bool) {
        return membershipExpiry[user] > block.timestamp;
    }

    function remainingTime(address user)
        external
        view
        returns (uint256)
    {
        if (membershipExpiry[user] <= block.timestamp) {
            return 0;
        }

        return membershipExpiry[user] - block.timestamp;
    }

    function setMembershipPrice(uint256 newPrice)
        external
        onlyOwner
    {
        require(newPrice > 0, "Price must be greater than zero");

        membershipPrice = newPrice;

        emit PriceUpdated(newPrice);
    }

    function setMembershipDuration(uint256 newDuration)
        external
        onlyOwner
    {
        require(newDuration > 0, "Duration must be greater than zero");

        membershipDuration = newDuration;

        emit DurationUpdated(newDuration);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;

        require(balance > 0, "No balance");

        payable(owner).transfer(balance);

        emit Withdrawn(owner, balance);
    }
}
