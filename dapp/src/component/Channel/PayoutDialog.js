import React from 'react';
import {action, observable} from 'mobx';
import {inject, observer} from 'mobx-react';
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

const styles = {
    textField: {
        width: 260
    }
};

@inject('channelStore')
@observer
class PayoutDialog extends React.Component {

    @observable value;
    @observable error;

    handlePayout = () => {
        if (this.error) {
            return;
        }
        const value = BigNumber(this.state.value).times(10 ** 18);
        this.props.onPayout(value);
    };

    handleCancel = () => {
        this.props.onCancel();
    };

    @action
    changeValue = event => {
        const channel = this.props.channelStore.channel;
        const value = BigNumber(event.target.value).times(10 ** 18);
        this.error = null;
        if (value > channel.value) {
            this.error = 'Value must be less or equal channel amount';
            return;
        }
        this.value = event.target.value;
    };

    render() {
        const {open, classes} = this.props;
        return (
            <Dialog open={open}>
                <DialogTitle>
                    Create Payment
                </DialogTitle>
                <DialogContent>
                    <DialogContentText/>
                    <TextField
                        className={classes.textField}
                        autoFocus
                        margin="dense"
                        id="value"
                        label="Value ETH"
                        onChange={this.changeValue}
                        error={!!this.error}
                        helperText={this.error || 'Recipient can get with value'}
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
};

export default withStyles(styles)(PayoutDialog);