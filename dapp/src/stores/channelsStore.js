import {flow, observable} from 'mobx';
import channelService from "../services/channelService";

class channelsStore {
    @observable channels = [];
    @observable loaded;

    constructor() {
    }

    loadChannels = flow(function* () {
        this.channels = yield channelService.getChannels();
        this.loaded = true;
    })
}

export default new channelsStore();