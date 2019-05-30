import React from 'react';
import PropTypes from 'prop-types';
import {statuses} from "../consts/channelsSatutes";
import BlockIcon from '@material-ui/icons/Block';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import VerticalAlignIcon from '@material-ui/icons/VerticalAlignBottom';
import {withStyles} from '@material-ui/core/styles';
import {green, grey} from '@material-ui/core/colors';

const statusMapping = {
    PENDING: {
        text: 'Pending...',
        icon: VerticalAlignIcon,
    },
    OPENED: {
        text: 'Opened',
        icon: AttachMoneyIcon,
    },
    CLOSED: {
        text: 'Closed',
        icon: BlockIcon
    }
};
const styles = theme => ({
    box: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    OPENED: {
        color: green[900]
    },
    CLOSED: {
        color: grey[500]
    },
    PENDING: {
        color: green[400]
    }
});

class ChannelStatus extends React.Component {
    render() {
        const status = this.props.status;
        const {text, icon: Icon} = statusMapping[status];
        const classes = this.props.classes;
        const statusClassName = classes[status];
        return (
            <div className={classes.box + ' ' + statusClassName}>
                <Icon/>
                <span>{text}</span>
            </div>
        )
    }
}

ChannelStatus.propTypes = {
    status: PropTypes.oneOf(statuses).isRequired
};
export default withStyles(styles)(ChannelStatus);
