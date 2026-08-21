// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ArcInvoice {
    address public owner;
    uint256 public invoiceCount;

    enum Status {
        Pending,
        Paid,
        Cancelled
    }

    struct Invoice {
        uint256 id;
        address payable recipient;
        string description;
        uint256 amount;
        Status status;
        uint256 createdAt;
        uint256 paidAt;
    }

    mapping(uint256 => Invoice) public invoices;

    event InvoiceCreated(
        uint256 indexed invoiceId,
        address indexed recipient,
        uint256 amount,
        string description
    );

    event InvoicePaid(
        uint256 indexed invoiceId,
        address indexed payer,
        uint256 amount
    );

    event InvoiceCancelled(
        uint256 indexed invoiceId
    );

    constructor() {
        owner = msg.sender;
    }

    function createInvoice(
        address payable _recipient,
        string memory _description,
        uint256 _amount
    ) external returns (uint256) {
        require(_recipient != address(0), "Invalid recipient");
        require(_amount > 0, "Amount must be greater than zero");

        invoiceCount++;

        invoices[invoiceCount] = Invoice({
            id: invoiceCount,
            recipient: _recipient,
            description: _description,
            amount: _amount,
            status: Status.Pending,
            createdAt: block.timestamp,
            paidAt: 0
        });

        emit InvoiceCreated(
            invoiceCount,
            _recipient,
            _amount,
            _description
        );

        return invoiceCount;
    }

    function payInvoice(uint256 _invoiceId) external payable {
        Invoice storage invoice = invoices[_invoiceId];

        require(invoice.id != 0, "Invoice does not exist");
        require(
            invoice.status == Status.Pending,
            "Invoice is not pending"
        );
        require(msg.value == invoice.amount, "Incorrect payment amount");

        invoice.status = Status.Paid;
        invoice.paidAt = block.timestamp;

        invoice.recipient.transfer(msg.value);

        emit InvoicePaid(
            _invoiceId,
            msg.sender,
            msg.value
        );
    }

    function cancelInvoice(uint256 _invoiceId) external {
        require(msg.sender == owner, "Only owner can cancel");

        Invoice storage invoice = invoices[_invoiceId];

        require(invoice.id != 0, "Invoice does not exist");
        require(
            invoice.status == Status.Pending,
            "Invoice cannot be cancelled"
        );

        invoice.status = Status.Cancelled;

        emit InvoiceCancelled(_invoiceId);
    }

    function getInvoice(
        uint256 _invoiceId
    ) external view returns (Invoice memory) {
        require(
            invoices[_invoiceId].id != 0,
            "Invoice does not exist"
        );

        return invoices[_invoiceId];
    }
}
