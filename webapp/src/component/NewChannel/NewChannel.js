import React from 'react';
import {observable, runInAction} from 'mobx';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';
import moment from 'moment';

import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import web3Service from '../../services/web3Service';
import channelService from '../../services/channelService';
import Loader from '../../view/Loader';
import {currencyStr} from '../../view/AmountView';
import {ethToWei} from "../../utils/ethUtils";


const styles = theme => ({
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
        width: 460,
    },
    toolbar: {
        display: 'flex'
    },
    button: {
        marginRight: theme.spacing.unit,
    }
});

@inject('newChannelStore')
@observer
class NewChannel extends React.Component {

    @observable values = {};

    componentDidMount() {
        this.props.newChannelStore.load();
    }

    componentWillUnmount() {
        this.props.newChannelStore.reset();
    }

    handleChange = name => event => {
        runInAction(() => this.values[name] = event.target.value);
    };

    handleCreateClicked = () => {
        const {fee} = this.props.newChannelStore;
        const id = web3Service.web3.utils.sha3('' + new Date().getTime());
        const channel = {
            channelName: this.values.channelName,
            channelId: id,
            sender: web3Service.account,
            recipient: this.values.recipient,
            value: ethToWei(this.values.amount),
            dueDate: Math.floor(moment(this.values.dueDate).valueOf() / 1000),
            fee: fee
        };
        channelService.openChannel(channel)
            .then(() => this.props.history.push(`/channel/${id}`))
            .catch(console.error);
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.handleCreateClicked();
    };

    renderForm() {
        const {classes, newChannelStore} = this.props;
        const {fee} = newChannelStore;
        const defaultInputProps = {
            margin: 'normal',
            className: classes.textField,
        };
        return (
            <form className={classes.container} onSubmit={this.handleSubmit}>
                <Paper>
                    <Toolbar className={classes.toolbar}>
                        <Typography variant='title' color='inherit'>
                            New Channel
                        </Typography>
                    </Toolbar>
                    <div className={classes.inputContainer}>
                        <TextField
                            required
                            id='channelName'
                            label='Channel name'
                            value={this.values.channelName}
                            onChange={this.handleChange('channelName')}
                            {...defaultInputProps}
                        />
                        <TextField
                            id='sender'
                            disabled
                            label='Sender address'
                            defaultValue={web3Service.account}
                            {...defaultInputProps}
                        />
                        <TextField
                            required
                            id='recipient'
                            label='Recipient address'
                            value={this.values.recipient}
                            onChange={this.handleChange('recipient')}
                            placeholder='0x...'
                            {...defaultInputProps}
                        />
                        <TextField
                            required
                            id="amount"
                            label="Amount ETH"
                            value={this.values.amount}
                            onChange={this.handleChange('amount')}
                            placeholder='1.0'
                            helperText="Value of channel excluding service fee"
                            {...defaultInputProps}
                        />
                        <TextField
                            required
                            id='dueDate'
                            label='Due date'
                            value={this.values.dueDate}
                            onChange={this.handleChange('dueDate')}
                            type='datetime-local'
                            defaultValue={moment().format('YYYY-MM-DDThh:mm')}
                            placeholder='2'
                            {...defaultInputProps}
                            shrink
                            helperText='As this time pasted you can cancel channel and refund full amount'
                        />
                        <TextField
                            id="fee"
                            disabled
                            label="Acuerdo Service Fee"
                            defaultValue={currencyStr(fee, 18) + ' ETH'}
                            {...defaultInputProps}
                            helperText="Fixed amount of fee need to pay on channel creation"
                        />
                    </div>
                    <Toolbar className={classes.toolbar}>
                        <Button variant='contained' color='secondary'
                                className={classes.button}
                                type='submit'>
                            Create
                        </Button>
                        <Link to='/'>
                            <Button variant='contained' color='primary'
                                    className={classes.button}>
                                Cancel
                            </Button>
                        </Link>
                    </Toolbar>
                </Paper>
            </form>
        )
    }

    renderLoader() {
        return <Loader caption='Preparing...'/>
    }

    render() {
        const {ready} = this.props.newChannelStore;
        return ready ? this.renderForm() : this.renderLoader();
    }
}

export default withStyles(styles)(NewChannel);