import React, { useEffect, useState, useContext } from 'react'
import { Button, Card, Modal, Box, TextField, CardContent, Typography, Grid, Container, Skeleton, CardHeader, Avatar, CardActionArea, DialogTitle, DialogContent, Dialog, DialogActions } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { DataGrid, GridActionsCellItem, GridToolbarExport } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
//import { CategoryContext } from '../UserRoutes';
import { useSnackbar } from 'notistack';
import CardTitle from '../../components/CardTitle';
import PageHeader from '../../components/PageHeader';
import GroupIcon from '@mui/icons-material/Group';
import titleHelper from '../../functions/helpers';
import { grey } from '@mui/material/colors';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AddRounded, CloseRounded, GroupRounded } from '@mui/icons-material';

function InviteList() {
    const [User, setUser] = useState([])
    const [Invite, setInvite] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    titleHelper("Groups")

    //For Dialog Functionality
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { enqueueSnackbar } = useSnackbar()

    //Form and friend creation
    const formik = useFormik({
        initialValues: {
            senderID: Invite.senderID,
            recipientID: Invite.recipientID
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
            http.post("/Friend", data).then((res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    window.location.reload();
                    enqueueSnackbar("Accepted friend request!", { variant: "success" });
                } else {
                    enqueueSnackbar("Something went wrong.", { variant: "error" });
                }
            }).catch((err) => {
                if (err.response) {
                    enqueueSnackbar("Friend creation Failed. " + err.response.data.error, { variant: "error" });
                    console.log(err.response.data.error);
                } else {
                    enqueueSnackbar("Friend creation Failed. " + err.message, { variant: "error" });
                    console.log(err.message);
                }
            })
        }
    });


    //CRUD
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

    const handleGetInvites = (userID) => {
        http.get("/FriendRequest/"+userID).then((res) => {
            if (res.status === 200) {
                setInvite(res.data)
                setLoading(false)
            }
        }).catch((err) => {
            if (err.response) {
                enqueueSnackbar("Invite retrieval failed: " + err.response.data.error, { variant: "error" });
                console.log(err.response.data.error);
            } else {
                enqueueSnackbar("Invite retrieval failed: " + err.message, { variant: "error" });
                console.log(err.message);
            }
        })
    }

    const handleDeleteFriendRequest = () => {
        http.delete("/FriendRequest/" + Friends.senderID, Friends.recipientID).then((res) => {
            if (res.status === 200) {
                setUser(res.data)
                window.location.reload();
            }
        }).catch((err) => {
            if (err.response) {
                enqueueSnackbar("Friend Request deletion failed: " + err.response.data.error, { variant: "error" });
                console.log(err.response.data.error);
            } else {
                enqueueSnackbar("Friend Request deletion failed: " + err.message, { variant: "error" });
                console.log(err.message);
            }
        })
    }

    //Website Elements
    const InviteTab = (Invite) => (
            <Card>
                <CardActionArea>
                    <CardHeader
                        sx={{}}
                        avatar={
                            <Avatar sx={{ bgcolor: grey }}>
                                {Invite.profile}
                            </Avatar>
                        }
                        title={<Typography variant='h6' fontWeight={700}>{Invite.name}</Typography>}
                    />
                    <CardContent>
                        <Typography variant='body1'>{Invite.name} sent you a friend request!</Typography>
                    </CardContent>

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
        document.title = "Invites"
        handleGetUser()
        handleGetInvites(User.Id)
    }, [])
    return (
        <>
            <PageHeader title="Friends" icon={GroupRounded} />
            <Container sx={{ my: "1rem" }} maxWidth="xl">
                <Grid container spacing={2}>
                    {loading && <>{[...Array(6)].map((card) => (
                        <Grid item key={card} xs={12} md={6}>
                            <SkeletonTab />
                        </Grid>
                    ))}</>}

                    {!loading && <>{Groups.map((card) => (
                        <Grid item key={card.id} xs={12} md={6}>
                            <InviteTab {...card} />
                        </Grid>
                    ))}</>}
                </Grid>
            </Container>
        </>
    )
}

export default InviteList
