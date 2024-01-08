import { useContext, useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography, Button } from "@mui/material";
import { AppContext } from "../../App";
import { ProfileContext } from "./ProfileRoutes";
import CardTitle from "../../components/CardTitle";
import { Info, Key, LinkRounded, PersonRounded } from "@mui/icons-material";
import InfoBox from "../../components/InfoBox";
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import { useSnackbar } from "notistack";


export default function ViewSecurity() {
    const { setActivePage } = useContext(ProfileContext);
    const { user } = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        setActivePage(4);
        document.title = "Account Security - UPlay" 
    }, [])

    // const handlePasskeySetup = () => {
    //     console.log("Passkey setup");

    //     const options = {
    //         challenge: new Uint8Array(16),
    //         rp: {
    //             name: "UPlay",
    //             id: "localhost"
    //         },
    //         user: {
    //             id: new Uint8Array(16),
    //             name: user.email,
    //             displayName: user.name
    //         },
    //         pubKeyCredParams: [
    //             {
    //                 type: "public-key",
    //                 alg: -7
    //             }
    //         ],
    //         authenticatorSelection: {
    //             authenticatorAttachment: "platform",
    //             requireResidentKey: false,
    //             userVerification: "preferred"
    //         },
    //         timeout: 60000,
    //         attestation: "direct"
    //     }

    //     navigator.credentials.create({
    //         publicKey: options
    //     }).then((newCredentialInfo) => {
    //         console.log("SUCCESS", newCredentialInfo);

    //         const attestationObject = new Uint8Array(newCredentialInfo.response.attestationObject);
    //         const clientDataJSON = new Uint8Array(newCredentialInfo.response.clientDataJSON);
    //         const rawId = new Uint8Array(newCredentialInfo.rawId);

    //         const data = {
    //             id: newCredentialInfo.id,
    //             rawId: rawId,
    //             type: newCredentialInfo.type,
    //             extensions: newCredentialInfo.getClientExtensionResults(),
    //             response: {
    //                 attestationObject: attestationObject,
    //                 clientDataJSON: clientDataJSON
    //             }
    //         }

    //         // Send the data to the server
    //         http.post("/User/Passkey", data).then((res) => {
    //             console.log("SUCCESS", res);
    //         }).catch((err) => {
    //             console.log("FAIL", err);
    //             enqueueSnackbar("Passkey setup failed!", { variant: "error" });
    //         })
    //     }).catch((err) => {
    //         console.log("FAIL", err);
    //         enqueueSnackbar("Passkey setup failed!", { variant: "error" });
    //     })
    // }

    return (
        <>
            <Card sx={{ mt: "1rem" }}>
                <CardContent>
                    <CardTitle title="Passkey Access" icon={<Key />} />
                    <Typography variant="body1" mt={3}>Passkeys allows you to login into NTUC UPlay without the need of a password by using your biometrics via mobile device or USB security key to verify your identity.</Typography>
                    <Box sx={{ mt: "1rem", display:"flex" }}>
                        <Button variant="contained" sx={{ mr: ".5rem", flexGrow: 1, flexBasis: 0 }} startIcon={<Key />} onClick>Setup Passkey Access</Button>
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