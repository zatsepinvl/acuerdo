const {tx, splitSignature} = require('./eth-utils');
const Channels = artifacts.require('Channels');
const channels = new web3.eth.Contract(Channels.abi, Channels.address, {gas: 4700000});

const setFee = (fee, sender) => {
    return tx(channels, 'setFee', [fee], {from: sender});
};

const openChannel = ({channelId, sender, recipient, value, timeout}) => {
    return tx(channels, 'open', [channelId, recipient, timeout], {
        from: sender,
        value: value
    }, ['ChannelOpened']);
};

const getFee = () => {
    return channels.methods.fee().call();
};

const getChannel = (channelId) => {
    return channels.methods.channels(channelId).call();
};

const closeChannelByRecipient = async({channelId, sender, recipient}, closeValue) => {
    const proof = await channels.methods.getPaymentId(channelId, closeValue).call();

    const signature = await web3.eth.sign(proof, sender);
    const senderSign = splitSignature(signature);
    return tx(
        channels, 'close',
        [proof, senderSign.v, senderSign.r, senderSign.s, channelId, closeValue],
        {from: recipient},
        ['ChannelClosed']
    );
};

module.exports = {
    setFee: setFee,
    getFee: getFee,
    getChannel: getChannel,
    openChannel: openChannel,
    closeChannelByRecipient: closeChannelByRecipient
};