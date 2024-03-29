import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Card, CardContent, Grid, Typography, Button, Container, CardMedia, Skeleton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Accordion,
  AccordionSummary, AccordionDetails, Rating, IconButton, Chip
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import http from '../../http';
import CardTitle from '../../components/CardTitle';
import AddIcon from '@mui/icons-material/Add';
import titleHelper from '../../functions/helpers';
import ShareIcon from '@mui/icons-material/Share';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ImageSelector from '../../components/ImageSelector';
import BookingDialog from '../../components/BookingDialog';
import { useFormik } from 'formik';
import * as Yup from "yup";
import LoadingButton from '@mui/lab/LoadingButton';
import DateCalendarServerRequest from '../../components/CustomDateCalendarBooking';
import ProfilePicture from '../../components/ProfilePicture';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { AddRounded, CategoryRounded, Place, RateReviewRounded } from '@mui/icons-material';
import { AppContext } from '../../App';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlaceIcon from '@mui/icons-material/Place';
import moment from 'moment';
import { validateUser } from '../../functions/user';

function ActivityDetails() {
  const url = import.meta.env.VITE_API_URL
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id: activityId } = useParams();
  const [Reviews, setReviews] = useState([])
  const [activity, setActivity] = useState([])
  titleHelper("Activity Details", activity.name);
  const { user } = useContext(AppContext);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [availabilities, setavailabilities] = useState([]);
  const [date, setDate] = React.useState('');
  const [pax, setPax] = React.useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  const handlePrevImage = (card) => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? card.pictures.items.length - 1 : prevIndex - 1));
  };

  const handleNextImage = (card) => {
    setCurrentImageIndex((prevIndex) => (prevIndex === card.pictures.items.length - 1 ? 0 : prevIndex + 1));
  };

  const handleGetAvailabilities = () => {
    http.get(`/Availability/Activity/${activityId}`).then((res) => {
      if (res.status === 200) {
        setavailabilities(res.data)
        setLoading(false)
        console.log("availabilities: ", res.data)
      }
    })
  }

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handlePaxChange = (event) => {
    setPax(event.target.value);
  };

  const handleSubmit = () => {

  };
  const handleEditReview = (reviewId) => {
    navigate("/editReview/" + reviewId);
  };

  const handleDeleteReview = (reviewId) => {
    http.delete(`/Review/${reviewId}`).then((res) => {
      if (res.status === 200) {
        handleGetReviews();
        enqueueSnackbar("Review Deleted");
      }
    })
  };

  const formik = useFormik({
    initialValues: {
      date: "",
      pax: 0,

    },
    validationSchema: Yup.object({
      date: Yup.date().required("Date is required"),
      pax: Yup.number().required("Discount Amount is required"),


    }),
    onSubmit: (data) => {
      setLoading(true);
      console.log("date: ", data.date)
      let availableId = null;

      const isDateAvailable = availabilities.some(availability => {
        const availabilityDate = moment(availability.date).format("YYYY-MM-DD");
        console.log("availabilityDate: ", availabilityDate)
        console.log("data.date: ", data.date)
        if (availabilityDate === data.date) {
          availableId = availability.id;
          return true;
        }
        return false;
      });

      if (!isDateAvailable) {
        enqueueSnackbar("Selected date is not available or fully booked.", { variant: "error" });
        setLoading(false);
        return;
      }

      const postData = {
        availabilityId: availableId,
        pax: data.pax
      };

      http.post("/Shop/Cart", postData).then((res) => {
        if (res.status === 200) {
          enqueueSnackbar("Added to cart!", { variant: "success" });
          handleCloseDialog();
          setLoading(false);
          //navigate("/profile/booking")
        } else {
          enqueueSnackbar("Cart failed! else", { variant: "error" });
          setLoading(false);
        }
      }).catch((err) => {
        enqueueSnackbar("Cart failed! catch " + err.response.data.error, { variant: "error" });
        setLoading(false);
      }
      )
    }
  })


  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleGetActivity = () => {
    setLoading(true);
    http.get(`/Activity/${activityId}`).then((res) => {
      if (res.status === 200) {
        setActivity(res.data);
        console.log("res data ", res.data);
        console.log("activity ", activity);
        setLoading(false);
      }
    });
  };

  const testArray = ['wsG2mTDfY1.png', 'Ro2fXB3hj7.png', 'mGgIXukd6l.avif', 'uwuV3PnEIy.jpeg', 'q9hk-jGPbk.jpeg', 'Mf8uu6lGdw.avif']

  const handleGetReviews = () => {
    setLoading(true);
    http.get(`/Review/Activity/${activityId}`).then((res) => {
      console.log("reviews: ", res.data, " status code: ", res.status)

      if (res.status === 200) {
        setReviews(res.data);
        setLoading(false);

        const totalRating = res.data.reduce((acc, review) => acc + review.rating, 0);
        const avgRating = totalRating / res.data.length;
        console.log(avgRating)
        setAverageRating(avgRating);
      }
    });
  };

  const CustomCard = ({ id, rating, description, pictures }) => (
    <Card>
      <CardMedia sx={{ height: 140 }} image={pictures ? url + '/uploads/' + pictures.items[0] : "/unknown.png"} />
      <CardContent>
        <Link to={`/ReviewDetails/${id}`} style={{ textDecoration: 'none' }}>
          <Typography variant="h6">rating: {rating}</Typography>
        </Link>
        <Typography>{description}</Typography>
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
    handleGetActivity();
    handleGetReviews();
    handleGetAvailabilities();
    setLoggedIn(validateUser())
    console.log("user: ", user);
  }, []);


  return (
    <>
      <Container maxWidth="xl" sx={{ mt: "1rem" }}>


        <Box sx={{ marginY: "1rem", margin: "1.5rem" }}>
          <Typography variant="h3" fontWeight={700}>{activity.name}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Box sx={{ justifyContent: 'space-between', display: 'flex', alignItems: { xs: "initial", md: "center" }, flexDirection: { xs: "column", md: "row" } }}>
                <Chip icon={<CategoryRounded />} label={activity.category} variant="filled" sx={{ mr: { xs: "0", md: "1rem" } }} />
                {/* <Typography><b>category:</b> {activity.category}</Typography> */}
                <Chip icon={<PlaceIcon />} label={activity.location} variant="filled" />
                {/* <Typography sx={{ display: 'flex', marginLeft: '20px' }} alignItems={"center"}><PlaceIcon /> {activity.location}</Typography> */}
                <Button sx={{ marginLeft: 'auto', width: { xs: "100%", md: "auto" } }} variant="secondary" startIcon={<ShareIcon />}>Share</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <ImageSelector imageUrls={activity.pictures ? activity.pictures.items : []} />


        <Box sx={{ marginY: "1rem" }}>
          <Card>
            <CardContent>
              <Grid container spacing={2} sx={{ display: 'flex' }}>
                <Grid item xs={12} md={8}>


                  <div>
                    <Typography variant="subtitle1" fontWeight={700}>Description</Typography>
                    <Typography variant="body1">{activity.description}</Typography>
                  </div>


                  <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                    <DialogTitle>Book Activity</DialogTitle>
                    <DialogContent>
                      <Box component="form" mt={3}>

                        <DateCalendarServerRequest
                          onChange={formik.values.date}
                          activityId={activityId}
                          availabilities={availabilities}
                          formik={formik} // Pass the formik prop here
                        />

                        <TextField
                          fullWidth
                          id="pax"
                          name="pax"
                          label="pax"
                          variant="outlined"
                          value={formik.values.pax}
                          onChange={formik.handleChange}
                          error={formik.touched.pax && Boolean(formik.errors.pax)}
                          helperText={formik.touched.pax && formik.errors.pax}
                          type='number'
                        />

                      </Box>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseDialog}>Cancel</Button>
                      <Button onClick={formik.handleSubmit} color="primary">Book</Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
                <Grid item xs={12} md={4}>
                  <div alignItems={"center"} style={{ marginLeft: 'auto' }}>
                    <div>
                      <Typography variant="subtitle1" fontWeight={700}>Till</Typography>
                      <Typography variant="body1">{moment(activity.expiryDate).format('DD/MM/YYYY')}</Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle1" fontWeight={700}>Company</Typography>
                      <Typography variant="body1">{activity.company}</Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle1" fontWeight={700}>Location</Typography>
                      <Typography variant="body1">{activity.location}</Typography>
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {loggedIn && (
                    <Button variant="contained" color="primary"
                      sx={{ marginLeft: 'auto', marginRight: 'auto', width: '100%' }} onClick={handleOpenDialog}>
                      <Typography variant='h5' fontWeight={800}>Book</Typography>
                    </Button>
                  )}
                  {!loggedIn && (
                    <Button variant="contained" color="primary"
                      sx={{ marginLeft: 'auto', marginRight: 'auto', width: '100%' }} LinkComponent={Link} to="/login">
                      <Typography variant='h5' fontWeight={800}>Login to Book</Typography>
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* review section */}
          {/* <ProfilePicture user={user} sx={{ width: "72px", height: "72px" }} /> */}
          <Box sx={{ mt: "1rem" }}>
            <Box mb={"1rem"} display={"flex"} alignItems={"center"}>
              <Box flexGrow={1}>
                <Typography variant='h5'>Average Rating: {averageRating.toFixed(2)}</Typography>
                <Rating name="read-only" value={averageRating} readOnly precision={0.1} />
              </Box>
              {loggedIn && (
                <Button variant="contained" color="primary" startIcon={<AddRounded />} LinkComponent={Link} to={`/review/${activityId}`}>Add Review</Button>
              )}
            </Box>

            <Grid container spacing={2}>
              {loading && (
                <>
                  {[...Array(6)].map((card, index) => ( // changed key={card} to key={index}
                    <Grid item key={index} xs={12} sm={6} md={4}>
                      <CustomSkeletonCard />
                    </Grid>
                  ))}
                </>
              )}

              {!loading && (
                <>
                  {Reviews.length === 0 &&
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                            <RateReviewRounded sx={{ fontSize: 100, color: "black", opacity: "0.5" }} />
                            <Typography variant="h6" fontWeight={700}>No reviews yet...</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  }
                  {Reviews.map((card) => (
                    <Grid item key={card.id} xs={12} md={6}>
                      <Accordion>
                        <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}
                          aria-controls="panel1a-content" id="panel1a-header"
                          sx={{ height: "90px", overflow: "hidden", display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <ProfilePicture user={card.user} sx={{ width: "72px", height: "72px" }} />
                            <p style={{ marginLeft: '10px' }}>@{card.user.name}</p>
                            <Rating name="read-only" value={card.rating} readOnly style={{ marginLeft: '10px' }} />

                            <Typography style={{
                              marginLeft: '10px', whiteSpace: 'nowrap', overflow: "hidden",
                              textOverflow: "ellipsis", maxWidth: '1000px'
                            }}>
                              {card.description}
                            </Typography>

                            {card.user.id == user?.id && (
                              <div style={{ display: 'flex', marginLeft: 'auto' }}>
                                <EditIcon onClick={() => handleEditReview(card.id)} style={{ marginRight: '5px' }} />
                                <DeleteIcon onClick={() => handleDeleteReview(card.id)} />
                              </div>
                            )
                            }
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container rowSpacing={1} sx={{ height: '20rem', overflow: 'hidden' }}>
                            <Grid item xs={12} sx={{ position: 'relative', display: 'flex', transition: 'transform 0.7s ease-in-out', transform: `translateX(-${currentImageIndex * 100}%)` }}>
                              {card.pictures.items.length > 0 ? (
                                card.pictures.items.map((picture, index) => (
                                  <img
                                    key={index}
                                    src={url + '/uploads/' + picture}
                                    alt={`Preview ${index}`}
                                    style={{ flex: '0 0 auto', width: '100%', maxHeight: '20rem', objectFit: 'contain', cursor: 'pointer' }}
                                    onClick={() => handleImageClick(card, index)}
                                  />
                                ))
                              ) : (
                                <img
                                  src="/logo_uplay_warm_grey.png" // Replace with your placeholder image URL
                                  alt="No Image"
                                  style={{ width: '100%', maxHeight: '20rem', objectFit: 'fit', opacity: "0.7" }}
                                //style={{ width: '100%', maxHeight: '20rem', objectFit: 'cover', filter:"invert(1)", opacity:"0.25" }}
                                />
                              )}
                            </Grid>
                            {card.pictures.items.length > 1 && (
                              <>
                                <KeyboardArrowLeftIcon
                                  sx={{ position: 'absolute', top: '50%', left: '0', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 1 }}
                                  onClick={() => handlePrevImage(card)}
                                />
                                <KeyboardArrowRightIcon
                                  sx={{ position: 'absolute', top: '50%', right: '0', transform: 'translateY(-50%)', cursor: 'pointer', zIndex: 1 }}
                                  onClick={() => handleNextImage(card)}
                                />
                              </>
                            )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  ))}
                </>
              )}
            </Grid>

          </Box>
        </Box>
      </Container>
    </>
  );
}

export default ActivityDetails;