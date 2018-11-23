import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const RECONNECT_TIMEOUT = 3000;
const APP_PATH = '/api/ws';

class wsClient {
    connected = false;
    _subscriptions = [];

    subscribe = (destination, handler) => {
        const subscription = {destination, handler};
        //lazy connecting
        if (this._subscriptions.length === 0) {
            this._connect();
        }
        this._subscriptions.push(subscription);
        if (this.connected) {
            this._subscribe(subscription);
        }
    };

    _connect = () => {
        const socket = new SockJS(APP_PATH);
        this.client = Stomp.over(socket);
        this.client.connect({}, this._onConnect, this._onConnectionError);
    };

    _subscribe = ({destination, handler}) => {
        this.client.subscribe(destination, handler);
    };

    _onConnect = () => {
        this._subscriptions.forEach(this._subscribe);
        this.connected = true;
    };

    _onConnectionError = (error) => {
        this.connected = false;
        console.log(error);
        setTimeout(this._connect, RECONNECT_TIMEOUT);
        console.log(`WebSocket reconnecting in ${RECONNECT_TIMEOUT} seconds`);
    };
}

export default new wsClient();