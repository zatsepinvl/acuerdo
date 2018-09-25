import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

import {observer, inject} from "mobx-react";
import Loader from "./common/Loader";
import {css} from "./utils/styles";
import ethIconWhite from './images/eth_white.svg';
import ethIcon from './images/eth.svg';
import metaMaskIcon from './images/metamask.svg';
import {getNetName} from "./utils/ethUtils";

@inject('web3Store')
@inject('uiStore')
@observer
export default class App extends Component {

    renderNeedMetaMaskFragment = () => {
        return (
            <div className="need-login-card-container">
                <Card {...css('need-login-card')}>
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
        const {account, netId} = this.props.web3Store;
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
        const {account} = this.props.web3Store;
        return account ? this.renderMainFragment() : this.renderNeedMetaMaskFragment();
    };

    renderLoader = () => {
        return (<Loader caption="Loading..."/>)
    };


    render() {
        const {isAppLoaded} = this.props.uiStore;
        return (
            <div className="app">
                {isAppLoaded ? this.renderApp() : this.renderLoader()}
            </div>
        );
    }
}
