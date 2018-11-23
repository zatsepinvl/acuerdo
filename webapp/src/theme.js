import {createMuiTheme} from '@material-ui/core/styles';
import {blueGrey, orange, red} from '@material-ui/core/colors';

export const theme = createMuiTheme({
    palette: {
        primary: {main: blueGrey[800]},
        secondary: {main: orange[500]},
        error: red,
    },
});