import { useContext, useEffect, useState } from 'react'
import { Route, Routes, Navigate, Link } from 'react-router-dom'
//import NotFound from './errors/NotFound'
//import { UserContext } from '..'
import { Button, Container, Divider, Typography, Grid, Box, Card, TextField, Skeleton, CardContent, Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { AppContext } from '../App';
import { ExpandMoreRounded, HomeRounded, QuestionAnswerRounded, SearchRounded } from '@mui/icons-material';
import titleHelper from '../functions/helpers';
import http from '../http';
import PageHeader from '../components/PageHeader';


function Faq() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    //const { setIsAdminPage } = useContext(UserContext);
    titleHelper("FAQ")

    return (
        <>
            <PageHeader icon={QuestionAnswerRounded} title="Frequently Asked Questions" navTitle="FAQ" />
            <Container maxWidth="xl" sx={{marginY: "1rem"}}>
                <Box sx={{ marginY: "1rem" }}>
                    <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
                        About UPlay Community
                    </Typography>
                    <Typography variant="p" gutterBottom>
                        We automatically welcome you to the UPlay Community as Friends of UPlay upon your first successful paid booking! <br/><br/>As Friends of UPlay, you will receive our monthly newsletter, unlock a trove of promotions and deals from our participating merchants or partners and also enjoy Friends of UPlay Member Rate on subsequent bookings.
                    </Typography>
                </Box>
                <Divider sx={{marginY: "1rem"}} />
                <Box sx={{ marginY: "1rem" }}>
                    <Typography variant='h6' fontWeight={700} gutterBottom>General Questions</Typography>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            Is UPlay a membership?
                        </AccordionSummary>
                        <AccordionDetails>
                            No, UPlay is not a membership program. It is a pay-per-use engagement platform where you can explore your interests through experiences and build connections with others within the UPlay Community.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            How do I sign-up for a UPlay account?
                        </AccordionSummary>
                        <AccordionDetails>
                            You can sign up for free using your Singapore registered mobile number. Click here to register. Please refer to the video below for a step-by-step guide on how to sign-up for a UPlay account.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            What are the benefits of being Friends of UPlay?
                        </AccordionSummary>
                        <AccordionDetails>
                            Please refer to the full list of Benefits and Rewards here.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            Friends of UPlay - Corporate Programme
                        </AccordionSummary>
                        <AccordionDetails>
                        UPlay partners with various organisations and associations under the Friends of UPlay - Corporate Program.<br/><br/>
                        With the Program, you are eligible for preferential Member Rates on UPlay bookings and will receive full access to all UPlay Community Benefits and Rewards. For the full list of Benefits and Rewards, please click here.<br/><br/>
                        For more FAQs on your respective Friends of UPlay - Corporate Programmes, please contact your Organisation or Association. Below is the list of organisations and associations under this Program.
                        </AccordionDetails>
                    </Accordion>
                </Box>
                <Box sx={{ marginY: "1rem" }}>
                    <Typography variant='h6' fontWeight={700} gutterBottom>About Member Rates</Typography>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            What member rates are available?
                        </AccordionSummary>
                        <AccordionDetails>
                        There are three-tiered Member Rates available on UPlay. For any clarifications, please contact UPlay Team here.<br/><br/>

                        Guest - First time guests on UPlay (you will be paying at full Guest price on your first chargeable booking on UPlay)<br/>
                        Friends of UPlay - Returning guests on UPlay (you will automatically unlock Friends of UPlay price on your second and subsequent bookings on UPlay upon verified login)<br/>
                        NTUC Members - NTUC Members holding on to a valid NTUC Union Membership card (you will automatically unlock NTUC Member price upon verified login)
                        </AccordionDetails>
                    </Accordion>
                </Box>
                <Box sx={{ marginY: "1rem" }}>
                    <Typography variant='h6' fontWeight={700} gutterBottom>General Questions</Typography>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            Contacting The Experience Organiser
                        </AccordionSummary>
                        <AccordionDetails>
                            If you have questions about a booking, please direct them to the organiser using the contact information indicated on the Experience Listing. If contact information is not available, please contact UPlay Team here.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            How do I retrieve my confirmation email if it was accidentally deleted?
                        </AccordionSummary>
                        <AccordionDetails>
                            You can resend your confirmation email by going to the login page and clicking on the "Resend Confirmation Email" button.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            Why is my confirmation email missing?
                        </AccordionSummary>
                        <AccordionDetails>
                            The email confirmation may be sent to your junk/spam folder or could not be delivered or you may have logged in to a different email address than the one you used to place the order.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            What should I do if my confirmation email is missing?
                        </AccordionSummary>
                        <AccordionDetails>
                        Once you place an order on UPlay, a confirmation email will be sent to the email address you entered for that order. If the email cannot be found, try to search your inbox for an email from noreply@uplay.com.sg.<br/><br/>

                        Alternatively, contact the Experience Organiser directly for a speedier response. Check if the contact information on the listing.<br/><br/>

                        Otherwise, you may contact UPlay Team here to look up your order and we will assist to resend your confirmation email within 3 working days.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            What happens when my order is cancelled or postponed by the organizer?
                        </AccordionSummary>
                        <AccordionDetails>
                            The Experience Organiser will duly inform all affected participants, via your e-mail or text to your registered email or phone number. For both postponements and cancellations, refund services may be available, and instructions will be communicated.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            Can I request for a refund?
                        </AccordionSummary>
                        <AccordionDetails>
                            Refunds are subject to approval on a case-by-case basis, please see Terms & Conditions on individual listings for the cancellation and refund policy. Otherwise, you may contact UPlay Team  here.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            I do not live in Singapore and/or do not have a local address. Can I still purchase through UPlay?
                        </AccordionSummary>
                        <AccordionDetails>
                            Yes, you can! You can purchase the tickets on behalf of another person or as a gift. If it is an online experience, we would be happy to have you logged in and join us virtually.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            How do I place corporate and group orders?
                        </AccordionSummary>
                        <AccordionDetails>
                            Corporate and group orders are subject to the availability of the respective Experiences hosted by the Experience Organizers. You may refer to the Experience Listing to check if bulk orders are available. Alternatively, you may contact the Experience Organizers directly to make arrangements.<br/><br/>

                            Otherwise, please feel free to contact UPlay Team here.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            Why Does UPlay require my personal information?
                        </AccordionSummary>
                        <AccordionDetails>
                            Collecting your contact details lets us reach out to you in the event where there are changes made to your order, such as change of venue, event postponement, or cancellation.<br/><br/>

                            Your personal information is also crucial for validation and verification purposes. In the case of lost/stolen tickets, information like your Name/Contact No./email details are the best means of validation.
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="panel1a-content" id="panel1a-header">
                            Which Payment Modes Are Accepted?
                        </AccordionSummary>
                        <AccordionDetails>
                            We accept various payment modes such as Visa, Mastercard, JCB, Apple Pay, Google Pay, Paynow, Alipay and WeChat Pay. For more information, please refer to our Payment Policy.
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Container>
        </>
    )
}

export default Faq