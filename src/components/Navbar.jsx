import { AppBar, Box, Container, Toolbar, IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Typography, Divider, Drawer, Stack, Button } from "@mui/material"
import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import LoginIcon from '@mui/icons-material/LoginRounded';
import { AppContext } from "../App";
import NavbarProfile from "./NavbarProfile";

export default function Navbar() {
    const { user } = useContext(AppContext);
    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>UPlay WIP</Link>
                        </Typography>
                        {!user && <Button LinkComponent={Link} variant="text" color="inherit" to="/login" startIcon={<LoginIcon/>}>Login</Button>}
                        {user && <NavbarProfile />}
                    </Box>
                    
                </Toolbar>
            </AppBar>
        </>
    )
}