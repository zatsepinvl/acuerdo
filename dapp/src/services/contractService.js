import web3Service from "./web3Service";

class contractService {

    loadContractFromJson(contractJson,) {
        const {web3, netId, account} = web3Service;
        return this._loadContract(contractJson, web3, netId, account);
    }

    loadEventContractFromJson(contractJson) {
        const {eventWeb3, netId} = web3Service;
        return this._loadContract(contractJson, eventWeb3, netId);
    }

    _loadContract(json, web3, netId, account) {
        const address = json.networks[netId].address;
        return new web3.eth.Contract(json.abi, address, {from: account});
    }

    sendTx(tx, args) {
        return new Promise((resolve, reject) => {
            tx.send(args).on('transactionHash', resolve).on('error', reject)
        });
    }
}

export default new contractService();