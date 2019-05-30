import BigNumber from "bignumber.js";

import web3Service from "./web3Service";
import contractService from "./contractService";
import httpClient from "../client/httpClient";

class channelContractService {
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

    getContract() {
        return this._channels;
    }

    openChannelTx(channel) {
        const {channelId, recipient, dueDate, value, fee} = channel;
        const args = [channelId, recipient, dueDate];
        const txArgs = {value: BigNumber(value).plus(fee)};
        const tx = this._channels.methods.open(...args);
        return contractService.sendTx(tx, txArgs);
    }

    closeChannelTx({channelId, paymentId, value, signature}) {
        const vrs = web3Service.splitSignature(signature);
        const args = [paymentId, vrs.v, vrs.r, vrs.s, channelId, '' + value];
        const tx = this._channels.methods.close(...args);
        console.log(args);
        return contractService.sendTx(tx);
    }

    getFee() {
        return this._channels.methods.fee().call();
    }
}

export default new channelContractService();