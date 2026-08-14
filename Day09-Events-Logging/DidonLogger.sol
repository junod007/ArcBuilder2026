// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DidonLogger {

    // Event ketika pesan baru dibuat
    event MessageUpdated(
        address indexed user,
        string message,
        uint256 timestamp
    );

    string private message;

    // Menyimpan pesan baru
    function setMessage(string memory _message) public {
        message = _message;

        emit MessageUpdated(
            msg.sender,
            _message,
            block.timestamp
        );
    }

    // Membaca pesan
    function getMessage() public view returns (string memory) {
        return message;
    }
}
