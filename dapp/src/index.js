import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {observable, action} from 'mobx';
import axios from 'axios';

class Store {
    @observable state;
    load = async () => this.setState(await axios.get('https://httpbin.org/get'));
    @action setState = state => {
        console.log('setting state');
        console.log(state);
        this.state = state;
    }
}

const store = new Store();
ReactDOM.render(<App store={store}/>, document.getElementById('root'));
registerServiceWorker();
