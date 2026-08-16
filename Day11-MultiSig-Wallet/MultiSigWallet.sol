// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MultiSigWallet {

    address[] public owners;
    mapping(address => bool) public isOwner;

    uint256 public requiredApprovals;

    struct Transaction {
        address to;
        uint256 value;
        bool executed;
        uint256 approvals;
    }

    Transaction[] public transactions;

    mapping(uint256 => mapping(address => bool)) public approved;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    modifier transactionExists(uint256 _txId) {
        require(_txId < transactions.length, "Transaction does not exist");
        _;
    }

    constructor(address[] memory _owners, uint256 _requiredApprovals) {
        require(_owners.length > 0, "Owners required");
        require(
            _requiredApprovals > 0 &&
            _requiredApprovals <= _owners.length,
            "Invalid required approvals"
        );

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Owner already exists");

            isOwner[owner] = true;
            owners.push(owner);
        }

        requiredApprovals = _requiredApprovals;
    }

    function deposit() external payable {}

    function submitTransaction(
        address _to,
        uint256 _value
    ) external onlyOwner {
        require(address(this).balance >= _value, "Insufficient balance");

        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                executed: false,
                approvals: 0
            })
        );
    }

    function approveTransaction(
        uint256 _txId
    ) external onlyOwner transactionExists(_txId) {
        Transaction storage transaction = transactions[_txId];

        require(!transaction.executed, "Already executed");
        require(!approved[_txId][msg.sender], "Already approved");

        approved[_txId][msg.sender] = true;
        transaction.approvals++;
    }

    function executeTransaction(
        uint256 _txId
    ) external onlyOwner transactionExists(_txId) {
        Transaction storage transaction = transactions[_txId];

        require(!transaction.executed, "Already executed");
        require(
            transaction.approvals >= requiredApprovals,
            "Not enough approvals"
        );

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.value}("");

        require(success, "Transaction failed");
    }

    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }
}
