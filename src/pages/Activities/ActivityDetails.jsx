import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import http from '../../http';
import CardTitle from '../../components/CardTitle';
import AddIcon from '@mui/icons-material/Add';
import titleHelper from '../../functions/helpers';

function ActivityDetails() {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id: activityId } = useParams();
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

  useEffect(() => {
    handleGetActivity();
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
                {/* Add other fields similarly */}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default ActivityDetails;