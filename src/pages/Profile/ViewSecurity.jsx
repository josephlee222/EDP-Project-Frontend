import { useContext, useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography, Button } from "@mui/material";
import { AppContext } from "../../App";
import { ProfileContext } from "./ProfileRoutes";
import CardTitle from "../../components/CardTitle";
import { Info, Key, LinkRounded, PersonRounded } from "@mui/icons-material";
import InfoBox from "../../components/InfoBox";
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';


export default function ViewSecurity() {
    const { setActivePage } = useContext(ProfileContext);

    useEffect(() => {
        setActivePage(4);
        document.title = "Account Security - UPlay" 
    }, [])

    return (
        <>
            <Card sx={{ mt: "1rem" }}>
                <CardContent>
                    <CardTitle title="Passkey Access" icon={<Key />} />
                    <Typography variant="body1" mt={3}>Passkeys allows you to login into NTUC UPlay without the need of a password by using your biometrics via mobile device or USB security key to verify your identity.</Typography>
                    <Box sx={{ mt: "1rem", display:"flex" }}>
                        <Button variant="contained" sx={{ mr: ".5rem", flexGrow: 1, flexBasis: 0 }} startIcon={<Key />}>Setup Passkey Access</Button>
                        <Button variant="secondary" sx={{ ml: ".5rem", flexGrow: 1, flexBasis: 0 }} startIcon={<Info />}>Learn More</Button>
                    </Box>
                </CardContent>
            </Card>
            <Card sx={{ mt: "1rem" }}>
                <CardContent>
                    <CardTitle title="Social Account Linkage" icon={<LinkRounded />} />
                    <Typography variant="body1" mt={3}>By linking your social accounts to UPlay, you can login using preferred social media account directly in the future.<br/>Layout not done for this yet.</Typography>
                </CardContent>
            </Card>
        </>
    )
}