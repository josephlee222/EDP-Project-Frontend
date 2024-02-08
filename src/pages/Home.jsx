import { useContext, useEffect } from 'react'
import { Route, Routes, Navigate, Link } from 'react-router-dom'
//import NotFound from './errors/NotFound'
//import { UserContext } from '..'
import { Button, Container, Divider, Typography } from '@mui/material'
import { AppContext } from '../App';
import { HomeRounded } from '@mui/icons-material';
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
            <Container sx={{mt: "1rem"}} maxWidth="xl">
                <Typography variant="h4" component="div" fontWeight={700} sx={{ flexGrow: 1 }}>
                    Welcome to UPlay WIP
                </Typography>
                <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                    This is a work in progress of a website for the UPlay app. This is a temporary landing page.
                </Typography>
                <Divider sx={{my: "1rem"}}/>
                <Button variant="contained" sx={{fontWeight: 700, mr: "1rem"}} LinkComponent={Link} to="/login">Login</Button>
                <Button variant="contained" sx={{fontWeight: 700, mr: "1rem"}} LinkComponent={Link} to="/admin/test">Admin Test</Button>
                <Button variant="contained" sx={{fontWeight: 700, mr: "1rem"}} LinkComponent={Link} to="/activityList">View all Activities</Button>
                <Button variant="contained" sx={{fontWeight: 700, mr: "1rem"}} LinkComponent={Link} to="/groupList">Groups and Friends</Button>
            </Container>
        </>
    )
}

export default Home