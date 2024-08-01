import { useContext, useEffect, useState } from 'react'
import { Route, Routes, Navigate, Link } from 'react-router-dom'
//import NotFound from './errors/NotFound'
//import { UserContext } from '..'
import { Button, Container, Divider, Typography, Grid, Box, Card, TextField, Skeleton, CardContent, Accordion, AccordionDetails, AccordionSummary, Stack } from '@mui/material'
import { AppContext } from '../App';
import { AccountBalanceRounded, AccountBalanceWalletRounded, ExpandMoreRounded, HomeRounded, LocalOfferRounded, LoyaltyRounded, NewReleasesRounded, QuestionAnswerRounded, SearchRounded, StarRounded, WalletRounded } from '@mui/icons-material';
import titleHelper from '../functions/helpers';
import http from '../http';
import PageHeader from '../components/PageHeader';
import CardTitle from '../components/CardTitle';


function Fou() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    //const { setIsAdminPage } = useContext(UserContext);
    titleHelper("Friends of UPlay")

    return (
        <>
            <PageHeader icon={LoyaltyRounded} title="Friends of UPlay" navTitle="Friends of UPlay" />
            <Container maxWidth="xl" sx={{ marginY: "1rem" }}>
                <Box my={"3rem"} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Typography variant="h4" fontWeight={700}>
                        Unlock Benefits and Rewards
                    </Typography>
                    <Typography variant="p" mb={"2rem"} textAlign={"center"}>
                        All it takes is your first successful paid booking on UPlay to be Friends of UPlay and start enjoying privileges!
                    </Typography>
                    <Card sx={{ width: "100%", marginBottom: "1rem" }}>
                        <CardContent>
                            <CardTitle title="Benefits of 'Friends Of UPlay'" icon={<StarRounded />} />
                            <Stack mt={"1rem"} spacing={"1rem"}>
                                <Box display={"flex"} alignItems={"center"} flexDirection={{xs: "column", md: "row"}}>
                                    <Card sx={{ width: "128px", backgroundColor: "#fff" }}>
                                        <CardContent>
                                            <AccountBalanceWalletRounded sx={{ width: "100%", height: "auto", opacity: 0.75 }} />
                                        </CardContent>
                                    </Card>
                                    <Box ml={{xs: "0", md: "1rem"}} mt={{xs: ".5rem", md: "0"}} textAlign={{xs: "center", md: "start"}}>
                                        <Typography variant="h6" fontWeight={700}>Member Rate</Typography>
                                        <Typography>
                                            Enjoy member rates on activities and experiences. Save more when you book more!
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems={"center"} flexDirection={{xs: "column", md: "row"}}>
                                    <Card sx={{ width: "128px", backgroundColor: "#fff" }}>
                                        <CardContent>
                                            <LocalOfferRounded sx={{ width: "100%", height: "auto", opacity: 0.75 }} />
                                        </CardContent>
                                    </Card>
                                    <Box ml={{xs: "0", md: "1rem"}} mt={{xs: ".5rem", md: "0"}} textAlign={{xs: "center", md: "start"}}>
                                        <Typography variant="h6" fontWeight={700}>Promotions & Deals</Typography>
                                        <Typography>
                                            Exclusive offers from UPlay and our partners. Enjoy more for less!
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display={"flex"} alignItems={"center"} flexDirection={{xs: "column", md: "row"}}>
                                    <Card sx={{ width: "128px", backgroundColor: "#fff" }}>
                                        <CardContent>
                                            <NewReleasesRounded sx={{ width: "100%", height: "auto", opacity: 0.75 }} />
                                        </CardContent>
                                    </Card>
                                    <Box ml={{xs: "0", md: "1rem"}} mt={{xs: ".5rem", md: "0"}} textAlign={{xs: "center", md: "start"}}>
                                        <Typography variant="h6" fontWeight={700}>VIP Exclusives</Typography>
                                        <Typography>
                                            via UPlay's newsletter and social media. Be the first to know!
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Container>
        </>
    )
}

export default Fou