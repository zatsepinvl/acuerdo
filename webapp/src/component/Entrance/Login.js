import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {inject, observer} from "mobx-react";
import web3Service from "../../services/web3Service";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {css} from "../../utils/styles";

const styles = theme => ({});


@inject('appStore')
@observer
class Login extends Component {

    login = () => {
        this.props.appStore.login();
    };

    render() {
        return (
            <Paper {...css('login-card')}>
                <Typography variant="body1" gutterBottom>
                    Login with this account to continue
                </Typography>
                <Typography variant="body2" gutterBottom>
                    {web3Service.account}
                </Typography>
                <Button variant="contained" color="secondary" onClick={this.login}>Login</Button>
            </Paper>
        );
    }
}

export default withStyles(styles)(Login);