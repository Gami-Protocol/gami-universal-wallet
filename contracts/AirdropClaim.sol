// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./GamiToken.sol";

contract AirdropClaim {
    GamiToken public token;
    mapping(address => bool) public claimed;

    constructor(address tokenAddress) {
        token = GamiToken(tokenAddress);
    }

    function claim(uint256 amount) external {
        require(!claimed[msg.sender], "Already claimed");
        claimed[msg.sender] = true;
        token.transfer(msg.sender, amount);
    }
}
