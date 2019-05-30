import React from 'react';
import {inject, observer} from "mobx-react";

import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import HashView from "../../view/HashView";
import TimeView from "../../view/TimeView";
import Hyperlink from "../../view/Hyperlink";

const txEventMapping = {
    'OPEN_CHANNEL': 'Open channel',
    'CLOSE_CHANNEL': 'Close channel'
};

const styles = {};

@inject('channelStore')
@observer
class ChannelTransactions extends React.PureComponent {

    renderTransactions() {
        const transactions = this.props.channelStore.transactions;
        return (
            <List>
                {transactions.map(tx => {
                    const {hash, event, confirmedAt} = tx;
                    return (
                        <Hyperlink href={`https://ropsten.etherscan.io/tx/${hash}`} key={hash}>
                            <ListItem button>
                                <ListItemText primary={txEventMapping[event] || 'Unknown tx'}
                                              secondary={<span>
                                                      Hash <HashView hash={hash}/>
                                                  </span>}
                                />
                                <Typography variant="body1">
                                    <TimeView time={confirmedAt}/>
                                </Typography>

                            </ListItem>
                        </Hyperlink>
                    )
                })}
            </List>
        )
    }

    render() {
        return (
            <Paper>
                <Toolbar>
                    <Typography variant="title">
                        Transaction history
                    </Typography>
                </Toolbar>
                {this.renderTransactions()}
            </Paper>
        )
    }
}


export default withStyles(styles)(ChannelTransactions);