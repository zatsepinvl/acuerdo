import React from 'react';
import PropTypes from 'prop-types';

class HashView extends React.PureComponent {
    render() {
        const {hash, className} = this.props;
        const prefix = hash && hash.substr(0, 6);
        const postfix = hash && hash.substr(hash.length - 4, 4);
        return (
            <span className={className}>{prefix}...{postfix}</span>
        );
    }
}

HashView.propTypes = {
    className: PropTypes.string,
    hash: PropTypes.string,
};

export default HashView;