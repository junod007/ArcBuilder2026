// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Crowdfunding {
    address public immutable owner;
    uint256 public immutable goal;
    uint256 public immutable deadline;

    mapping(address => uint256) public contributions;

    uint256 public totalRaised;
    bool public fundsClaimed;

    event ContributionReceived(
        address indexed contributor,
        uint256 amount
    );

    event FundsClaimed(
        address indexed owner,
        uint256 amount
    );

    event RefundClaimed(
        address indexed contributor,
        uint256 amount
    );

    constructor(uint256 _goal, uint256 _duration) {
        require(_goal > 0, "Goal must be greater than zero");
        require(_duration > 0, "Duration must be greater than zero");

        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + _duration;
    }

    function contribute() external payable {
        require(block.timestamp < deadline, "Campaign has ended");
        require(msg.value > 0, "Contribution must be greater than zero");

        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        emit ContributionReceived(msg.sender, msg.value);
    }

    function claimFunds() external {
        require(msg.sender == owner, "Only owner");
        require(block.timestamp >= deadline, "Campaign is still active");
        require(totalRaised >= goal, "Goal not reached");
        require(!fundsClaimed, "Funds already claimed");

        fundsClaimed = true;

        uint256 amount = address(this).balance;

        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsClaimed(owner, amount);
    }

    function refund() external {
        require(block.timestamp >= deadline, "Campaign is still active");
        require(totalRaised < goal, "Goal was reached");

        uint256 amount = contributions[msg.sender];
        require(amount > 0, "No contribution to refund");

        contributions[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Refund failed");

        emit RefundClaimed(msg.sender, amount);
    }

    function getCampaignStatus()
        external
        view
        returns (
            uint256 campaignGoal,
            uint256 amountRaised,
            uint256 campaignDeadline,
            bool goalReached,
            bool campaignEnded,
            bool ownerHasClaimed
        )
    {
        return (
            goal,
            totalRaised,
            deadline,
            totalRaised >= goal,
            block.timestamp >= deadline,
            fundsClaimed
        );
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
