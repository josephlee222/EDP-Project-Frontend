import { useContext, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
//import NotFound from './errors/NotFound'
//import { UserContext } from '..'
import { Container, Typography } from '@mui/material'


function Home() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    //const { setIsAdminPage } = useContext(UserContext);
    //const { user } = useContext(UserContext);

    // useEffect(() => {
    //     setIsAdminPage(false)
    // }, [])
    return (
        document.title = "UPlay - Home",
        <>
            <Container>
                <Typography>Beep boop test hello world</Typography>
            </Container>
        </>
    )
}

export default Home