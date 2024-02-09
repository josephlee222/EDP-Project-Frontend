import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography, Button, Container, CardMedia, Skeleton } from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import http from '../../http';
import CardTitle from '../../components/CardTitle';
import AddIcon from '@mui/icons-material/Add';
import titleHelper from '../../functions/helpers';

function ReviewDetails() {
  const url = import.meta.env.VITE_API_URL
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id: reviewId } = useParams();
  const [Reviews, setReviews] = useState([])
  const [review, setReview] = useState({
    name: "",
    expiryDate: "",
    description: "",
    category: "",
    ntucExclusive: "",
    ageLimit: "",
    location: "",
    company: "",
    discountType: "",
    discountAmount: ""
  });
  titleHelper("Review Details" , review.name);

  const handleGetReview = () => {
    setLoading(true);
    http.get(`/Review/${reviewId}`).then((res) => {
      if (res.status === 200) {
        setReview(res.data);
        setLoading(false);
        
      }
    });
  };

  const handleGetReviews = () => {
    setLoading(true);
    http.get(`/Review/Review/${reviewId}`).then((res) => {
      console.log("reviews: "+res.data+" status code: "+res.status)

      if (res.status === 200) {
        setReviews(res.data);
        setLoading(false);
      }
    });
  };

  const CustomCard = ({ id, rating, description, pictures }) => (
    <Card>
        <CardMedia sx={{ height: 140 }} image={pictures ? url+'/uploads/'+pictures.items[0] : "/unknown.png"}/>
        <CardContent>
            <Link to={`/reviewList/${id}`} style={{ textDecoration: 'none' }}>
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
    handleGetReview();
    handleGetReviews();
  }, []);

  return (
    <>
      <Box sx={{ marginY: "1rem" }}>
        <Card>
          <CardContent>
            <CardTitle title="Review Details" icon={<AddIcon />} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                
                <div>
                  <Typography variant="subtitle1">Name:</Typography>
                  <Typography variant="body1">{review.name}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle1">Expiry Date:</Typography>
                  <Typography variant="body1">{review.expiryDate}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle1">Description:</Typography>
                  <Typography variant="body1">{review.description}</Typography>
                </div>
                
                <Button
                 onClick={() => {
                  navigate("/Booking/" + reviewId)
              }}
                >
                  book
                </Button>
              </Grid>
            </Grid>

          </CardContent>


            {/* <CardContent>
            <CardTitle title="Reviews" icon={<AddIcon />} />
            <Link to={`/review/${reviewId}`} style={{ textDecoration: 'none' }}>
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
        <Link to={`/review/${reviewId}`} style={{ textDecoration: 'none' }}>
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
    </>
  );
}

export default ReviewDetails;