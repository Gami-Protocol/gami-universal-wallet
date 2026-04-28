// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GamiTieredStaking is Ownable, ReentrancyGuard {
    IERC20 public immutable gami;

    struct Tier {
        uint256 minStake;
        uint256 rewardBps;
        uint256 xpMultiplierBps;
        string name;
    }

    struct Position {
        uint256 amount;
        uint256 rewardDebt;
        uint256 updatedAt;
    }

    mapping(uint8 => Tier) public tiers;
    mapping(address => Position) public positions;

    uint8 public constant BRONZE = 1;
    uint8 public constant SILVER = 2;
    uint8 public constant GOLD = 3;
    uint8 public constant DIAMOND = 4;

    event Staked(address indexed user, uint256 amount, uint8 tier);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(address token, address owner_) Ownable(owner_) {
        gami = IERC20(token);
        tiers[BRONZE] = Tier(1_000 ether, 500, 11000, "Bronze");
        tiers[SILVER] = Tier(10_000 ether, 800, 12500, "Silver");
        tiers[GOLD] = Tier(50_000 ether, 1200, 15000, "Gold");
        tiers[DIAMOND] = Tier(250_000 ether, 1800, 20000, "Diamond");
    }

    function currentTier(address user) public view returns (uint8) {
        uint256 amount = positions[user].amount;
        if (amount >= tiers[DIAMOND].minStake) return DIAMOND;
        if (amount >= tiers[GOLD].minStake) return GOLD;
        if (amount >= tiers[SILVER].minStake) return SILVER;
        if (amount >= tiers[BRONZE].minStake) return BRONZE;
        return 0;
    }

    function pendingRewards(address user) public view returns (uint256) {
        Position memory p = positions[user];
        if (p.amount == 0) return 0;
        uint8 tier = currentTier(user);
        uint256 elapsed = block.timestamp - p.updatedAt;
        uint256 yearlyReward = (p.amount * tiers[tier].rewardBps) / 10_000;
        return p.rewardDebt + ((yearlyReward * elapsed) / 365 days);
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "amount=0");
        positions[msg.sender].rewardDebt = pendingRewards(msg.sender);
        positions[msg.sender].amount += amount;
        positions[msg.sender].updatedAt = block.timestamp;
        require(gami.transferFrom(msg.sender, address(this), amount), "transfer failed");
        emit Staked(msg.sender, amount, currentTier(msg.sender));
    }

    function claimRewards() public nonReentrant {
        uint256 reward = pendingRewards(msg.sender);
        require(reward > 0, "no reward");
        positions[msg.sender].rewardDebt = 0;
        positions[msg.sender].updatedAt = block.timestamp;
        require(gami.transfer(msg.sender, reward), "reward transfer failed");
        emit RewardClaimed(msg.sender, reward);
    }

    function unstake(uint256 amount) external nonReentrant {
        Position storage p = positions[msg.sender];
        require(amount > 0 && amount <= p.amount, "bad amount");
        p.rewardDebt = pendingRewards(msg.sender);
        p.amount -= amount;
        p.updatedAt = block.timestamp;
        require(gami.transfer(msg.sender, amount), "transfer failed");
        emit Unstaked(msg.sender, amount);
    }

    function setTier(uint8 id, uint256 minStake, uint256 rewardBps, uint256 xpMultiplierBps, string calldata name) external onlyOwner {
        require(rewardBps <= 3000, "reward too high");
        tiers[id] = Tier(minStake, rewardBps, xpMultiplierBps, name);
    }
}
