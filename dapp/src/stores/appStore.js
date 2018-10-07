import {observable, computed, action} from 'mobx';
import web3Service from '../services/web3Service';
import channelService from "../services/channelService";
import channelStore from "./channelStore";

class appStore {
    @observable appLoaded;
    @observable appSynced;

    constructor() {
        this._init();
    }

    async _init() {
        await this._checkAndSet([
            web3Service.whenLoad,
            channelService.whenLoad,
        ], this.setAppLoaded);

        await this._checkAndSet([
            channelService.whenSynced,
            channelStore.whenSynced
        ], this.setAppSynced);
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

    @action setAppSynced = value => this.appSynced = value;


}

export default new appStore();