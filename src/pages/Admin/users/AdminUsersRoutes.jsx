import { useContext, useEffect, createContext, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import NotFound from '../../errors/NotFound'
import Test from '../../Test'
import { AppContext } from '../../../App'
import { useSnackbar } from 'notistack'
import { Card, CardContent, Container, Grid, ListItemIcon, ListItemButton, ListItem, ListItemText, Box, Button } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAddRounded';
import GroupIcon from '@mui/icons-material/GroupRounded';
import BackpackIcon from '@mui/icons-material/BackpackRounded';
import StorefrontIcon from '@mui/icons-material/StorefrontRounded';
import { List } from '@mui/icons-material'
import ViewUsers from './ViewUsers'
import CreateUser from './CreateUser'

export const CategoryContext = createContext(null);
export default function AdminUsersRoutes() {
    const [activePage, setActivePage] = useState(null);

    return (
        <>
            <CategoryContext.Provider value={{activePage, setActivePage}}>
                <Card sx={{ mt: "1rem" }}>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Button variant={activePage == 1 ? "contained" : "secondary"} startIcon={<List/>} sx={{mr: ".5rem"}} LinkComponent={Link} to="/admin/users">User List</Button>
                            <Button variant={activePage == 2 ? "contained" : "secondary"} startIcon={<PersonAddIcon/>} LinkComponent={Link} to="/admin/users/create">Create User</Button>
                        </Box>
                    </CardContent>
                </Card>
                <Routes>
                    <Route path="/" element={<ViewUsers />} />
                    <Route path="/create" element={<CreateUser />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </CategoryContext.Provider>
        </>
        
    )
}