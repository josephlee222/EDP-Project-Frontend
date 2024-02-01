import { useContext, useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography, Button, Divider } from "@mui/material";
import { AppContext } from "../../App";
import { ProfileContext } from "./ProfileRoutes";
import CardTitle from "../../components/CardTitle";
import { AddLinkRounded, Info, Key, LinkOffRounded, LinkRounded } from "@mui/icons-material";
import InfoBox from "../../components/InfoBox";
import { useSnackbar } from "notistack";
import http from "../../http";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from '@greatsumini/react-facebook-login';
import { LoadingButton } from "@mui/lab";
import { Link, json } from "react-router-dom";
import { coerceToArrayBuffer, coerceToBase64Url } from "../../functions/fidoHelpers";



export default function ViewSecurity() {
    const { setActivePage } = useContext(ProfileContext);
    const { user } = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();
    const [socialLoading, setSocialLoading] = useState(false);

    useEffect(() => {
        setActivePage(4);
        document.title = "Account Security - UPlay"
    }, [])

    const handlePasskeySetup = async () => {
        var credentials = await http.post("/User/Passkey/Setup");
        credentials = credentials.data;
        var rawCredentials = credentials;
        console.log("Credential Options Object", credentials);  // DEBUG


        // Turn the challenge back into the accepted format of padded base64
        credentials.challenge = coerceToArrayBuffer(credentials.challenge);
        // Turn ID into a UInt8Array Buffer for some reason
        credentials.user.id = coerceToArrayBuffer(credentials.user.id);

        credentials.excludeCredentials = credentials.excludeCredentials.map((c) => {
            c.id = coerceToArrayBuffer(c.id);
            return c;
        });


        if (credentials.authenticatorSelection.authenticatorAttachment === null) credentials.authenticatorSelection.authenticatorAttachment = undefined;

        var newCredential;
        try {
            newCredential = await navigator.credentials.create({
                publicKey: credentials
            });
        } catch (e) {
            var msg = "Could not create credentials in browser. Probably because the username is already registered with your authenticator. Please change username or authenticator."
            console.log(msg);
            console.log(e);
            return;
        }

        try {
            await handlePasskeySave(newCredential, rawCredentials);
        } catch (e) {
            console.log(e);
            return;
        }
    }

    const handlePasskeySave = async (newCredential, credentialsOptions) => {
        console.log("New Credential Object", newCredential);  // DEBUG
        let attestationObject = new Uint8Array(newCredential.response.attestationObject);
        let clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
        let rawId = new Uint8Array(newCredential.rawId);

        const data = {
            id: newCredential.id,
            rawId: coerceToBase64Url(rawId),
            type: newCredential.type,
            extensions: newCredential.getClientExtensionResults(),
            response: {
                AttestationObject: coerceToBase64Url(attestationObject),
                clientDataJson: coerceToBase64Url(clientDataJSON)
            }
        };
        console.log("Cred Options", credentialsOptions);  // DEBUG
        credentialsOptions.user.id = coerceToBase64Url(credentialsOptions.user.id);
        credentialsOptions.challenge = coerceToBase64Url(credentialsOptions.challenge);
        credentialsOptions.excludeCredentials = credentialsOptions.excludeCredentials.map((c) => {
            c.id = coerceToBase64Url(c.id);
            return c;
        });
        let response;
        try {
            response = await http.post("/User/Passkey/Save", {AttestationResponse: data, Options: JSON.stringify(credentialsOptions)});
        } catch (e) {
            alert(e);
            return;
        }

        console.log("Credential Object", response);

        // show error
        if (response.status !== 200) {
            enqueueSnackbar("Failed to register passkey. " + response.errorMessage, { variant: "error" });
            return;
        }

        enqueueSnackbar("Passkey registered successfully!", { variant: "success" });
    }


    const handleChangeGoogle = useGoogleLogin({
        onSuccess: (res) => {
            setSocialLoading(true)
            http.post("/User/Google/Link", { token: res.access_token }).then((res) => {
                if (res.status === 200) {
                    enqueueSnackbar(res.data.message, { variant: "success" });
                    setSocialLoading(false)
                }
            }).catch((err) => {
                enqueueSnackbar("Failed to change Google account. " + err.response.data.error, { variant: "error" });
                setSocialLoading(false)
            })
        },
    })

    const handleFacebookSuccess = async (res) => {
        setSocialLoading(true)
        http.post("/User/Facebook/Link", { token: res.accessToken }).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar(res.data.message, { variant: "success" });
                setSocialLoading(false)
            }
        }).catch((err) => {
            enqueueSnackbar("Failed to change Facebook account. " + err.response.data.error, { variant: "error" });
            setSocialLoading(false)
        })
    }

    const handleFacebookFailure = (err) => {
        console.log(err);
        if (err.status === "loginCancelled") {
            enqueueSnackbar("Login failed! Cancelled by user.", { variant: "error" });
            setLoading(false);
        } else {
            enqueueSnackbar("Login failed! " + err.status, { variant: "error" });
            setLoading(false);
        }
    }

    return (
        <>
            <Card sx={{ mt: "1rem" }}>
                <CardContent>
                    <CardTitle title="Passkey Access" icon={<Key />} />
                    <Typography variant="body1" mt={"1rem"}>Passkeys allows you to login into NTUC UPlay without the need of a password by using your biometrics via mobile device or USB security key to verify your identity.</Typography>
                    <Box sx={{ mt: "1rem", display: "flex" }}>
                        <Button variant="contained" sx={{ mr: ".5rem", flexGrow: 1, flexBasis: 0 }} startIcon={<Key />} onClick={handlePasskeySetup}>Setup Passkey Access</Button>
                        <Button variant="secondary" sx={{ ml: ".5rem", flexGrow: 1, flexBasis: 0 }} startIcon={<Info />} LinkComponent={Link} to="https://www.passkeys.io/" target="_blank">Learn More</Button>
                    </Box>
                </CardContent>
            </Card>
            <Card sx={{ mt: "1rem" }}>
                <CardContent>
                    <CardTitle title="Social Account Linkage" icon={<LinkRounded />} />
                    <Typography variant="body1" mt={"1rem"}>By linking your social accounts to UPlay, you can login using your preferred social media account directly in the future.</Typography>
                    <Grid container marginTop={"1rem"} alignItems={"center"}>
                        <Grid item xs={12} sm marginBottom={["1rem", 0]}>
                            <Box component="form" display="flex" alignItems={"center"}>
                                <InfoBox flexGrow={1} title="Google Account" value={user?.googleId ? "Linked" : "Not Linked"} boolean={user?.googleId || false} />
                                <LoadingButton loading={socialLoading} variant="secondary" color="primary" onClick={handleChangeGoogle} startIcon={!user?.googleId ? <AddLinkRounded /> : <LinkOffRounded />}>{user?.googleId ? "Un-link" : "Link"}</LoadingButton>
                            </Box>
                        </Grid>
                        <Divider orientation="vertical" sx={{ marginX: "1rem" }} flexItem />
                        <Grid item xs={12} sm>
                            <Box component="form" display="flex" alignItems={"center"}>
                                <InfoBox flexGrow={1} title="Facebook Account" value={user?.facebookId ? "Linked" : "Not Linked"} boolean={user?.facebookId || false} />
                                <FacebookLogin
                                    appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                                    onSuccess={handleFacebookSuccess}
                                    onFail={handleFacebookFailure}
                                    render={({ onClick, logout }) => (
                                        <LoadingButton loading={socialLoading} variant="secondary" color="primary" onClick={onClick} startIcon={!user?.facebookId ? <AddLinkRounded /> : <LinkOffRounded />}>{user?.facebookId ? "Un-link" : "Link"}</LoadingButton>
                                    )}
                                />

                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}