import { AppBar, Box, Container, Toolbar, IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Typography, Divider, Drawer, Stack, Button, Badge, Chip } from "@mui/material"
import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import LoginIcon from '@mui/icons-material/LoginRounded';
import { AppContext } from "../App";
import NavbarProfile from "./NavbarProfile";

export default function Navbar() {
    const { user, adminPage } = useContext(AppContext);
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
                            {adminPage && <Chip label="Admin Area" color="warning" size="small"/>}
                        </Box>
                        
                        {!user && <Button LinkComponent={Link} variant="text" color="inherit" to="/login" startIcon={<LoginIcon/>}>Login</Button>}
                        {user && <NavbarProfile />}
                    </Box>
                    
                </Toolbar>
            </AppBar>
        </>
    )
}