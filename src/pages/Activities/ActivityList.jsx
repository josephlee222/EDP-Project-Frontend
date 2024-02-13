import React, { useEffect, useState, useContext, useRef } from 'react'
import {
    Button, Container, Divider, Typography, Grid, Box, Card,
    Tabs, TextField, Skeleton, CardContent, CardMedia, Tab, MenuItem
    , IconButton
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { DataGrid, GridActionsCellItem, GridToolbarExport } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
//import { CategoryContext } from '../UserRoutes';
import CardTitle from '../../components/CardTitle';
import PageHeader from '../../components/PageHeader';
import BackpackRounded from '@mui/icons-material/BackpackRounded';
import titleHelper from '../../functions/helpers';
//import { CategoryContext } from '../UserRoutes';
import { HomeRounded, SearchRounded } from '@mui/icons-material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import moment from 'moment';


function getChipProps(params) {
    return {
        label: params.value,
    };
}

function ActivityList() {
    const [Activities, setActivities] = useState([])
    const [categories, setCategories] = useState([])
    const url = import.meta.env.VITE_API_URL
    const [loading, setLoading] = useState(true)
    const [deactivateLoading, setDeactivateLoading] = useState(null)
    const [deactivateActivityDialog, setDeactivateActivityDialog] = useState(false)
    const [deactivateActivity, setDeactivateActivity] = useState(null)
    const [value, setValue] = React.useState(0);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [maxAgeLimit, setMaxAgeLimit] = useState(0);
    const [sortingCriteria, setSortingCriteria] = useState('name'); // Default sorting by name
    const [sortingDirection, setSortingDirection] = useState('asc'); // Default sorting in ascending order


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    const toggleSortingDirection = () => {
        setSortingDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        filteredActivities(Activities, category, searchQuery);
    };

    // Function to handle changes in sorting criteria
    const handleSortingCriteriaChange = (event) => {
        setSortingCriteria(event.target.value);
    };

    // Function to handle changes in sorting direction
    const handleSortingDirectionChange = (event) => {
        setSortingDirection(event.target.value);
    };

    const sortActivities = (activities) => {
        return activities.slice().sort((a, b) => {
            let comparison = 0;
            if (a[sortingCriteria] > b[sortingCriteria]) {
                comparison = 1;
            } else if (a[sortingCriteria] < b[sortingCriteria]) {
                comparison = -1;
            }
            return sortingDirection === 'asc' ? comparison : -comparison;
        });
    };

    // Function to filter and sort activities
    const filterAndSortActivities = (activities) => {
        let filtered = activities.filter(activity => (
            (selectedCategory === 'All' || activity.category === selectedCategory) &&
            (maxAgeLimit === 0 || activity.ageLimit <= maxAgeLimit) &&
            (activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                activity.description.toLowerCase().includes(searchQuery.toLowerCase()))
        ));
        return sortActivities(filtered);
    };



    const categoriesRef = useRef(null);
    const navigate = useNavigate()
    titleHelper("View Activities")
    //const { setActivePage } = useContext(CategoryContext);
    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'expiryDate', headerName: 'Expiry Date', flex: 1, minWidth: 250 },
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'category', headerName: 'Category', width: 200 },
        { field: 'pictures', headerName: 'pictures', width: 200 },
        /*{ field: 'ntucExclusive', headerName: 'NtucExclusive', width: 200 },
        { field: 'ageLimit', headerName: 'AgeLimit', width: 200 },
        { field: 'location', headerName: 'Location', width: 200 },
        { field: 'company', headerName: 'Company', width: 200 },
        { field: 'discountType', headerName: 'DiscountType', width: 200 },
        { field: 'discountAmount', headerName: 'DiscountAmount', width: 200 }*/
        ,
        {
            field: 'actions', type: 'actions', width: 120, getActions: (params) => [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit Activity"
                    onClick={() => {
                        navigate("/admin/Activities/" + params.row.id)
                    }}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete Activity"
                    onClick={() => {
                    }}
                    showInMenu
                />,
            ]
        },
    ];


    const handleGetActivities = () => {
        http.get("/Activity/").then((res) => {
            if (res.status === 200) {
                setActivities(res.data)
                console.log(res.data);
                setLoading(false)
                setFilteredActivities(res.data);
            }
        })
    }

    const handleGetCategories = () => {
        http.get("/Category/").then((res) => {
            if (res.status === 200) {
                setCategories(res.data)
                console.log(res.data);
                setLoading(false)
            }
        })
    }

    // Function to handle changes in maximum age limit
    const handleMaxAgeLimitChange = (maxAge) => {
        setMaxAgeLimit(maxAge);
    };


    const customToolbar = () => {
        return (
            <GridToolbarExport />
        );
    }

    const scrollCategories = (direction) => {
        const container = categoriesRef.current;
        if (container) {
            const containerWidth = container.offsetWidth;
            const scrollAmount = direction > 0 ? containerWidth : -containerWidth;
            container.scrollLeft += scrollAmount;
        }
    };


    const CustomCard = ({ id, name, expiryDate, description, pictures }) => (
        <Link to={`/activityList/${id}`} style={{ textDecoration: 'none' }}>
            <Card>
                <CardMedia sx={{ height: 140 }} image={pictures ? url + '/uploads/' + pictures.items[0] : "/unknown.png"} />
                <CardContent>
                    <Typography variant="h6" fontWeight={700}>{name}</Typography>
                    <Typography>{description}</Typography>
                    <Typography>Expiry Date: {moment(expiryDate).format("DD/MM/YYYY")}</Typography>
                </CardContent>
            </Card>
        </Link>
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
        document.title = "UPlay Admin - View Activities"
        //setActivePage(1)
        handleGetActivities()
        handleGetCategories()
    }, [])
    return (
        <>
            <PageHeader title="Activities" icon={BackpackRounded} background="/kayak.jpg" />




            <Container sx={{ mt: "1rem" }} maxWidth="xl">
                <Card sx={{ mb: "1rem" }}>
                    <CardContent>
                        <Grid container spacing={2}>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Search Activities"
                                    variant="outlined"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    fullWidth
                                    InputProps={{
                                        endAdornment: <SearchRounded />,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Maximum Age Limit"
                                    type="number"
                                    variant="outlined"
                                    value={maxAgeLimit}
                                    onChange={(e) => handleMaxAgeLimitChange(parseInt(e.target.value))}
                                    InputProps={{
                                        endAdornment: <AccessibilityNewIcon />,
                                    }}
                                    fullWidth
                                />


                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    select
                                    label="Sorting Criteria"
                                    value={sortingCriteria}
                                    onChange={handleSortingCriteriaChange}
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <>
                                                <IconButton onClick={toggleSortingDirection}>
                                                    {sortingDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </IconButton>
                                            </>
                                        ),
                                    }}
                                >
                                    <MenuItem value="name">Name</MenuItem>
                                    <MenuItem value="expiryDate">Expiry Date</MenuItem>
                                    <MenuItem value="dateAdded">Date Added</MenuItem> {/* Add "Date Added" option */}
                                    {/* Add more sorting criteria options here */}
                                </TextField>
                            </Grid>


                            <Grid item xs={10} md={12} sx={{ overflowX: 'auto', display: 'flex', alignItems: 'center' }}>
                                <Tabs value={selectedCategory} onChange={(event, newValue) => setSelectedCategory(newValue)} variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs example">
                                    <Tab label="All" value="All" />
                                    {categories.map((category, index) => (
                                        <Tab key={index} label={category.name} value={category.name} />
                                    ))}
                                </Tabs>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Grid container spacing={2} mb={"1rem"}>
                    {loading ? (
                        // Display skeleton cards while loading
                        [...Array(6)].map((_, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4}>
                                <CustomSkeletonCard />
                            </Grid>
                        ))
                    ) : (
                        // Display filtered and sorted activities
                        filterAndSortActivities(Activities).map((card) => (
                            <Grid item key={card.id} xs={12} sm={6} md={4}>
                                <CustomCard {...card} />
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>
        </>
    )
}

export default ActivityList