import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Card from '@material-ui/core/Card';

import {observer, inject} from "mobx-react";
import Loader from "./common/Loader";
import {css} from "./utils/styles";
import ethIconWhite from './images/eth_white.svg';
import ethIcon from './images/eth.svg';
import metaMaskDownloadImage from './images/download-metamask-dark.png';
import metaMaskIcon from './images/metamask.svg';
import {getNetName} from "./utils/ethUtils";
import web3Service from './services/web3Service';

@inject('appStore')
@observer
export default class App extends Component {

    renderNoMetaMaskFragment = () => {
        return (
            <div className="metamask-need-card-container">
                <Card {...css('metamask-need-card')}>
                    <Typography variant="subheading" color="primary" {...css('text')}>
                        Install MetaMask to continue...
                    </Typography>
                    <a href="https://metamask.io/" target="_blank">
                        <img src={metaMaskDownloadImage} alt="" width="400" height="121"/>
                    </a>
                </Card>
            </div>
        );
    };

    renderMetaMaskLoginFragment = () => {
        return (
            <div className="metamask-login-card-container">
                <Card {...css('metamask-login-card')}>
                    <img src={metaMaskIcon} alt="" width="60" height="60"/>
                    <Typography variant="subheading" color="primary" {...css('text')}>
                        Login In MetaMask to continue...
                    </Typography>
                    <img src={ethIcon} alt="" width="60" height="60"/>
                </Card>
            </div>
        );
    };

    renderMainFragment = () => {
        const {account, netId} = web3Service;
        const netName = getNetName(netId);
        return (
            <React.Fragment>
                <AppBar position="static" {...css('app-bar')}>
                    <Toolbar>
                        <Typography variant="title" color="inherit" {...css('title')}>
                            Acuerdo DApp
                        </Typography>
                        <Typography variant="caption" color="inherit">
                            {account}
                        </Typography>
                        <img src={ethIconWhite} alt="" width="40" height="40"/>
                        <Typography variant="caption" color="inherit">
                            {netName}
                        </Typography>
                    </Toolbar>
                </AppBar>
            </React.Fragment>
        );
    };

    renderApp = () => {
        const {notConnected, account} = web3Service;
        if (notConnected) {
            return this.renderNoMetaMaskFragment();
        }
        if (!account) {
            return this.renderMetaMaskLoginFragment();
        }
        return this.renderMainFragment();
    };

    renderLoader = () => {
        return (<Loader caption="Loading..."/>)
    };


    render() {
        const {isAppLoaded} = this.props.appStore;
        return (
            <div className="app">
                {isAppLoaded ? this.renderApp() : this.renderLoader()}
            </div>
        );
    }
}
