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


function CreateBooking() {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { id: activityId } = useParams();
    const { setActivePage } = useContext(AppContext);
    const [availability, setAvailability] = useState([]);
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
      

    const handleGetAvailabilities = () => {
        http.get("/Availabilities/").then((res) => {
            if (res.status === 200) {
                setAvailability(res.data)
                setLoading(false)
            }
        })
    }



    titleHelper("Book Activity")



    const formik = useFormik({
        initialValues: {
            date: "",
            pax: 0,
            
        },
        validationSchema: Yup.object({
            date: Yup.date().required("Date is required"),
            pax: Yup.number().required("Discount Amount is required"),

            
        }),
        onSubmit: (data) => {
            setLoading(true);
            
            console.log(data)
            data.activityId = activityId;


            http.post("/Booking", data).then((res) => {
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
        handleGetAvailabilities();
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
                                        id="date"
                                        name="date"
                                        label="Date"
                                        variant="outlined"
                                        value={formik.values.date}
                                        onChange={formik.handleChange}
                                        error={formik.touched.date && Boolean(formik.errors.date)}
                                        helperText={formik.touched.date && formik.errors.date}
                                        type='date'
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="pax"
                                        name="pax"
                                        label="pax"
                                        variant="outlined"
                                        value={formik.values.pax}
                                        onChange={formik.handleChange}
                                        error={formik.touched.pax && Boolean(formik.errors.pax)}
                                        helperText={formik.touched.pax && formik.errors.pax}
                                        type='number'
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
                                Book
                            </LoadingButton>


                        </Box>

                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default CreateBooking