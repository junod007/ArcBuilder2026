// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StakingRewards {
    address public owner;

    uint256 public rewardRate = 1;
    uint256 public totalStaked;

    struct StakeInfo {
        uint256 amount;
        uint256 stakedAt;
        uint256 rewards;
    }

    mapping(address => StakeInfo) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function stake() external payable {
        require(msg.value > 0, "Amount must be greater than 0");

        StakeInfo storage user = stakes[msg.sender];

        if (user.amount > 0) {
            user.rewards += pendingReward(msg.sender);
        }

        user.amount += msg.value;
        user.stakedAt = block.timestamp;

        totalStaked += msg.value;

        emit Staked(msg.sender, msg.value);
    }

    function pendingReward(address _user) public view returns (uint256) {
        StakeInfo memory user = stakes[_user];

        if (user.amount == 0) {
            return 0;
        }

        uint256 stakingTime = block.timestamp - user.stakedAt;

        return (user.amount * rewardRate * stakingTime) / 1 days;
    }

    function claimReward() external {
        StakeInfo storage user = stakes[msg.sender];

        require(user.amount > 0, "No active stake");

        uint256 reward = user.rewards + pendingReward(msg.sender);

        require(reward > 0, "No rewards available");

        user.rewards = 0;
        user.stakedAt = block.timestamp;

        payable(msg.sender).transfer(reward);

        emit RewardClaimed(msg.sender, reward);
    }

    function unstake(uint256 _amount) external {
        StakeInfo storage user = stakes[msg.sender];

        require(_amount > 0, "Amount must be greater than 0");
        require(user.amount >= _amount, "Insufficient staked amount");

        user.rewards += pendingReward(msg.sender);

        user.amount -= _amount;
        totalStaked -= _amount;
        user.stakedAt = block.timestamp;

        payable(msg.sender).transfer(_amount);

        emit Unstaked(msg.sender, _amount);
    }

    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        rewardRate = _rewardRate;
    }

    function fundRewards() external payable onlyOwner {
        require(msg.value > 0, "Must send ETH");
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
