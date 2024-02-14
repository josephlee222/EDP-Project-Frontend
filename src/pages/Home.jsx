import { useContext, useEffect, useState } from 'react'
import { Route, Routes, Navigate, Link } from 'react-router-dom'
//import NotFound from './errors/NotFound'
//import { UserContext } from '..'
import { Button, Container, Divider, Typography, Grid, Box, Card, TextField, Skeleton, CardContent, CardMedia, Chip } from '@mui/material'
import { AppContext } from '../App';
import { HomeRounded, NewReleasesRounded, SearchRounded, WarningRounded } from '@mui/icons-material';
import titleHelper from '../functions/helpers';
import http from '../http';
import { useSnackbar } from "notistack";
import moment from 'moment';

function Home() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    //const { setIsAdminPage } = useContext(UserContext);
    titleHelper("Home")
    const apiUrl = import.meta.env.VITE_API_URL;
    const [banners, setBanners] = useState({})
    const [loading, setLoading] = useState(false)
    const [activities, setActivities] = useState([])
    const [loadingActivities, setLoadingActivities] = useState(false)
    const { enqueueSnackbar } = useSnackbar();

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

    const getBanners = () => {
        setLoading(true)
        http.get("/Shop/Banner").then((res) => {
            if (res.status === 200) {
                setBanners(res.data)
                setLoading(false)
            }
        }).catch((err) => {
            enqueueSnackbar("Failed to load banners! " + err.response.data.message, { variant: "error" });
            setLoading(false)
        }
        )
    }

    const getActivities = () => {
        setLoadingActivities(true)
        http.get("/Activity").then((res) => {
            if (res.status === 200) {
                var activities = res.data
                console.log(activities.reverse())
                setActivities(activities)
                setLoadingActivities(false)
            }
        }).catch((err) => {
            enqueueSnackbar("Failed to load activities! " + err.response.data.message, { variant: "error" });
            setLoadingActivities(false)
        }
        )
    }

    useEffect(() => {
        getBanners()
        getActivities()
    }, [])

    return (
        <>
            <Box p={"1rem"} sx={{ backgroundImage: "url('/family-fun-time-banner.png')", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "50%, 10%" }}>
                <Grid container spacing={{ xs: "1rem", md: 10 }}>
                    <Grid item xs={12} md={6}>
                    </Grid>
                    <Grid item xs={12} md={6} display={"flex"} flexDirection={"column"} justifyContent={"center"}>
                        <Box sx={{ height: "400px", display: "flex", flexDirection: "column", justifyContent: { xs: "end", md: "center" } }}>
                            <Typography variant="h3" component="div" fontWeight={700}>
                                <Box component="span" sx={{ color: "primary.main" }}>UPlay</Box>, <br />Discover Fun
                            </Typography>
                            <Box sx={{ mt: "1rem" }} display={"flex"}>
                                <TextField
                                    id="outlined-basic"
                                    label="Search for an activity"
                                    variant="outlined"
                                    sx={{ minWidth: "15rem", flexGrow: { xs: "1", md: "0" } }}
                                />
                                <Button variant="contained" sx={{ fontWeight: 700, ml: "1rem" }} LinkComponent={Link} to="/activityList" startIcon={<SearchRounded />}>Search</Button>
                            </Box>
                            <Typography variant="h6" fontWeight={700} sx={{ mt: "1rem" }}>or browse by <Button variant='secondary' sx={{ fontWeight: 700, mixBlendMode: "multiply" }}>category</Button></Typography>

                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Container sx={{ mt: "1rem" }} maxWidth="xl">
                <Box mt={"2rem"} mb={"3rem"}>
                    <Grid container spacing={{ xs: "1rem", md: 10 }}>
                        <Grid item xs={12} md={8} display={"flex"} direction={"column"} justifyContent={"center"}>
                            <Box>
                                <Typography variant="h4" component="div" mb={"1rem"} fontWeight={700} sx={{ flexGrow: 1 }}>
                                    Welcome to UPlay
                                </Typography>
                                <Typography variant="p" component="div" sx={{ flexGrow: 1, mb: "1rem" }}>
                                    UPlay, powered by NTUC Club, is a phygital (physical + digital) concierge of curatorial recreation experiences to enhance the social well-being of all workers.
                                    <br /><br />
                                    More than just a booking platform, UPlay aspires to connect people from all walks of life, forging new relationships over time as they find a common thread through shared interests. Union and companies can also join us in creating fun and engaging communities while cultivating deep connections and lifelong relationships.
                                </Typography>
                                <Button variant="contained" sx={{ fontWeight: 700, mr: "1rem" }} LinkComponent={Link} to="/faq">Learn More</Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <img src="/group_kouitten 1.png" width={"100%"} />
                        </Grid>
                        {/* <Divider sx={{ my: "1rem" }} />
                    <Button variant="contained" sx={{ fontWeight: 700, mr: "1rem" }} LinkComponent={Link} to="/login">Login</Button>
                    <Button variant="contained" sx={{ fontWeight: 700, mr: "1rem" }} LinkComponent={Link} to="/admin/test">Admin Test</Button>
                    <Button variant="contained" sx={{ fontWeight: 700 }} LinkComponent={Link} to="/activityList">View all Activities</Button> */}
                    </Grid>
                </Box>
                <Box my={"3rem"} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Typography variant="h4" fontWeight={700}>
                        Offers & Discounts
                    </Typography>
                    <Typography variant="p" mb={"2rem"} textAlign={"center"}>
                        Save more with our current exclusive offers and discounts
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                            <Card sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", aspectRatio: "1/1" }}>
                                {banners.banner1 ? <img src={apiUrl + "/uploads/" + banners.banner1.imagePath} alt="Banner 1" style={{ width: "100%", height: "100%" }} /> : (loading && <Skeleton variant="rectangular" width={"100%"} height={"100%"} />)}
                                {!banners.banner1 && !loading &&
                                    <Box textAlign={"center"} sx={{ opacity: 0.5 }}>
                                        <NewReleasesRounded sx={{ fontSize: "6rem" }} />
                                        <Typography variant="h6" fontWeight={700} textAlign={"center"}>Check back later...</Typography>
                                    </Box>
                                }
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Card sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", aspectRatio: "1/1" }}>
                                {banners.banner2 ? <img src={apiUrl + "/uploads/" + banners.banner2.imagePath} alt="Banner 2" style={{ width: "100%", height: "100%" }} /> : (loading && <Skeleton variant="rectangular" width={"100%"} height={"100%"} />)}
                                {!banners.banner2 && !loading &&
                                    <Box textAlign={"center"} sx={{ opacity: 0.5 }}>
                                        <NewReleasesRounded sx={{ fontSize: "6rem" }} />
                                        <Typography variant="h6" fontWeight={700} textAlign={"center"}>Check back later...</Typography>
                                    </Box>
                                }
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Card sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", aspectRatio: "1/1" }}>
                                {banners.banner3 ? <img src={apiUrl + "/uploads/" + banners.banner3.imagePath} alt="Banner 3" style={{ width: "100%", height: "100%" }} /> : (loading && <Skeleton variant="rectangular" width={"100%"} height={"100%"} />)}
                                {!banners.banner3 && !loading &&
                                    <Box textAlign={"center"} sx={{ opacity: 0.5 }}>
                                        <NewReleasesRounded sx={{ fontSize: "6rem" }} />
                                        <Typography variant="h6" fontWeight={700} textAlign={"center"}>Check back later...</Typography>
                                    </Box>
                                }
                            </Card>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Card sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", aspectRatio: "1/1" }}>
                                {banners.banner4 ? <img src={apiUrl + "/uploads/" + banners.banner4.imagePath} alt="Banner 4" style={{ width: "100%", height: "100%" }} /> : (loading && <Skeleton variant="rectangular" width={"100%"} height={"100%"} />)}
                                {!banners.banner4 && !loading &&
                                    <Box textAlign={"center"} sx={{ opacity: 0.5 }}>
                                        <NewReleasesRounded sx={{ fontSize: "6rem" }} />
                                        <Typography variant="h6" fontWeight={700} textAlign={"center"}>Check back later...</Typography>
                                    </Box>
                                }
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
                <Box my={"3rem"} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Typography variant="h4" fontWeight={700}>
                        New Activities
                    </Typography>
                    <Typography variant="p" mb={"2rem"} textAlign={"center"}>
                        Discover the latest activities that we have to offer
                    </Typography>
                    <Grid container spacing={2}>
                        {loadingActivities && (
                            <>
                                <Grid item xs={12} sm={6} md={4}>
                                    <CustomSkeletonCard />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <CustomSkeletonCard />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <CustomSkeletonCard />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <CustomSkeletonCard />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <CustomSkeletonCard />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <CustomSkeletonCard />
                                </Grid>
                            </>
                        )}
                        {!loadingActivities && activities.length === 0 && (
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                                            <WarningRounded sx={{ fontSize: 100, color: "black", opacity: "0.5" }} />
                                            <Typography variant="h6" fontWeight={700}>No activities Found</Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                        )}
                        {activities.slice(0, 6).map((activity, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Link to={`/activityList/${activity.id}`} style={{ textDecoration: 'none' }}>
                                    <Card>
                                        <CardMedia sx={{ height: 140 }} image={activity.pictures ? apiUrl + '/uploads/' + activity.pictures.items[0] : "/unknown.png"} />
                                        <CardContent>
                                            <Typography sx={{
                                                whiteSpace: 'nowrap', overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }} variant="h6" fontWeight={700}>{activity.name}</Typography>
                                            <Typography sx={{
                                                whiteSpace: 'nowrap', overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}>{activity.description}</Typography>
                                            <Typography>Till: {moment(activity.expiryDate).format("DD/MM/YYYY")}</Typography>
                                            <Chip label={activity.category} variant='contained' sx={{mt: ".5rem"}} /> 
                                        </CardContent>
                                    </Card>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </>
    )
}

export default Home