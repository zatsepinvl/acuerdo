const BigNumber = require('bignumber.js');
const channels = require('./channels');
const {sleepUntil, expectError, nowSeconds} = require('./utils');
const {ethBalance} = require('./eth-utils');
const {assertBigNumbers} = require('./assert-utils');


contract('Channels', (accounts) => {
    describe('Cancel flow', () => {
        const channel = channels.newDefaultChannel(accounts, {dueDate: nowSeconds() + 3});

        before(async () => {
            await channels.openChannel(channel, {includeFee: true});
        });

        it("Sender can not close before due date", async () => {
            await expectError(
                channels.cancelChannel(channel),
                'VM Exception while processing transaction: revert'
            );
        });

        it("Sender can close after due date", async () => {
            sleepUntil(channel.dueDate + 2);

            const senderBalance = await ethBalance(channel.sender);
            const tx = await channels.cancelChannel(channel);
            const actualSenderBalance = await ethBalance(channel.sender);

            assert.equal(
                tx.events.ChannelCanceled.channelId, channel.channelId,
                'ChannelId from event doesnt match'
            );
            assertBigNumbers(
                actualSenderBalance, senderBalance.plus(channel.value).minus(tx.ethUsed),
                'Sender balance must be changed by channel value minus tx eth used'
            );
        });
    });
});
