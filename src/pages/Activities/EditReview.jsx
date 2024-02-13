import React, { useState, useEffect, useContext } from 'react'
import {
    Container, Card, CardContent, Box, Checkbox, TextField,
    Grid, FormControlLabel, IconButton, Typography, RadioGroup, Radio, List,
    ListItem, ListItemText, Menu, MenuItem, Rating
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
import { EditRounded, PersonAddRounded } from '@mui/icons-material';
import moment from 'moment';
import titleHelper from '../../functions/helpers';
import DeleteIcon from '@mui/icons-material/Delete';


function EditReview() {
    //const { user } = useContext(AppContext);
    titleHelper("Edit Review")
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const url = import.meta.env.VITE_API_URL
    const { id: reviewId } = useParams();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [files, setFiles] = useState([]);
    const [oldFiles, setOldFiles] = useState([]);


    const [review, setReview] = useState({
        rating: "",
        description: "",
        pictures: [],
    })

    const handleGetReview = () => {
        http.get(`/Review/${reviewId}`).then((res) => {
            if (res.status === 200) {
                setReview(res.data)
                //setLoading(false)
                formik.setValues(res.data);
            }
        })

    }


    const formik = useFormik({
        initialValues: {
            /*name: review.name,
            expiryDate: review.expiryDate,
            description: review.description,
            category:review.category,
            ntucExclusive:review.ntucExclusive,
            ageLimit:review.ageLimit,
            location:review.location,
            company:review.company,
            discountType:review.discountType,
            discountAmount:review.discountAmount*/

            rating: "",
            description: "",

        },
        validationSchema: Yup.object({
            rating: Yup.string().required("Rating is required"),
            description: Yup.string().required("Description is required"),

        }),
        onSubmit: (data) => {
            setLoading(true);
            var pictures = []
            console.log("pictures: " + data.pictures);
            console.log(data.pictures);

            console.log("files", files)

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

            data.pictures = oldFiles;
            data.description = data.description.trim();

            const formDataEntries = formData.getAll('files');
            if (formDataEntries.length > 0) {
                console.log("no skip")
                http.post("/File/multiUpload/", formData, config).then((res) => {

                    if (res.status === 200) {
                        const allFiles = oldFiles.concat(res.data.uploadedFiles)
                        enqueueSnackbar("Pictures uploaded successfully!", { variant: "success" });
                        data.pictures = allFiles
                        


                        console.log(data)

                        http.put(`/Review/${reviewId}`, data).then((res) => {
                            if (res.status === 200) {
                                enqueueSnackbar("Review created successfully!", { variant: "success" });
                                navigate("/admin/activities")
                            } else {
                                enqueueSnackbar("Review creation failed!.", { variant: "error" });
                                setLoading(false);
                            }
                        }).catch((err) => {
                            enqueueSnackbar("Review creation failed! " + err.response.data.error, { variant: "error" });
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
                http.put("/Review/"+reviewId, data)
                    .then((res) => {
                        if (res.status === 200) {
                            enqueueSnackbar("Activity created successfully!", { variant: "success" });
                            console.log(res.data);
                            navigate(`/activityList/${review.activityId}`);
                        } else {
                            enqueueSnackbar("Activity creation failed!.", { variant: "error" });
                            setLoading(false);
                        }
                    })
                    .catch((err) => {
                        enqueueSnackbar("Activity creation failed! " + err.response, { variant: "error" });
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
            name: file.rating,
            preview: URL.createObjectURL(file)
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
        var removedFile = updatedFileDetails.splice(index, 1);
        setUploadedFiles(updatedFileDetails);
        var OldFileNames = [];
        var OldFiles = oldFiles;

        for (let i = 0; i < oldFiles; i++) {
            const picture = oldFiles[i];
            OldFileNames.push({
                name: picture,
            });
        }

        var removeIndex = null;

        for(let i = 0;i < OldFileNames; i++){
            const pictureName = OldFileNames[i].name;
            if(removedFile == pictureName){
                removeIndex = i;
            }
        }

        OldFiles.splice(removeIndex, 1);
        setOldFiles(OldFiles);


        console.log(removedFile);


        //the actual list of file that contain the FILE files
        //this is 100% definitely best practice
        const updatedFiles = [...files];
        console.log(updatedFiles)
        updatedFiles.splice(index, 1);
        console.log(updatedFiles)
        setFiles(updatedFiles);
    };

    useEffect(() => {
        handleGetReview();
        return () => {
            uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
        };
    }, [])

    useEffect(() => {
        // Set default value for uploadedFiles when review data is fetched
        if (review.pictures?.items) {
            const files = [];
            const oldFiles = [];
            for (let i = 0; i < review.pictures.items.length; i++) {
                const picture = review.pictures.items[i];
                files.push({
                    name: picture,
                    preview: url + `/uploads/${picture}`
                });
            }

            for (let i = 0; i < review.pictures.items.length; i++) {
                const picture = review.pictures.items[i];
                oldFiles.push(picture);
            }

            console.log("files", oldFiles);

            setUploadedFiles(files);

            setOldFiles(oldFiles);
        }
    }, [review]);


    return (
        <>
            <Box sx={{ marginY: "1rem" }}>
                <Card>

                    <CardContent>
                        <CardTitle title="Edit Review" icon={<EditRounded />} />
                        <Box component="form" mt={3}>
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
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        id="expiryDate"
                                        name="expiryDate"
                                        label="Expiry Date"
                                        variant="outlined"
                                        value={moment(formik.values.expiryDate).format("YYYY-MM-DD")}
                                        onChange={formik.handleChange}
                                        error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
                                        helperText={formik.touched.expiryDate && formik.errors.expiryDate}
                                        type='date'
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="description"
                                        name="description"
                                        label="Review Description"
                                        variant="outlined"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        error={formik.touched.description && Boolean(formik.errors.description)}
                                        helperText={formik.touched.description && formik.errors.description}
                                        multiline
                                        rows={4}
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
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                type="submit"
                                loading={loading}
                                loadingPosition="start"
                                startIcon={<EditRounded />}
                                onClick={formik.handleSubmit}
                                fullWidth
                            >
                                Edit Review
                            </LoadingButton>
                        </Box>

                    </CardContent>
                </Card>
            </Box>
        </>
    )
}

export default EditReview