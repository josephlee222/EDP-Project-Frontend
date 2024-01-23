import { useState, useContext } from "react";
import { Box, IconButton, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Popover, Divider, Typography, Button, colors, Tooltip, Stack, Card, CardContent, Badge } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import ProfilePicture from "./ProfilePicture";
import { AppContext } from "../App";
import CardTitle from "./CardTitle";

import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/PersonRounded';
import SupportIcon from '@mui/icons-material/Support';
import { enqueueSnackbar } from "notistack";
import { NotificationsRounded, ShoppingBagRounded } from "@mui/icons-material";
import http from "../http";

export default function NavbarNotifications() {
    const { notifications } = useContext(AppContext);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const navigate = useNavigate()

    function handlePopoverOpen(event) {
        setAnchorEl(event.currentTarget);
        setIsPopoverOpen(true);
    }

    function handleNotificationClick(url) {
        navigate(url)
        setIsPopoverOpen(false)
    }

    function handleNotificationDismiss(id) {
        http.get("User/Notification/Read?notificationId=" + id).then((res) => {
            enqueueSnackbar("Notification dismissed", { variant: "success" })
        }).catch((err) => {
            enqueueSnackbar("Failed to dismiss notification", { variant: "error" })
        })
    }

    // Profile picture should be implemented later
    return (
        <>
            <Tooltip title="Account Notifications" arrow>
                <IconButton onClick={(e) => handlePopoverOpen(e)}>
                    {notifications.length > 0 &&
                        <Badge badgeContent={notifications.length} color="yellow" overlap="circular">
                            <NotificationsRounded sx={{ fill: "white" }} />
                        </Badge>
                    }
                    {notifications.length === 0 &&
                        <NotificationsRounded sx={{ fill: "white" }} />
                    }
                </IconButton>
            </Tooltip>
            <Popover
                id={"userPopover"}
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={() => setIsPopoverOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    horizontal: 'right',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            width: "400px",
                            borderRadius: "1rem"
                        }
                    }
                }}
            >
                <Box sx={{ margin: "1rem" }}>
                    <CardTitle title="Account Notifications" icon={<NotificationsRounded />} />
                    <Stack spacing={".5rem"} mt={"1rem"}>
                        {notifications.length === 0 &&
                            <Card sx={{ backgroundColor: "#ffffff" }}>
                                <CardContent>
                                    <Typography variant="body1" fontWeight={700} width={"100%"} textAlign={"center"}>No Unread Notifications</Typography>
                                </CardContent>
                            </Card>
                        }
                        {notifications.map((notification) => (
                            <Card sx={{ backgroundColor: "#ffffff" }}>
                                <CardContent>
                                    <Typography variant="body1" fontWeight={700}>{notification.title}</Typography>
                                    <Typography variant="body2" mb={".5rem"}>{notification.subtitle}</Typography>
                                    <Stack direction="row" justifyContent="flex-end">
                                        <Button variant="contained" color="primary" size="small" sx={{ mr: ".5rem" }} onClick={() => handleNotificationClick(notification.actionUrl)}>{notification.action}</Button>
                                        <Button variant="outlined" color="primary" size="small" onClick={() => handleNotificationDismiss(notification.id)}>Dismiss</Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))
                        }
                        <Button variant="outlined" color="primary" size="small" fullWidth>View All Notifications</Button>
                    </Stack>
                </Box>
            </Popover>
        </>
    )
}