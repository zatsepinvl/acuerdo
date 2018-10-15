import React from 'react';
import Typography from '@material-ui/core/Typography';
import {css} from "../../utils/styles";
import ethIcon from '../../images/eth.svg';
import metaMaskIcon from '../../images/metamask.svg';
import Paper from '@material-ui/core/Paper';

export default class MetaMaskLogin extends React.PureComponent {
    render() {
        return (
            <div className="metamask-login-card-container">
                <Paper {...css('metamask-login-card')}>
                    <img src={metaMaskIcon} alt="" width="60" height="60"/>
                    <Typography variant="subheading" color="primary" {...css('text')}>
                        Login In MetaMask to continue...
                    </Typography>
                    <img src={ethIcon} alt="" width="60" height="60"/>
                </Paper>
            </div>
        );
    }
}