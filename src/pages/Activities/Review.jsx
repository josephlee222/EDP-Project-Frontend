import React, { useState, useEffect, useContext } from 'react'
import {  Container, Card, CardContent, Box, Checkbox, TextField,
    Grid, FormControlLabel, IconButton, Typography, RadioGroup, Radio, List,
    ListItem,
    ListItemText } from '@mui/material'
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
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [files, setFiles] = useState([]);


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
            pictures: [],
            
        },
        validationSchema: Yup.object({
            description: Yup.string().required("description is required"),
            rating: Yup.number().required("Discount Amount is required"),

            
        }),
        onSubmit: (data) => {
            setLoading(true);
            var pictures = []
            console.log("pictures: " + data.pictures);
            console.log(data.pictures);

            data.ActivityId = activityId;

            const formData = new FormData();
            Array.from(files).forEach((file, index) => {
                formData.append(`files`, file);
                console.log(`Appended file ${index}:`, file);
            });

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            console.log("formdata: ", formData);
            console.log(formData);

            http.post("/File/multiUpload/", formData, config).then((res) => {

                if (res.status === 200) {
                    enqueueSnackbar("Pictures uploaded successfully!", { variant: "success" });
                    console.log("res data: ", res.data);
                    const resPic = { Items: res.data };
                    console.log("respic: ", resPic);
                    data.pictures = res.data.uploadedFiles
                    console.log(pictures)
                    data.description = data.description.trim();
                    data.ActivityId = activityId;

                    console.log(data)

                    http.post("/Review/", data).then((res) => {
                        if (res.status === 200) {
                            enqueueSnackbar("Activity created successfully!", { variant: "success" });
                            navigate(`/activityList/${activityId}`)
                        } else {
                            enqueueSnackbar("Activity creation failed!.", { variant: "error" });
                            setLoading(false);
                        }
                    }).catch((err) => {
                        enqueueSnackbar("Activity creation failed! " + err.response.data.error, { variant: "error" });
                        setLoading(false);
                    })
                } else {
                    enqueueSnackbar("Pictures uploaded failed!. else", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                console.log(err)
                enqueueSnackbar("Pictures uploaded failed! catch" + err.response.data.error, { variant: "error" });
                setLoading(false);
            })
        }
        
    })

    const handlePicturesChange = (event) => {
        const files = event.target.files;

        // Convert FileList to an array
        const fileList = Array.from(files);
        // Concatenate the new array of files with the existing list of uploaded files
        const newUploadedFiles = [...uploadedFiles, ...fileList.map(file => file.name)];
        // Set the updated list of uploaded files
        setUploadedFiles(newUploadedFiles);
        // Set the array of files to the formik values
        //formik.setFieldValue('pictures', newUploadedFiles);
        // Set the files state to the selected files
        setFiles(files);

        console.log("Files state:", files);
    };

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
                                    <Grid item xs={12}>
                                        <input
                                            accept="image/*"
                                            id="pictures"
                                            name="pictures"
                                            type="file"
                                            onChange={handlePicturesChange}
                                            multiple // Allow multiple file selection
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="pictures">
                                            <IconButton
                                                color="primary"
                                                aria-label="upload picture"
                                                component="span"
                                            >
                                                <AddIcon />
                                            </IconButton>
                                            <Typography variant="body1">Upload Pictures</Typography>
                                        </label>
                                        {uploadedFiles.length > 0 && (
                                            <List>
                                                {uploadedFiles.map((fileName, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemText primary={fileName} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}
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