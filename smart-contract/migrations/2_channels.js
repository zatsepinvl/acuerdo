const Channels = artifacts.require("./Channels.sol");

module.exports = async (deployer) => {
  await deployer.deploy(Channels);
};
