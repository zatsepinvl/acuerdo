const networkIdMapping = {
    1: 'Main Ethereum Netowrk',
    3: 'Ropsten Test Network',
    4: 'Rinkeby Test Network',
    42: 'Kovan Test Network'
};

export const getNetName = (netId) => {
    return networkIdMapping[netId] || 'Custom Test Network';
};