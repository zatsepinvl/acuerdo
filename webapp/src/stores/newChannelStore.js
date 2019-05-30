import {action, flow, observable} from 'mobx';
import {channelContractService} from '../services';

class newChannelStore {
    @observable fee;
    @observable ready;

    @action
    reset() {
        this.fee = 0;
        this.ready = false;
    }

    load = flow(function* () {
        this.fee = yield channelContractService.getFee();
        this.ready = true;
    }).bind(this);


}

export default new newChannelStore();