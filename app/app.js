/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router/immutable';
import history from 'utils/history';
import 'sanitize.css/sanitize.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

// Load the favicon and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import '!file-loader?name=[name].[ext]!./assets/js/appConfig.js';
import '!file-loader?name=[name].[ext]!../css/api.js';
// import '!file-loader?name=[name].[ext]!../css/diagram.bpmn';
import 'file-loader?name=.htaccess!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

import './assets/scss/custom-boostrap.css';
import '!file-loader?name=[name].[ext]!../css/base64.js';
import '!file-loader?name=[name].[ext]!../css/vgcaplugin.js';

import '!file-loader?name=[name].[ext]!../css/abc.woff2';
import '!file-loader?name=[name].[ext]!../css/material.icon.css';
import '!file-loader?name=[name].[ext]!../css/dhtmlxgantt.css';
import '!file-loader?name=[name].[ext]!../css/dhtmlxgantt.js';
import '!file-loader?name=[name].[ext]!../css/dx.common.css';
import '!file-loader?name=[name].[ext]!../css/dx.material.blue.light.css';
import '!file-loader?name=[name].[ext]!../css/material.css';
import '!file-loader?name=[name].[ext]!../css/all.css';
import '!file-loader?name=[name].[ext]!../css/allA.css';

import '!file-loader?name=[name].[ext]!../css/roboto.min.css';

import configureStore from './configureStore';
import './index.css';
import './assets/scss/custom-boostrap.css';

// Import i18n messages
import { translationMessages } from './i18n';

const theme = createMuiTheme({
  direction: 'ltr',
  palette: {
    primary: {
      light: '#61c5ff',
      main: '#2196F3',
      dark: '#0067a9',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#fff',
    },
    success: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#fff',
    },
    action: {
      // selected: '#00ACC1',
      // hover: '#00ACC1',
      // disabled: '#9B9B9B',
    },
  },
  typography: {
    useNextVariants: true,
    suppressDeprecationWarnings: true,
  },
  spacing: 4,
  overrides: {
    MuiCard: {
      root: {
        overflow: 'visible'
      }
    },
    MuiOutlinedInput: {
      input: {
        paddingRight: 8,
        paddingLeft: 8,
        paddingBottom: '14.5px',
        paddingTop: '14.5px'
      },
      inputMarginDense: {
        paddingBottom: '14.5px',
        paddingTop: '14.5px'
      }
    },

    MuiTablePagination: {
      toolbar: {
        height: '28px',
        minHeight: '28px !important',
      }
    },
    MuiTable: {
      root: {
        marginBottom: '0px !important;'

      }
    },
    MuiPaper: {
      elevation4: {
        boxShadow: 'none'

      }
    },

    TableContainer: {
      root: {
        maxHeight: "calc(100vh - 280px);",
        height: 'auto',
      }
    },
    MuiTableCell: {
      head: {
        color: 'rgb(0 0 0 / 85%)',
      }
    },
    MuiToolbar: {
      regular: {
        minHeight: '58px!important',
        maxHeight: '58px!important',
      }
    },
    MuiFormLabel: {
      disabled: {
        color: '#000!important'
      },

    },
    MuiInputLabel: {
      outlined: {
        color: '#000!important'
      },

    },
    MuiTab: {
      labelContainer: {
        padding: '6px 20px !important',
      },
    },
    MuiBadge: {
      badge: {
        top: '-3px',
        right: '-8px',
        lineHeight: '20px'
      }
    },
    // MuiButton:{
    //   root:{
    //     fontWeight: 600
    //   },

    //   // text:{
    //   //   color: 'white'
    //   // }
    // },
    SortLabel: {
      sortLabelRoot: {
        fontWeight: 'bold',
      }
    },
    MuiInputBase: {
      root: {
        color: 'rgba(0,0,0,1) !important;',

      },
      disabled: {
        backgroundColor: '#dedddda8'
      }
    },
  },

});

// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');
const container = document.getElementById('tryit-jssip-container');
const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <SnackbarProvider>
        <LanguageProvider messages={messages}>
          <ConnectedRouter history={history}>
            <MuiThemeProvider theme={theme}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <App />
              </MuiPickersUtilsProvider>
            </MuiThemeProvider>
          </ConnectedRouter>
        </LanguageProvider>
      </SnackbarProvider>
    </Provider>,
    MOUNT_NODE,
    container,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}
// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
