import React, { useState, useEffect, useContext } from 'react'
import { Container, Card, CardContent, Box, Checkbox, TextField, Grid, FormControlLabel, IconButton, Typography, RadioGroup, Radio, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddIcon from '@mui/icons-material/Add';
import CardTitle from "../../../components/CardTitle";
import http from '../../../http'
import { useSnackbar } from 'notistack'
import { useParams, Form, useNavigate } from 'react-router-dom'
import * as Yup from "yup";
import { useFormik } from 'formik';
import { AddRounded, PersonAddRounded } from '@mui/icons-material';
import { CategoryContext } from './AdminActivitiesRoutes';
import titleHelper from '../../../functions/helpers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';


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



    titleHelper("Set availabilities")

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
        setLoading(true);
        http.get(`/Activity/${activityId}`).then((res) => {
          if (res.status === 200) {
            setActivity(res.data);
            setLoading(false);
          }
        });
      };

    useEffect(() => {
        handleGetAvailabilities();
        handleGetActivity();
        setActivePage(2);
    }, [])

    const handleDateSelection = (date) => {
        console.log("dialog opening");
        setSelectedDate(date);
        setDialogOpen(true);
        
    };

    const handleDialogClose = () => {
        setMaxPax('');
        setPrice('');
        setDialogOpen(false);
    };

    const handleSaveAvailability = () => {
        
        http.post("/Admin/Availability", {
            "ActivityId" : activityId,
            "Date" : selectedDate,
            "MaxPax" : maxPax,
            "Price" : price

        }).then((res) => {
            if (res.status === 200) {
                enqueueSnackbar("Activity created successfully!", { variant: "success" });
                navigate("/admin/activities")
            } else {
                enqueueSnackbar("Activity creation failed!.", { variant: "error" });
                setLoading(false);
            }
        }).catch((err) => {
            enqueueSnackbar("Activity creation failed! " + err.response.data.error, { variant: "error" });
            setLoading(false);
        })

        handleDialogClose();
    };


    const CustomDateCell = ({ date }) => {
        const formattedDate = date.toISOString().split('T')[0]; // Extract date part only
        const availability = availabilities.find(availability => availability.date.split('T')[0] === formattedDate);
        return (
            <div style={{ position: 'relative', height: '100%' }}>
                <div>{date.getDate()}</div>
                {availability && (
                    <div style={{ position: 'absolute', top: 0, left: 0, background: 'white', padding: '2px' }}>
                        <div>Max Pax: {availability.maxPax}</div>
                        <div>Price: {availability.price}</div>
                    </div>
                )}
            </div>
        );
    };


    return (
        <Box sx={{ marginY: "1rem" }}>
            <Card>
                <CardContent>
                    <Box component="form" mt={3}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateCalendar
                            renderDay={CustomDateCell}
                            onChange={handleDateSelection}
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
                            <Button onClick={handleSaveAvailability}>Save</Button>
                        </DialogActions>
                    </Dialog>
                </CardContent>
            </Card>
        </Box>
    );
}

export default CreateAvailability;
