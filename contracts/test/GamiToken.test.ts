import { expect } from "chai";
import { ethers } from "hardhat";

describe("GamiToken", () => {
  const MAX_SUPPLY = ethers.parseEther("1000000000");

  async function deploy() {
    const [deployer, treasury, alice, bob] = await ethers.getSigners();
    const GamiToken = await ethers.getContractFactory("GamiToken");
    const token = await GamiToken.deploy(treasury.address);
    await token.waitForDeployment();
    return { token, deployer, treasury, alice, bob };
  }

  it("mints the full supply to the treasury at deployment", async () => {
    const { token, treasury } = await deploy();
    expect(await token.totalSupply()).to.equal(MAX_SUPPLY);
    expect(await token.balanceOf(treasury.address)).to.equal(MAX_SUPPLY);
    expect(await token.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
  });

  it("sets ERC20 metadata correctly", async () => {
    const { token } = await deploy();
    expect(await token.name()).to.equal("Gami Protocol");
    expect(await token.symbol()).to.equal("GAMI");
    expect(await token.decimals()).to.equal(18);
  });

  it("makes the treasury the owner", async () => {
    const { token, treasury } = await deploy();
    expect(await token.owner()).to.equal(treasury.address);
  });

  it("supports ERC20 transfers between accounts", async () => {
    const { token, treasury, alice } = await deploy();
    const amount = ethers.parseEther("100");
    await token.connect(treasury).transfer(alice.address, amount);
    expect(await token.balanceOf(alice.address)).to.equal(amount);
  });

  it("reverts transfers that exceed the sender balance", async () => {
    const { token, alice, bob } = await deploy();
    await expect(
      token.connect(alice).transfer(bob.address, ethers.parseEther("1"))
    ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
  });

  it("supports ERC20Permit (EIP-2612) signed approvals", async () => {
    const { token, treasury, alice, bob } = await deploy();
    // Treasury owns the supply, so it signs the permit
    const value = ethers.parseEther("10");
    // Earlier tests in the suite advance hardhat's block time, so wall-clock
    // Date.now() can be in the past relative to the chain. Use the latest
    // block's timestamp + 1h as the deadline.
    const latest = (await ethers.provider.getBlock("latest"))!;
    const deadline = latest.timestamp + 3600;
    const nonce = await token.nonces(treasury.address);
    const network = await ethers.provider.getNetwork();
    const domain = {
      name: "Gami Protocol",
      version: "1",
      chainId: network.chainId,
      verifyingContract: await token.getAddress(),
    };
    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };
    const message = {
      owner: treasury.address,
      spender: alice.address,
      value,
      nonce,
      deadline,
    };
    const signature = await treasury.signTypedData(domain, types, message);
    const { v, r, s } = ethers.Signature.from(signature);

    await token.permit(treasury.address, alice.address, value, deadline, v, r, s);
    expect(await token.allowance(treasury.address, alice.address)).to.equal(value);

    // Alice can now transferFrom on behalf of treasury
    await token.connect(alice).transferFrom(treasury.address, bob.address, value);
    expect(await token.balanceOf(bob.address)).to.equal(value);
  });
});
