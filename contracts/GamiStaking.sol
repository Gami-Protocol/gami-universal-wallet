// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./GamiToken.sol";

contract GamiStaking {
    GamiToken public token;

    struct Stake {
        uint256 amount;
        uint256 start;
    }

    mapping(address => Stake) public stakes;

    constructor(address tokenAddress) {
        token = GamiToken(tokenAddress);
    }

    function stake(uint256 amount) external {
        require(amount > 0);
        token.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender] = Stake(amount, block.timestamp);
    }

    function unstake() external {
        Stake memory s = stakes[msg.sender];
        require(s.amount > 0);

        uint256 duration = block.timestamp - s.start;
        uint256 reward = (s.amount * duration) / 1 days / 10;

        delete stakes[msg.sender];
        token.transfer(msg.sender, s.amount + reward);
    }
}
