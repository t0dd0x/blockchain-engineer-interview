const { config: dotenvConfig } = require("dotenv");
const { resolve } = require("path");

require("@nomicfoundation/hardhat-toolbox");

const dotenvConfigPath = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

const mnemonic = process.env.MNEMONIC || "";
const privateKeys = process.env.PRIVATE_KEYS ? process.env.PRIVATE_KEYS.split(',') : []
if (!mnemonic && !privateKeys.length) {
  throw new Error("Please set your MNEMONIC or PRIVATE_KEYS in a .env file");
}


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    
  },

  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};
