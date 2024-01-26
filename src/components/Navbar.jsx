import { AppBar, Toolbar, Typography, Box, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Chip, Skeleton, ListItemButton } from "@mui/material"
import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import LoginIcon from '@mui/icons-material/LoginRounded';
import { AppContext } from "../App";
import NavbarProfile from "./NavbarProfile";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import NavbarNotifications from "./NavbarNotifications";
import { MenuRounded } from "@mui/icons-material";
import { HomeRounded } from "@mui/icons-material";

export default function Navbar() {
    const { user, adminPage, userLoading, title } = useContext(AppContext);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)


    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <Box sx={{ flexGrow: 1, alignItems: "center", display: "flex" }}>
                        <Box sx={{flexGrow: 1, display: ["none", "none", "flex"], alignItems: "center"}}>
                            <Typography variant="h6" component="div">
                                <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>UPlay WIP</Link>
                            </Typography>
                            <Divider orientation="vertical" flexItem sx={{mx: "1rem"}}/>

                            {adminPage && <Chip label="Admin Panel" color="warning" size="small" icon={<AdminPanelSettingsIcon/>}/>}
                        </Box>
                        <Box sx={{flexGrow: 1, display: ["flex", "flex", "none"], alignItems: "center"}}>
                            <IconButton color="inherit" sx={{ marginRight: "1rem" }} onClick={() => setIsDrawerOpen(true)}><MenuRounded /></IconButton>
                            <Divider orientation="vertical" flexItem sx={{ marginRight: "1rem" }} />
                            <Typography variant="h6" component="div">
                                {title}
                            </Typography>
                        </Box>
                        {(!user && userLoading) && <Skeleton variant="circular" width={40} height={40} sx={{m: "8px"}} animation="wave"/>}
                        {(!user && userLoading) && <Skeleton variant="circular" width={40} height={40} sx={{m: "8px"}} animation="wave"/>}
                        {(!user && !userLoading) && <Button LinkComponent={Link} variant="text" color="inherit" to="/login" startIcon={<LoginIcon/>}>Login</Button>}
                        {user && <NavbarNotifications />}
                        {user && <NavbarProfile />}
                    </Box>
                    
                </Toolbar>
            </AppBar>
            <Drawer
                anchor={"left"}
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            >
                <List sx={{ width: "250px" }}>
                    <ListItem key={"Home"}>
                        <Typography fontWeight={700}>Navigation Menu</Typography>
                    </ListItem>
                    <Divider sx={{marginBottom: 1}} />
                    <ListItem key={"Home"} disablePadding>
                        <ListItemButton component={Link} to="/" onClick={() => setIsDrawerOpen(false)}>
                            <ListItemIcon><HomeRounded /></ListItemIcon>
                            <ListItemText primary={"Home"} />
                        </ListItemButton>
                    </ListItem>
                    
                </List>
            </Drawer>
        </>
    )
}