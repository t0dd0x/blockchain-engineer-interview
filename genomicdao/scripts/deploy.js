const { ethers } = require("hardhat");

async function main() {
    const accounts = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("PostCovidStrokePrevention");
    const tokenContract = await TokenFactory.deploy();
    await tokenContract.waitForDeployment();

    console.log("Token deployed to:", await tokenContract.getAddress());

    const NftFactory = await ethers.getContractFactory("GeneNFT");
    const nftContract = await NftFactory.deploy()
    await nftContract.waitForDeployment();

    console.log("NFT deployed to:", await nftContract.getAddress());

    const ControllerFactory = await ethers.getContractFactory("Controller");
    const controllerContract = await ControllerFactory.deploy(await nftContract.getAddress(), await tokenContract.getAddress());
    await controllerContract.waitForDeployment();

    const controllerAddress = await controllerContract.getAddress();

    let tx1 = await tokenContract.transferOwnership(controllerAddress)
    await tx1.wait();

    let tx2 = await nftContract.transferOwnership(controllerAddress)
    await tx2.wait();

    console.log("Controller deployed to:", controllerAddress);
}

main();