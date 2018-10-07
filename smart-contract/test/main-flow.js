const {tx, splitSignature} = require('./eth-utils');
const Channels = artifacts.require('Channels');
const channels = new web3.eth.Contract(Channels.abi, Channels.address, {gas: 4700000});

contract('Channels', (accounts) => {
    const channel = {
        channelId: web3.utils.randomHex(32),
        sender: accounts[0],
        recepient: accounts[1],
        value: 10 ** 18,
        timeout: 100,
        data: '123456789'//JSON.stringify({name: 'Some name'})
    };
    describe('Main Payment Channel Flow', () => {
        it('Open channel', async () => {
            const {channelId, sender, recepient, timeout, value, data} = channel;
            const openTxResult = await tx(channels, 'open', [channelId, recepient, timeout, data], {
                from: sender,
                value: value
            }, ['ChannelOpened']);
            console.log(openTxResult.events.ChannelOpened);
            assert.equal(openTxResult.events.ChannelOpened.channelId, channelId, 'Channed Id from event doesnt match');


            const closeValue = value / 2;
            const proof = web3.utils.soliditySha3(channelId, closeValue);

            const signature = await web3.eth.sign(proof, sender);
            const senderSign = splitSignature(signature);
            const senderCloseTxResult = await tx(
                channels, 'close',
                [proof, senderSign.v, senderSign.r, senderSign.s, channelId, closeValue],
                {from: sender}
            );

            const signature1 = await web3.eth.sign(proof, recepient);
            const recipientSign = splitSignature(signature1);
            const recipientCloseTxResult = await tx(
                channels, 'close',
                [proof, recipientSign.v, recipientSign.r, recipientSign.s, channelId, closeValue],
                {from: recepient},
                ['ChannelClosed']
            );
            console.log(recipientCloseTxResult.events.ChannelClosed);
        })
    })
});
