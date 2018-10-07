import React from 'react';
import {observer, inject} from 'mobx-react';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
    tableRow: {
        cursor: 'pointer',
    },
    createNewButton: {},
    title: {
        flexGrow: 1
    }
});

@inject('channelStore')
@observer
class ChannelsList extends React.Component {

    handleOnCreateNewClicked = () => {
        this.props.history.push('/channel/new');
    };

    render() {
        const {classes, channelStore} = this.props;
        const {channels} = channelStore;
        return (
            <div>
                <Toolbar>
                    <Typography variant="title" color="inherit"
                                className={classes.title}>
                        My Channels
                    </Typography>
                    <Button variant="contained" color="secondary"
                            className={classes.createNewButton}
                            onClick={this.handleOnCreateNewClicked}>
                        Create New
                    </Button>
                </Toolbar>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Channel Id</TableCell>
                                <TableCell>Recipient</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {channels.map(channel => {
                                return (
                                    <TableRow key={channel.channelId}
                                              className={classes.tableRow}
                                              hover
                                              onClick={event => console.log(event + channel.channelId)}>
                                        <TableCell component="th"
                                                   scope="row">
                                            {channel.channelId.substr(0, 6)}...{channel.channelId.substr(62, 4)}
                                        </TableCell>
                                        <TableCell>0x0dae...3d69</TableCell>
                                        <TableCell>1.0 ETH</TableCell>
                                        <TableCell>10 10 2018</TableCell>
                                        <TableCell>Opened</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(ChannelsList);