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
import { CategoryContext } from './AdminActivitiesRoutes';

function CreateActivity() {

    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { setActivePage } = useContext(CategoryContext);

    const formik = useFormik({
        initialValues: {
            name: "",
            expiryDate: "",
            //description: "",
            //category:"",
            //ntucExclusive:"",
            //ageLimit:"",
            //location:"",
            //company:"",
            //discountType:"",
            //discountAmount:""
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            expiryDate: Yup.date().required("Date is required")
        }),
        onSubmit: (data) => {
            setLoading(true);
            data.name = data.name.trim();
            data.expiryDate = data.expiryDate.trim();
            console.log(data)

            http.post("/Admin/Activity/", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Activity created successfully!", { variant: "success" });
                    navigate("/admin/users")
                } else {
                    enqueueSnackbar("Activity creation failed!.", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Activity creation failed! " + err.response.data.error, { variant: "error" });
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
                        <CardTitle title="Create Activity" icon={<PersonAddRounded />} />
                        <Box component="form" mt={3}>
                            
                            <Grid container spacing={2}>
                                
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
                                    <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="expiryDate"
                                        name="expiryDate"
                                        label="Expiry Date"
                                        variant="outlined"
                                        value={formik.values.expiryDate}
                                        onChange={formik.handleChange}
                                        error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
                                        helperText={formik.touched.expiryDate && formik.errors.expiryDate}
                                    />
                                </Grid>
                            </Grid>
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
                                Create Activity
                            </LoadingButton>
                        </Box>

                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default CreateActivity