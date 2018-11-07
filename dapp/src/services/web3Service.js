import Web3 from 'web3';

class web3Service {

    web3;
    account;
    netId;
    whenLoad;

    constructor() {
        this.whenLoad = this._load();
    }

    getBlock(numberOrHash) {
        return this.web3.eth.getBlock(numberOrHash);
    }

    get isConnected() {
        return this.web3 && this.account;
    }

    sign(text) {
        return this.web3.eth.personal.sign(text, this.account);
    };

    sha3(...args) {
        return this.web3.utils.soliditySha3(...args);
    };

    _load = async () => {
        if (!Web3.givenProvider) {
            return;
        }
        this.web3 = new Web3(Web3.givenProvider);
        window.w = this.web3;
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

    splitSignature(signature) {
        signature = signature.substr(2);
        return {
            r: '0x' + signature.slice(0, 64),
            s: '0x' + signature.slice(64, 128),
            v: this.web3.utils.toDecimal('0x' + signature.slice(128, 130))
        }
    }
}

export default new web3Service();