import { useContext, useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { AppContext } from "../../App";
import { ProfileContext } from "./ProfileRoutes";
import CardTitle from "../../components/CardTitle";
import { PersonRounded } from "@mui/icons-material";
import InfoBox from "../../components/InfoBox";
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';


export default function ViewBookings() {
    const { setActivePage } = useContext(ProfileContext);

    useEffect(() => {
        setActivePage(2);
        document.title = "Bookings - UPlay" 
    }, [])

    return (
        <>
            <Card sx={{ mt: "1rem" }}>
                <CardContent>
                    <CardTitle title="My Bookings" icon={<TodayRoundedIcon />} />
                    <Typography variant="body1" mt={3}>Not implemented yet.</Typography>
                </CardContent>
            </Card>
        </>
    )
}