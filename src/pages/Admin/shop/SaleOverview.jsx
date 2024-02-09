import React, { useEffect, useState, useContext } from 'react'
import { Chip, Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, Box, Card, CardContent } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { CategoryContext } from './AdminShopRoutes';
import CardTitle from '../../../components/CardTitle';
import { BarChartRounded, Person } from '@mui/icons-material';
import titleHelper from '../../../functions/helpers';

function getChipProps(params) {
    return {
        label: params.value,
    };
}

function HomepageBanners() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { setActivePage } = useContext(CategoryContext);
    titleHelper("Sale Overview")

    useEffect(() => {
        setActivePage(1)
    }, [])
    return (
        <>
            <Box sx={{ marginY: "1rem" }}>
                <Card>
                    <CardContent>
                        <CardTitle title="Sales Overview" icon={<BarChartRounded />} />
                        
                    </CardContent>
                </Card>

            </Box>

        </>
    )
}

export default HomepageBanners