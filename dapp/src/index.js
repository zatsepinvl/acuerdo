import React from 'react';
import ReactDOM from 'react-dom';
import {configure} from 'mobx';
import {Provider} from 'mobx-react';
import {MuiThemeProvider} from '@material-ui/core/styles';

import './styles/index.css';
import App from './App';
import './services';
import * as stores from './stores';
import {theme} from './theme';

// For easier debugging
window._____APP_STATE_____ = stores;
// Don't allow state modifications outside actions
configure({enforceActions: 'observed'});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Provider {...stores}>
            <App/>
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
);