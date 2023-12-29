import React, { useState, useEffect, useContext } from 'react'
import { Container, Card, CardContent, Box, Checkbox, TextField, Grid, FormControlLabel, IconButton, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Add';
import CardTitle from "../../../components/CardTitle";
import http from '../../../http'
import { useSnackbar } from 'notistack'
import { Form, useNavigate } from 'react-router-dom'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { PersonAddRounded } from '@mui/icons-material';
import { CategoryContext } from './AdminUsersRoutes';

function CreateUser() {

    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { setActivePage } = useContext(CategoryContext);

    const formik = useFormik({
        initialValues: {
            email: "",
            name: "",
            is_admin: false,
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email is required"),
            name: Yup.string().required("Name is required"),
            is_admin: Yup.boolean().optional(),
        }),
        onSubmit: (data) => {
            setLoading(true);
            data.email = data.email.trim();
            data.name = data.name.trim();

            http.post("/Admin/User", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("User created successfully! E-mail has been sent to the user.", { variant: "success" });
                    navigate("/admin/users")
                } else {
                    enqueueSnackbar("User creation failed!.", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("User creation failed! " + err.response.data.message, { variant: "error" });
                setLoading(false);
            })
        }
    })

    useEffect(() => {
        setActivePage(2);
    }, [])

    return (
        <>
            <Box sx={{ marginY: "1rem" }}>
                <Card>

                    <CardContent>
                        <CardTitle title="Create User" icon={<PersonAddRounded />} />
                        <Box component="form" mt={3}>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="E-mail Address"
                                        variant="outlined"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="name"
                                        name="name"
                                        label="Name"
                                        variant="outlined"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                    />
                                </Grid>
                            </Grid>
                            <FormControlLabel label="Is Admin" control={
                                <Checkbox
                                    id="is_admin"
                                    name="is_admin"
                                    label="Is Admin"
                                    variant="outlined"
                                    value={formik.values.is_admin}
                                    onChange={formik.handleChange}
                                    error={formik.touched.is_admin && Boolean(formik.errors.is_admin)}
                                    helperText={formik.touched.is_admin && formik.errors.is_admin}
                                />
                            } />
                            <Typography gutterBottom>When the user is created, an e-mail with an activation URL will be sent to the user to set the account password.</Typography>
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                type="submit"
                                loading={loading}
                                loadingPosition="start"
                                startIcon={<AddIcon />}
                                onClick={formik.handleSubmit}
                                fullWidth
                            >
                                Create User
                            </LoadingButton>
                        </Box>

                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default CreateUser