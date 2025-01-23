require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");

const { alchemyApiKey, privateKey } = require('./secrets.json');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    matic: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
      accounts: [privateKey]
    }
  }
};