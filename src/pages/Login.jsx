import React, { useState, useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from '@greatsumini/react-facebook-login';
import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Card, Grid, CardContent, Box, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, useTheme, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CardTitle from "../components/CardTitle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import LoginIcon from '@mui/icons-material/LoginRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import GoogleIcon from '@mui/icons-material/Google';
import CloseIcon from '@mui/icons-material/CloseRounded';
import LockResetIcon from '@mui/icons-material/LockResetRounded';
import RefreshIcon from '@mui/icons-material/RefreshRounded';
import http from "../http";
import { AppContext } from "../App";
import PageHeader from "../components/PageHeader";
import { HubConnectionBuilder } from "@microsoft/signalr";
import titleHelper from "../functions/helpers";


export default function Login() {
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resetPasswordDialog, setResetPasswordDialog] = useState(false);
    const [resendDialog, setResendDialog] = useState(false);
    const [loginType, setLoginType] = useState("email");
    const { enqueueSnackbar } = useSnackbar();
    const { setUser, setConnection, setNotifications } = useContext(AppContext);
    const navigate = useNavigate();
    const theme = useTheme();
    titleHelper("Login");

    const handleResetPasswordDialog = () => {
        setResetPasswordDialog(true);
    }

    const handleResetPasswordDialogClose = () => {
        setResetPasswordDialog(false);
    }

    const handleResendDialog = () => {
        setResendDialog(true);
    }

    const handleResendDialogClose = () => {
        setResendDialog(false);
    }

    const handleStartSignalR = () => {
        // Create a new connection to the actions hub
        const connect = new HubConnectionBuilder()
            .withUrl(import.meta.env.VITE_API_URL + "/hubs/actions")
            .withAutomaticReconnect()
            .build();

        setConnection(connect);
    }

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("E-mail is required"),
            password: Yup.string().required("Password is required"),
        }),
        onSubmit: (data) => {
            setLoading(true);
            //enqueueSnackbar("Logging in...", { variant: "info" });
            data.email = data.email.trim();
            data.password = data.password.trim();
            http.post("/User/Login", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Login successful. Welcome back!", { variant: "success" });
                    // Store token in local storage
                    localStorage.setItem("token", res.data.token);
                    // Set user context
                    setUser(res.data.user);
                    // Set notifications
                    setNotifications(res.data.user.notifications);
                    handleStartSignalR();
                    navigate("/")
                } else {
                    enqueueSnackbar("Login failed! Check your e-mail and password.", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                if (err.response) {
                    enqueueSnackbar("Login failed! " + err.response.data.error, { variant: "error" });
                    setLoading(false);
                } else {
                    enqueueSnackbar("Login failed! " + err.message, { variant: "error" });
                    setLoading(false);
                }
            })
        }

    })

    const resetFormik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
        }),
        onSubmit: (data) => {
            setResetLoading(true);
            data.email = data.email.trim();
            http.post("/User/Forgot", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Password reset e-mail sent!", { variant: "success" });
                    setResetPasswordDialog(false);
                    setResetLoading(false);
                } else {
                    enqueueSnackbar("Password reset failed! Check your e-mail.", { variant: "error" });
                    setResetLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Password reset failed! " + err.response.data.message, { variant: "error" });
                setResetLoading(false);
            })
        }
    })


    // Currently not in use
    const resendFormik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
        }),
        onSubmit: (data) => {
            setResendLoading(true);
            data.email = data.email.trim();
            http.post("/User/Resend", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Verification e-mail sent!", { variant: "success" });
                    setResendDialog(false);
                    setResendLoading(false);
                } else {
                    enqueueSnackbar("Verification e-mail failed! Check your e-mail.", { variant: "error" });
                    setResendLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Verification e-mail failed! " + err.response.data.message, { variant: "error" });
                setResendLoading(false);
            })
        }
    })

    const googleAuth = useGoogleLogin({
        onSuccess: async (res) => {
            setLoading(true);
            setLoginType("google");
            http.post("/User/Google", { token: res.access_token }).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Login successful. Welcome back!", { variant: "success" });
                    // Store token in local storage
                    localStorage.setItem("token", res.data.token);
                    // Set user context
                    setUser(res.data.user);
                    setNotifications(res.data.user.notifications);
                    handleStartSignalR();
                    navigate("/")
                } else {
                    enqueueSnackbar("Login failed! " + err.response.data.error, { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Login failed! " + err.response.data.error, { variant: "error" });
                setLoading(false);
            })
        },
    });

    const handleFacebookSuccess = async (res) => {
        setLoading(true);
        setLoginType("facebook");
        console.log(res.accessToken);
        http.post("/User/Facebook", { token: res.accessToken }).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("Login successful. Welcome back!", { variant: "success" });
                // Store token in local storage
                localStorage.setItem("token", res.data.token);
                // Set user context
                setUser(res.data.user);
                setNotifications(res.data.user.notifications);
                handleStartSignalR();
                navigate("/")
            } else {
                enqueueSnackbar("Login failed! " + err.response.data.error, { variant: "error" });
                setLoading(false);
            }
        }).catch((err) => {
            enqueueSnackbar("Login failed! " + err.response.data.error, { variant: "error" });
            setLoading(false);
        })
    }

    const handleFacebookFailure = (err) => {
        console.log(err);
        if (err.status === "loginCancelled") {
            enqueueSnackbar("Login failed! Cancelled by user.", { variant: "error" });
            setLoading(false);
        } else {
            enqueueSnackbar("Login failed! " + err.status, { variant: "error" });
            setLoading(false);
        }
    }


    return (
        <>
            <PageHeader icon={LoginIcon} title="Welcome Back" navTitle="Login" />
            <Container sx={{ mt: "2rem", mb: "1rem" }} maxWidth="lg">
                <Grid container spacing={2} justifyContent={"center"} mb={"2rem"}>
                    <Grid item xs={6} md={2}>
                        <Button variant="contained" fullWidth sx={{ fontWeight: 700 }}>Login</Button>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <Button variant="secondary" fullWidth sx={{ fontWeight: 700 }} LinkComponent={Link} to="/register">Register</Button>
                    </Grid>
                </Grid>
                <Grid container spacing={2} justifyContent={"center"}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <CardTitle title="Login with E-mail" icon={<PasswordRoundedIcon />} />
                                <Box component="form" onSubmit={formik.handleSubmit}>
                                    <TextField
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="E-mail Address"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                        sx={{ mt: 3 }}
                                    />
                                    <TextField
                                        fullWidth
                                        id="password"
                                        name="password"
                                        label="Password"
                                        type="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
                                        sx={{ mt: 1 }}
                                    />
                                    <LoadingButton
                                        fullWidth
                                        variant="contained"
                                        type="submit"
                                        sx={{ mt: "1rem" }}
                                        loading={loading}
                                    >
                                        Login
                                    </LoadingButton>
                                    <Stack direction={["column", "column", "row"]} sx={{ mt: "1rem" }}>
                                        <Button
                                            fullWidth
                                            variant="secondary"
                                            component={Link}
                                            onClick={handleResetPasswordDialog}
                                            sx={{ mr: { xs: 0, md: "1rem" } }}
                                        >
                                            Forgot password?
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="secondary"
                                            component={Link}
                                            onClick={handleResendDialog}
                                            sx={{ mt: { xs: "1rem", md: 0 } }}
                                        >
                                            Resend verification
                                        </Button>
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <CardTitle title="Login via other methods" icon={<KeyRoundedIcon />} />
                                <Button fullWidth variant="contained" sx={{ mt: "1rem" }} disabled startIcon={<KeyRoundedIcon />}>
                                    Login with PassKey
                                </Button>
                                <LoadingButton fullWidth variant="contained" sx={{ mt: "1rem" }} startIcon={<GoogleIcon />} onClick={googleAuth} loading={loading}>
                                    Login with Google
                                </LoadingButton>
                                <FacebookLogin
                                    appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                                    onSuccess={handleFacebookSuccess}
                                    onFail={handleFacebookFailure}
                                    render={({ onClick, logout }) => (
                                        <LoadingButton fullWidth variant="contained" sx={{ mt: "1rem" }} onClick={onClick} startIcon={<FacebookRoundedIcon />} loading={loading}>
                                            Login with Facebook
                                        </LoadingButton>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Dialog open={resetPasswordDialog} onClose={handleResetPasswordDialogClose}>
                <DialogTitle>Forgot Password</DialogTitle>
                <Box component="form" onSubmit={resetFormik.handleSubmit}>
                    <DialogContent sx={{ paddingTop: 0 }}>
                        <DialogContentText>
                            To reset your password, please enter your e-mail address below. We will send you a link to reset your password.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="E-mail Address"
                            type="email"
                            name="email"
                            fullWidth
                            variant="standard"
                            value={resetFormik.values.email}
                            onChange={resetFormik.handleChange}
                            error={resetFormik.touched.email && Boolean(resetFormik.errors.email)}
                            helperText={resetFormik.touched.email && resetFormik.errors.email}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleResetPasswordDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                        <LoadingButton type="submit" loadingPosition="start" loading={resetLoading} variant="text" color="primary" startIcon={<LockResetIcon />}>Reset</LoadingButton>
                    </DialogActions>
                </Box>
            </Dialog>
            <Dialog open={resendDialog} onClose={handleResendDialogClose}>
                <DialogTitle>Resend Verification E-mail</DialogTitle>
                <Box component="form" onSubmit={resendFormik.handleSubmit}>
                    <DialogContent sx={{ paddingTop: 0 }}>
                        <DialogContentText>
                            To resend your verification e-mail, please enter your e-mail address below. We will send you a link to verify your account.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="email"
                            label="E-mail Address"
                            type="email"
                            name="email"
                            fullWidth
                            variant="standard"
                            value={resendFormik.values.email}
                            onChange={resendFormik.handleChange}
                            error={resendFormik.touched.email && Boolean(resendFormik.errors.email)}
                            helperText={resendFormik.touched.email && resendFormik.errors.email}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleResendDialogClose} startIcon={<CloseIcon />}>Cancel</Button>
                        <LoadingButton type="submit" loadingPosition="start" loading={resendLoading} variant="text" color="primary" startIcon={<RefreshIcon />}>Resend E-mail</LoadingButton>
                    </DialogActions>
                </Box>
            </Dialog>
        </>

    );
}