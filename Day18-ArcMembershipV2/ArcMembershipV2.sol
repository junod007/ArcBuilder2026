// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function transfer(
        address to,
        uint256 amount
    ) external returns (bool);

    function balanceOf(
        address account
    ) external view returns (uint256);

    function approve(
        address spender,
        uint256 amount
    ) external returns (bool);
}

contract ArcMembershipV2 {
    IERC20 public immutable usdc;

    address public owner;

    uint256 public membershipPrice;
    uint256 public membershipDuration;

    mapping(address => uint256) public membershipExpiry;
    mapping(address => bool) public managers;

    event MembershipJoined(
        address indexed member,
        uint256 expiry
    );

    event MembershipRenewed(
        address indexed member,
        uint256 expiry
    );

    event ManagerUpdated(
        address indexed manager,
        bool status
    );

    event MembershipPriceUpdated(
        uint256 newPrice
    );

    event MembershipDurationUpdated(
        uint256 newDuration
    );

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Not the owner"
        );
        _;
    }

    modifier onlyManager() {
        require(
            msg.sender == owner || managers[msg.sender],
            "Not authorized"
        );
        _;
    }

    constructor(
        address _usdc,
        uint256 _membershipPrice,
        uint256 _membershipDuration
    ) {
        owner = msg.sender;
        usdc = IERC20(_usdc);
        membershipPrice = _membershipPrice;
        membershipDuration = _membershipDuration;
    }

    function addManager(address account)
        external
        onlyOwner
    {
        require(
            account != address(0),
            "Invalid address"
        );

        managers[account] = true;

        emit ManagerUpdated(account, true);
    }

    function removeManager(address account)
        external
        onlyOwner
    {
        managers[account] = false;

        emit ManagerUpdated(account, false);
    }

    function joinMembership()
        external
    {
        require(
            membershipExpiry[msg.sender] < block.timestamp,
            "Already a member"
        );

        require(
            usdc.transferFrom(
                msg.sender,
                address(this),
                membershipPrice
            ),
            "USDC payment failed"
        );

        uint256 expiry =
            block.timestamp + membershipDuration;

        membershipExpiry[msg.sender] = expiry;

        emit MembershipJoined(
            msg.sender,
            expiry
        );
    }

    function renewMembership()
        external
    {
        require(
            membershipExpiry[msg.sender] >= block.timestamp,
            "Membership expired"
        );

        require(
            usdc.transferFrom(
                msg.sender,
                address(this),
                membershipPrice
            ),
            "USDC payment failed"
        );

        uint256 expiry =
            membershipExpiry[msg.sender]
            + membershipDuration;

        membershipExpiry[msg.sender] = expiry;

        emit MembershipRenewed(
            msg.sender,
            expiry
        );
    }

    function isMember(address account)
        public
        view
        returns (bool)
    {
        return membershipExpiry[account] >= block.timestamp;
    }

    function setMembershipPrice(uint256 newPrice)
        external
        onlyManager
    {
        require(
            newPrice > 0,
            "Price must be greater than zero"
        );

        membershipPrice = newPrice;

        emit MembershipPriceUpdated(newPrice);
    }

    function setMembershipDuration(uint256 newDuration)
        external
        onlyManager
    {
        require(
            newDuration > 0,
            "Duration must be greater than zero"
        );

        membershipDuration = newDuration;

        emit MembershipDurationUpdated(newDuration);
    }

    function withdrawUSDC(uint256 amount)
        external
        onlyOwner
    {
        require(
            usdc.transfer(owner, amount),
            "Withdrawal failed"
        );
    }

    function contractUSDCBalance()
        external
        view
        returns (uint256)
    {
        return usdc.balanceOf(address(this));
    }
}
