import {action, observable} from 'mobx';
import {channelService, web3Service} from '../services';
import authService from "../services/authService";

class appStore {
    @observable appLoaded = false;
    @observable loggedIn = false;

    constructor() {
        this._init();
    }

    async _init() {
        try {
            await Promise.all([
                web3Service.whenLoad,
                channelService.whenLoad,
            ]);
            if (!web3Service.isConnected) {
                return;
            }
            const loggedAccount = await authService.getLoggedAccount();
            if (loggedAccount && loggedAccount !== web3Service.account) {
                await authService.logout();
            } else if (loggedAccount === web3Service.account) {
                this.setLoggedIn(true);
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            this.setAppLoaded(true);
        }
    }

    @action
    setAppLoaded = value => this.appLoaded = value;

    @action
    setLoggedIn = value => this.loggedIn = value;

    async login() {
        await authService.login();
        this.setLoggedIn(true);
    }
}

export default new appStore();