import {action, observable} from 'mobx';
import {channelService, web3Service} from '../services';

class appStore {
    @observable appLoaded;

    constructor() {
        this._init();
    }

    async _init() {
        await this._checkAndSet([
            web3Service.whenLoad,
            channelService.whenLoad,
        ], this.setAppLoaded);
    }

    async _checkAndSet(promises, setter) {
        try {
            await Promise.all(promises);
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setter(true);
        }
    }

    @action setAppLoaded = value => this.appLoaded = value;
}

export default new appStore();