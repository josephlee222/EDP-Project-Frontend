import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, CardContent, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../../http';
import { CategoryContext } from './AdminActivitiesRoutes';
import titleHelper from '../../../functions/helpers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import DateCalendarServerRequest from '../../../components/CustomDateCalendar'; // Import the DateCalendarServerRequest component

function CreateAvailability() {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { id: activityId } = useParams();
    const { setActivePage } = useContext(CategoryContext);
    const [availabilities, setAvailabilities] = useState([]);
    const [activity, setActivity] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [maxPax, setMaxPax] = useState('');
    const [price, setPrice] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    titleHelper("Set availabilities");

    const handleGetAvailabilities = () => {
        //`/Admin/Availability/Activity/${activityId}`
        http.get(`/Admin/Availability/Activity/${activityId}`).then((res) => {
            if (res.status === 200) {
                setAvailabilities(res.data)
                setLoading(false)
                
            console.log(res.data);
            }
        })
        
    }

    const handleGetActivity = () => {
        http.get(`/Activity/${activityId}`).then((res) => {
            if (res.status === 200) {
                setActivity(res.data);
            }
        });
    };

    useEffect(() => {
        handleGetAvailabilities();
        handleGetActivity();
        setActivePage(2);
    }, []);

    const handleDateSelection = (date) => {
        console.log("dialog opening");
        setSelectedDate(date); // Set the selected date
        setDialogOpen(true); // Open the dialog
    };
    

    const handleDialogClose = () => {
        setMaxPax('');
        setPrice('');
        setDialogOpen(false);
    };

    const handleSaveAvailability = () => {
        http.post("/Admin/Availability", {
            "ActivityId": activityId,
            "Date": selectedDate, // Make sure to provide the selectedDate
            "MaxPax": maxPax,
            "Price": price
        }).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("Activity created successfully!", { variant: "success" });
                handleGetAvailabilities();
            } else {
                enqueueSnackbar("Activity creation failed!.", { variant: "error" });
            }
        }).catch((err) => {
            enqueueSnackbar("Activity creation failed! " + err.response.data.error, { variant: "error" });
        });

        handleDialogClose();
    };

    return (
        <Box sx={{ marginY: "1rem" }}>
            <Card>
                <Typography variant="h5" sx={{margin:"1.5rem"}}>
                    Availabilities for {activity.name}
                </Typography>
                <CardContent>
                    <Box component="form" mt={3}>
                            {/* Use DateCalendarServerRequest component */}
                            <DateCalendarServerRequest
                            onChange={handleDateSelection}
                                activityId={activityId}
                                availabilities={availabilities} // Pass the availabilities array
                                setDialogOpen={setDialogOpen}
                            />
                    </Box>
                    <Dialog open={dialogOpen} onClose={handleDialogClose}>
                        <DialogTitle>Add Availability</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" gutterBottom>Add a new availability to this date</Typography>
                            <TextField
                                label="Max Pax"
                                variant="outlined"
                                fullWidth
                                value={maxPax}
                                onChange={(e) => setMaxPax(e.target.value)}
                                margin="dense"
                            />
                            <TextField
                                label="Price"
                                variant="outlined"
                                fullWidth
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                margin="dense"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose}>Cancel</Button>
                            <Button onClick={handleSaveAvailability}>Save</Button>
                        </DialogActions>
                    </Dialog>
                </CardContent>
            </Card>
        </Box>
    );
}

export default CreateAvailability;
