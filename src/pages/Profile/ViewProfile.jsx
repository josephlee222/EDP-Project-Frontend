import { useContext, useEffect, useState } from "react";
import { Box, Card, CardContent, Grid } from "@mui/material";
import { AppContext } from "../../App";
import { ProfileContext } from "./ProfileRoutes";
import CardTitle from "../../components/CardTitle";
import { PersonRounded } from "@mui/icons-material";
import InfoBox from "../../components/InfoBox";


export default function ViewProfile() {
    const { user } = useContext(AppContext);
    const { activePage, setActivePage } = useContext(ProfileContext);

    useEffect(() => {
        setActivePage(1);
        document.title = "Profile - UPlay" 
    }, [])

    return (

        <>
            <Card sx={{ mt: "1rem" }}>
                <CardContent>
                    <CardTitle title="Profile Information" icon={<PersonRounded />} />
                    <Grid container mt=".5rem" spacing={2}>
                        <Grid item xs={12} md={6}>
                            <InfoBox title="Name" value={user && user.name} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoBox title="Phone Number" value={user && (user.phone ? user.phone : "Not Provided")} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoBox title="Birthday" value={user && (user.birthday ? user.birthday : "Not Provided")} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoBox title="NRIC (Last 4 Digits)" value={user && (user.nric ? user.nric : "Not Provided")} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card sx={{ mt: "1rem" }}>
                <CardContent>
                    <CardTitle title="Membership & Other Information" icon={<PersonRounded />} />
                    <Grid container mt=".5rem" spacing={2}>
                        <Grid item xs={12} md={6}>
                            <InfoBox title="Membership Status" value={"Not implemented"} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoBox title="Newsletter subscription" boolean={false} value="Not Implemented" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoBox title="Address" value={user && (user.address ? user.address : "Not Provided")} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoBox title="Postal Code" value={user && (user.postalCode ? user.postalCode : "Not Provided")} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )

}