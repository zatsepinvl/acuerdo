import React from 'react';
import {inject, observer} from "mobx-react";

import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Loader from "../../common/Loader";
import ChannelDetails from "./ChannelDetails";
import ChannelPayments from "./ChannelPayments";
import ChannelTransactions from "./ChannelTransactions";

const styles = {
    paymentsTitle: {
        flexGrow: 1
    },
    noPaymentsText: {
        paddingBottom: 16
    }
};

@inject('channelStore')
@observer
class Channel extends React.Component {
    componentDidMount() {
        const channelId = this.props.match.params.id;
        this.props.channelStore.loadChannel(channelId);
    }

    componentWillUnmount() {
        this.props.channelStore.reset();
    }

    render() {
        const {loaded, channel} = this.props.channelStore;
        if (!loaded) {
            return <Loader caption="Loading channel..."/>;
        }
        return (
            <React.Fragment>
                <Grid container spacing={16}>
                    <Grid item xs={4}>
                        <ChannelDetails/>
                    </Grid>
                    <Grid item xs={4}>
                        <ChannelPayments/>
                    </Grid>
                    <Grid item xs={4}>
                        <ChannelTransactions channel={channel}/>
                    </Grid>
                </Grid>

            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Channel);