import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import HashView from "../../common/HashView";
import TimeView from "../../common/TimeView";
import A from "../../common/A";

const txEventMapping = {
    'OPEN_CHANNEL': 'Open channel',
    'CLOSE_CHANNEL': 'Close channel'
};

const styles = {};

class ChannelTransactions extends React.PureComponent {

    renderTransactions() {
        const transactions = this.props.channel.transactions || [];
        return (
            <List>
                {transactions.map(tx => {
                    const {hash, event, confirmedAt} = tx;
                    return (
                        <A href={`https://ropsten.etherscan.io/tx/${hash}`} key={hash}>
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
                        </A>
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
                        Transaction History
                    </Typography>
                </Toolbar>
                {this.renderTransactions()}
            </Paper>
        )
    }
}

ChannelTransactions.propTypes = {
    channel: PropTypes.object.isRequired
};

export default withStyles(styles)(ChannelTransactions);