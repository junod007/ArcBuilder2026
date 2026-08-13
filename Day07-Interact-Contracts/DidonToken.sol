// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DidonToken {

    // Nama token
    string public name = "Didon Token";

    // Simbol token
    string public symbol = "DIDON";

    // Jumlah desimal
    uint8 public decimals = 0;

    // Total jumlah token
    uint256 public totalSupply;

    // Menyimpan saldo setiap wallet
    mapping(address => uint256) public balanceOf;

    // Menyimpan izin penggunaan token
    mapping(address => mapping(address => uint256)) public allowance;

    // Event saat token ditransfer
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    // Event saat approval diberikan
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    // Constructor
    constructor(uint256 initialSupply) {
        totalSupply = initialSupply;

        // Semua token awal diberikan kepada deployer
        balanceOf[msg.sender] = initialSupply;

        emit Transfer(address(0), msg.sender, initialSupply);
    }

    // Transfer token ke wallet lain
    function transfer(
        address to,
        uint256 amount
    ) public returns (bool) {

        require(
            balanceOf[msg.sender] >= amount,
            "Saldo tidak cukup"
        );

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(msg.sender, to, amount);

        return true;
    }

    // Memberikan izin kepada wallet lain
    function approve(
        address spender,
        uint256 amount
    ) public returns (bool) {

        allowance[msg.sender][spender] = amount;

        emit Approval(msg.sender, spender, amount);

        return true;
    }

    // Transfer token menggunakan izin allowance
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public returns (bool) {

        require(
            balanceOf[from] >= amount,
            "Saldo tidak cukup"
        );

        require(
            allowance[from][msg.sender] >= amount,
            "Allowance tidak cukup"
        );

        balanceOf[from] -= amount;
        balanceOf[to] += amount;

        allowance[from][msg.sender] -= amount;

        emit Transfer(from, to, amount);

        return true;
    }

    // Membuat token baru
    function mint(
        address to,
        uint256 amount
    ) public returns (bool) {

        balanceOf[to] += amount;
        totalSupply += amount;

        emit Transfer(address(0), to, amount);

        return true;
    }

}
