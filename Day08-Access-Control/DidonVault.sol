// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DidonVault {

    // Pemilik kontrak
    address public owner;

    // Menyimpan saldo setiap pengguna
    mapping(address => uint256) public balances;

    // Event saat deposit
    event Deposited(address indexed user, uint256 amount);

    // Event saat withdraw
    event Withdrawn(address indexed user, uint256 amount);

    // Event saat owner berubah
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // Modifier: hanya owner yang boleh menjalankan
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Constructor: wallet yang deploy menjadi owner
    constructor() {
        owner = msg.sender;
    }

    // Deposit ETH ke vault
    function deposit() public payable {
        require(msg.value > 0, "Deposit must be greater than 0");

        balances[msg.sender] += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    // User menarik saldo miliknya sendiri
    function withdraw(uint256 amount) public {
        require(
            balances[msg.sender] >= amount,
            "Insufficient balance"
        );

        balances[msg.sender] -= amount;

        payable(msg.sender).transfer(amount);

        emit Withdrawn(msg.sender, amount);
    }

    // Hanya owner yang bisa melihat total ETH di vault
    function getVaultBalance()
        public
        view
        onlyOwner
        returns (uint256)
    {
        return address(this).balance;
    }

    // Hanya owner yang bisa memindahkan ownership
    function transferOwnership(address newOwner)
        public
        onlyOwner
    {
        require(
            newOwner != address(0),
            "Invalid new owner"
        );

        emit OwnershipTransferred(owner, newOwner);

        owner = newOwner;
    }
}
