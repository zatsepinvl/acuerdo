import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class TimeView extends React.PureComponent {
    render() {
        const {className, time, format, placeholder} = this.props;
        const value = time ? moment(time).format(format) : placeholder;
        return (
            <span className={className}>{value}</span>
        )
    }
}

TimeView.propTypes = {
    className: PropTypes.string,
    time: PropTypes.any,
    format: PropTypes.string,
    placeholder: PropTypes.string,
};

TimeView.defaultProps = {
    format: 'MMMM Do YYYY, HH:mm',
    placeholder: '(pending)'
};

export default TimeView;