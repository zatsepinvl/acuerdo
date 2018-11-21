const HDWalletProvider = require('truffle-hdwallet-provider');

const env = process.env;
require('dotenv').config({path: require("path").resolve(process.cwd(), "truffle.env")});
const testrpcMnemonic = "inmate luxury business before add script battle must arch speak pact ritual";

module.exports = {
    networks: {
        testrpc: {
            provider: () => {
                return new HDWalletProvider(testrpcMnemonic, env.ETH_NODE_URL || "http://localhost:8545");
            },
            network_id: '*'
        }
    }
};
