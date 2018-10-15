import BigNumber from "bignumber.js";

import web3Service from "./web3Service";
import contractService from "./contractService";
import * as restClient from "./restClient";

class channelService {
    whenLoad;
    _channels;

    constructor() {
        this.whenLoad = this._load();
    }

    async _load() {
        await web3Service.whenLoad;
        const contract = await restClient.channels.contract();
        this._channels = contractService.loadContract(contract);
    }

    getChannels() {
        const username = web3Service.account;
        return restClient.channels.getAllByUser(username)
    }

    getChannelById(channelId) {
        return restClient.channels.getById(channelId);
    }

    openChannel(channel) {
        const {channelId, recipient, timeout, value, fee} = channel;
        const args = [channelId, recipient, timeout];
        const txArgs = {value: BigNumber(value).plus(fee)};
        const tx = this._channels.methods.open(...args);
        return contractService.sendTx(tx, txArgs)
            .then(transactionHash => {
                channel.status = 'PENDING';
                const transaction = {
                    hash: transactionHash,
                    channelId: channelId,
                    from: channel.sender,
                    to: this._channels.options.address,
                    event: 'OPEN_CHANNEL'
                };
                return restClient.channels.save({channel, transaction});
            })
    }

    getFee() {
        return this._channels.methods.fee().call();
    }
}

export default new channelService();