import React, { useState, useEffect, useContext } from 'react'
import {
    Container, Card, CardContent, Box, Checkbox, TextField,
    Grid, FormControlLabel, IconButton, Typography, RadioGroup, Radio, List,
    ListItem, ListItemText, Rating
} from '@mui/material'
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
import DeleteIcon from '@mui/icons-material/Delete';



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
            activityId: activityId

        },
        validationSchema: Yup.object({
            description: Yup.string().required("description is required"),
            rating: Yup.number().required("Discount Amount is required"),


        }),
        onSubmit: (data) => {

            var pictures = [];
            setLoading(true);
            console.log("pictures: " + data.pictures);
            console.log(data.pictures);

            const formData = new FormData();
            Array.from(files).forEach((file, index) => {
                formData.append(`files`, file);
                console.log(`Appended file ${index}:`, file);
            });

            console.log("formdata: ", formData);
            console.log(formData);
            console.log(formData.length);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            data.description = data.description.trim();
            const formDataEntries = formData.getAll('files');
            if (formDataEntries.length > 0) {

                http.post("/File/multiUpload/", formData, config).then((res) => {

                    if (res.status === 200) {
                        enqueueSnackbar("Pictures uploaded successfully!", { variant: "success" });
                        console.log("res data: ", res.data);
                        const resPic = { Items: res.data };
                        console.log("respic: ", resPic);
                        data.pictures = res.data.uploadedFiles
                        console.log(pictures)

                        console.log(data)

                        http.post("/Review/", data).then((res) => {
                            if (res.status === 200) {
                                enqueueSnackbar("Activity created successfully!", { variant: "success" });
                                navigate(`/activityList/${activityId}`);
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
            else {
                http.post("/Review/", data)
                    .then((res) => {
                        if (res.status === 200) {
                            enqueueSnackbar("Activity created successfully!", { variant: "success" });
                            console.log(res.data);
                            navigate(`/activityList/${activityId}`);
                        } else {
                            enqueueSnackbar("Activity creation failed!.", { variant: "error" });
                            setLoading(false);
                        }
                    })
                    .catch((err) => {
                        enqueueSnackbar("Activity creation failed! " + err.response.data.error, { variant: "error" });
                        setLoading(false);
                    });
            }



        }
    })



    const handlePicturesChange = (event) => {
        const Files = event.target.files;

        // Convert FileList to an array
        const fileList = Array.from(Files);
        const newFiles = files.concat(fileList)

        // Concatenate the new array of files with the existing list of uploaded files
        const newUploadedFiles = [...uploadedFiles, ...fileList.map(file => ({
            name: file.name,
            preview: URL.createObjectURL(file) // Generate preview URL
        }))];
        // Set the updated list of uploaded files
        setUploadedFiles(newUploadedFiles);

        console.log(Files);


        setFiles(newFiles);

        console.log("Files state:", files);
    };

    const handleDeleteFile = (index) => {
        //the list of file details
        const updatedFileDetails = [...uploadedFiles];
        updatedFileDetails.splice(index, 1);
        setUploadedFiles(updatedFileDetails);

        //the actual list of file that contain the FILE files
        //this is 100% definitely best practice
        const updatedFiles = [...files];
        console.log(updatedFiles)
        updatedFiles.splice(index, 1);
        console.log(updatedFiles)
        setFiles(updatedFiles);
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
                        <Box component="form" mt={2}>

                            <Grid container spacing={2}>

                                <Grid item xs={12} sm={6}>
                                    <Rating
                                        name="rating"
                                        value={formik.values.rating}
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue("rating", newValue);
                                        }}
                                        size="large"
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
                                        {uploadedFiles.map((file, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={file.name} />
                                                {file.preview && (
                                                    <img
                                                        src={file.preview}
                                                        alt={`Preview of ${file.name}`}
                                                        style={{ width: '50px', height: 'auto', marginLeft: '10px' }}
                                                    />
                                                )}
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => handleDeleteFile(index)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItem>
                                        ))}
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