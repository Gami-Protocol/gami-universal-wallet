import { expect } from "chai";
import { ethers } from "hardhat";

describe("AirdropClaim", () => {
  async function deploy() {
    const [treasury, alice, bob] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("GamiToken");
    const token = await Token.deploy(treasury.address);
    await token.waitForDeployment();

    const Airdrop = await ethers.getContractFactory("AirdropClaim");
    const airdrop = await Airdrop.deploy(await token.getAddress());
    await airdrop.waitForDeployment();

    // Pre-fund the airdrop so it can pay
    await token
      .connect(treasury)
      .transfer(await airdrop.getAddress(), ethers.parseEther("1000"));

    return { token, airdrop, treasury, alice, bob };
  }

  it("transfers the requested amount and marks the claimer", async () => {
    const { token, airdrop, alice } = await deploy();
    const amount = ethers.parseEther("100");
    await airdrop.connect(alice).claim(amount);

    expect(await token.balanceOf(alice.address)).to.equal(amount);
    expect(await airdrop.claimed(alice.address)).to.equal(true);
  });

  it("rejects a second claim by the same address", async () => {
    const { airdrop, alice } = await deploy();
    await airdrop.connect(alice).claim(ethers.parseEther("10"));
    await expect(
      airdrop.connect(alice).claim(ethers.parseEther("10"))
    ).to.be.revertedWith("Already claimed");
  });

  it("tracks each user independently", async () => {
    const { token, airdrop, alice, bob } = await deploy();
    await airdrop.connect(alice).claim(ethers.parseEther("10"));
    await airdrop.connect(bob).claim(ethers.parseEther("25"));
    expect(await token.balanceOf(alice.address)).to.equal(ethers.parseEther("10"));
    expect(await token.balanceOf(bob.address)).to.equal(ethers.parseEther("25"));
  });

  // Documents an architectural risk with the current contract: claim()
  // accepts an arbitrary amount with no allowlist or signature, so it
  // is only safe when the contract's balance is the cap. Test asserts
  // the current behaviour so future code changes (e.g. adding a
  // per-address allocation) cannot regress silently.
  it("currently has no per-address cap — caller chooses amount up to contract balance", async () => {
    const { token, airdrop, alice } = await deploy();
    const huge = ethers.parseEther("999"); // less than 1000 funded
    await airdrop.connect(alice).claim(huge);
    expect(await token.balanceOf(alice.address)).to.equal(huge);
  });

  it("reverts if the contract is insufficiently funded for the requested amount", async () => {
    const { airdrop, alice } = await deploy();
    // Funded with 1000, ask for 1001
    await expect(
      airdrop.connect(alice).claim(ethers.parseEther("1001"))
    ).to.be.reverted;
  });
});
