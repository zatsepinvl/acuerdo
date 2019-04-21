const {tx, splitSignature} = require('./eth-utils');
const Channels = artifacts.require('Channels');
const channels = new web3.eth.Contract(Channels.abi, Channels.address, {gas: 4700000});
const {nowSeconds} = require('./utils');
const BigNumber = require('bignumber.js');

const DEFAULT_VALUE = new BigNumber(10 ** 18);

const newDefaultChannel = (accounts, {dueDate, value} = {}) => {
    return {
        channelId: web3.utils.randomHex(32),
        sender: accounts[0],
        recipient: accounts[1],
        value: value || DEFAULT_VALUE,
        dueDate: dueDate || nowSeconds() + 3600 //in 1 hour
    };
};

const setFee = (fee, sender) => {
    return tx(channels, 'setFee', [fee], {from: sender});
};

const openChannel = async (/*channel*/{channelId, sender, recipient, value, dueDate},
                           /*options*/{includeFee} = {}) => {
    let actualValue = value;
    if (includeFee) {
        const fee = new BigNumber(await getFee());
        actualValue = fee.plus(value);
    }
    return tx(channels, 'open', [channelId, recipient, dueDate], {
        from: sender,
        value: actualValue
    }, ['ChannelOpened']);
};

const getFee = () => {
    return channels.methods.fee().call();
};

const getChannel = (channelId) => {
    return channels.methods.channels(channelId).call();
};

const closeChannelByRecipient = async ({channelId, sender, recipient}, closeValue) => {
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

const cancelChannel = ({channelId, sender}) => {
    return tx(
        channels, 'cancel',
        [channelId],
        {from: sender},
        ['ChannelCanceled']
    )
};

module.exports = {
    defaults: {
        DEFAULT_AMOUNT: DEFAULT_VALUE,
    },
    newDefaultChannel: newDefaultChannel,
    setFee: setFee,
    getFee: getFee,
    getChannel: getChannel,
    openChannel: openChannel,
    closeChannelByRecipient: closeChannelByRecipient,
    cancelChannel: cancelChannel
};