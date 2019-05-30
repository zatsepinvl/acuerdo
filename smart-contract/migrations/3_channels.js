const Channels = artifacts.require("./Channels.sol");
const ChannelsRepository = artifacts.require("./ChannelsRepository.sol");
const EternalStorage = artifacts.require("./EternalStorage.sol");

const DEFAULT_FEE = 10 ** 15;
module.exports = async (deployer) => {
  await deployer.deploy(ChannelsRepository);
  await deployer.link(ChannelsRepository, Channels);
  await deployer.deploy(Channels, DEFAULT_FEE, EternalStorage.address);
  const eternalStorage = await EternalStorage.deployed();
  await eternalStorage.allowContract(Channels.address);
};
