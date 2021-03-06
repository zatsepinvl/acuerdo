import React from 'react';
import PropTypes from 'prop-types';

class A extends React.PureComponent {
    render() {
        const {href, target, underlined, children} = this.props;
        const style = {
            textDecoration: underlined ? 'underlined' : 'none'
        };
        return (
            <a href={href} target={target} style={style}
               rel="noopener noreferrer">
                {children}
            </a>
        )
    }
}

A.propTypes = {
    href: PropTypes.string,
    target: PropTypes.string,
    underlined: PropTypes.bool
};

A.defaultProps = {
    target: '_blank',
    underlined: false
};

export default A;
