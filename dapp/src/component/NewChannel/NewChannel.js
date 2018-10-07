import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';

import web3Service from "../../services/web3Service";
import channelService from "../../services/channelService";


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

class NewChannel extends React.Component {

    state = {};

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleCreateClicked = () => {
        channelService.openChannel({
            id: web3Service.web3.utils.randomHex(32),
            recipient: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
            value: 10 ** 18,
            timeout: 10,
            data: ''
        })
            .then((hash) => {
                this.setState({
                    opened: true,
                    hash: hash
                })
            })
            .catch(console.error);
    };

    render() {
        const {classes} = this.props;

        return (
            <form className={classes.container} noValidate autoComplete="off">
                <Paper>
                    <Toolbar className={classes.toolbar}>
                        <Typography variant="title" color="inherit">
                            New Channel
                        </Typography>
                    </Toolbar>
                    <div className={classes.inputContainer}>
                        <TextField
                            required
                            id="sender"
                            disabled
                            label="Sender"
                            defaultValue={web3Service.account}
                            className={classes.textField}
                            margin="normal"
                        />
                        <TextField
                            id="recipient"
                            label="Recipient"
                            defaultValue="0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
                            className={classes.textField}
                            margin="normal"
                        />
                        <TextField
                            id="amount"
                            label="Amount"
                            defaultValue="1.0 ETH"
                            className={classes.textField}
                            margin="normal"
                        />
                        <TextField
                            id="fee"
                            disabled
                            label="Fee"
                            defaultValue={`${channelService.fee} %`}
                            className={classes.textField}
                            margin="normal"
                        />
                        <TextField
                            id="timeout"
                            label="Timeout"
                            defaultValue="2 days"
                            className={classes.textField}
                            margin="normal"
                        />
                    </div>
                    <Toolbar className={classes.toolbar}>
                        <Button variant="contained" color="secondary"
                                className={classes.button}
                                onClick={this.handleCreateClicked}>
                            Create
                        </Button>
                        <Button variant="contained" color="primary"
                                className={classes.button}>
                            Cancel
                        </Button>
                    </Toolbar>

                </Paper>
            </form>
        )
    }
}

export default withStyles(styles)(NewChannel);