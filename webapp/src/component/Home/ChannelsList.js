import React from 'react';
import {inject, observer} from 'mobx-react';

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

import HashView from "../../common/HashView";
import AmountView from "../../common/AmountView";
import TimeView from "../../common/TimeView";

import web3Service from "../../services/web3Service";
import Loader from "../../common/Loader";
import ChannelStatus from "../../common/ChannelStatus";

const styles = (theme) => ({
    root: {
        minWidth: 900
    },
    tableRow: {
        cursor: 'pointer',
    },
    toolbar: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    title: {
        flexGrow: 1
    },
    createNewButton: {},
});

@inject('channelsStore')
@observer
class ChannelsList extends React.Component {

    componentDidMount() {
        this.props.channelsStore.loadChannels();
    }

    handleCreateNewClicked = () => {
        this.props.history.push('/channel/new');
    };

    handleChannelClicked = (event, id) => {
        this.props.history.push(`/channel/${id}`);
    };

    renderYou(address) {
        return web3Service.account === address && ' (you)'
    }

    renderLoader() {
        return <Loader caption="Loading channels..."/>
    }

    renderChannelsTable() {
        const {classes, channelsStore} = this.props;
        const {channels} = channelsStore;
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Channel Name</TableCell>
                        <TableCell>Channel Id</TableCell>
                        <TableCell>Sender</TableCell>
                        <TableCell>Recipient</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {channels.map(channel => {
                        const {channelName, sender, recipient, value, createdAt, status, channelId: id} = channel;
                        return (
                            <TableRow key={id}
                                      className={classes.tableRow}
                                      hover
                                      onClick={event => this.handleChannelClicked(event, id)}>
                                <TableCell>
                                    {channelName || '(none)'}
                                </TableCell>
                                <TableCell>
                                    <HashView hash={id}/>
                                </TableCell>
                                <TableCell>
                                    <HashView hash={sender}/>
                                    {this.renderYou(sender)}
                                </TableCell>
                                <TableCell>
                                    <HashView hash={recipient}/>
                                    {this.renderYou(recipient)}
                                </TableCell>
                                <TableCell>
                                    <AmountView value={value} currency="ETH"/>
                                </TableCell>
                                <TableCell>
                                    <TimeView time={createdAt}/>
                                </TableCell>
                                <TableCell>
                                    <ChannelStatus status={status}/>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        )
    }

    render() {
        const {classes, channelsStore} = this.props;
        const {loaded, channels} = channelsStore;
        if (!loaded) {
            return this.renderLoader();
        }
        return (
            <Paper className={classes.root}>
                <Toolbar>
                    <Typography variant="title" color="inherit"
                                className={classes.title}>
                        My Channels
                    </Typography>
                    <Button variant="contained" color="secondary"
                            className={classes.createNewButton}
                            onClick={this.handleCreateNewClicked}>
                        Create New
                    </Button>
                </Toolbar>
                {!channels.length && (
                    <Typography variant="caption" align="center" paragraph gutterBottom>
                        No channels yet
                    </Typography>
                )}
                {!!channels.length && this.renderChannelsTable()}
            </Paper>
        );
    }
}

export default withStyles(styles)(ChannelsList);