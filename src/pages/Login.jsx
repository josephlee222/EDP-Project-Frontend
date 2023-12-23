import React, {useState} from "react";
import { Link } from "react-router-dom";
import { Container, Button, Card, Grid, CardContent, Box, TextField, Typography } from "@mui/material";
import CardTitle from "../components/CardTitle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import LoginIcon from '@mui/icons-material/LoginRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import PasswordRoundedIcon from '@mui/icons-material/PasswordRounded';


export default function Login() {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
            password: Yup.string().required("Password is required"),
        }),
        onSubmit: (data) => {
            setLoading(true);
            data.email = data.email.trim();
            data.password = data.password.trim();
            http.post("/auth", data).then((res) => {
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
                enqueueSnackbar("Login failed! " + err.response.data.message, { variant: "error" });
                setLoading(false);
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
                                    sx={{ mt: 3 }}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    type="submit"
                                    sx={{ mt: "1rem" }}
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