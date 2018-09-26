import Web3 from 'web3';

class web3Service {

    constructor() {
        this.whenLoad = this._init();
    }

    _init = async () => {
        let web3 = window.web3;
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
            const [accounts, netId] = await Promise.all([
                web3.eth.getAccounts(),
                web3.eth.net.getId()
            ]);
            this._setState(accounts[0], netId, web3);
        } else {
            this.notConnected = true;
        }
    };

    _setState = (account, netId, web3) => {
        this.account = account;
        this.netId = netId;
        this.web3 = web3;
        this._subscribeOnUpdate(web3);
    };

    _subscribeOnUpdate = web3 => {
        web3.currentProvider.publicConfigStore.on('update', response => {
            if (this.account !== response.selectedAddress) {
                window.location.reload();
            }
        });
    };
}

export default new web3Service();