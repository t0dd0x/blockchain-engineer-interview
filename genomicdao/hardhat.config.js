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
    life_local: {
      url: "http://127.0.0.1:9650/ext/bc/LIFENetwork/rpc",
      accounts: ['56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027'],
      chainId: 9999
    }
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
