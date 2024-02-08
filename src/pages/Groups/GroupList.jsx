import React, { useEffect, useState, useContext } from 'react'
import { Card, CardContent, Typography, Grid, Container, CardMedia, Skeleton, CardHeader, Avatar, CardActionArea } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { DataGrid, GridActionsCellItem, GridToolbarExport } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
//import { CategoryContext } from '../UserRoutes';
import CardTitle from '../../components/CardTitle';
import PageHeader from '../../components/PageHeader';
import GroupIcon from '@mui/icons-material/Group';
import titleHelper from '../../functions/helpers';
import { grey } from '@mui/material/colors';

function getChipProps(params) {
    return {
        label: params.value,
    };
}

//TODO: Add profile picture functionality

function GroupList() {
    const [Groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    titleHelper("Groups")
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

    const customToolbar = () => {
        return (
            <GridToolbarExport />
        );
    }



    const GroupTab = ({ id, name }) => (
        <Card sx={{}}>
            <CardActionArea onClick={() => {
                        navigate("/groups/" + params.row.id)
                    }}>
            <CardHeader
            avatar={
                <Avatar sx={{bgcolor: grey}}>
                    
                </Avatar>
            }
            title={name}
            />
            </CardActionArea>
        </Card>
    );

    const SkeletonTab = () => (
        <Card>
            <CardHeader
            avatar={
                <Skeleton variant='circular'width={60} height={60} animation="wave" />
            }
            title={
                <Skeleton variant='rounded' height={40} animation="wave"/>
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