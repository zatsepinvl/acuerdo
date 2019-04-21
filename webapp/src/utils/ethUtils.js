import * as web3 from "web3";
import {BigNumber} from "bignumber.js";

const weiFactor = 10 ** 18;

const networkIdMapping = {
    1: 'Main Ethereum Netowrk',
    3: 'Ropsten Test Network',
    4: 'Rinkeby Test Network',
    42: 'Kovan Test Network'
};

export const ethToWei = (eth) => {
    return web3.utils.toWei(eth);
};

export const weiToEth = (wei) => {
    return BigNumber(wei).dividedBy(weiFactor)
};

export const getNetName = (netId) => {
    return networkIdMapping[netId] || 'Custom Test Network';
};