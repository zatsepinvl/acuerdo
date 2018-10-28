import web3Service from "./web3Service";
import wsClient from "../client/wsClient";

class channelEventService {
    whenLoaded;
    _subscriptions = [];

    constructor() {
        this.whenLoaded = this.init();
    }

    async init() {
        await web3Service.whenLoad;
        const account = web3Service.account;
        if (!account) {
            return;
        }
        wsClient.subscribe(`/topic/users/${account}/channels`, this._handle)
    }

    subscribe(subscriber) {
        this._subscriptions.push(subscriber);
    }

    _handle = (data) => {
        console.log(data);
        const event = JSON.parse(data.body);
        this._subscriptions.forEach(subscriber => subscriber(event));
    }
}

export default new channelEventService();