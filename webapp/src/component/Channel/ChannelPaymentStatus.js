import React from 'react';
import {inject, observer} from "mobx-react";

import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AmountView from "../../common/AmountView";

const styles = (theme) => ({});

@inject('channelStore')
@observer
class ChannelPaymentStatus extends React.Component {

    render() {
        const {classes, channelStore} = this.props;
        const {paymentStatus, isSender, isRecipient} = channelStore;
        const {refundToSender, releaseToRecipient} = paymentStatus;
        return (
            <React.Fragment>
                <Paper>
                    <Toolbar>
                        <Typography variant="title">
                            Payment Status
                        </Typography>
                    </Toolbar>
                    <List>
                        <ListItem>
                            <ListItemText primary="Refund to depositor"/>
                            <Typography variant="body1" color={isSender ? "secondary" : "primary"}>
                                <AmountView value={refundToSender} currency="ETH"/>
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Release to recipient"/>
                            <Typography variant="body1" color={isRecipient ? "secondary" : "primary"}>
                                <AmountView value={releaseToRecipient} currency="ETH"/>
                            </Typography>
                        </ListItem>
                    </List>
                </Paper>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(ChannelPaymentStatus);