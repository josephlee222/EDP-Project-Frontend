import React, { useEffect, useState, useContext } from 'react'
import { Button, Card, Modal, Box, TextField, CardContent, Typography, Grid, Container, Skeleton, CardHeader, Avatar, CardActionArea } from '@mui/material'
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

function getChipProps(params) {
    return {
        label: params.value,
    };
}

//TODO: Add profile picture functionality and participants, get Modal submit to close modal upon successful form submission

function GroupList() {
    const [Groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    titleHelper("Groups")

    //For Modal Functionality
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { enqueueSnackbar } = useSnackbar()

    //CRUD and Group Info
    const formik = useFormik({
        initialValues: {
            name: "",
            description: ""
        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .max(30, 'Name can only be 30 characters maximum')
                .required('Name is required'),
            description: yup.string().trim()
                .max(100, 'Description can only be 100 characters maximum')
                .required('Description is required')
        }),
        onSubmit: (data) => {
            data.name = data.name.trim();
            data.description = data.description.trim();
            http.post("/Group", data).then((res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    window.location.reload();
                    enqueueSnackbar("Group creation successful", { variant: "success" });
                } else {
                    enqueueSnackbar("Something went wrong.", { variant: "error" });
                }
            }).catch((err) => {
                if (err.response) {
                    enqueueSnackbar("Group Creation Failed. " + err.response.data.error, { variant: "error" });
                    console.log(err.response.data.error);
                } else {
                    enqueueSnackbar("Group Creation Failed. " + err.message, { variant: "error" });
                    console.log(err.message);
                }
            })
        }
    });

    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
    ];

    const handleGetGroups = () => {
        http.get("/Group/").then((res) => {
            if (res.status === 200) {
                setGroups(res.data)
                setLoading(false)
            }
        })
    }

    //Website Elements
    const customToolbar = () => {
        return (
            <GridToolbarExport />
        );
    }

    const GroupTab = ({ params, name }) => (
        <Card>
            <CardActionArea onClick={() => {
                navigate("/groups/" + params.row.id)
            }}>
                <CardHeader 
                    sx={{}}
                    avatar={
                        <Avatar sx={{ bgcolor: grey }}>

                        </Avatar>
                    }
                    title={<Typography variant='h5'>{name}</Typography>}
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
        document.title = "Groups"
        handleGetGroups()
    }, [])
    return (
        <>
            <PageHeader title="Groups & Friends" icon={GroupIcon} />
            <Button onClick={handleOpen} sx={{ top: 7 }} variant='contained'>Create Group</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 4,
                }} component="form" onSubmit={formik.handleSubmit}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create Group
                    </Typography>
                    <TextField
                        fullWidth margin="dense" autoComplete="off"
                        label="Name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        fullWidth margin="dense" autoComplete="off"
                        label="Description" 
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />
                    <Button sx={{ mt: 2 }} variant="contained" type="submit">
                        Create
                    </Button>
                </Box>
            </Modal >
            <Container sx={{ mt: "1rem" }} maxWidth="xl">
                <Grid container spacing={2}>
                    {loading && <>{[...Array(6)].map((card) => (
                        <Grid item key={card} xs={12}>
                            <SkeletonTab />
                        </Grid>
                    ))}</>}

                    {!loading && <>{Groups.map((card) => (
                        <Grid item key={card.id} xs={12}>
                            <GroupTab {...card} />
                        </Grid>
                    ))}</>}
                </Grid>
            </Container>
        </>
    )
}

export default GroupList

/*// Import necessary dependencies
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

// Sample data (you can replace it with your own data)
const cardData = [
  { id: 1, title: 'Card 1', content: 'Lorem ipsum dolor sit amet.' },
  { id: 2, title: 'Card 2', content: 'Consectetur adipiscing elit.' },
  { id: 3, title: 'Card 3', content: 'Pellentesque nec metus sit amet odio.' },
  // Add more data as needed
];

// Component for rendering a single card
const GroupTab = ({ title, content }) => (
  <Card>
    <CardContent>
      <Typography variant="h6">{title}</Typography>
      <Typography>{content}</Typography>
    </CardContent>
  </Card>
);

// Main component for rendering the grid of cards
const CardGrid = () => {
  return (
    <Grid container spacing={2}>
      {cardData.map((card) => (
        <Grid item key={card.id} xs={12} sm={6} md={4} lg={3}>
          <GroupTab {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CardGrid;
*/