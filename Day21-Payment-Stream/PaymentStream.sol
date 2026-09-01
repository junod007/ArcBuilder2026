// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    function transfer(
        address to,
        uint256 value
    ) external returns (bool);

    function balanceOf(
        address account
    ) external view returns (uint256);
}

contract PaymentStream {
    IERC20 public immutable usdc;

    struct Stream {
        address sender;
        address recipient;
        uint256 totalAmount;
        uint256 withdrawnAmount;
        uint256 startTime;
        uint256 endTime;
        bool cancelled;
    }

    uint256 public nextStreamId;

    mapping(uint256 => Stream) public streams;

    event StreamCreated(
        uint256 indexed streamId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 startTime,
        uint256 endTime
    );

    event Withdrawn(
        uint256 indexed streamId,
        address indexed recipient,
        uint256 amount
    );

    event StreamCancelled(
        uint256 indexed streamId,
        address indexed sender,
        uint256 refundedAmount
    );

    constructor(address _usdc) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = IERC20(_usdc);
    }

    function createStream(
        address _recipient,
        uint256 _amount,
        uint256 _startTime,
        uint256 _endTime
    ) external returns (uint256 streamId) {
        require(_recipient != address(0), "Invalid recipient");
        require(_recipient != msg.sender, "Cannot stream to yourself");
        require(_amount > 0, "Amount must be greater than zero");
        require(_startTime >= block.timestamp, "Start time must be in future");
        require(_endTime > _startTime, "Invalid stream duration");

        bool success = usdc.transferFrom(
            msg.sender,
            address(this),
            _amount
        );

        require(success, "USDC transfer failed");

        streamId = nextStreamId;

        streams[streamId] = Stream({
            sender: msg.sender,
            recipient: _recipient,
            totalAmount: _amount,
            withdrawnAmount: 0,
            startTime: _startTime,
            endTime: _endTime,
            cancelled: false
        });

        nextStreamId++;

        emit StreamCreated(
            streamId,
            msg.sender,
            _recipient,
            _amount,
            _startTime,
            _endTime
        );
    }

    function getVestedAmount(
        uint256 _streamId
    ) public view returns (uint256) {
        Stream memory stream = streams[_streamId];

        require(stream.sender != address(0), "Stream does not exist");

        if (block.timestamp <= stream.startTime) {
            return 0;
        }

        if (block.timestamp >= stream.endTime || stream.cancelled) {
            return stream.totalAmount;
        }

        uint256 elapsed = block.timestamp - stream.startTime;
        uint256 duration = stream.endTime - stream.startTime;

        return (stream.totalAmount * elapsed) / duration;
    }

    function getWithdrawableAmount(
        uint256 _streamId
    ) public view returns (uint256) {
        Stream memory stream = streams[_streamId];

        require(stream.sender != address(0), "Stream does not exist");

        uint256 vested = getVestedAmount(_streamId);

        return vested - stream.withdrawnAmount;
    }

    function withdraw(uint256 _streamId) external {
        Stream storage stream = streams[_streamId];

        require(stream.sender != address(0), "Stream does not exist");
        require(msg.sender == stream.recipient, "Not recipient");
        require(!stream.cancelled, "Stream cancelled");

        uint256 withdrawable = getWithdrawableAmount(_streamId);

        require(withdrawable > 0, "Nothing to withdraw");

        stream.withdrawnAmount += withdrawable;

        bool success = usdc.transfer(
            stream.recipient,
            withdrawable
        );

        require(success, "USDC transfer failed");

        emit Withdrawn(
            _streamId,
            stream.recipient,
            withdrawable
        );
    }

    function cancelStream(uint256 _streamId) external {
        Stream storage stream = streams[_streamId];

        require(stream.sender != address(0), "Stream does not exist");
        require(msg.sender == stream.sender, "Not sender");
        require(!stream.cancelled, "Already cancelled");

        uint256 vested = getVestedAmount(_streamId);
        uint256 withdrawable = vested - stream.withdrawnAmount;

        stream.cancelled = true;

        if (withdrawable > 0) {
            stream.withdrawnAmount += withdrawable;

            bool recipientSuccess = usdc.transfer(
                stream.recipient,
                withdrawable
            );

            require(
                recipientSuccess,
                "Recipient transfer failed"
            );
        }

        uint256 refundAmount =
            stream.totalAmount - stream.withdrawnAmount;

        if (refundAmount > 0) {
            stream.withdrawnAmount += refundAmount;

            bool senderSuccess = usdc.transfer(
                stream.sender,
                refundAmount
            );

            require(
                senderSuccess,
                "Refund transfer failed"
            );
        }

        emit StreamCancelled(
            _streamId,
            stream.sender,
            refundAmount
        );
    }

    function getStream(
        uint256 _streamId
    ) external view returns (Stream memory) {
        require(
            streams[_streamId].sender != address(0),
            "Stream does not exist"
        );

        return streams[_streamId];
    }
}
