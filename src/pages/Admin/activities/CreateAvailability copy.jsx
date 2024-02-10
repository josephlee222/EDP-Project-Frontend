import React, { useState, useEffect, useContext } from 'react';
import { Box, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import http from '../../../http';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';
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
    const [selectedDate, setSelectedDate] = useState(null);
    const [maxPax, setMaxPax] = useState('');
    const [price, setPrice] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    titleHelper("Set availabilities");

    const handleGetAvailabilities = () => {
        http.get(`/Admin/Availability/Activity/${activityId}`)
            .then((res) => {
                if (res.status === 200) {
                    setAvailabilities(res.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching availabilities:", error);
            });
    }

    useEffect(() => {
        handleGetAvailabilities();
        setActivePage(2);
    }, []);

    const handleDateSelection = (date) => {
        setSelectedDate(date);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setMaxPax('');
        setPrice('');
        setDialogOpen(false);
    };


    const handleSaveAvailability = () => {
        setLoading(true);
        http.post("/Admin/Availability", {
            "ActivityId" : activityId,
            "Date" : selectedDate,
            "MaxPax" : maxPax,
            "Price" : price
        })
        .then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("Activity created successfully!", { variant: "success" });
                navigate("/admin/activities");
            } else {
                enqueueSnackbar("Activity creation failed!.", { variant: "error" });
            }
        })
        .catch((err) => {
            enqueueSnackbar("Activity creation failed! " + err.response.data.error, { variant: "error" });
        })
        .finally(() => {
            setLoading(false);
            handleDialogClose();
        });
    };

    return (
        <Box sx={{ marginY: "1rem" }}>
            <Card>
                <CardContent>
                    <Box component="form" mt={3}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateCalendarServerRequest
                                activityId={activityId}
                                availabilities={availabilities}
                                setDialogOpen={setDialogOpen}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Dialog open={dialogOpen} onClose={handleDialogClose}>
                        <DialogTitle>Add Availability</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Max Pax"
                                variant="outlined"
                                fullWidth
                                value={maxPax}
                                onChange={(e) => setMaxPax(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="Price"
                                variant="outlined"
                                fullWidth
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                margin="normal"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose}>Cancel</Button>
                            <Button onClick={handleSaveAvailability} disabled={loading}>
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </CardContent>
            </Card>
        </Box>
    );
}

export default CreateAvailability;
