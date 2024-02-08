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
            <Box p={"1rem"} sx={{ backgroundImage: "url('/family-fun-time-banner.png')", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "50%, 10%" }}>
                <Grid container spacing={{ xs: "1rem", md: 10 }}>
                    <Grid item xs={12} md={6}>
                    </Grid>
                    <Grid item xs={12} md={6} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                        <Box sx={{ height: "370px", display: "flex", flexDirection: "column", justifyContent: { xs: "end", md: "center" } }}>
                            <Typography variant="h3" component="div" fontWeight={700}>
                                <Box component="span" sx={{ color: "primary.main" }}>UPlay</Box>, <br />Discover Fun
                            </Typography>
                            <Box sx={{ mt: "1rem" }} display={"flex"}>
                                <TextField
                                    id="outlined-basic"
                                    label="Search for an activity"
                                    variant="outlined"
                                    sx={{ minWidth: "15rem", flexGrow: { xs: "1", md: "0" } }}
                                />
                                <Button variant="contained" sx={{ fontWeight: 700, ml: "1rem" }} LinkComponent={Link} to="/activityList" startIcon={<SearchRounded />}>Search</Button>
                            </Box>
                            <Typography variant="h6" fontWeight={700} sx={{ mt: "1rem" }}>or browse by <Button variant='secondary' sx={{ fontWeight: 700, mixBlendMode:"multiply" }}>category</Button></Typography>

                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Container sx={{ mt: "1rem" }} maxWidth="xl">
                <Box my={"2rem"}>
                    <Grid container spacing={{ xs: "1rem", md: 10 }}>
                        <Grid item xs={12} md={8} display={"flex"} direction={"column"} justifyContent={"center"}>
                            <Box>
                            <Typography variant="h4" component="div" mb={"1rem"} fontWeight={700} sx={{ flexGrow: 1 }}>
                                Welcome to UPlay
                            </Typography>
                            <Typography variant="p" component="div" sx={{ flexGrow: 1, mb: "1rem" }}>
                                UPlay, powered by NTUC Club, is a phygital (physical + digital) concierge of curatorial recreation experiences to enhance the social well-being of all workers.
                            </Typography>
                            <Button variant="contained" sx={{ fontWeight: 700, mr: "1rem" }} LinkComponent={Link} to="/login">Login</Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <img src="/group_kouitten 1.png" width={"100%"} />
                        </Grid>
                        {/* <Divider sx={{ my: "1rem" }} />
                    <Button variant="contained" sx={{ fontWeight: 700, mr: "1rem" }} LinkComponent={Link} to="/login">Login</Button>
                    <Button variant="contained" sx={{ fontWeight: 700, mr: "1rem" }} LinkComponent={Link} to="/admin/test">Admin Test</Button>
                    <Button variant="contained" sx={{ fontWeight: 700 }} LinkComponent={Link} to="/activityList">View all Activities</Button> */}
                    </Grid>
                </Box>
            </Container>
        </>
    )
}

export default Home