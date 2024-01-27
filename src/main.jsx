import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { grey } from '@mui/material/colors';
import { responsiveFontSizes } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { GoogleOAuthProvider } from '@react-oauth/google';
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
            dark: "#b22c20",
            contrastText: "#ffffff",
        },
        secondary: {
            main: grey[500],
            light: grey[300],
            dark: grey[700],
        },
        yellow: {
            main: "#FDDC02",
            light: "#fde45f",
            dark: "#7e6e01",
            contrastText: "#000000",
        },
        white: {
            main: "#ffffff",
            light: "#ffffff",
            dark: "#ffffff",
            contrastText: "#000000",
        },
        background: {
            paper: "#EEEEEE",
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
                elevation: 0,
            }
        },
        MuiButton: {
            variants: [
                {
                    props: { variant: 'secondary' },
                    style: {
                        color: "#E8533F",
                        backgroundColor: "#E8533F32",
                        '&:hover': {
                            backgroundColor: "#E8533F80",
                        },
                    },
                },
            ]
        },
        MuiDialogTitle: {
            defaultProps: {
                style: {
                    fontWeight: 700,
                }
            }
        },
        MuiCardContent: {
            defaultProps: {
                style: {
                    padding: 16,
                    "&:last-child": {
                        paddingBottom: 0,
                    },
                }
            },
        },
    },
    shape: {
        borderRadius: 20,
    },

});

theme = responsiveFontSizes(theme);

ReactDOM.createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <SnackbarProvider maxSnack={3}>
                    <App />
                </SnackbarProvider>
            </BrowserRouter>
        </ThemeProvider>,
    </GoogleOAuthProvider>

)
