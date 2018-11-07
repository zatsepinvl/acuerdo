import wsClient from "../client/wsClient";
import web3Service from "./web3Service";

class channelEventService {
    _subscriptions = [];

    init() {
        wsClient.subscribe(`/topic/user/${web3Service.account}/channels`, this._handle)
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