import React, { useState, useEffect, useContext } from 'react';
import { Box, Card, CardContent, Grid, Button, Typography, Container, Stack, TextField, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import http from '../../http';
import CardTitle from '../../components/CardTitle';
import AddIcon from '@mui/icons-material/Add';
import titleHelper from '../../functions/helpers';
import { ForumRounded, SendRounded, SmsFailedRounded } from '@mui/icons-material';
import { AppContext } from '../../App';
import MessageBox from '../../components/MessageBox';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { HubConnectionBuilder } from "@microsoft/signalr";

function GroupDetails() {
    const [loading, setLoading] = useState(false);
    const [connection, setConnection] = useState(null)
    const [sendLoading, setSendLoading] = useState(false)
    const { user } = useContext(AppContext)
    const { enqueueSnackbar } = useSnackbar();
    const { id: groupId } = useParams();
    const [group, setGroup] = useState({
        name: "",

    });
    const [messages, setMessages] = useState([])

    titleHelper("Group Details", group.name);
    //Deletion Confirmation
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    //CRUD Functions
    const handleGetGroup = () => {
        setLoading(true);
        http.get(`/Group/${groupId}`).then((res) => {
            if (res.status === 200) {
                setGroup(res.data);
                setLoading(false);
            }
        });
    };

    const handleGetMessages = () => {
        http.get(`/Group/Message/${groupId}`).then((res) => {
            if (res.status === 200) {
                setMessages(res.data);
                setLoading(false);
                // Create a new connection to the actions hub
                const connect = new HubConnectionBuilder()
                    .withUrl(import.meta.env.VITE_API_URL + "/hubs/groups")
                    .withAutomaticReconnect()
                    .build();

                setConnection(connect);
            }
        });
    }

    const deleteGroup = () => {
        http.delete(`/group/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate("/groupList");
            });
    }

    const sendFormik = useFormik({
        initialValues: {
            message: ""
        },
        validationSchema: Yup.object({
            message: Yup.string().required("Message is required")
        }),
        onSubmit: (data) => {
            setSendLoading(true);
            data.groupId = groupId
            http.post("/Group/Message", data).then((res) => {
                if (res.status === 200) {
                    setSendLoading(false)
                    navigate("/cart/checkout/success")

                } else {
                    enqueueSnackbar("Message send failed!.", { variant: "error" });
                    setSendLoading(false);
                }
            }).catch((err) => {
                enqueueSnackbar("Message send failed! " + err.response.data.error, { variant: "error" });
                setSendLoading(false);
            })
        }
    })

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    connection.invoke("Register", Number(groupId))

                    connection.on("ReceiveMessage", (message) => {
                        console.log(message);
                    });

                    connection.on("message", (message) => {
                        console.log("ping")
                        setMessages([...messages, message])
                    });
                })
                .catch((error) => console.log(error));
        }
    }, [connection]);

    useEffect(() => {
        handleGetGroup();
        handleGetMessages();
    }, []);

    const message = {
        user: {
            name: "Joseph Lee"
        },
        message: "Hello world",
        createdAt: "2020-02-02"
    }

    return (
        <>
            <Container maxWidth="xl" sx={{ my: "1rem" }}>
                <Typography variant='h3' fontWeight={700}>{group?.name}</Typography>
                <Typography varient='h5' mb={"1rem"}>{group?.description}</Typography>
                <Card>
                    <CardContent>
                        <CardTitle title="Discussion Room" icon={<ForumRounded />} />
                        <Card sx={{ backgroundColor: '#ffffff', mt: "1rem" }}>
                            <CardContent>
                                <Stack spacing={"1rem"} height={"500px"} overflow={"auto"}>
                                    <Stack spacing={".5rem"}>
                                        {messages.length == 0 && <>
                                            <Box width={"100%"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} sx={{opacity: 0.5}}>
                                                <SmsFailedRounded sx={{width: "96px", height: "96px"}}/>
                                                <Typography variant='h6' fontWeight={700}>No Messages</Typography>
                                            </Box>
                                        </>}
                                        {messages.map((message, index) => {
                                            return (
                                                <MessageBox key={index} message={message} sender={message.user.id == user?.id} />
                                            )
                                        })}
                                    </Stack>
                                </Stack>
                                <Divider sx={{ marginY: "1rem" }} />
                                <Box component="form" onSubmit={sendFormik.handleSubmit} sx={{ display: "flex" }}>
                                    <TextField
                                        fullWidth
                                        label="Message"
                                        name='message'
                                        size="small"
                                        variant="outlined"
                                        sx={{ flexGrow: 1 }}
                                        value={sendFormik.values.message}
                                        onChange={sendFormik.handleChange}
                                        error={sendFormik.touched.message && Boolean(sendFormik.errors.message)}
                                        helperText={sendFormik.touched.message && sendFormik.errors.message}
                                        disabled={closed}
                                    />
                                    <LoadingButton type='submit' loading={sendLoading} startIcon={<SendRounded />} variant="contained" sx={{ marginLeft: "1rem" }}>Send</LoadingButton>
                                </Box>
                            </CardContent>

                        </Card>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}

export default GroupDetails;