import React from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from 'react-router-dom';

import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


import web3Service from "../../services/web3Service";
import channelService from "../../services/channelService";
import Loader from "../../common/Loader";
import {currencyView} from "../../common/AmountView";


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

    state = {};

    componentDidMount() {
        this.props.newChannelStore.load();
    }

    componentWillUnmount() {
        this.props.newChannelStore.reset();
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleCreateClicked = () => {
        const {fee} = this.props.newChannelStore;
        const id = web3Service.web3.utils.sha3('' + new Date().getTime());
        const channel = {
            channelId: id,
            sender: web3Service.account,
            recipient: this.state.recipient,
            value: this.state.amount * 10 ** 18,
            timeout: this.state.timeout * 86400, //day to seconds
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
        return (
            <form className={classes.container} onSubmit={this.handleSubmit}>
                <Paper>
                    <Toolbar className={classes.toolbar}>
                        <Typography variant="title" color="inherit">
                            New Channel
                        </Typography>
                    </Toolbar>
                    <div className={classes.inputContainer}>
                        <TextField
                            id="sender"
                            disabled
                            label="Sender address"
                            defaultValue={web3Service.account}
                            className={classes.textField}
                            margin="normal"
                        />
                        <TextField
                            required
                            id="recipient"
                            label="Recipient address"
                            value={this.state.recipient}
                            onChange={this.handleChange('recipient')}
                            placeholder="0x..."
                            className={classes.textField}
                            margin="normal"
                        />
                        <TextField
                            required
                            id="amount"
                            label="Amount ETH"
                            value={this.state.amount}
                            onChange={this.handleChange('amount')}
                            placeholder="1.0"
                            className={classes.textField}
                            margin="normal"
                        />
                        <TextField
                            id="fee"
                            disabled
                            label="Fee"
                            defaultValue={currencyView(fee, 18) + ' ETH'}
                            className={classes.textField}
                            margin="normal"
                            helperText="Fixed amount of fee need to pay on channel creation"
                        />
                        <TextField
                            required
                            id="timeout"
                            label="Timeout in days"
                            value={this.state.timeout}
                            onChange={this.handleChange('timeout')}
                            placeholder="2"
                            className={classes.textField}
                            margin="normal"
                            helperText="In it time you can cancel channel and refund full amount"
                        />
                    </div>
                    <Toolbar className={classes.toolbar}>
                        <Button variant="contained" color="secondary"
                                className={classes.button}
                                type="submit">
                            Create
                        </Button>
                        <Link to="/">
                            <Button variant="contained" color="primary"
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
        return <Loader caption="Preparing..."/>
    }

    render() {
        const {ready} = this.props.newChannelStore;
        return ready ? this.renderForm() : this.renderLoader();
    }
}

export default withStyles(styles)(NewChannel);