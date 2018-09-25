import {observable, computed, action} from 'mobx';

class uiStore {
    @observable web3Loaded;

    @action setWeb3Loaded = value => this.web3Loaded = value;

    @computed
    get isAppLoaded() {
        return !!this.web3Loaded;
    }
}

export default new uiStore();