import Web3 from 'web3';

class web3Service {

    web3;
    eventWeb3;
    account;
    netId;

    constructor() {
        this.whenLoad = this._load();
    }

    getBlock(numberOrHash) {
        return this.web3.eth.getBlock(numberOrHash);
    }

    async getBlockTimestamp(numberOrHash) {
        const block = await this.getBlock(numberOrHash);
        return block.timestamp;
    }

    _load = async () => {
        this.eventWeb3 = new Web3('ws://localhost:8545');
        if (!Web3.givenProvider) {
            this.notConnected = true;
            return;
        }
        this.web3 = new Web3(Web3.givenProvider);
        const [accounts, netId] = await Promise.all([
            this.web3.eth.getAccounts(),
            this.web3.eth.net.getId()
        ]);
        this.account = accounts.length && accounts[0].toLowerCase();
        this.netId = netId;
        this._subscribeOnUpdate();
    };

    _subscribeOnUpdate() {
        this.web3.currentProvider.publicConfigStore
            .on('update', response => {
                if (this.account !== response.selectedAddress) {
                    window.location.reload();
                }
            });
    };
}

export default new web3Service();