import React, { useEffect, useState, useContext } from 'react'
import { Button, Container, Divider, Typography, Grid, Box, Card, TextField, Skeleton, CardContent, CardMedia } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { DataGrid, GridActionsCellItem, GridToolbarExport } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
//import { CategoryContext } from '../UserRoutes';
import CardTitle from '../../components/CardTitle';
import PageHeader from '../../components/PageHeader';
import BackpackRounded from '@mui/icons-material/BackpackRounded';
import titleHelper from '../../functions/helpers';
//import { CategoryContext } from '../UserRoutes';
import { HomeRounded, SearchRounded } from '@mui/icons-material';

function getChipProps(params) {
    return {
        label: params.value,
    };
}

function ActivityList() {
    const [Activities, setActivities] = useState([])
    const url = import.meta.env.VITE_API_URL
    const [loading, setLoading] = useState(true)
    const [deactivateLoading, setDeactivateLoading] = useState(null)
    const [deactivateActivityDialog, setDeactivateActivityDialog] = useState(false)
    const [deactivateActivity, setDeactivateActivity] = useState(null)
    const navigate = useNavigate()
    titleHelper("View Activities")
    //const { setActivePage } = useContext(CategoryContext);
    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'expiryDate', headerName: 'Expiry Date', flex: 1, minWidth: 250 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'category', headerName: 'Category', width: 200 },
        { field: 'pictures', headerName: 'pictures', width: 200 },
        /*{ field: 'ntucExclusive', headerName: 'NtucExclusive', width: 200 },
        { field: 'ageLimit', headerName: 'AgeLimit', width: 200 },
        { field: 'location', headerName: 'Location', width: 200 },
        { field: 'company', headerName: 'Company', width: 200 },
        { field: 'discountType', headerName: 'DiscountType', width: 200 },
        { field: 'discountAmount', headerName: 'DiscountAmount', width: 200 }*/
        ,
        {
            field: 'actions', type: 'actions', width: 120, getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit Activity"
                    onClick={() => {
                        navigate("/admin/Activities/" + params.row.id)
                    }}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete Activity"
                    onClick={() => {
                    }}
                    showInMenu
                />,
            ]
        },
    ];


    const handleGetActivities = () => {
        http.get("/Activity/").then((res) => {
            if (res.status === 200) {
                setActivities(res.data)
                console.log(res.data);
                setLoading(false)
            }
        })
    }

    const customToolbar = () => {
        return (
            <GridToolbarExport />
        );
    }



    const CustomCard = ({ id, name, expiryDate, description, pictures }) => (
        <Card>
            <CardMedia sx={{ height: 140 }} image={pictures ? url+'/uploads/'+pictures.items[0] : "/unknown.png"}/>
            <CardContent>
                <Link to={`/activityList/${id}`} style={{ textDecoration: 'none' }}>
                    <Typography variant="h6">{name}</Typography>
                </Link>
                <Typography>{description}</Typography>
                <Typography>Expiry Date: {expiryDate}</Typography>
            </CardContent>
        </Card>
    );

    const CustomSkeletonCard = () => (
        <Card>
            <Skeleton variant="rectangular" height={140} />
            <CardContent>
                <Typography variant="h6"><Skeleton animation="wave" /></Typography>
                <Typography><Skeleton animation="wave" /></Typography>
                <Typography><Skeleton animation="wave" /></Typography>
            </CardContent>
        </Card>
    );

    useEffect(() => {
        document.title = "UPlay Admin - View Activities"
        //setActivePage(1)
        handleGetActivities()
    }, [])
    return (
        <>
            <PageHeader title="Activities" icon={BackpackRounded} />
           
            <Container sx={{ mt: "1rem" }} maxWidth="xl">
                <Grid container spacing={2}>
                    {loading && <>{[...Array(6)].map((card) => (
                        <Grid item key={card} xs={12} sm={6} md={4}>
                            <CustomSkeletonCard />
                        </Grid>
                    ))}</>}

                    {!loading && <>{Activities.map((card) => (
                        <Grid item key={card.id} xs={12} sm={6} md={4}>
                            <CustomCard {...card} />
                        </Grid>
                    ))}</>}
                </Grid>
            </Container>
        </>
    )
}

export default ActivityList