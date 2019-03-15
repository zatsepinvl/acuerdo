import React from 'react';
import {action, observable, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import {withStyles} from '@material-ui/core/styles';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {channelService} from '../../services';

const styles = (theme) => ({
    container: {},
    inputContainer: {
        paddingLeft: 16,
        paddingRight: 16,
        display: 'flex',
        flexDirection: 'column',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 360,
    },
    toolbar: {
        display: 'flex'
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    paymentImportInput: {
        display: 'none'
    },
    orFillCaption: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    },
    errorText: {
        color: 'red'
    }
});

@observer
class ManualModeDialog extends React.Component {

    @observable error;
    @observable txHash;
    @observable isSender = false;
    @observable values = {};

    handleSubmit = event => {
        event.preventDefault();
        channelService.closeChannel(this.values)
            .then(hash => {
                runInAction(() => {
                    this.txHash = hash;
                });
            })
            .catch(error => {
                runInAction(() => {
                    console.log(error);
                    this.error = 'Exception while processing transaction';
                })
            });
    };

    handleChange = name => event => {
        runInAction(() => this.values[name] = event.target.value);
    };

    handleCancel = () => {
        this.props.onCancel();
    };

    @action
    handleSelectedFile = (event) => {
        const reader = new FileReader();
        this.error = undefined;
        this.txHash = undefined;
        reader.onload = () => {
            const text = reader.result;
            const payment = JSON.parse(text);
            runInAction(() => {
                this.values.channelId = payment.channelId;
                this.values.paymentId = payment.paymentId;
                this.values.value = payment.value;
                this.values.signature = this.isSender ? payment.recipientSignature : payment.senderSignature;
            })
        };
        reader.readAsText(event.target.files[0]);
    };

    render() {
        const {open, classes} = this.props;
        const defaultInputProps = {
            margin: "normal",
            className: classes.textField,
            InputLabelProps: {shrink: true}
        };
        return (
            <Dialog open={open}>
                <form className={classes.container} onSubmit={this.handleSubmit}>
                    <DialogTitle>
                        Close Channel Manually
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText/>
                        <div className={classes.inputContainer}>
                            <input
                                className={classes.paymentImportInput}
                                id="payment-import-file"
                                type="file"
                                accept="application/json"
                                onChange={this.handleSelectedFile}/>
                            <label htmlFor="payment-import-file">
                                <Button component="span">
                                    Upload payment JSON
                                </Button>
                            </label>
                            <Typography variant="caption" className={classes.orFillCaption}>
                                or fill fields
                            </Typography>
                            <TextField
                                required
                                id="channelId"
                                label="Channel id"
                                value={this.values.channelId}
                                onChange={this.handleChange('channelId')}
                                placeholder="0x..."
                                {...defaultInputProps}
                            />
                            <TextField
                                required
                                id="paymentId"
                                label="Payment id"
                                value={this.values.paymentId}
                                onChange={this.handleChange('paymentId')}
                                placeholder="0x..."
                                {...defaultInputProps}
                            />
                            <TextField
                                required
                                id="value"
                                label="Value ETH"
                                value={this.values.value}
                                onChange={this.handleChange('value')}
                                placeholder="ETH"
                                {...defaultInputProps}
                            />
                            <TextField
                                required
                                id="signature"
                                label="Another party signature"
                                value={this.values.signature}
                                onChange={this.handleChange('signature')}
                                placeholder="0x..."
                                {...defaultInputProps}
                            />
                            {this.txHash && <Typography variant="body1" color="secondary">
                                Transaction hash:
                                <br/> {this.txHash}
                            </Typography>}
                            {this.error && <Typography variant="body1" className={classes.errorText}>
                                Error: {this.error}
                            </Typography>}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="secondary">
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

ManualModeDialog.propTypes = {};

export default withStyles(styles)(ManualModeDialog);