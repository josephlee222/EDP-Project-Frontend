import React, { useEffect, useState, useContext } from 'react'
import { Card, CardContent, Typography, Grid, Container, CardMedia, Skeleton } from '@mui/material'
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

function getChipProps(params) {
    return {
        label: params.value,
    };
}



function ActivityList() {
    const [Activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [deactivateLoading, setDeactivateLoading] = useState(null)
    const [deactivateActivityDialog, setDeactivateActivityDialog] = useState(false)
    const [deactivateActivity, setDeactivateActivity] = useState(null)
    const navigate = useNavigate()
    //const { setActivePage } = useContext(CategoryContext);
    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'expiryDate', headerName: 'Expiry Date', flex: 1, minWidth: 250 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'category', headerName: 'Category', width: 200 },
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
                setLoading(false)
            }
        })
    }

    const customToolbar = () => {
        return (
            <GridToolbarExport />
        );
    }



    const CustomCard = ({ id, name, expiryDate, description }) => (
        <Card>
            <CardMedia
                sx={{ height: 140 }}
                image="/static/images/cards/contemplative-reptile.jpg"
                title="green iguana"
            />
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
const CustomCard = ({ title, content }) => (
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
          <CustomCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CardGrid;
*/