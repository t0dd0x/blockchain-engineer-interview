const { ethers } = require("hardhat");

async function main() {
    const accounts = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("PostCovidStrokePrevention");
    const tokenContract = await TokenFactory.deploy();

    console.log("Token deployed to:", await tokenContract.getAddress());

    const NftFactory = await ethers.getContractFactory("GeneNFT");
    const nftContract = await NftFactory.deploy()

    console.log("NFT deployed to:", await nftContract.getAddress());

    const ControllerFactory = await ethers.getContractFactory("Controller");
    const controllerContract = await ControllerFactory.deploy(await nftContract.getAddress(), await tokenContract.getAddress());

    await tokenContract.transferOwnership(await controllerContract.getAddress())
    await nftContract.transferOwnership(await controllerContract.getAddress())

    console.log("Controller deployed to:", await controllerContract.getAddress());
}

main();