import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography, Button, Container, CardMedia, Skeleton } from '@mui/material';
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

function ActivityDetails() {
  const url = import.meta.env.VITE_API_URL
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id: activityId } = useParams();
  const [Reviews, setReviews] = useState([])
  // const [activity, setActivity] = useState({
  //   name: "",
  //   expiryDate: "",
  //   description: "",
  //   category: "",
  //   ntucExclusive: "",
  //   ageLimit: "",
  //   location: "",
  //   company: "",
  //   discountType: "",
  //   discountAmount: "",
  //   pictures:[]
  // });
  const [activity, setActivity] = useState([])
  titleHelper("Activity Details", activity.name);

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
      console.log("reviews: " + res.data + " status code: " + res.status)

      if (res.status === 200) {
        setReviews(res.data);
        setLoading(false);
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
  }, []);

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: "1rem" }}>


        <Box sx={{ marginY: "1rem", margin: "1.5rem" }}>
          <Typography variant="h2">{activity.name}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={11} md={11}>
              <Typography>category: {activity.category}</Typography>
            </Grid>
            <Grid item xs={1} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography>share  </Typography><ShareIcon />
            </Grid>
          </Grid>
        </Box>

        <ImageSelector imageUrls={activity.pictures ? activity.pictures.items : []} />



        <Box sx={{ marginY: "1rem" }}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>


                  <div>
                    <Typography variant="subtitle1">Expiry Date:</Typography>
                    <Typography variant="body1">{activity.expiryDate}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle1">Description:</Typography>
                    <Typography variant="body1">{activity.description}</Typography>
                  </div>

                  <Button
                    onClick={() => {
                      navigate("/Booking/" + activityId)
                    }}
                  >
                    book
                  </Button>
                </Grid>
              </Grid>

            </CardContent>


            {/* <CardContent>
            <CardTitle title="Reviews" icon={<AddIcon />} />
            <Link to={`/review/${activityId}`} style={{ textDecoration: 'none' }}>
                    <Typography variant="h6">add review</Typography>
                </Link>

            {Reviews.map((review) => (
              <div key={review.id}>
                <Typography variant="subtitle1">User:</Typography>
                <Typography variant="body1">{review.userId}</Typography>
                <Typography variant="subtitle1">Rating:</Typography>
                <Typography variant="body1">{review.rating}</Typography>
                <Typography variant="subtitle1">Description:</Typography>
                <Typography variant="body1">{review.description}</Typography>
              </div>
            ))}
          </CardContent> */}
          </Card>

          <Container sx={{ mt: "1rem" }} maxWidth="xl">
            <Link to={`/review/${activityId}`} style={{ textDecoration: 'none' }}>
              <Typography variant="h6">add review</Typography>
            </Link>
            <Grid container spacing={2}>
              {loading && <>{[...Array(6)].map((card) => (
                <Grid item key={card} xs={12} sm={6} md={4}>
                  <CustomSkeletonCard />
                </Grid>
              ))}</>}

              {!loading && <>{Reviews.map((card) => (
                <Grid item key={card.id} xs={12} sm={6} md={4}>
                  <CustomCard {...card} />
                </Grid>
              ))}</>}
            </Grid>
          </Container>
        </Box>
      </Container>
    </>
  );
}

export default ActivityDetails;