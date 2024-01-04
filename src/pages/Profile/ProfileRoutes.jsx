import { useContext, useEffect, useState, createContext } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import NotFound from '../errors/NotFound'
import Test from '../Test'
import { AppContext } from '../../App'
import { useSnackbar } from 'notistack'
import { Card, CardContent, Container, Grid, ListItemIcon, ListItemButton, ListItem, ListItemText, createTheme, ThemeProvider, Box, Typography, Button } from '@mui/material'
import ProfilePicture from '../../components/ProfilePicture'
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PageHeader from '../../components/PageHeader'
import { validateUser } from "../../functions/user";

import ViewProfile from './ViewProfile'
import ViewBookings from './ViewBookings'
import ViewWallet from './ViewWallet'
import ViewSecurity from './ViewSecurity'

export const ProfileContext = createContext(null);

export default function ProfileRoutes() {
    const { setAdminPage, user } = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();
    const [ activePage, setActivePage ] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!validateUser()) {
            enqueueSnackbar("You must be logged in to view this page", { variant: "error" });
            navigate("/login");
        }
    }, [])

    return (
        <ProfileContext.Provider value={{ activePage, setActivePage }}>
            <PageHeader icon={BadgeRoundedIcon} title="My Profile" />
            <Container maxWidth="xl">
                <Grid container spacing={2} maxWidth={"xl"} mb={3}>
                    <Grid item xs={12} md="4" lg="3">
                        <Card sx={{ mt: "1rem", width: "100%" }}>
                            <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                                    {user &&
                                        <ProfilePicture user={user} sx={{ width: ["72px", "96px", "128px"], height: ["72px", "96px", "128px"] }} />
                                    }
                                    <Typography variant="h5" fontWeight={700} sx={{ textAlign: "center", mt: ".5rem" }}>{user && user.name}</Typography>
                                    <Typography variant="body1" sx={{ textAlign: "center" }}>{user && user.email}</Typography>
                                    <Button fullWidth variant="contained" sx={{ mt: "1rem" }} LinkComponent={Link} to="/profile/edit" startIcon={<EditRoundedIcon/>}>Edit Profile</Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md="8" lg="9">
                        <Card sx={{ mt: "1rem" }}>
                            <CardContent>
                                <Box sx={{  alignItems: "center", overflowX:"auto", whiteSpace:"nowrap" }}>
                                    <Button variant={activePage == 1 ? "contained" : "secondary"} startIcon={<BadgeRoundedIcon />} sx={{ mr: ".5rem", fontWeight: 700 }} LinkComponent={Link} to="/profile">Profile Information</Button>
                                    <Button variant={activePage == 2 ? "contained" : "secondary"} startIcon={<TodayRoundedIcon />} sx={{ mr: ".5rem", fontWeight: 700 }} LinkComponent={Link} to="/profile/bookings">Bookings</Button>
                                    <Button variant={activePage == 3 ? "contained" : "secondary"} startIcon={<AccountBalanceWalletRoundedIcon />} sx={{ mr: ".5rem", fontWeight: 700 }} LinkComponent={Link} to="/profile/wallet">Wallet & Gifts</Button>
                                    <Button variant={activePage == 4 ? "contained" : "secondary"} startIcon={<SecurityRoundedIcon />} sx={{ fontWeight: 700 }} LinkComponent={Link} to="/profile/security">Account Security</Button>
                                </Box>
                            </CardContent>
                        </Card>
                        <Routes>
                            <Route path="*" element={<NotFound />} />
                            <Route path="/" element={<ViewProfile />} />
                            <Route path="/bookings" element={<ViewBookings />} />
                            <Route path="/wallet" element={<ViewWallet />} />
                            <Route path="/security" element={<ViewSecurity />} />
                        </Routes>
                    </Grid>
                </Grid>
            </Container>
        </ProfileContext.Provider>
    )
}

