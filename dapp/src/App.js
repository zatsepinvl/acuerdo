import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import {withStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListIcon from '@material-ui/icons/List';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom'

import {observer, inject} from "mobx-react";
import Loader from "./common/Loader";
import {css} from "./utils/styles";
import ethIconWhite from './images/eth_white.svg';
import ethIcon from './images/eth.svg';
import metaMaskDownloadImage from './images/download-metamask-dark.png';
import metaMaskIcon from './images/metamask.svg';
import {getNetName} from "./utils/ethUtils";
import web3Service from './services/web3Service';
import ChannelsList from "./component/ChannelsList";
import NotFound from "./component/NotFound";
import NewChannel from "./component/NewChannel/NewChannel";

const drawerWidth = 240;
const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        marginTop: 64,
        minWidth: 0,
        overflow: 'auto'
    },
    toolbar: theme.mixins.toolbar,
});


@inject('appStore')
@observer
class App extends Component {

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
        const {classes} = this.props;
        return (
            <Router>
                <div className={classes.root}>
                    <AppBar position="absolute" {...css('app-bar')} className={classes.appBar}>
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
                    <Drawer
                        variant="permanent"
                        classes={{paper: classes.drawerPaper}}
                    >
                        <div className={classes.toolbar}/>
                        <List>
                            <div>
                                <Link to="/" className="no-text-decoration">
                                    <ListItem button>
                                        <ListItemIcon>
                                            <ListIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="My Channels"/>
                                    </ListItem>
                                </Link>
                                <Link to="/test" className="no-text-decoration">
                                    <ListItem button>
                                        <ListItemIcon>
                                            <AddBoxIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="Add Channel">
                                        </ListItemText>
                                    </ListItem>
                                </Link>
                            </div>
                        </List>
                    </Drawer>
                    <main className={classes.content}>
                        <Switch>
                            <Route exact path="/" component={ChannelsList}/>
                            <Route path="/channel/new" component={NewChannel}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </main>
                </div>
            </Router>
        );
    };

    renderApp = () => {
        const {appSynced} = this.props.appStore;
        const {notConnected, account} = web3Service;
        if (notConnected) {
            return this.renderNoMetaMaskFragment();
        }
        if (!account) {
            return this.renderMetaMaskLoginFragment();
        }
        if (!appSynced) {
            return this.renderSyncLoader()
        }
        return this.renderMainFragment();
    };

    renderLoader = () => {
        return (<Loader caption="Loading components..."/>)
    };

    renderSyncLoader = () => {
        return (<Loader caption="Syncing with network..."/>)
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