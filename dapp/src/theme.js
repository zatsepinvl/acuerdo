import {createMuiTheme} from '@material-ui/core/styles';
import {blueGrey, indigo, red} from '@material-ui/core/colors';

export const theme = createMuiTheme({
    palette: {
        primary: {main: blueGrey[800]},
        secondary: indigo,
        error: red,
    },
});