import React from 'react';
import metaMaskDownloadImage from '../../images/download-metamask-dark.png';
import Typography from '@material-ui/core/Typography';
import {css} from "../../utils/styles";
import Paper from '@material-ui/core/Paper';

export default class NoMetaMask extends React.PureComponent {
    render() {
        return (
            <Paper {...css('metamask-need-card')}>
                <Typography variant="body1" color="primary" {...css('text')}>
                    Install MetaMask to continue...
                </Typography>
                <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                    <img src={metaMaskDownloadImage} alt="" width="400" height="121"/>
                </a>
            </Paper>
        );
    }
}