const EternalStorage = artifacts.require("./EternalStorage.sol");

module.exports = async (deployer) => {
  await deployer.deploy(EternalStorage);
};
