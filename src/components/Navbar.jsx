import { AppBar, Box, Toolbar, Typography, Divider, Button, Chip, Skeleton } from "@mui/material"
import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import LoginIcon from '@mui/icons-material/LoginRounded';
import { AppContext } from "../App";
import NavbarProfile from "./NavbarProfile";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import NavbarNotifications from "./NavbarNotifications";

export default function Navbar() {
    const { user, adminPage, userLoading } = useContext(AppContext);
    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                        <Box sx={{flexGrow: 1, display: "flex", alignItems: "center"}}>
                            <Typography variant="h6" component="div">
                                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>UPlay WIP</Link>
                            </Typography>
                            <Divider orientation="vertical" flexItem sx={{mx: "1rem"}}/>

                            {adminPage && <Chip label="Admin Panel" color="warning" size="small" icon={<AdminPanelSettingsIcon/>}/>}
                        </Box>
                        {(!user && userLoading) && <Skeleton variant="circular" width={40} height={40} sx={{m: "8px"}} animation="wave"/>}
                        {(!user && userLoading) && <Skeleton variant="circular" width={40} height={40} sx={{m: "8px"}} animation="wave"/>}
                        {(!user && !userLoading) && <Button LinkComponent={Link} variant="text" color="inherit" to="/login" startIcon={<LoginIcon/>}>Login</Button>}
                        {user && <NavbarNotifications />}
                        {user && <NavbarProfile />}
                    </Box>
                    
                </Toolbar>
            </AppBar>
        </>
    )
}