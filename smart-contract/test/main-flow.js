const BigNumber = require('bignumber.js');

const channels = require('./channels.js');
const {ethBalance} = require('./eth-utils.js');
const {assertBigNumbers} = require('./assert-utils.js');


contract('Channels', (accounts) => {
    const fee = new BigNumber(10 ** 10);
    const channelAmount = new BigNumber(10 ** 18);
    const channel = {
        channelId: web3.utils.randomHex(32), sender: accounts[0],
        recipient: accounts[1], value: channelAmount.plus(fee), timeout: 100
    };

    describe('Main Payment Channel Flow', () => {
        it('setFee', async () => {
            await channels.setFee(fee.toFixed(), accounts[0]); //accounts[0] - default owner
            const actualFee = await channels.getFee();
            assert.equal(actualFee, fee, "Fee must be changed");
        });

        it('Open channel', async () => {
            const senderBalance = await ethBalance(channel.sender);
            const tx = await channels.openChannel(channel);
            const actualSenderBalance = await ethBalance(channel.sender);

            console.log(senderBalance);
            assert.equal(
                tx.events.ChannelOpened.channelId, channel.channelId,
                'ChannelId from event doesnt match'
            );
            assertBigNumbers(
                actualSenderBalance, senderBalance.minus(channel.value).minus(tx.ethUsed),
                'Sender balance must be changed by channel value and tx eth used'
            );
        });

        it('Close channel', async () => {
            const closeValue = channelAmount.dividedToIntegerBy(2);

            const senderBalance = await ethBalance(channel.sender);
            const recipientBalance = await ethBalance(channel.recipient);
            const tx = await channels.closeChannelByRecipient(channel, closeValue.toFixed());
            const actualSenderBalance = await ethBalance(channel.sender);
            const actualRecipientBalance = await ethBalance(channel.recipient);

            assert.equal(
                tx.events.ChannelClosed.channelId, channel.channelId,
                'ChannelId from event doesnt match'
            );
            assertBigNumbers(
                actualSenderBalance, senderBalance.plus(closeValue),
                'Sender balance must be changed by channel close value'
            );
            assertBigNumbers(
                actualRecipientBalance, recipientBalance.plus(closeValue).minus(tx.ethUsed),
                'Sender balance must be changed by channel close value minus tx eth used'
            )

        });
    });
});
