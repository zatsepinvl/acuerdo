import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {inject, observer} from "mobx-react";
import Loader from "./view/Loader";
import web3Service from './services/web3Service';
import logoImage from "./images/logo.svg";
import NoMetaMask from './component/Entrance/NoMetaMask';
import MetaMaskLogin from './component/Entrance/MetaMaskLogin';
import Login from "./component/Entrance/Login";
import Home from "./component/Home/Home";

const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    appBar: {},
    flexGrow: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        marginTop: 64,
        minWidth: 0,
        overflow: 'auto',
    },
    wrapper: {
        position: 'relative',
        justifyContent: 'center',
        display: 'flex',
        padding: theme.spacing.unit * 3,
    },
    toolbar: theme.mixins.toolbar,
});


@inject('appStore')
@observer
class App extends Component {

    getLoginStep() {
        const {loggedIn} = this.props.appStore;
        const {web3, account} = web3Service;
        if (!web3) {
            return <NoMetaMask/>;
        }
        else if (!account) {
            return <MetaMaskLogin/>;
        }
        else if (!loggedIn) {
            return <Login/>;
        }
        else return null;
    };

    renderApp = () => {
        const LoginStep = this.getLoginStep();
        if (LoginStep) {
            return (
                <div className="into-step-container">
                    <img src={logoImage} alt="" width="128" height="30" className="logo"/>
                    {LoginStep}
                </div>
            );
        }
        return <Home/>;
    };

    renderLoader = () => {
        return (<Loader caption="Loading application..." position="absolute"/>)
    };

    render() {
        const {appLoaded} = this.props.appStore;
        return (
            <div className="app">
                {appLoaded ? this.renderApp() : this.renderLoader()}
            </div>
        );
    }
}

export default withStyles(styles)(App);