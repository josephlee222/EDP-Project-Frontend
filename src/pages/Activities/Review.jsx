import React, { useState, useEffect, useContext } from 'react'
import { Container, Card, CardContent, Box, Checkbox, TextField, Grid, FormControlLabel, IconButton, Typography, RadioGroup, Radio } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Add';
import CardTitle from "../../components/CardTitle";
import http from '../../http'
import { useSnackbar } from 'notistack'
import { Form, useNavigate, useParams } from 'react-router-dom'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { AddRounded, PersonAddRounded } from '@mui/icons-material';
import titleHelper from '../../functions/helpers';
import { AppContext } from "../../App";


function CreateReview() {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { id: activityId } = useParams();
    const { setActivePage } = useContext(AppContext);
    const [activity, setActivity] = useState([]);
      const handleGetActivity = () => {
        setLoading(true);
        http.get(`/Activity/${activityId}`).then((res) => {
          if (res.status === 200) {
            setActivity(res.data);
            setLoading(false);
            
          }
        });
      };
      


    titleHelper("Book Activity")



    const formik = useFormik({
        initialValues: {
            description: "",
            rating: 0,
            
        },
        validationSchema: Yup.object({
            description: Yup.string().required("description is required"),
            rating: Yup.number().required("Discount Amount is required"),

            
        }),
        onSubmit: (data) => {
            setLoading(true);
            
            console.log(data)
            data.ActivityId = activityId;


            http.post("/Review", data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("Booking successful!", { variant: "success" });
                    console.log("success yayyyy")
                    navigate("/profile/booking")
                } else {
                    enqueueSnackbar("Booking failed!.", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Booking failed! " + err.response.data.error, { variant: "error" });
                setLoading(false);
            })
        }
    })

    useEffect(() => {
        handleGetActivity();
    }, []
    
    )

    return (
        <>
            <Box sx={{ marginY: "1rem" }}>
                <Card>

                    <CardContent>
                        <CardTitle title={`Booking Activity: ${activity.name}`} icon={<AddRounded />} />
                        <div>{activity.name}</div>
                        <Box component="form" mt={3}>

                            <Grid container spacing={2}>
                            
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="rating"
                                        name="rating"
                                        label="rating"
                                        variant="outlined"
                                        value={formik.values.rating}
                                        onChange={formik.handleChange}
                                        error={formik.touched.rating && Boolean(formik.errors.rating)}
                                        helperText={formik.touched.rating && formik.errors.rating}
                                        type='number'
                                    />
                                    <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="description"
                                        name="description"
                                        label="description"
                                        variant="outlined"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        error={formik.touched.description && Boolean(formik.errors.description)}
                                        helperText={formik.touched.description && formik.errors.description}
                                    />
                                </Grid>
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
                                Create Review
                            </LoadingButton>


                        </Box>

                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default CreateReview