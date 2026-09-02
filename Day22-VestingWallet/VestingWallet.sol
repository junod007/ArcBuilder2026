// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VestingWallet {
    address public immutable beneficiary;

    uint256 public immutable start;
    uint256 public immutable cliffDuration;
    uint256 public immutable vestingDuration;
    uint256 public immutable totalAllocation;

    uint256 public released;

    event FundsReceived(address indexed sender, uint256 amount);
    event TokensReleased(address indexed beneficiary, uint256 amount);

    constructor(
        address _beneficiary,
        uint256 _start,
        uint256 _cliffDuration,
        uint256 _vestingDuration,
        uint256 _totalAllocation
    ) payable {
        require(_beneficiary != address(0), "Invalid beneficiary");
        require(_vestingDuration > 0, "Invalid duration");
        require(_totalAllocation > 0, "Invalid allocation");

        beneficiary = _beneficiary;
        start = _start;
        cliffDuration = _cliffDuration;
        vestingDuration = _vestingDuration;
        totalAllocation = _totalAllocation;
    }

    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }

    function vestedAmount() public view returns (uint256) {
        if (block.timestamp < start + cliffDuration) {
            return 0;
        }

        if (block.timestamp >= start + vestingDuration) {
            return totalAllocation;
        }

        return (totalAllocation * (block.timestamp - start)) / vestingDuration;
    }

    function claimableAmount() public view returns (uint256) {
        uint256 vested = vestedAmount();

        if (vested <= released) {
            return 0;
        }

        return vested - released;
    }

    function claim() external {
        require(msg.sender == beneficiary, "Only beneficiary");
        require(address(this).balance > 0, "No funds");

        uint256 amount = claimableAmount();

        require(amount > 0, "Nothing to claim");

        released += amount;

        (bool success, ) = beneficiary.call{value: amount}("");
        require(success, "Transfer failed");

        emit TokensReleased(beneficiary, amount);
    }
}
