import { useContext, useEffect, useState } from 'react'
import { Route, Routes, Navigate, Link } from 'react-router-dom'
import { Button, Container, Divider, Typography, Grid, Box, Card, TextField, Skeleton, CardContent, Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { ExpandMoreRounded, HomeRounded, PriceCheckRounded, QuestionAnswerRounded, SearchRounded } from '@mui/icons-material';
import titleHelper from '../../functions/helpers';


function CheckoutSuccess() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    //const { setIsAdminPage } = useContext(UserContext);
    titleHelper("Checkout Success")

    return (
        <>
            <Container maxWidth="md" sx={{ marginY: "1rem" }}>
                <Card>
                    <CardContent>
                        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} textAlign={"center"}>
                            <PriceCheckRounded sx={{ fontSize: "8rem", color: "green" }} />
                            <Typography variant={"h4"} fontWeight={700}>Thank you for your purchase!</Typography>
                            <Typography variant={"body1"}>Your order has been successfully placed. You will receive an email confirmation shortly.</Typography>
                            <Divider sx={{ marginY: "1rem" }} />
                            <Button variant={"contained"} color={"primary"} component={Link} to={"/profile/bookings"} startIcon={<HomeRounded />}>View Bookings</Button>
                        </Box>
                    </CardContent>

                </Card>
            </Container>
        </>
    )
}

export default CheckoutSuccess