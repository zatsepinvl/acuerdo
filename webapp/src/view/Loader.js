import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const styles = {
    box: {

        display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center',
    },
    cover: {
        backgroundColor: 'rgba(253, 253, 253, 0.9)', zIndex: 999
    },
    caption: {
        marginTop: 10
    },
    positions: {
        absolute: {
            position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
        }

    }
};

class Loader extends React.PureComponent {
    render() {
        const {caption, show, cover, position} = this.props;
        if (!show) {
            return false;
        }
        let style = {
            ...styles.box,
            ...(cover ? styles.cover : {}),
            ...(position ? styles.positions[position] : {})
        };
        return (
            <div style={style}>
                <CircularProgress/>
                <Typography type="caption"
                            align="center"
                            style={styles.caption}
                >
                    {caption}
                </Typography>
            </div>
        )
    }
}

Loader.propTypes = {
    caption: PropTypes.string,
    show: PropTypes.bool,
    style: PropTypes.object,
    cover: PropTypes.bool,
    position: PropTypes.string,
};

Loader.defaultProps = {
    caption: 'Loading...',
    show: true
};

export default Loader;
