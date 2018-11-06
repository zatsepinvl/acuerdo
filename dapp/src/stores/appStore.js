import {action, observable} from 'mobx';
import {channelService, web3Service} from '../services';
import authService from "../services/authService";

class appStore {
    @observable appLoaded;

    constructor() {
        this._init();
    }

    async _init() {
        try {
            await Promise.all([
                web3Service.whenLoad,
                channelService.whenLoad,
            ]).then(() => {
                if (web3Service.isConnected) {
                    return authService.login()
                }
            })
        } catch (error) {
            console.error(error)
        }
        finally {
            this.setAppLoaded(true);
        }

    }

    @action
    setAppLoaded = value => this.appLoaded = value;
}

export default new appStore();