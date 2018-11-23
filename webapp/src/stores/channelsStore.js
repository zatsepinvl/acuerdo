import {flow, observable} from 'mobx';
import channelService from "../services/channelService";

class channelsStore {
    @observable channels = [];
    @observable loaded;

    loadChannels = flow(function* () {
        this.channels = yield channelService.getChannels();
        this.loaded = true;
    }).bind(this);
}

export default new channelsStore();