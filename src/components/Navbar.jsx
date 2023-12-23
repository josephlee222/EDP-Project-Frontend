import { AppBar, Box, Container, Toolbar, IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Typography, Divider, Drawer, Stack, Button } from "@mui/material"
import { Link } from "react-router-dom"
import { useState } from "react"

export default function Navbar() {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>UPlay WIP</Link>
                        </Typography>
                        <Button color="inherit" LinkComponent={Link} to="login">Login</Button>
                    </Box>
                    
                </Toolbar>
            </AppBar>
        </>
    )
}