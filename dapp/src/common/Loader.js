import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const styles = {
        box: {
            position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
            display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center',
        },
        cover: {
            backgroundColor: 'rgba(253, 253, 253, 0.9)', zIndex: 999
        },
        caption: {
            marginTop: 10
        }
    }
;

class Loader extends React.PureComponent {
    render() {
        const {caption, show, cover} = this.props;
        const style = {...styles.box, ...(cover ? styles.cover : {})};
        return (
            <div>
                {show && <div style={style}>
                    <CircularProgress/>
                    <Typography type="caption"
                                align="center"
                                style={styles.caption}
                    >
                        {caption}
                    </Typography>
                </div>}
            </div>
        )
    }
}

Loader.propTypes = {
    caption: PropTypes.string,
    show: PropTypes.bool,
    style: PropTypes.object,
    cover: PropTypes.bool,
};

Loader.defaultProps = {
    caption: 'Loading...',
    show: true
};

export default Loader;
