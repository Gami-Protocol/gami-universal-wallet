import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("GamiStaking", () => {
  async function deploy() {
    const [treasury, alice, bob] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("GamiToken");
    const token = await Token.deploy(treasury.address);
    await token.waitForDeployment();

    const Staking = await ethers.getContractFactory("GamiStaking");
    const staking = await Staking.deploy(await token.getAddress());
    await staking.waitForDeployment();

    // Fund users and the staking contract reward pool
    const fund = ethers.parseEther("10000");
    await token.connect(treasury).transfer(alice.address, fund);
    await token.connect(treasury).transfer(bob.address, fund);
    // Pre-fund the contract so unstake can pay rewards
    await token.connect(treasury).transfer(await staking.getAddress(), fund);

    return { token, staking, treasury, alice, bob };
  }

  it("records a stake and pulls tokens from the user", async () => {
    const { token, staking, alice } = await deploy();
    const amount = ethers.parseEther("100");
    await token.connect(alice).approve(await staking.getAddress(), amount);
    await staking.connect(alice).stake(amount);

    const stake = await staking.stakes(alice.address);
    expect(stake.amount).to.equal(amount);
    expect(stake.start).to.be.gt(0);
    expect(await token.balanceOf(alice.address)).to.equal(
      ethers.parseEther("9900")
    );
  });

  it("rejects a zero-amount stake", async () => {
    const { staking, alice } = await deploy();
    await expect(staking.connect(alice).stake(0)).to.be.reverted;
  });

  it("returns principal plus a linear-time reward on unstake", async () => {
    const { token, staking, alice } = await deploy();
    const amount = ethers.parseEther("100");
    await token.connect(alice).approve(await staking.getAddress(), amount);

    // Pin the stake timestamp so duration is exactly 10 days at unstake.
    const stakeTx = await staking.connect(alice).stake(amount);
    const stakeBlock = (await ethers.provider.getBlock(
      (await stakeTx.wait())!.blockNumber
    ))!;
    const startBalance = await token.balanceOf(alice.address);

    // Reward formula in the contract: amount * duration / 1 days / 10
    // With duration = 10 days: 100 GAMI * 10 days / 1 day / 10 = 100 GAMI.
    // i.e. the contract pays a 10%/day linear reward, so after 10 days the
    // reward equals the principal.
    const TEN_DAYS = 10 * 24 * 60 * 60;
    await time.setNextBlockTimestamp(stakeBlock.timestamp + TEN_DAYS);
    await staking.connect(alice).unstake();

    const expectedReward = ethers.parseEther("100");
    const endBalance = await token.balanceOf(alice.address);
    expect(endBalance - startBalance).to.equal(amount + expectedReward);

    // Position is cleared
    const stake = await staking.stakes(alice.address);
    expect(stake.amount).to.equal(0);
  });

  it("reverts unstake when user has no position", async () => {
    const { staking, bob } = await deploy();
    await expect(staking.connect(bob).unstake()).to.be.reverted;
  });

  it("does not let a user unstake twice", async () => {
    const { token, staking, alice } = await deploy();
    const amount = ethers.parseEther("50");
    await token.connect(alice).approve(await staking.getAddress(), amount);
    await staking.connect(alice).stake(amount);
    await time.increase(86400);
    await staking.connect(alice).unstake();
    await expect(staking.connect(alice).unstake()).to.be.reverted;
  });

  it("isolates stakes per user", async () => {
    const { token, staking, alice, bob } = await deploy();
    const a = ethers.parseEther("10");
    const b = ethers.parseEther("25");
    await token.connect(alice).approve(await staking.getAddress(), a);
    await token.connect(bob).approve(await staking.getAddress(), b);
    await staking.connect(alice).stake(a);
    await staking.connect(bob).stake(b);

    expect((await staking.stakes(alice.address)).amount).to.equal(a);
    expect((await staking.stakes(bob.address)).amount).to.equal(b);
  });

  // Documents a known-but-unprotected behaviour: calling stake twice
  // overwrites the previous position, dropping the old start timestamp
  // and silently forfeiting accrued rewards. Should be addressed in the
  // contract, but tests should assert the current behaviour so changes
  // are noticed.
  it("overwrites the previous position when stake() is called twice (current behaviour)", async () => {
    const { token, staking, alice } = await deploy();
    const first = ethers.parseEther("10");
    const second = ethers.parseEther("20");
    await token.connect(alice).approve(await staking.getAddress(), first + second);

    await staking.connect(alice).stake(first);
    await time.increase(5 * 24 * 60 * 60);
    await staking.connect(alice).stake(second);

    const stake = await staking.stakes(alice.address);
    // Bug-as-test: amount is replaced, not added, and start is reset.
    expect(stake.amount).to.equal(second);
  });
});
