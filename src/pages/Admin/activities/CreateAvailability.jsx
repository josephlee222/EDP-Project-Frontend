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
    const [availability, setAvailability] = useState([]);
    const [activity, setActivity] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [maxPax, setMaxPax] = useState('');
    const [price, setPrice] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);



    titleHelper("Set availability")

    const handleGetAvailabilities = () => {
        http.get("/Availabilities/").then((res) => {
            if (res.status === 200) {
                setAvailability(res.data)
                setLoading(false)
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




    const CustomDateCalendar = React.forwardRef((props, ref) => {
        const { children, ...other } = props;

        return (
            <DateCalendar
                {...other}
                ref={ref}
                renderDay={(date, _, DayProps) => {
                    const availability = availability.find(availability => availability.Date === date.toISOString());
                    const isAvailable = availability !== undefined;

                    return (
                        <div {...DayProps}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    color: isAvailable ? 'red' : 'inherit',
                                }}
                            >
                                {children}
                                {isAvailable && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                            textAlign: 'center',
                                            fontSize: '0.8rem',
                                            padding: '2px',
                                        }}
                                    >
                                        MaxPax: {availability.MaxPax}, Price: {availability.Price}
                                    </Box>
                                )}
                            </Box>
                        </div>
                    );
                }}
            />
        );
    });

    return (
        <Box sx={{ marginY: "1rem" }}>
            <Card>
                <CardContent>
                    <Box component="form" mt={3}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DateCalendar
                                onChange={handleDateSelection}
                                renderDay={(date, _, DayProps) => {
                                    const availability = availability.find(availability => availability.Date === date.toISOString());
                                    const isAvailable = availability !== undefined;

                                    return (
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                color: isAvailable ? 'red' : 'inherit',
                                            }}
                                            {...DayProps}
                                        >
                                            {date.getDate()}
                                            {isAvailable && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                                        textAlign: 'center',
                                                        fontSize: '0.8rem',
                                                        padding: '2px',
                                                    }}
                                                >
                                                    MaxPax: {availability.MaxPax}, Price: {availability.Price}
                                                </Box>
                                            )}
                                        </Box>
                                    );
                                }}
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
