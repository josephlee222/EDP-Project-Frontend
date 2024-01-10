import React, { useState, useEffect, useContext } from 'react'
import { Card, CardContent, Box, Checkbox, TextField, Grid, FormControlLabel, Typography, Skeleton, Stack, MenuItem } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import CardTitle from "../../../components/CardTitle";
import http from '../../../http'
import { useSnackbar } from 'notistack'
import { useNavigate, useParams } from 'react-router-dom'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { Edit, InfoRounded } from '@mui/icons-material';
import { CategoryContext } from './AdminUsersRoutes';
import ProfilePicture from '../../../components/ProfilePicture';
import { AppContext } from '../../../App';

export default function EditUser() {
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { setActivePage } = useContext(CategoryContext);
    const { id: userId } = useParams();
    const [user, setUser] = useState(null);
    const { user: currentUser, setUser: setCurrentUser } = useContext(AppContext);

    function handleLogout() {
        localStorage.removeItem("token")
        setCurrentUser(null)
        enqueueSnackbar("You need to login again because your permissions has changed", { variant: "warning" })
        navigate("/")
    }

    const handleGetUser = () => {
        http.get(`/Admin/User/${userId}`).then((res) => {
            if (res.status === 200) {
                setUser(res.data)
                console.log(res.data)
                setLoading(false)
                formik.setValues(res.data);
            }
        }).catch((err) => {
            enqueueSnackbar("Failed to get user! " + err.response.data.error, { variant: "error" });
            navigate("/admin/users")
        })
    }

    const formik = useFormik({
        initialValues: {
            email: "",
            name: "",
            isAdmin: false,
            phoneNumber: "",
            occupationalStatus: "",
            postalCode: "",
            address: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email is required"),
            name: Yup.string().required("Name is required"),
            phoneNumber: Yup.string().optional().nullable().matches(/^[0-9]+$/, "Phone number must be a number"),
            occupationalStatus: Yup.string().optional().nullable(),
            postalCode: Yup.string().optional().nullable().matches(/^[0-9]+$/, "Postal code must be a number"),
            address: Yup.string().optional().nullable(),
            isAdmin: Yup.boolean().optional(),
        }),
        onSubmit: (data) => {
            setUpdateLoading(true);
            data.email = data.email.trim();
            data.name = data.name.trim();

            http.put("/Admin/User/" + userId, data).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar("User updated successfully.", { variant: "success" });

                    // If the user is updating their own information, check if they are still an admin
                    if (currentUser.id === res.data.id) {
                        if (res.data.isAdmin !== currentUser.isAdmin) {
                            handleLogout();
                        } else {
                            setCurrentUser(res.data);
                            navigate("/admin/users")
                        }
                    } else {
                        navigate("/admin/users")
                    }
                } else {
                    enqueueSnackbar("Unable to update user!.", { variant: "error" });
                    setLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Unable to update user! " + err.response.data.error, { variant: "error" });
                setLoading(false);
            })
        }
    })

    useEffect(() => {
        setActivePage(1);
        handleGetUser();
    }, [])

    return (
        <>
            <Box sx={{ marginY: "1rem" }}>
                <Card>
                    <CardContent>
                        <CardTitle title="User Information" icon={<InfoRounded />} />
                        <Box mt={3}>
                            {loading && <Stack direction={"row"} alignItems={"center"}>
                                <Skeleton variant="circular" width={"72px"} height={"72px"} />
                                <Stack sx={{ width: "250px" }} spacing={1} marginLeft={"1rem"}>
                                    <Skeleton variant="text" width={"100%"} height={35} animation="wave" />
                                    <Skeleton variant="text" width={"100%"} height={18} animation="wave" />
                                </Stack>
                            </Stack>}
                            {!loading && <Stack direction={"row"} alignItems={"center"}>
                                <ProfilePicture user={user} sx={{ width: "72px", height: "72px" }} />
                                <Stack sx={{ width: "100%" }} spacing={.5} marginLeft={"1rem"}>
                                    <Typography variant={"h5"} fontWeight={700}>{user?.name}</Typography>
                                    <Typography variant={"body1"}>{user?.email}</Typography>
                                </Stack>
                            </Stack>}
                        </Box>
                    </CardContent>
                </Card>
                <Box component="form" mt={"1rem"}>
                    <Card>
                        <CardContent>
                            <CardTitle title="Edit User Information" icon={<Edit />} />
                            <Box mt={3}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            id="name"
                                            name="name"
                                            label="Name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            error={formik.touched.name && Boolean(formik.errors.name)}
                                            helperText={formik.touched.name && formik.errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            label="Phone Number"
                                            value={formik.values.phoneNumber}
                                            onChange={formik.handleChange}
                                            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        {/* Select options for occupational status */}
                                        <TextField
                                            select
                                            fullWidth
                                            id="occupationalStatus"
                                            name="occupationalStatus"
                                            label="Occupational Status"
                                            value={formik.values.occupationalStatus}
                                            onChange={formik.handleChange}
                                            error={formik.touched.occupationalStatus && Boolean(formik.errors.occupationalStatus)}
                                            helperText={formik.touched.occupationalStatus && formik.errors.occupationalStatus}
                                        >
                                            <MenuItem value="Student">Student</MenuItem>
                                            <MenuItem value="Employed">Employed</MenuItem>
                                            <MenuItem value="Unemployed">Unemployed</MenuItem>
                                            <MenuItem value="Retired">Retired</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            id="postalCode"
                                            name="postalCode"
                                            label="Postal Code"
                                            value={formik.values.postalCode}
                                            onChange={formik.handleChange}
                                            error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                                            helperText={formik.touched.postalCode && formik.errors.postalCode}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            id="address"
                                            name="address"
                                            label="Address"
                                            value={formik.values.address}
                                            onChange={formik.handleChange}
                                            error={formik.touched.address && Boolean(formik.errors.address)}
                                            helperText={formik.touched.address && formik.errors.address}
                                            multiline
                                            rows={2}
                                        />
                                    </Grid>
                                </Grid>
                                <FormControlLabel label="Is Admin" control={
                                    <Checkbox
                                        id="isAdmin"
                                        name="isAdmin"
                                        label="Is Admin"
                                        variant="outlined"
                                        value={formik.values.isAdmin}
                                        onChange={formik.handleChange}
                                        error={formik.touched.isAdmin && Boolean(formik.errors.isAdmin)}
                                        helperText={formik.touched.isAdmin && formik.errors.isAdmin}
                                        checked={formik.values.isAdmin}
                                    />
                                } />
                            </Box>

                        </CardContent>
                    </Card>
                    <Card sx={{ mt: "1rem" }}>
                        <CardContent>
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                type="submit"
                                loading={loading || updateLoading}
                                loadingPosition="start"
                                startIcon={<AddIcon />}
                                onClick={formik.handleSubmit}
                                fullWidth
                            >
                                Save Changes
                            </LoadingButton>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </>
    )
}