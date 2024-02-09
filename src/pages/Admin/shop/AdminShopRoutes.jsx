import { useContext, useEffect, createContext, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import NotFound from '../../errors/NotFound'
import Test from '../../Test'
import { AppContext } from '../../../App'
import { useSnackbar } from 'notistack'
import { Card, CardContent, Container, Grid, ListItemIcon, ListItemButton, ListItem, ListItemText, Box, Button } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAddRounded';
import { BarChartRounded, CellTowerRounded, GroupRounded, List, ViewCarouselRounded } from '@mui/icons-material'
import SaleOverview from './SaleOverview'
import HomepageBanners from './HomepageBanners'


export const CategoryContext = createContext(null);
export default function AdminShopRoutes() {
    const [activePage, setActivePage] = useState(null);

    return (
        <>
            <CategoryContext.Provider value={{activePage, setActivePage}}>
                <Card sx={{ mt: "1rem" }}>
                    <CardContent>
                        <Box sx={{ alignItems: "center", overflowX: "auto", whiteSpace: "nowrap" }}>
                            <Button variant={activePage == 1 ? "contained" : "secondary"} startIcon={<BarChartRounded/>} sx={{mr: ".5rem"}} LinkComponent={Link} to="/admin/shop">Sales Overview</Button>
                            <Button variant={activePage == 2 ? "contained" : "secondary"} startIcon={<ViewCarouselRounded/>} sx={{mr: ".5rem"}} LinkComponent={Link} to="/admin/shop/banners">Homepage Banners</Button>
                        </Box>
                    </CardContent>
                </Card>
                <Routes>
                    <Route path="/" element={<SaleOverview />} />
                    <Route path="/banners" element={<HomepageBanners />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </CategoryContext.Provider>
        </>
        
    )
}