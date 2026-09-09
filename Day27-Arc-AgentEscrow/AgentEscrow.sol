// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract AgentEscrow {
    IERC20 public immutable usdc;

    uint256 public nextJobId;

    enum Status {
        None,
        Funded,
        Released,
        Refunded
    }

    struct Job {
        address client;
        address agent;
        uint256 amount;
        Status status;
    }

    mapping(uint256 => Job) public jobs;

    event JobCreated(
        uint256 indexed jobId,
        address indexed client,
        address indexed agent,
        uint256 amount
    );

    event JobReleased(
        uint256 indexed jobId,
        address indexed agent,
        uint256 amount
    );

    event JobRefunded(
        uint256 indexed jobId,
        address indexed client,
        uint256 amount
    );

    constructor(address _usdc) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = IERC20(_usdc);
    }

    function createJob(
        address agent,
        uint256 amount
    ) external returns (uint256 jobId) {
        require(agent != address(0), "Invalid agent");
        require(amount > 0, "Amount must be greater than zero");

        jobId = nextJobId++;

        jobs[jobId] = Job({
            client: msg.sender,
            agent: agent,
            amount: amount,
            status: Status.None
        });

        emit JobCreated(
            jobId,
            msg.sender,
            agent,
            amount
        );
    }

    function deposit(uint256 jobId) external {
        Job storage job = jobs[jobId];

        require(job.client == msg.sender, "Not client");
        require(job.status == Status.None, "Invalid status");

        require(
            usdc.transferFrom(
                msg.sender,
                address(this),
                job.amount
            ),
            "USDC transfer failed"
        );

        job.status = Status.Funded;
    }

    function release(uint256 jobId) external {
        Job storage job = jobs[jobId];

        require(job.client == msg.sender, "Not client");
        require(job.status == Status.Funded, "Not funded");

        job.status = Status.Released;

        require(
            usdc.transfer(job.agent, job.amount),
            "USDC transfer failed"
        );

        emit JobReleased(
            jobId,
            job.agent,
            job.amount
        );
    }

    function refund(uint256 jobId) external {
        Job storage job = jobs[jobId];

        require(job.client == msg.sender, "Not client");
        require(job.status == Status.Funded, "Not funded");

        job.status = Status.Refunded;

        require(
            usdc.transfer(job.client, job.amount),
            "USDC transfer failed"
        );

        emit JobRefunded(
            jobId,
            job.client,
            job.amount
        );
    }

    function getJob(
        uint256 jobId
    )
        external
        view
        returns (
            address client,
            address agent,
            uint256 amount,
            Status status
        )
    {
        Job memory job = jobs[jobId];

        return (
            job.client,
            job.agent,
            job.amount,
            job.status
        );
    }

    function escrowBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }
}
