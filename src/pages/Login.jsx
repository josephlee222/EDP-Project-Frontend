import React, {useState, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Card, Grid, CardContent, Box, TextField, Typography } from "@mui/material";
import CardTitle from "../components/CardTitle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import LoginIcon from '@mui/icons-material/LoginRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';
import http from "../http";
import { AppContext } from "../App";


export default function Login() {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { setUser } = useContext(AppContext);
    const navigate = useNavigate();

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


    return (
        <Container>
            <Box display={"flex"} sx={{ p: "3rem", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <LoginIcon sx={{ height: "72px", width:"72px", color: "primary"}} color="primary" />

                <Typography fontWeight={700} variant="h4" component="h1" align="center">
                    Welcome Back
                </Typography>
            </Box>
            <Grid container spacing={2} justifyContent={"center"} mb={"2rem"}>
                <Grid item xs={6} md={2}>
                    <Button variant="contained" fullWidth sx={{fontWeight: 700}}>Login</Button>
                </Grid>
                <Grid item xs={6} md={2}>
                    <Button variant="secondary" fullWidth sx={{fontWeight: 700}}>Register</Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent={"center"}>
                <Grid item xs={12} md={5}>
                    <Card>
                        <CardContent>
                            <CardTitle title="Login with E-mail" icon={<PasswordRoundedIcon />} />
                            <Box component="form" onSubmit={formik.handleSubmit}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="E-mail"
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
                                <Button
                                    fullWidth
                                    variant="contained"
                                    type="submit"
                                    sx={{ mt: "1rem" }}
                                    disabled={loading}
                                >
                                    Login
                                </Button>
                                <Button
                                    fullWidth
                                    variant="text"
                                    component={Link}
                                    to="/forgot"
                                    sx={{ mt: "1rem" }}
                                >
                                    Forgot password?
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card>
                        <CardContent>
                            <CardTitle title="Login via other methods" icon={<KeyRoundedIcon />} />
                            <Button fullWidth variant="contained" sx={{ mt: "1rem" }} disabled>
                                Passkey
                            </Button>
                            <Button fullWidth variant="contained" sx={{ mt: "1rem" }} disabled>
                                Google
                            </Button>
                            <Button fullWidth variant="contained" sx={{ mt: "1rem" }} disabled>
                                Facebook
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}