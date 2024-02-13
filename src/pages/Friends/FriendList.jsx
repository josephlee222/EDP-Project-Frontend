import React, { useEffect, useState, useContext } from 'react'
import { IconButton, Button, Card, Modal, Box, TextField, CardContent, Typography, Grid, Container, Skeleton, CardHeader, Avatar, CardActionArea, DialogTitle, DialogContent, DialogContentText, Dialog, DialogActions } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid, GridActionsCellItem, GridToolbarExport } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
import { useSnackbar } from 'notistack';
import CardTitle from '../../components/CardTitle';
import PageHeader from '../../components/PageHeader';
import titleHelper from '../../functions/helpers';
import { grey } from '@mui/material/colors';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AddRounded, CloseRounded, GroupRounded, Delete, GroupAdd } from '@mui/icons-material';

//TODO: Add profile picture functionality and participants, get Modal submit to close modal upon successful form submission

function FriendList() {
    const [User, setUser] = useState([])
    const [Friends, setFriends] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    titleHelper("Friends")

    //For Dialog Functionality
    const [open, setOpen] = React.useState(false);
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const handleOpenConfirmation = () => setOpenConfirmation(true);
    const handleCloseConfirmation = () => setOpenConfirmation(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { enqueueSnackbar } = useSnackbar()

    //Form and friend request creation
    const formik = useFormik({
        initialValues: {
            senderID: User.Id,
            recipientID: ""
        },
        validationSchema: yup.object({
            senderid: yup.string().trim()
                .required('SenderID is required'),
            recipientid: yup.string().trim()
                .required('RecipientID is required')
        }),
        onSubmit: (data) => {
            data.senderid = data.senderid.trim();
            data.recipientid = data.recipientid.trim();
            http.post("/FriendRequest", data).then((res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    window.location.reload();
                    enqueueSnackbar("Friend request sent!", { variant: "success" });
                } else {
                    enqueueSnackbar("Something went wrong.", { variant: "error" });
                }
            }).catch((err) => {
                if (err.response) {
                    enqueueSnackbar("Friend request Failed. " + err.response.data.error, { variant: "error" });
                    console.log(err.response.data.error);
                } else {
                    enqueueSnackbar("Friend request Failed. " + err.message, { variant: "error" });
                    console.log(err.message);
                }
            })
        }
    });

    //CRUD Functions
    const handleGetFriends = (userID) => {
        http.get("/Friend/" + userID).then((res) => {
            if (res.status === 200) {
                setFriends(res.data)
                setLoading(false)
            }
        }).catch((err) => {
            if (err.response) {
                enqueueSnackbar("Friend retrieval failed: " + err.response.data.error, { variant: "error" });
                console.log(err.response.data.error);
            } else {
                enqueueSnackbar("Friend retrieval failed: " + err.message, { variant: "error" });
                console.log(err.message);
            }
        })
    }

    const handleGetUser = () => {
        http.get("/User").then((res) => {
            if (res.status === 200) {
                setUser(res.data)
            }
        }).catch((err) => {
            if (err.response) {
                enqueueSnackbar("User retrieval failed: " + err.response.data.error, { variant: "error" });
                console.log(err.response.data.error);
            } else {
                enqueueSnackbar("User retrieval failed: " + err.message, { variant: "error" });
                console.log(err.message);
            }
        })
    }

    const handleDeleteFriend = () => {
        http.delete("/Friend/" + Friends.senderID, Friends.recipientID).then((res) => {
            if (res.status === 200) {
                setUser(res.data)
                window.location.reload();
            }
        }).catch((err) => {
            if (err.response) {
                enqueueSnackbar("Deletion failed: " + err.response.data.error, { variant: "error" });
                console.log(err.response.data.error);
            } else {
                enqueueSnackbar("Deletion failed: " + err.message, { variant: "error" });
                console.log(err.message);
            }
        })
    }

    //Website Elements
    const FriendTab = (Friends) => (
        <Card>
            <CardActionArea>
                <CardHeader
                    sx={{}}
                    avatar={
                        <Avatar sx={{ bgcolor: grey }}>
                            {Friends.profile}
                        </Avatar>
                    }
                    title={<Typography variant='h6' fontWeight={700}>{Friends.name}</Typography>}
                    action={
                        <IconButton>
                            <Delete fontSize="large" sx={{ mt: 1 }} onClick={handleDeleteFriend(Friends.senderID, Friends.recipientID)} />
                        </IconButton>
                    }
                />
            </CardActionArea>
        </Card>
    );

    const SkeletonTab = () => (
        <Card>
            <CardHeader
                avatar={
                    <Skeleton variant='circular' width={60} height={60} animation="wave" />
                }
                title={
                    <Skeleton variant='rounded' height={40} animation="wave" />
                }
            />
        </Card>
    );

    useEffect(() => {
        document.title = "Friends"
        handleGetUser()
        handleGetFriends(User.Id)
    }, [])
    return (
        <>
            <PageHeader title="Friends" icon={GroupRounded} />

            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" sx={{ mt: 2, mr: "2rem" }} onClick={handleOpen}>
                    Send Friend Request
                </Button>
            </Box>

            <Container sx={{ my: "1rem" }} maxWidth="xl">
                <Grid container spacing={2}>
                    {loading && <>{[...Array(6)].map((card) => (
                        <Grid item key={card} xs={12} md={6}>
                            <SkeletonTab />
                        </Grid>
                    ))}</>}

                    {!loading && <>{Friends.map((card) => (
                        <Grid item key={card.id} xs={12} md={6}>
                            <FriendTab {...card} />
                        </Grid>
                    ))}</>}
                </Grid>
            </Container>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Create Friend Request
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 12,
                    }}
                >
                    <CloseIcon onClick={handleClose} />
                </IconButton>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <TextField
                            fullWidth margin="none" autoComplete="off"
                            label="Friend's ID"
                            name="Friend's ID"
                            value={formik.values.recipientID}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.recipientID && Boolean(formik.errors.recipientID)}
                            helperText={formik.touched.recipientID && formik.errors.recipientID}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit" startIcon={<AddRounded />}>Create Friend</Button>
                    </DialogActions>
                </Box>
            </Dialog >
        </>
    )
}

export default FriendList
/*//
<Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
                <DialogTitle>
                    Delete Tutorial
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this tutorial?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleCloseConfirmation}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteTutorial}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
*/