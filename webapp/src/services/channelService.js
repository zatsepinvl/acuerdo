import BigNumber from "bignumber.js";

import web3Service from "./web3Service";
import contractService from "./contractService";
import httpClient from "../client/httpClient";

class channelService {
    whenLoad;
    address;
    _channels;

    constructor() {
        this.whenLoad = this._load();
    }

    async _load() {
        await web3Service.whenLoad;
        if (!web3Service.isConnected) {
            return;
        }
        const contract = await httpClient.channels.contract();
        this._channels = contractService.loadContract(contract);
        this.address = this._channels.options.address.toLowerCase();
    }

    getChannels() {
        const username = web3Service.account;
        return httpClient.channels.getAllByUser(username)
    }

    getChannelById(channelId) {
        return httpClient.channels.getById(channelId);
    }

    getContract() {
        return this._channels;
    }

    openChannel(channel) {
        const {channelId, channelName, recipient, timeout, value, fee} = channel;
        const args = [channelId, recipient, timeout];
        const txArgs = {value: BigNumber(value).plus(fee)};
        const tx = this._channels.methods.open(...args);
        return contractService.sendTx(tx, txArgs)
            .then(transactionHash => {
                channel.status = 'PENDING';
                const transaction = {
                    hash: transactionHash,
                    channelId: channelId,
                    channelName: channelName,
                    from: channel.sender,
                    to: this._channels.options.address,
                    event: 'OPEN_CHANNEL'
                };
                return httpClient.channels.save({channel, transaction});
            })
    }

    closeChannel({channelId, paymentId, value, signature}) {
        const vrs = web3Service.splitSignature(signature);
        const args = [paymentId, vrs.v, vrs.r, vrs.s, channelId, '' + value];
        const tx = this._channels.methods.close(...args);
        return contractService.sendTx(tx);
    }

    getFee() {
        return this._channels.methods.fee().call();
    }
}

export default new channelService();