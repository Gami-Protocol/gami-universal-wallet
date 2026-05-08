import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const BRONZE = 1n;
const SILVER = 2n;
const GOLD = 3n;
const DIAMOND = 4n;

describe("GamiTieredStaking", () => {
  async function deploy() {
    const [treasury, owner, alice, bob, attacker] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("GamiToken");
    const token = await Token.deploy(treasury.address);
    await token.waitForDeployment();

    const Tiered = await ethers.getContractFactory("GamiTieredStaking");
    const tiered = await Tiered.deploy(await token.getAddress(), owner.address);
    await tiered.waitForDeployment();

    // Generously fund users and the contract reward pool
    const userFund = ethers.parseEther("1000000");
    await token.connect(treasury).transfer(alice.address, userFund);
    await token.connect(treasury).transfer(bob.address, userFund);
    await token.connect(treasury).transfer(attacker.address, userFund);
    await token
      .connect(treasury)
      .transfer(await tiered.getAddress(), ethers.parseEther("10000000"));

    return { token, tiered, treasury, owner, alice, bob, attacker };
  }

  describe("tier resolution", () => {
    it("returns 0 when the user has no position", async () => {
      const { tiered, alice } = await deploy();
      expect(await tiered.currentTier(alice.address)).to.equal(0n);
    });

    it("maps stake amounts to the correct tier at boundaries", async () => {
      const { token, tiered, alice } = await deploy();
      const target = await tiered.getAddress();

      // Stake exactly the BRONZE minimum -> BRONZE
      await token.connect(alice).approve(target, ethers.parseEther("1000"));
      await tiered.connect(alice).stake(ethers.parseEther("1000"));
      expect(await tiered.currentTier(alice.address)).to.equal(BRONZE);

      // Bring up to SILVER boundary (10_000)
      await token.connect(alice).approve(target, ethers.parseEther("9000"));
      await tiered.connect(alice).stake(ethers.parseEther("9000"));
      expect(await tiered.currentTier(alice.address)).to.equal(SILVER);

      // Bring up to GOLD boundary (50_000)
      await token.connect(alice).approve(target, ethers.parseEther("40000"));
      await tiered.connect(alice).stake(ethers.parseEther("40000"));
      expect(await tiered.currentTier(alice.address)).to.equal(GOLD);

      // Bring up to DIAMOND boundary (250_000)
      await token.connect(alice).approve(target, ethers.parseEther("200000"));
      await tiered.connect(alice).stake(ethers.parseEther("200000"));
      expect(await tiered.currentTier(alice.address)).to.equal(DIAMOND);
    });

    it("returns 0 when the user is one wei below BRONZE", async () => {
      const { token, tiered, alice } = await deploy();
      const justUnder = ethers.parseEther("1000") - 1n;
      await token.connect(alice).approve(await tiered.getAddress(), justUnder);
      await tiered.connect(alice).stake(justUnder);
      expect(await tiered.currentTier(alice.address)).to.equal(0n);
    });
  });

  describe("stake / unstake", () => {
    it("rejects a zero-amount stake", async () => {
      const { tiered, alice } = await deploy();
      await expect(tiered.connect(alice).stake(0)).to.be.revertedWith("amount=0");
    });

    it("emits Staked with the post-stake tier", async () => {
      const { token, tiered, alice } = await deploy();
      const amount = ethers.parseEther("10000");
      await token.connect(alice).approve(await tiered.getAddress(), amount);
      await expect(tiered.connect(alice).stake(amount))
        .to.emit(tiered, "Staked")
        .withArgs(alice.address, amount, SILVER);
    });

    it("rejects unstake of zero or more than position", async () => {
      const { token, tiered, alice } = await deploy();
      const amount = ethers.parseEther("1000");
      await token.connect(alice).approve(await tiered.getAddress(), amount);
      await tiered.connect(alice).stake(amount);

      await expect(tiered.connect(alice).unstake(0)).to.be.revertedWith("bad amount");
      await expect(
        tiered.connect(alice).unstake(amount + 1n)
      ).to.be.revertedWith("bad amount");
    });

    it("returns principal on unstake and clears the position to zero", async () => {
      const { token, tiered, alice } = await deploy();
      const amount = ethers.parseEther("1000");
      const target = await tiered.getAddress();

      await token.connect(alice).approve(target, amount);
      await tiered.connect(alice).stake(amount);
      const before = await token.balanceOf(alice.address);

      await tiered.connect(alice).unstake(amount);
      const after = await token.balanceOf(alice.address);

      expect(after - before).to.equal(amount);
      expect((await tiered.positions(alice.address)).amount).to.equal(0);
    });
  });

  describe("rewards", () => {
    it("accrues rewards proportional to elapsed time and tier APR", async () => {
      const { token, tiered, alice } = await deploy();
      // Silver tier: 10_000 GAMI at 800 bps yearly -> 800 GAMI/year
      const amount = ethers.parseEther("10000");
      await token.connect(alice).approve(await tiered.getAddress(), amount);
      await tiered.connect(alice).stake(amount);

      // Advance 365 days exactly
      await time.increase(365 * 24 * 60 * 60);

      const expectedYearly = (amount * 800n) / 10_000n; // 800 GAMI
      const pending = await tiered.pendingRewards(alice.address);

      // pendingRewards uses block.timestamp at view time; allow ~1s of drift
      const drift = expectedYearly / 365n / 24n / 3600n + 1n;
      expect(pending).to.be.closeTo(expectedYearly, drift);
    });

    it("returns zero pending rewards before any time elapses", async () => {
      const { token, tiered, alice } = await deploy();
      const amount = ethers.parseEther("1000");
      await token.connect(alice).approve(await tiered.getAddress(), amount);
      await tiered.connect(alice).stake(amount);
      // Right after staking, no measurable time has passed
      expect(await tiered.pendingRewards(alice.address)).to.be.lt(
        ethers.parseEther("0.001")
      );
    });

    it("reverts claimRewards when nothing is pending", async () => {
      const { tiered, alice } = await deploy();
      await expect(tiered.connect(alice).claimRewards()).to.be.revertedWith(
        "no reward"
      );
    });

    it("pays out and resets accrual on claimRewards", async () => {
      const { token, tiered, alice } = await deploy();
      const amount = ethers.parseEther("10000");
      await token.connect(alice).approve(await tiered.getAddress(), amount);
      await tiered.connect(alice).stake(amount);

      await time.increase(30 * 24 * 60 * 60);
      const before = await token.balanceOf(alice.address);
      await tiered.connect(alice).claimRewards();
      const after = await token.balanceOf(alice.address);

      expect(after).to.be.gt(before);
      // Immediately after claim, pending should be ~0 again
      expect(await tiered.pendingRewards(alice.address)).to.be.lt(
        ethers.parseEther("0.001")
      );
    });
  });

  describe("admin", () => {
    it("only owner can call setTier", async () => {
      const { tiered, attacker } = await deploy();
      await expect(
        tiered
          .connect(attacker)
          .setTier(BRONZE, ethers.parseEther("500"), 100, 10500, "Pleb")
      ).to.be.revertedWithCustomError(tiered, "OwnableUnauthorizedAccount");
    });

    it("rejects rewardBps above 3000 even from the owner", async () => {
      const { tiered, owner } = await deploy();
      await expect(
        tiered
          .connect(owner)
          .setTier(BRONZE, ethers.parseEther("1000"), 3001, 11000, "Bronze")
      ).to.be.revertedWith("reward too high");
    });

    it("allows the owner to update a tier within bounds", async () => {
      const { tiered, owner } = await deploy();
      await tiered
        .connect(owner)
        .setTier(BRONZE, ethers.parseEther("2000"), 600, 12000, "Bronze+");
      const t = await tiered.tiers(BRONZE);
      expect(t.minStake).to.equal(ethers.parseEther("2000"));
      expect(t.rewardBps).to.equal(600n);
      expect(t.xpMultiplierBps).to.equal(12000n);
      expect(t.name).to.equal("Bronze+");
    });
  });
});
