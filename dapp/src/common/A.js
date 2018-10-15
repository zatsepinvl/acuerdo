import React from 'react';
import PropTypes from 'prop-types';


class A extends React.PureComponent {
    render() {
        const {href, target, children} = this.props;
        return (
            <a href={href} target={target} rel="noopener noreferrer">
                {children}
            </a>
        )
    }
}

A.propTypes = {
    href: PropTypes.string,
    target: PropTypes.string,
};

A.defaultProps = {
    target: '_blank',
};

export default A;
