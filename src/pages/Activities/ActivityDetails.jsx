import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import http from '../../http';
import CardTitle from '../../components/CardTitle';
import AddIcon from '@mui/icons-material/Add';
import titleHelper from '../../functions/helpers';

function ActivityDetails() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id: activityId } = useParams();
  const [Reviews, setReviews] = useState([])
  const [activity, setActivity] = useState({
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
  titleHelper("Activity Details" , activity.name);

  const handleGetActivity = () => {
    setLoading(true);
    http.get(`/Activity/${activityId}`).then((res) => {
      if (res.status === 200) {
        setActivity(res.data);
        setLoading(false);
        
      }
    });
  };

  const handleGetReviews = () => {
    setLoading(true);
    http.get(`/Review/Activity/${activityId}`).then((res) => {
      console.log("reviews: "+res.data+" status code: "+res.status)

      if (res.status === 200) {
        setReviews(res.data);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    handleGetActivity();
    handleGetReviews();
  }, []);

  return (
    <>
      <Box sx={{ marginY: "1rem" }}>
        <Card>
          <CardContent>
            <CardTitle title="Activity Details" icon={<AddIcon />} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                
                <div>
                  <Typography variant="subtitle1">Name:</Typography>
                  <Typography variant="body1">{activity.name}</Typography>
                </div>
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

            {/* Reviews Section */}
            <CardContent>
            <CardTitle title="Reviews" icon={<AddIcon />} />
            <Link to={`/review/${activityId}`} style={{ textDecoration: 'none' }}>
                    <Typography variant="h6">add review</Typography>
                </Link>
            {/* Display reviews here using the Reviews state */}
            {Reviews.map((review) => (
              <div key={review.id}>
                <Typography variant="subtitle1">User:</Typography>
                <Typography variant="body1">{review.user}</Typography>
                <Typography variant="subtitle1">Rating:</Typography>
                <Typography variant="body1">{review.rating}</Typography>
                <Typography variant="subtitle1">Comment:</Typography>
                <Typography variant="body1">{review.comment}</Typography>
              </div>
            ))}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default ActivityDetails;