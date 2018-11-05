import React from 'react';
import {inject, observer} from "mobx-react";

import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

import HashView from "../../common/HashView";
import AmountView from "../../common/AmountView";
import TimeView from "../../common/TimeView";
import ChannelStatus from "../../common/ChannelStatus";


const styles = (theme) => ({
    title: {
        flexGrow: 1
    },
    button: {
        margin: theme.spacing.unit,
    },
});


@inject('channelStore')
@observer
class ChannelDetails extends React.Component {

    close = () => {
        const {payments, closeChannel} = this.props.channelStore;
        closeChannel(payments[0]);
    };

    render() {
        const {classes, channelStore} = this.props;
        const {channel, isActive} = channelStore;
        const {channelId: id, sender, recipient, value, canCanceledBefore, createdAt, status} = channel;
        return (
            <Paper>
                <Toolbar>
                    <Typography variant="title" className={classes.title}>
                        Channel
                    </Typography>
                    <React.Fragment>
                        {isActive && (
                            <Button variant="contained"
                                    color="secondary"
                                    className={classes.button}
                                    onClick={this.close}>
                                Close
                            </Button>
                        )}
                    </React.Fragment>
                </Toolbar>
                <List>
                    <ListItem>
                        <ListItemText primary="Channel Id"/>
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
                            <ChannelStatus status={status}/>
                        </Typography>
                    </ListItem>
                </List>
            </Paper>
        )
    }
}

export default withStyles(styles)(ChannelDetails);