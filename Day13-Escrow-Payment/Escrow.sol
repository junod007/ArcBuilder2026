// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Escrow {
    address public buyer;
    address public seller;
    address public arbiter;

    uint256 public amount;

    enum State {
        AWAITING_PAYMENT,
        AWAITING_DELIVERY,
        COMPLETE,
        REFUNDED
    }

    State public state;

    event Deposited(address indexed buyer, uint256 amount);
    event Released(address indexed seller, uint256 amount);
    event Refunded(address indexed buyer, uint256 amount);

    constructor(address _seller, address _arbiter) {
        buyer = msg.sender;
        seller = _seller;
        arbiter = _arbiter;
        state = State.AWAITING_PAYMENT;
    }

    function deposit() external payable {
        require(msg.sender == buyer, "Only buyer can deposit");
        require(state == State.AWAITING_PAYMENT, "Invalid state");
        require(msg.value > 0, "Amount must be greater than zero");

        amount = msg.value;
        state = State.AWAITING_DELIVERY;

        emit Deposited(msg.sender, msg.value);
    }

    function release() external {
        require(
            msg.sender == buyer || msg.sender == arbiter,
            "Not authorized"
        );
        require(
            state == State.AWAITING_DELIVERY,
            "Payment cannot be released"
        );

        state = State.COMPLETE;

        uint256 payment = amount;
        amount = 0;

        payable(seller).transfer(payment);

        emit Released(seller, payment);
    }

    function refund() external {
        require(
            msg.sender == buyer || msg.sender == arbiter,
            "Not authorized"
        );
        require(
            state == State.AWAITING_DELIVERY,
            "Refund not available"
        );

        state = State.REFUNDED;

        uint256 refundAmount = amount;
        amount = 0;

        payable(buyer).transfer(refundAmount);

        emit Refunded(buyer, refundAmount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
