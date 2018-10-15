import {action, flow, observable} from 'mobx';
import channelService from "../services/channelService";

class channelsStore {
    @observable channel;
    @observable loaded;

    constructor() {
    }

    @action
    reset() {
        this.channel = undefined;
        this.loaded = false;
    }

    loadChannel = flow(function* (channelId) {
        this.channel = yield channelService.getChannelById(channelId);
        this.loaded = true;
    })
}

export default new channelsStore();