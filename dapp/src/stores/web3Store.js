import Web3 from 'web3';
import {observable, computed, action} from 'mobx';
import uiStore from './uiStore';

class web3Store {
    @observable web3;
    @observable account;
    @observable netId;
    @observable notConnected;

    constructor() {
        this.init().then(() => uiStore.setWeb3Loaded(true));
    }

    init = async () => {
        let web3 = window.web3;
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
            const [accounts, netId] = await Promise.all([
                web3.eth.getAccounts(),
                web3.eth.net.getId()
            ]);
            this.setState(accounts[0], netId, web3);
        } else {
            this.notConnected = true;
        }
    };

    @action
    setState = (account, netId, web3) => {
        this.account = account;
        this.netId = netId;
        this.web3 = web3;
        this.subscribeOnUpdate(web3);
    };

    subscribeOnUpdate = web3 => {
        web3.currentProvider.publicConfigStore.on('update', response => {
            if (this.account !== response.selectedAddress) {
                window.location.reload();
            }
        });
    };
}

export default new web3Store();