import {observable, computed, action} from 'mobx';
import web3Service from '../services/web3Service';

class uiStore {
    @observable web3Loaded;

    constructor() {
        web3Service.whenLoad.then(() => this.setWeb3Loaded(true));
    }

    @action setWeb3Loaded = value => this.web3Loaded = value;

    @computed
    get isAppLoaded() {
        return !!this.web3Loaded;
    }
}

export default new uiStore();