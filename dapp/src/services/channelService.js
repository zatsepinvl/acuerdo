import web3Service from "./web3Service";
import contractService from "./contractService";
import Channels from "../contracts/Channels.json";
import storageService from "./storageService";

const keys = {
    fromBlock: 'fromBlock',
    channels: 'channels'
};

class channelService {

    whenLoaded;
    whenSynced;
    fee;
    _channelsContract;
    channelsEvents;
    channels;

    constructor() {
        this.whenLoaded = this._load();
        this.whenSynced = this._sync();
    }

    async _load() {
        await web3Service.whenLoad;
        this._channelsContract = contractService.loadContractFromJson(Channels);
        this.channelsEvents = contractService.loadEventContractFromJson(Channels);
        this.fee = await this._channelsContract.methods.fee().call();
    }

    async _sync() {
        await this.whenLoaded;
        const fromBlock = storageService.get(keys.fromBlock, 0);
        const toBlock = await web3Service.web3.eth.getBlockNumber();
        console.log(toBlock);
        const options = {
            fromBlock: fromBlock,
            toBlock: toBlock,
            filter: {
                sender: web3Service.account,
                //recipient: web3Service.account
            }
        };
        const channels = storageService.get(keys.channels, []);
        const newChannels = fromBlock <= toBlock ? await this._getChannels(options) : [];
        this.channels = channels.concat(newChannels);
        storageService.save(keys.fromBlock, toBlock + 1);
        storageService.save(keys.channels, this.channels);
    }

    openChannel(channel) {
        const args = [channel.id, channel.recipient, channel.timeout, channel.data];
        const txArgs = {value: channel.value};
        const tx = this._channelsContract.methods.open(...args);
        return contractService.sendTx(tx, txArgs);
    }

    async _getChannels(options = {fromBlock: 0}) {
        const openedEvents = await this._getOpenedChannels(options)
        return openedEvents.map(this._channelFromOpenedEvent)
    }

    _getOpenedChannels(options = {fromBlock: 0}) {
        return this.channelsEvents.getPastEvents('ChannelOpened', options)
    }

    _getClosedChannels(options = {fromBlock: 0}) {
        return this.channelsEvents.getPastEvents('ChannelClosed', options)
    }

    _channelFromOpenedEvent(event) {
        const values = event.returnValues;
        return Object.keys(values)
            .filter(isNaN)
            .reduce((obj, key) => {
                obj[key] = values[key];
                return obj;
            }, {});
    }
}

export default new channelService();