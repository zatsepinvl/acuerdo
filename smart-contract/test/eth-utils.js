const promiseTimeout = require("./utils.js").promiseTimeout;

const defaultGasPrice = 10 * 10 ** 9; //10 GWEI

const logTx = async (promise, name, gasPrice) => {
    const result = await promiseTimeout(promise);
    const price = gasPrice ? gasPrice : defaultGasPrice;
    result.ethUsed = price * result.gasUsed;
    const logStr = `[${name}]: gasUsed: ${result.gasUsed} | ethUsed: ${result.ethUsed / 10 ** 18}`
    console.log(logStr);
    return result;
};

const watchEvent = (event) => {
    return new Promise((resolve, reject) => {
        event
            .once('data', (data) => resolve(data))
            .once('error', reject);
    });
};

const tx = async (contract, func, args = [], txArgs = {}, events = []) => {
    const watchEvents = {};
    events.forEach(event => {
        if (!contract.events.hasOwnProperty(event)) {
            throw new Error("Unable to find event " + event + " in contract");
        }
    });
    if (!txArgs.gasPrice) {
        txArgs.gasPrice = defaultGasPrice;
    }
    const result = await logTx(contract.methods[func](...args).send(txArgs), func);
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        watchEvents[event] = result.events[event].returnValues;
    }
    result.events = watchEvents;
    return result;
};

const splitSignature = (signature) => {
    signature = signature.substr(2);
    return {
        r: '0x' + signature.slice(0, 64),
        s: '0x' + signature.slice(64, 128),
        v: web3.utils.toDecimal('0x' + signature.slice(128, 130)) + 27
    }
}

module.exports = {
    defaultGasPrice: defaultGasPrice,
    logTx: logTx,
    tx: tx,
    watchEvent: watchEvent,
    rawBalance: async (address) => await web3.eth.getBalance(address),
    tokenRawBalance: async (address, token) => await token.balanceOf(address),
    splitSignature: splitSignature
};