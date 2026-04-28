// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleAirdrop {
    IERC20 public immutable token;
    bytes32 public immutable merkleRoot;
    mapping(address => bool) public claimed;

    event Claimed(address indexed user, uint256 amount);

    constructor(address token_, bytes32 root_) {
        token = IERC20(token_);
        merkleRoot = root_;
    }

    function claim(uint256 amount, bytes32[] calldata proof) external {
        require(!claimed[msg.sender], "already claimed");
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "invalid proof");
        claimed[msg.sender] = true;
        require(token.transfer(msg.sender, amount), "transfer failed");
        emit Claimed(msg.sender, amount);
    }
}
