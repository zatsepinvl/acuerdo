const BigNumber = require('bignumber.js');
const channels = require('./channels');
const {sleepUntil, expectError, nowSeconds} = require('./utils');
const {ethBalance} = require('./eth-utils');
const {assertBigNumbers} = require('./assert-utils');


contract('Channels', (accounts) => {
    describe('Default flow', () => {
        const channel = channels.newDefaultChannel(accounts);
        const fee = new BigNumber(10 ** 10);

        it('setFee', async () => {
            await channels.setFee(fee.toFixed(), accounts[0]); //accounts[0] - default owner
            const actualFee = await channels.getFee();
            assert.equal(actualFee, fee, "Fee must be changed");
        });

        it('Open channel', async () => {
            const senderBalance = await ethBalance(channel.sender);
            const tx = await channels.openChannel(channel, {includeFee: true});
            const actualSenderBalance = await ethBalance(channel.sender);

            console.log(senderBalance);
            assert.equal(
                tx.events.ChannelOpened.channelId, channel.channelId,
                'ChannelId from event doesnt match'
            );
            assertBigNumbers(
                actualSenderBalance, senderBalance.minus(channel.value).minus(fee).minus(tx.ethUsed),
                'Sender balance must be changed by channel value and tx eth used'
            );
        });

        it('Close channel', async () => {
            const closeValue = channel.value.dividedToIntegerBy(2);

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
