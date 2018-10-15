import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom'
import {inject, observer} from "mobx-react";
import Loader from "./common/Loader";
import ethIconWhite from './images/eth_white.svg';
import {getNetName} from "./utils/ethUtils";
import web3Service from './services/web3Service';
import ChannelsList from "./component/ChannelsList";
import NotFound from "./component/NotFound";
import NewChannel from "./component/NewChannel/NewChannel";
import Channel from "./component/Channel/Channel";
import logoImage from "./images/logo.svg";
import NoMetaMask from './component/Main/NoMetaMask';
import MetaMaskLogin from './component/Main/MetaMaskLogin';

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

    renderMainFragment = () => {
        const {account, netId} = web3Service;
        const netName = getNetName(netId);
        const {classes} = this.props;
        return (
            <Router>
                <div className={classes.root}>
                    <AppBar position="absolute" className={classes.appBar}>
                        <Toolbar>
                            <Link to="/">
                                <img src={logoImage} alt="" width="128" height="30"/>
                            </Link>
                            <div className={classes.flexGrow}/>
                            <Typography variant="caption" color="inherit">
                                {account}
                            </Typography>
                            <img src={ethIconWhite} alt="" width="40" height="40"/>
                            <Typography variant="caption" color="inherit">
                                {netName}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <main className={classes.content}>
                        <div className={classes.wrapper}>
                            <Switch>
                                <Route exact path="/" component={ChannelsList}/>
                                <Route path="/channel/new" component={NewChannel}/>
                                <Route path="/channel/:id" component={Channel}/>
                                <Route component={NotFound}/>
                            </Switch>
                        </div>
                    </main>
                </div>
            </Router>
        );
    };

    renderApp = () => {
        const {notConnected, account} = web3Service;
        if (notConnected) {
            return <NoMetaMask/>;
        }
        if (!account) {
            return <MetaMaskLogin/>;
        }
        return this.renderMainFragment();
    };

    renderLoader = () => {
        return (<Loader caption="Loading components..." position="absolute"/>)
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