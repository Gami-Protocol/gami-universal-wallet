import { expect } from "chai";
import { ethers } from "hardhat";

// ---- Minimal sorted-pair Merkle tree ----
// Matches @openzeppelin/contracts MerkleProof.verify behaviour: parent =
// keccak256(min(a,b) || max(a,b)). Leaves are computed by the caller.
function hashPair(a: string, b: string): string {
  const [lo, hi] = a < b ? [a, b] : [b, a];
  return ethers.keccak256(ethers.concat([lo, hi]));
}

function buildTree(leaves: string[]): { root: string; layers: string[][] } {
  if (leaves.length === 0) throw new Error("empty");
  const layers: string[][] = [leaves.slice()];
  while (layers[layers.length - 1].length > 1) {
    const cur = layers[layers.length - 1];
    const next: string[] = [];
    for (let i = 0; i < cur.length; i += 2) {
      next.push(i + 1 < cur.length ? hashPair(cur[i], cur[i + 1]) : cur[i]);
    }
    layers.push(next);
  }
  return { root: layers[layers.length - 1][0], layers };
}

function getProof(layers: string[][], leafIndex: number): string[] {
  const proof: string[] = [];
  let idx = leafIndex;
  for (let i = 0; i < layers.length - 1; i++) {
    const layer = layers[i];
    const sibling = idx % 2 === 0 ? idx + 1 : idx - 1;
    if (sibling < layer.length) proof.push(layer[sibling]);
    idx = Math.floor(idx / 2);
  }
  return proof;
}

function leafFor(addr: string, amount: bigint): string {
  return ethers.keccak256(
    ethers.solidityPacked(["address", "uint256"], [addr, amount])
  );
}

describe("MerkleAirdrop", () => {
  async function deploy() {
    const [treasury, alice, bob, carol, attacker] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("GamiToken");
    const token = await Token.deploy(treasury.address);
    await token.waitForDeployment();

    const allocations: Array<[string, bigint]> = [
      [alice.address, ethers.parseEther("100")],
      [bob.address, ethers.parseEther("250")],
      [carol.address, ethers.parseEther("50")],
    ];
    const leaves = allocations.map(([a, amt]) => leafFor(a, amt));
    const { root, layers } = buildTree(leaves);

    const Airdrop = await ethers.getContractFactory("MerkleAirdrop");
    const airdrop = await Airdrop.deploy(await token.getAddress(), root);
    await airdrop.waitForDeployment();

    await token
      .connect(treasury)
      .transfer(await airdrop.getAddress(), ethers.parseEther("1000"));

    return { token, airdrop, allocations, layers, alice, bob, carol, attacker };
  }

  it("stores the merkle root passed at construction", async () => {
    const { airdrop, layers } = await deploy();
    expect(await airdrop.merkleRoot()).to.equal(layers[layers.length - 1][0]);
  });

  it("lets an eligible user claim with a valid proof", async () => {
    const { token, airdrop, allocations, layers, alice } = await deploy();
    const proof = getProof(layers, 0);
    const [, amount] = allocations[0];

    await expect(airdrop.connect(alice).claim(amount, proof))
      .to.emit(airdrop, "Claimed")
      .withArgs(alice.address, amount);
    expect(await token.balanceOf(alice.address)).to.equal(amount);
    expect(await airdrop.claimed(alice.address)).to.equal(true);
  });

  it("rejects a second claim from the same address", async () => {
    const { airdrop, allocations, layers, alice } = await deploy();
    const proof = getProof(layers, 0);
    const [, amount] = allocations[0];
    await airdrop.connect(alice).claim(amount, proof);
    await expect(
      airdrop.connect(alice).claim(amount, proof)
    ).to.be.revertedWith("already claimed");
  });

  it("rejects a claim with the wrong amount even from an eligible user", async () => {
    const { airdrop, layers, alice } = await deploy();
    const proof = getProof(layers, 0);
    await expect(
      airdrop.connect(alice).claim(ethers.parseEther("101"), proof)
    ).to.be.revertedWith("invalid proof");
  });

  it("rejects a claim from an address not in the tree", async () => {
    const { airdrop, allocations, layers, attacker } = await deploy();
    // Attacker tries to use Alice's proof and amount
    const proof = getProof(layers, 0);
    const [, aliceAmount] = allocations[0];
    await expect(
      airdrop.connect(attacker).claim(aliceAmount, proof)
    ).to.be.revertedWith("invalid proof");
  });

  it("rejects an empty proof", async () => {
    const { airdrop, allocations, alice } = await deploy();
    const [, amount] = allocations[0];
    await expect(airdrop.connect(alice).claim(amount, [])).to.be.revertedWith(
      "invalid proof"
    );
  });

  it("rejects a claim using another user's proof", async () => {
    const { airdrop, allocations, layers, alice } = await deploy();
    // Alice tries to use Bob's (index 1) proof + amount
    const bobProof = getProof(layers, 1);
    const [, bobAmount] = allocations[1];
    await expect(
      airdrop.connect(alice).claim(bobAmount, bobProof)
    ).to.be.revertedWith("invalid proof");
  });

  it("allows independent claims for each eligible user", async () => {
    const { token, airdrop, allocations, layers, alice, bob, carol } =
      await deploy();
    const accounts = [alice, bob, carol];
    for (let i = 0; i < accounts.length; i++) {
      const proof = getProof(layers, i);
      const [, amount] = allocations[i];
      await airdrop.connect(accounts[i]).claim(amount, proof);
      expect(await token.balanceOf(accounts[i].address)).to.equal(amount);
    }
  });
});
