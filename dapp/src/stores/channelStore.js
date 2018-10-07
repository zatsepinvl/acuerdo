import {observable, action} from 'mobx';
import channelService from "../services/channelService";

class channelsStore {
    whenSynced;
    @observable channels = [];

    constructor() {
        this.whenSynced = this._sync();
    }

    async _sync() {
        await channelService.whenSynced;
        const channels = channelService.channels;
        this._addChannels(channels);
    }

    @action
    _addChannels = (channels) => this.channels = this.channels.concat(channels);
}

export default new channelsStore();