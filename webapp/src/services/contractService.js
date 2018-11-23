import web3Service from "./web3Service";

class contractService {

    loadContract(contract) {
        const {abi, address} = contract;
        const {web3, account} = web3Service;
        return new web3.eth.Contract(abi, address, {from: account});
    }

    sendTx(tx, args = {}) {
        return new Promise((resolve, reject) => {
            tx.send(args)
                .on('transactionHash', resolve)
                .on('error', reject)
        });
    }
}

export default new contractService();