import React, { useState, useEffect, useContext } from 'react'
import { Container, Card, CardContent, Box, Checkbox, TextField, Grid, FormControlLabel, IconButton, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Add';
import CardTitle from "../../../components/CardTitle";
import http from '../../../http'
import { useSnackbar } from 'notistack'
import { Form, useNavigate, useParams } from 'react-router-dom'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { PersonAddRounded } from '@mui/icons-material';
import { CategoryContext } from './AdminActivitiesRoutes';

function EditActivity() {
    //const { user } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { setActivePage } = useContext(CategoryContext);
    const { id: activityId } = useParams();
    const[activity, setActivity] = useState({
            name: "",
            expiryDate: "",
            description: "",
            category:"",
            ntucExclusive:"",
            ageLimit:"",
            location:"",
            company:"",
            discountType:"",
            discountAmount:""
    })

    const handleGetActivity = () => {
        http.get(`/Admin/Activity/${activityId}`).then((res) => {
            if (res.status === 200) {
                setActivity(res.data)
                //setLoading(false)
                formik.setValues(res.data);
            }
        })
    }

    const formik = useFormik({
        initialValues: {
            /*name: activity.name,
            expiryDate: activity.expiryDate,
            description: activity.description,
            category:activity.category,
            ntucExclusive:activity.ntucExclusive,
            ageLimit:activity.ageLimit,
            location:activity.location,
            company:activity.company,
            discountType:activity.discountType,
            discountAmount:activity.discountAmount*/

            name: "",
            expiryDate: "",
            description: "",
            category: "",
            ntucExclusive: "",
            ageLimit: "",
            location: "",
            company: "",
            discountType: "",
            discountAmount: ""
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

            http.put(`/Admin/Activity/${activityId}`, data).then((res) => {
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
        handleGetActivity()
        
    }, [])

    return (
        <>
            <Box sx={{ marginY: "1rem" }}>
                <Card>

                    <CardContent>
                        <CardTitle title="Edit Activity" icon={<PersonAddRounded />} />
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
                                    <TextField
                                        fullWidth
                                        id="description"
                                        name="description"
                                        label="Description"
                                        variant="outlined"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        error={formik.touched.description && Boolean(formik.errors.description)}
                                        helperText={formik.touched.description && formik.errors.description}
                                    />
                                    <TextField
                                        fullWidth
                                        id="ntucExclusive"
                                        name="ntucExclusive"
                                        label="ntucExclusive"
                                        variant="outlined"
                                        value={formik.values.ntucExclusive}
                                        onChange={formik.handleChange}
                                        error={formik.touched.ntucExclusive && Boolean(formik.errors.ntucExclusive)}
                                        helperText={formik.touched.ntucExclusive && formik.errors.ntucExclusive}
                                    />
                                    <TextField
                                        fullWidth
                                        id="ageLimit"
                                        name="ageLimit"
                                        label="ageLimit"
                                        variant="outlined"
                                        value={formik.values.ageLimit}
                                        onChange={formik.handleChange}
                                        error={formik.touched.ageLimit && Boolean(formik.errors.ageLimit)}
                                        helperText={formik.touched.ageLimit && formik.errors.ageLimit}
                                    />
                                    <TextField
                                        fullWidth
                                        id="location"
                                        name="location"
                                        label="location"
                                        variant="outlined"
                                        value={formik.values.location}
                                        onChange={formik.handleChange}
                                        error={formik.touched.location && Boolean(formik.errors.location)}
                                        helperText={formik.touched.location && formik.errors.location}
                                    />

                                    <TextField
                                        fullWidth
                                        id="company"
                                        name="company"
                                        label="company"
                                        variant="outlined"
                                        value={formik.values.company}
                                        onChange={formik.handleChange}
                                        error={formik.touched.company && Boolean(formik.errors.company)}
                                        helperText={formik.touched.company && formik.errors.company}
                                    />
                                    <TextField
                                        fullWidth
                                        id="discountType"
                                        name="discountType"
                                        label="discountType"
                                        variant="outlined"
                                        value={formik.values.discountType}
                                        onChange={formik.handleChange}
                                        error={formik.touched.discountType && Boolean(formik.errors.discountType)}
                                        helperText={formik.touched.discountType && formik.errors.discountType}
                                    />
                                    <TextField
                                        fullWidth
                                        id="discountAmount"
                                        name="discountAmount"
                                        label="discountAmount"
                                        variant="outlined"
                                        value={formik.values.discountAmount}
                                        onChange={formik.handleChange}
                                        error={formik.touched.discountAmount && Boolean(formik.errors.discountAmount)}
                                        helperText={formik.touched.discountAmount && formik.errors.discountAmount}
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
                                Edit Activity
                            </LoadingButton>
                        </Box>

                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default EditActivity