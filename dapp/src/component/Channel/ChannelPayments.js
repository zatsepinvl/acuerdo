import React from 'react';
import {action, observable} from 'mobx';
import {inject, observer} from "mobx-react";

import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AmountView from "../../common/AmountView";
import TimeView from "../../common/TimeView";
import PayoutDialog from "./PayoutDialog";
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import DoneAll from '@material-ui/icons/DoneAll';
import AssignmentTurnedIn from '@material-ui/icons/AssignmentTurnedIn';

const styles = (theme) => ({
    paymentsTitle: {
        flexGrow: 1
    },
    noPaymentsText: {
        paddingBottom: 16
    },
    button: {
        margin: theme.spacing.unit,
    },
});


@inject('channelStore')
@observer
class ChannelPayments extends React.Component {

    @observable payoutDialogOpen = false;

    @action
    togglePayoutDialog = () => {
        this.payoutDialogOpen = !this.payoutDialogOpen;
    };

    onPayout = (value) => {
        const {savePayment, channel} = this.props.channelStore;
        savePayment({
            channelId: channel.channelId,
            value
        })
            .then(() => this.togglePayoutDialog())
            .catch(console.error);
    };

    sign = (payment) => {
        this.props.channelStore.signPayment(payment);
    };

    renderNoPayments() {
        const {classes} = this.props;
        return (
            <Typography variant="caption" align="center"
                        paragraph className={classes.noPaymentsText}>
                No payments yet
            </Typography>
        )
    }

    renderPaymentsList() {
        const {payments, isRecipient} = this.props.channelStore;
        if (!payments.length) {
            return this.renderNoPayments();
        }
        return (<List>
            {payments.map(payment => {
                const {paymentId, value, createdAt, recipientSignature} = payment;
                return (
                    <ListItem key={paymentId}>
                        <ListItemIcon>
                            {recipientSignature ? <DoneAll/> : <DoneIcon/>}
                        </ListItemIcon>
                        <ListItemText
                            primary={<AmountView value={value} currency="ETH"/>}
                            secondary={<TimeView time={createdAt}/>}
                        />
                        {isRecipient && !recipientSignature && (
                            <ListItemSecondaryAction>
                                <IconButton color="primary">
                                    <AssignmentTurnedIn onClick={() => this.sign(payment)}/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        )}
                    </ListItem>
                )
            })}
        </List>);
    }

    render() {
        const {classes, channelStore} = this.props;
        const {isSender, isActive} = channelStore;
        return (
            <React.Fragment>
                <Paper>
                    <Toolbar>
                        <Typography variant="title" className={classes.paymentsTitle}>
                            Payments
                        </Typography>
                        {isSender && isActive && (
                            <Button variant="contained"
                                    color="secondary"
                                    className={classes.button}
                                    onClick={this.togglePayoutDialog}>
                                Pay out
                            </Button>
                        )}
                    </Toolbar>
                    {this.renderPaymentsList()}
                </Paper>
                <PayoutDialog open={this.payoutDialogOpen}
                              onPayout={this.onPayout}
                              onCancel={this.togglePayoutDialog}/>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(ChannelPayments);