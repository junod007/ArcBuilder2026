// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TimeLockWallet {

    address public owner;
    uint256 public unlockTime;

    event Deposited(address indexed sender, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);

    constructor(uint256 _unlockTime) {
        require(
            _unlockTime > block.timestamp,
            "Unlock time must be in the future"
        );

        owner = msg.sender;
        unlockTime = _unlockTime;
    }

    receive() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    function deposit() external payable {
        require(msg.value > 0, "Amount must be greater than zero");

        emit Deposited(msg.sender, msg.value);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(
            block.timestamp >= unlockTime,
            "Funds are still locked"
        );

        uint256 balance = address(this).balance;

        require(balance > 0, "No funds available");

        payable(owner).transfer(balance);

        emit Withdrawn(owner, balance);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function isUnlocked() external view returns (bool) {
        return block.timestamp >= unlockTime;
    }
}
