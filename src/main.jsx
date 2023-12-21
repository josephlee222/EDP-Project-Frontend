import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createTheme, ThemeProvider } from '@mui/material';
import { grey } from '@mui/material/colors';
import { responsiveFontSizes } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

let fonts = [
    'Nunito',
    'Nunito Sans',
    'Roboto',
    '"Segoe UI"',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
].join(',');

// Theme for the website, configure it here
let theme = createTheme({
    palette: {
        primary: {
            main: "#0f6d51",
            light: "#b2cfc6",
        },
        secondary: {
            main: grey[500],
        },
        blue: {
            main: "#0083CA",
        },
        yellow: {
            main: "#faf2e9",
            dark: "#c49451",
        },
        white: {
            main: "#ffffff",
        }
    },
    typography: {
        fontFamily: fonts,
        "fontWeightLight": 300,
        "fontWeightRegular": 400,
        "fontWeightMedium": 500,
        "fontWeightBold": 700,
    },
    components: {
        MuiTypography: {
            defaultProps: {
                fontFamily: fonts,
            },
        },
    },
});

theme = responsiveFontSizes(theme);

ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
        <BrowserRouter>
            <SnackbarProvider maxSnack={3}>
                <App />
            </SnackbarProvider>
        </BrowserRouter>
    </ThemeProvider>,
)
