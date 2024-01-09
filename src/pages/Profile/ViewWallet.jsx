import { useContext, useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography, Button } from "@mui/material";
import { AppContext } from "../../App";
import { ProfileContext } from "./ProfileRoutes";
import CardTitle from "../../components/CardTitle";
import { NewspaperRounded, PersonRounded } from "@mui/icons-material";
import InfoBox from "../../components/InfoBox";
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcardRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded';
import PinRoundedIcon from '@mui/icons-material/PinRounded';



export default function ViewWallet() {
    const { setActivePage } = useContext(ProfileContext);
    const { user } = useContext(AppContext);

    useEffect(() => {
        setActivePage(3);
        document.title = "Wallet & Gifts - UPlay" 
    }, [])

    return (
        <>
            <Card sx={{ mt: "1rem" }}>
                <CardContent>
                    <CardTitle title="Wallet Balance" icon={<AccountBalanceWalletRoundedIcon />} />
                    <Typography variant="body2" mt={3} fontWeight={700}>Current Balance</Typography>
                    <Typography variant="h4" mt={1} fontWeight={700}>${user && user.balance.toFixed(2)}</Typography>
                    <Box sx={{ mt: "1rem", display:"flex" }}>
                        <Button variant="contained" sx={{ mr: ".5rem", flexGrow: 1, flexBasis: 0 }} startIcon={<AddCardRoundedIcon />}>Top-Up Wallet</Button>
                        <Button variant="secondary" sx={{ ml: ".5rem", flexGrow: 1, flexBasis: 0 }} startIcon={<HistoryRoundedIcon />}>View Transaction History</Button>
                    </Box>
                </CardContent>
            </Card>
            <Card sx={{ mt: "1rem" }}>
                <CardContent>
                    <CardTitle title="UPlay Gifts" icon={<CardGiftcardIcon />} />
                    <Typography variant="body1" mt={3}>UPlay Gifts lets you purchase a gift code for you to give to someone else. You can also redeem gift codes that you have received. </Typography>
                    <Box sx={{ mt: "1rem", display:"flex" }}>
                        <Button variant="contained" sx={{ mr: ".5rem", flexGrow: 1, flexBasis: 0 }} startIcon={<CardGiftcardIcon />}>Purchase a Gift Code</Button>
                        <Button variant="secondary" sx={{ ml: ".5rem", flexGrow: 1, flexBasis: 0 }} startIcon={<PinRoundedIcon />}>Redeem a Gift Code</Button>
                    </Box>
                </CardContent>
            </Card>
        </>
    )
}