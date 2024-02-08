import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import http from '../../http';
import CardTitle from '../../components/CardTitle';
import AddIcon from '@mui/icons-material/Add';
import titleHelper from '../../functions/helpers';

function GroupDetails() {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id: groupId } = useParams();
  const [group, setGroup] = useState({
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
  titleHelper("Group Details" , group.name);

  const handleGetGroup = () => {
    setLoading(true);
    http.get(`/Group/${groupId}`).then((res) => {
      if (res.status === 200) {
        setGroup(res.data);
        setLoading(false);
        
      }
    });
  };

  useEffect(() => {
    handleGetGroup();
  }, []);

  return (
    <>
      <Box sx={{ marginY: "1rem" }}>
        <Card>
          <CardContent>
            <CardTitle title="Group Details" icon={<AddIcon />} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <div>
                  <Typography variant="subtitle1">Name:</Typography>
                  <Typography variant="body1">{group.name}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle1">Expiry Date:</Typography>
                  <Typography variant="body1">{group.expiryDate}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle1">Description:</Typography>
                  <Typography variant="body1">{group.description}</Typography>
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

export default GroupDetails;