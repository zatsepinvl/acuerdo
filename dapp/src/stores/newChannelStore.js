import {action, flow, observable} from 'mobx';
import {channelService} from '../services';

class newChannelStore {
    @observable fee;
    @observable ready;

    constructor() {
    }

    @action
    reset() {
        this.fee = 0;
        this.ready = false;
    }

    load = flow(function* () {
        this.fee = yield channelService.getFee();
        this.ready = true;
    })

}

export default new newChannelStore();