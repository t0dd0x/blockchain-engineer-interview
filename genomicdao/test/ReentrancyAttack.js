const {
  time,
  loadFixture
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { expect } = require("chai");

describe("ReentrancyAttack", function () {
  async function deployControllerFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const nft1 = await ethers.deployContract("GeneNFT");
    const pcspToken1 = await ethers.deployContract("PostCovidStrokePrevention");
    const controller = await ethers.deployContract("Controller", [nft1.target, pcspToken1.target]);
    await nft1.transferOwnership(controller.target)
    await pcspToken1.transferOwnership(controller.target)
    const attacker1 = await ethers.deployContract("MockAttacker", [controller.target]);

    const nft2 = await ethers.deployContract("GeneNFT");
    const pcspToken2 = await ethers.deployContract("PostCovidStrokePrevention");
    const exploitedController = await ethers.deployContract("MockExploitedController", [nft2.target, pcspToken2.target]);
    await nft2.transferOwnership(exploitedController.target)
    await pcspToken2.transferOwnership(exploitedController.target)
    const attacker2 = await ethers.deployContract("MockAttacker", [exploitedController.target]);

    return { owner, addr1, controller, nft1, pcspToken1, exploitedController, nft2, pcspToken2, attacker1, attacker2 }
  }

  describe("Attack", function () {
    it("Should be failed", async function () {
      const { attacker1, addr1 } = await loadFixture(deployControllerFixture);

      const docId = "doc1"
      const contentHash = "dochash"
      const proof = "success"
      const riskScore = 1

      await expect(attacker1.connect(addr1).attack(docId, contentHash, proof, riskScore))
        .to.be.reverted
    })

    it("Should be succeed", async function () {
      const { attacker2, addr1, exploitedController, nft2, pcspToken2 } = await loadFixture(deployControllerFixture);

      const docId = "doc1"
      const contentHash = "dochash"
      const proof = "success"
      const riskScore = 1

      const awardAmount = BigInt("15000") * BigInt("10") ** BigInt("18")

      await expect(attacker2.connect(addr1).attack(docId, contentHash, proof, riskScore))
        .not.to.be.reverted

      expect(await nft2.balanceOf(attacker2)).to.equal(2);
      expect(await pcspToken2.balanceOf(attacker2)).to.equal(awardAmount * BigInt(2));
    })
  })
})