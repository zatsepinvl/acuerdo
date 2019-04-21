const Channels = artifacts.require("./Channels.sol");

const DEFAULT_FEE = 10 ** 15;
module.exports = async (deployer) => {
  await deployer.deploy(Channels, DEFAULT_FEE);
};
