import React from 'react';
import {inject, observer} from "mobx-react";

import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import HashView from "../../common/HashView";
import AmountView from "../../common/AmountView";
import TimeView from "../../common/TimeView";
import ChannelStatus from "../../common/ChannelStatus";


const styles = (theme) => ({
    title: {
        flexGrow: 1
    },
});


@inject('channelStore')
@observer
class ChannelDetails extends React.Component {

    render() {
        const {classes, channelStore} = this.props;
        const {channel, isSender, isRecipient} = channelStore;
        const {channelName, channelId, sender, recipient, value, canCanceledAfter, createdAt, status} = channel;
        return (
            <Paper>
                <Toolbar>
                    <Typography variant="title" className={classes.title}>
                        Channel
                    </Typography>
                </Toolbar>
                <List>
                    <ListItem>
                        <ListItemText secondary="Channel Name"/>
                        <Typography variant="subheading">
                            {channelName || '(none)'}
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <ListItemText secondary="Channel Id"/>
                        <Typography variant="subheading">
                            <HashView hash={channelId}/>
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <ListItemText secondary={`Sender ${isSender ? '(you)' : ''}`}/>
                        <Typography variant="subheading">
                            <HashView hash={sender}/>
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <ListItemText secondary={`Recipient ${isRecipient ? '(you)' : ''}`}/>
                        <Typography variant="subheading">
                            <HashView hash={recipient}/>
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <ListItemText secondary="Deposited value"/>
                        <Typography variant="subheading">
                            <AmountView value={value} currency="ETH"/>
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <ListItemText secondary="Created at"/>
                        <Typography variant="subheading">
                            <TimeView time={createdAt}/>
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <ListItemText secondary="Can canceled after"/>
                        <Typography variant="subheading">
                            <TimeView time={canCanceledAfter}/>
                        </Typography>
                    </ListItem>
                    <ListItem>
                        <ListItemText secondary="Status"/>
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