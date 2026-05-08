// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract GamiToken is ERC20, ERC20Permit, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 ether;

    constructor(address treasury) ERC20("Gami Protocol", "GAMI") ERC20Permit("Gami Protocol") Ownable(treasury) {
        _mint(treasury, MAX_SUPPLY);
    }
}
