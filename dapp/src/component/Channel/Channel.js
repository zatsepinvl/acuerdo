import React from 'react';
import {inject, observer} from "mobx-react";

import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import Loader from "../../common/Loader";
import HashView from "../../common/HashView";
import AmountView from "../../common/AmountView";
import TimeView from "../../common/TimeView";

import channelStore from "../../stores/channelStore";
import A from "../../common/A";


const styles = {
    paymentsTitle: {
        flexGrow: 1
    },
    noPaymentsText: {
        paddingBottom: 16
    }
};

const txEventMapping = {
    'OPEN_CHANNEL': 'Open channel'
};

@inject('channelStore')
@observer
class Channel extends React.Component {
    componentDidMount() {
        const channelId = this.props.match.params.id;
        channelStore.loadChannel(channelId);
    }

    componentWillUnmount() {
        this.props.channelStore.reset();
    }

    renderChannelDetails(channel) {
        const {channelId: id, sender, recipient, value, canCanceledBefore, createdAt, status} = channel;
        return (
            <List>
                <ListItem>
                    <ListItemText primary="Channel id"/>
                    <Typography variant="subheading">
                        <HashView hash={id}/>
                    </Typography>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Sender"/>
                    <Typography variant="subheading">
                        <HashView hash={sender}/>
                    </Typography>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Recipient"/>
                    <Typography variant="subheading">
                        <HashView hash={recipient}/>
                    </Typography>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Deposited value"/>
                    <Typography variant="subheading">
                        <AmountView value={value} currency="ETH"/>
                    </Typography>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Created at"/>
                    <Typography variant="subheading">
                        <TimeView time={createdAt}/>
                    </Typography>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Can canceled before"/>
                    <Typography variant="subheading">
                        <TimeView time={canCanceledBefore}/>
                    </Typography>
                </ListItem>
                <ListItem>
                    <ListItemText primary="Status"/>
                    <Typography variant="subheading">
                        {status}
                    </Typography>
                </ListItem>
            </List>
        )
    }

    renderChannelPayments(payments = []) {
        const {classes} = this.props;
        if (payments.length === 0) {
            return (
                <Typography variant="caption" align="center"
                            paragraph className={classes.noPaymentsText}>
                    No payments yet
                </Typography>
            )
        }
        return (
            <List>
                {payments.map(payment => {
                    const {id, value, createdAt} = payment;
                    return (
                        <ListItem key={id}>
                            <ListItemText primary={
                                <AmountView value={value} currency="ETH"/>
                            }/>
                            <Typography variant="body1">
                                <TimeView time={createdAt}/>
                            </Typography>
                        </ListItem>
                    )
                })}
            </List>
        )
    }

    renderChannelTransactions(transactions = []) {
        return (
            <List>
                {transactions.map(tx => {
                    const {hash, event, confirmedAt} = tx;
                    return (
                        <ListItem key={hash}>
                            <ListItemText primary={txEventMapping[event] || 'Unknown tx'}
                                          secondary={
                                              <A href={`https://ropsten.etherscan.io/tx/${hash}`}>
                                                  <HashView hash={hash}/>
                                              </A>
                                          }
                            />
                            <Typography variant="body1">
                                <TimeView time={confirmedAt}/>
                            </Typography>
                        </ListItem>
                    )
                })}
            </List>
        )
    }

    render() {
        const {classes} = this.props;
        const {loaded, channel} = this.props.channelStore;
        if (!loaded) {
            return <Loader caption="Loading channel..."/>;
        }
        return (
            <Grid container spacing={16}>
                <Grid item xs={4}>
                    <Paper>
                        <Toolbar>
                            <Typography variant="title">
                                Channel Details
                            </Typography>
                        </Toolbar>
                        {this.renderChannelDetails(channel)}
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper>
                        <Toolbar>
                            <Typography variant="title" className={classes.paymentsTitle}>
                                Payments
                            </Typography>
                            <Button variant="contained" color="secondary">
                                Pay out
                            </Button>
                        </Toolbar>
                        {this.renderChannelPayments(channel.payments)}
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper>
                        <Toolbar>
                            <Typography variant="title" className={classes.paymentsTitle}>
                                Transaction History
                            </Typography>
                        </Toolbar>
                        {this.renderChannelTransactions(channel.transactions)}
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Channel);