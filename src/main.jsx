import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createTheme, ThemeProvider } from '@mui/material';
import { grey } from '@mui/material/colors';
import { responsiveFontSizes } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import './index.css'

let fonts = [
    'Nunito',
    '"Nunito Sans"',
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
            main: "#E8533F",
            light: "#ef8476",
        },
        secondary: {
            main: grey[500],
        },
        yellow: {
            main: "#FDDC02",
            dark: "#7e6e01",
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
        MuiCard: {
            defaultProps: {
                elevation: 10,
            },
        },
    },
    shape: {
        borderRadius: 20,
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
