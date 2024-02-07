import { useContext, useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Container, CardMedia, Skeleton, Box } from '@mui/material'
import { AppContext } from "../../App";
import { ProfileContext } from "./ProfileRoutes";
import CardTitle from "../../components/CardTitle";
import { PersonRounded, WarningRounded } from "@mui/icons-material";
import InfoBox from "../../components/InfoBox";
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import http from '../../http';
import { Link } from 'react-router-dom';


export default function ViewBookings() {
    const { setActivePage } = useContext(ProfileContext);
    const [loading, setLoading] = useState(true)
    const [booking, setBooking] = useState([]);
    const [Activities, setActivities] = useState([])
    const handleGetBookings = () => {
        http.get("/Booking/").then((res) => {
            if (res.status === 200) {
                setBooking(res.data)
                setLoading(false)
            }
        })
    }
    const handleGetActivities = () => {
        http.get("/Activity/").then((res) => {
            if (res.status === 200) {
                setActivities(res.data)
                setLoading(false)
            }
        })
    }
    const getActivityName = (activityId) => {
        const activity = Activities.find((act) => act.id === activityId);
        return activity ? activity.name : "Activity Not Found";
    };

    

    const CustomCard = ({ id, activityId, date, pax, notes }) => (
        <Card>
          <CardContent>
                <Link to={`/activityList/${activityId}`} style={{ textDecoration: 'none' }}>
                    <Typography variant="h6">Activity: {getActivityName(activityId)}</Typography>
                </Link>
                <Typography>Date: {date}</Typography>
                <Typography>Pax: {pax}</Typography>
                <Typography>Notes: {notes}</Typography>

                <Link to={`/editBooking/${id}`} style={{ textDecoration: 'none' }}>
                    <Typography variant="h6">Edit</Typography>
                </Link>
            </CardContent>
        </Card>
    );

    const CustomSkeletonCard = () => (
        <Card>
            <Skeleton variant="rectangular" height={140} />
            <CardContent>
                <Typography variant="h6"><Skeleton animation="wave" /></Typography>
                <Typography><Skeleton animation="wave" /></Typography>
                <Typography><Skeleton animation="wave" /></Typography>
            </CardContent>
        </Card>
    );


    useEffect(() => {
        setActivePage(2);
        document.title = "Bookings - UPlay" ;
        handleGetBookings();
        handleGetActivities()
    }, [])

    return (
        <>
                
                {!loading && booking.length === 0 && 
                    <Card sx={{mt: "1rem"}}>
                    <CardContent>
                        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                            <WarningRounded sx={{ fontSize: 100, color:"black", opacity:"0.5" }} />
                            <Typography variant="h6" fontWeight={700}>No Bookings Found</Typography>
                        </Box>
                    </CardContent>
                </Card>
                }
                
                <Grid container spacing={2} mt={"1rem"}>
                    {loading && <>{[...Array(2)].map((card) => (
                        <Grid item key={card} xs={12} sm={6} md={4}>
                            <CustomSkeletonCard />
                        </Grid>
                    ))}</>}

                    {!loading && <>{booking.map((card) => (
                        <Grid item key={card.id} xs={12} sm={6} md={4}>
                            <CustomCard {...card} />
                        </Grid>
                    ))}</>}
                </Grid>
        </>
    )
}