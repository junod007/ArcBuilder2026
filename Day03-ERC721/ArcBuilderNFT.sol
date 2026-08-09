// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ArcBuilderNFT is ERC721 {
    uint256 private _nextTokenId;

    constructor() ERC721("Arc Builder NFT", "ABNFT") {}

    function mint() public {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }
}
