import {action, observable} from 'mobx';
import {channelService, web3Service} from '../services';
import authService from "../services/authService";
import channelEventService from "../services/channelEventService";

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
            if (web3Service.web3) {
                web3Service.onUserChanged(() => {
                    authService.logout();
                    window.location.reload();
                });
            }

            if (!web3Service.isConnected) {
                return;
            }
            const loggedAccount = await authService.getLoggedAccount();
            if (loggedAccount && loggedAccount !== web3Service.account) {
                await authService.logout();
            } else if (loggedAccount === web3Service.account) {
                this._login();
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
        this._login();
    }

    _login() {
        this.setLoggedIn(true);
        channelEventService.init();
    }
}

export default new appStore();