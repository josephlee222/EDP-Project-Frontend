import { useContext, useEffect } from 'react'
import { Route, Routes, Navigate, Link } from 'react-router-dom'
//import NotFound from './errors/NotFound'
//import { UserContext } from '..'
import { Button, Container, Divider, Typography, Grid, Box, Card, TextField } from '@mui/material'
import { AppContext } from '../App';
import { HomeRounded, SearchRounded } from '@mui/icons-material';
import titleHelper from '../functions/helpers';


function Home() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    //const { setIsAdminPage } = useContext(UserContext);
    titleHelper("Home")

    // useEffect(() => {
    //     setIsAdminPage(false)
    // }, [])
    return (
        <>
            <Box p={"1rem"} sx={{ backgroundColor: "appGrey.main" }}>
                <Grid container spacing={{xs: "1rem", md: 10}}>
                    <Grid item xs={12} md={6}>
                        <Card style={{ width: "100%" }}>
                            <img src="/homepage_hero.jpg" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                        <Box>
                            <Typography variant="h3" component="div" fontWeight={700}>
                                <Box component="span" sx={{ color: "primary.main" }}>UPlay</Box>, <br />Discover Fun
                            </Typography>
                            <Box sx={{ mt: "1rem" }} display={"flex"}>
                                <TextField
                                    id="outlined-basic"
                                    label="Search for an activity"
                                    variant="outlined"
                                    sx={{minWidth: "15rem", flexGrow: {xs: "1", md: "0"}}}
                                />
                                <Button variant="contained" sx={{ fontWeight: 700, ml: "1rem" }} LinkComponent={Link} to="/activityList" startIcon={<SearchRounded />}>Search</Button>
                            </Box>
                            <Typography variant="h6" fontWeight={700} sx={{ mt: "1rem" }}>or browse by <Button variant='secondary' sx={{fontWeight: 700}}>category</Button></Typography>
                                
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Container sx={{ mt: "1rem" }} maxWidth="xl">
                <Typography variant="h4" component="div" fontWeight={700} sx={{ flexGrow: 1 }}>
                    Welcome to UPlay WIP
                </Typography>
                <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                    This is a work in progress of a website for the UPlay app. This is a temporary landing page.
                </Typography>
                <Divider sx={{ my: "1rem" }} />
                <Button variant="contained" sx={{ fontWeight: 700, mr: "1rem" }} LinkComponent={Link} to="/login">Login</Button>
                <Button variant="contained" sx={{ fontWeight: 700, mr: "1rem" }} LinkComponent={Link} to="/admin/test">Admin Test</Button>
                <Button variant="contained" sx={{ fontWeight: 700 }} LinkComponent={Link} to="/activityList">View all Activities</Button>
            </Container>
        </>
    )
}

export default Home