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
}

contract PaymentSplitter {
    IERC20 public immutable usdc;

    address public owner;

    address public recipient1;
    address public recipient2;
    address public recipient3;

    uint256 public share1;
    uint256 public share2;
    uint256 public share3;

    uint256 public constant TOTAL_SHARES = 10000;

    event PaymentReceived(
        address indexed payer,
        uint256 amount
    );

    event PaymentDistributed(
        address indexed payer,
        uint256 amount,
        uint256 amount1,
        uint256 amount2,
        uint256 amount3
    );

    event RecipientsUpdated(
        address recipient1,
        address recipient2,
        address recipient3
    );

    event SharesUpdated(
        uint256 share1,
        uint256 share2,
        uint256 share3
    );

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Not the owner"
        );
        _;
    }

    constructor(
        address _usdc,
        address _recipient1,
        address _recipient2,
        address _recipient3,
        uint256 _share1,
        uint256 _share2,
        uint256 _share3
    ) {
        require(
            _usdc != address(0),
            "Invalid USDC"
        );

        require(
            _recipient1 != address(0) &&
            _recipient2 != address(0) &&
            _recipient3 != address(0),
            "Invalid recipient"
        );

        require(
            _share1 + _share2 + _share3 == TOTAL_SHARES,
            "Shares must equal 10000"
        );

        owner = msg.sender;

        usdc = IERC20(_usdc);

        recipient1 = _recipient1;
        recipient2 = _recipient2;
        recipient3 = _recipient3;

        share1 = _share1;
        share2 = _share2;
        share3 = _share3;
    }

    function pay(uint256 amount)
        external
    {
        require(
            amount > 0,
            "Amount must be greater than zero"
        );

        require(
            usdc.transferFrom(
                msg.sender,
                address(this),
                amount
            ),
            "USDC payment failed"
        );

        emit PaymentReceived(
            msg.sender,
            amount
        );

        uint256 amount1 =
            (amount * share1) / TOTAL_SHARES;

        uint256 amount2 =
            (amount * share2) / TOTAL_SHARES;

        uint256 amount3 =
            amount - amount1 - amount2;

        require(
            usdc.transfer(recipient1, amount1),
            "Transfer 1 failed"
        );

        require(
            usdc.transfer(recipient2, amount2),
            "Transfer 2 failed"
        );

        require(
            usdc.transfer(recipient3, amount3),
            "Transfer 3 failed"
        );

        emit PaymentDistributed(
            msg.sender,
            amount,
            amount1,
            amount2,
            amount3
        );
    }

    function setRecipients(
        address _recipient1,
        address _recipient2,
        address _recipient3
    )
        external
        onlyOwner
    {
        require(
            _recipient1 != address(0) &&
            _recipient2 != address(0) &&
            _recipient3 != address(0),
            "Invalid recipient"
        );

        recipient1 = _recipient1;
        recipient2 = _recipient2;
        recipient3 = _recipient3;

        emit RecipientsUpdated(
            _recipient1,
            _recipient2,
            _recipient3
        );
    }

    function setShares(
        uint256 _share1,
        uint256 _share2,
        uint256 _share3
    )
        external
        onlyOwner
    {
        require(
            _share1 + _share2 + _share3 == TOTAL_SHARES,
            "Shares must equal 10000"
        );

        share1 = _share1;
        share2 = _share2;
        share3 = _share3;

        emit SharesUpdated(
            _share1,
            _share2,
            _share3
        );
    }

    function contractUSDCBalance()
        external
        view
        returns (uint256)
    {
        return usdc.balanceOf(address(this));
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
}
