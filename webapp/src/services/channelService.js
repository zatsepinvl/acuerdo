import web3Service from "./web3Service";
import httpClient from "../client/httpClient";
import channelContractService from "./channelContractService";

class channelService {
    whenLoad;

    constructor() {
        this.whenLoad = this._load();
    }

    async _load() {
        await web3Service.whenLoad;
    }

    getChannels() {
        return httpClient.channels.getAllByUser(web3Service.account)
    }

    getChannelById(channelId) {
        return httpClient.channels.getById(channelId);
    }

    async openChannel(channel) {
        const {channelId, sender} = channel;
        const txHash = await channelContractService.openChannelTx(channel);
        channel.status = 'PENDING';
        const transaction = {
            hash: txHash,
            channelId: channelId,
            from: sender,
            to: channelContractService.address,
            event: 'OPEN_CHANNEL'
        };
        const sendResult = await httpClient.channels.save({channel, transaction});
        return {transaction, sendResult};
    }

    /**
     * request {channelId, paymentId, value, signature}
     */
    async closeChannel(request) {
        const txHash = await channelContractService.closeChannelTx(request);
        const {channelId} = request;
        const transaction = {
            hash: txHash,
            channelId: channelId,
            from: web3Service.account,
            to: channelService.address,
            event: 'CLOSE_CHANNEL'
        };
        const sendResult = await httpClient.channels.close({channelId, transaction});
        return {sendResult, transaction};
    }

}

export default new channelService();