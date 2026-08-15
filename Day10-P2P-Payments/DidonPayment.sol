// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DidonPayment {

    event PaymentSent(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 timestamp
    );

    function sendPayment(address payable recipient) external payable {
        require(recipient != address(0), "Invalid recipient");
        require(msg.value > 0, "Payment must be greater than 0");

        recipient.transfer(msg.value);

        emit PaymentSent(
            msg.sender,
            recipient,
            msg.value,
            block.timestamp
        );
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
