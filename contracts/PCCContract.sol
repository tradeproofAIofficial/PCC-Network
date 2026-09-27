// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title PCC Contract — Proof of Counterfactual Contribution v0.1
/// @notice Prototype commitment registry. Sensitive evidence remains off-chain.
contract PCCContract {
    struct Commitment {
        address creator;
        bytes32 preCommitment;
        bytes32 methodologyHash;
        uint64 createdAt;
        bool locked;
        bool settled;
    }

    mapping(bytes32 => Commitment) public commitments;

    event ContractLocked(
        bytes32 indexed contractId,
        address indexed creator,
        bytes32 preCommitment,
        bytes32 methodologyHash
    );

    event ContractSettled(
        bytes32 indexed contractId,
        bytes32 receiptHash
    );

    function lockContract(
        bytes32 contractId,
        bytes32 preCommitment,
        bytes32 methodologyHash
    ) external {
        require(commitments[contractId].createdAt == 0, "contract exists");

        commitments[contractId] = Commitment(
            msg.sender,
            preCommitment,
            methodologyHash,
            uint64(block.timestamp),
            true,
            false
        );

        emit ContractLocked(
            contractId,
            msg.sender,
            preCommitment,
            methodologyHash
        );
    }

    function settle(
        bytes32 contractId,
        bytes32 receiptHash
    ) external {
        Commitment storage c = commitments[contractId];

        require(c.locked, "not locked");
        require(!c.settled, "already settled");
        require(msg.sender == c.creator, "not creator");

        c.settled = true;

        emit ContractSettled(
            contractId,
            receiptHash
        );
    }
}