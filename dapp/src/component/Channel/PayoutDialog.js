import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import BigNumber from 'bignumber.js';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const styles = {};

class PayoutDialog extends React.Component {
    state = {
        value: '0'
    };

    handlePayout = () => {
        const value = BigNumber(this.state.value).times(10 ** 18);
        this.props.onPayout(value);
    };

    handleCancel = () => {
        this.props.onCancel();
    };

    changeValue = event => {
        this.setState({value: event.target.value});
    };

    render() {
        const {open} = this.props;
        return (
            <Dialog aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle id="simple-dialog-title">
                    Create Payment
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="value"
                        label="Value ETH"
                        onChange={this.changeValue}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handlePayout} color="secondary">
                        Pay Out
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

PayoutDialog.propTypes = {
    onCreate: PropTypes.func,
    onPayout: PropTypes.func,
    channel: PropTypes.object
};

export default withStyles(styles)(PayoutDialog);