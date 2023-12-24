import { useContext, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import NotFound from './errors/NotFound'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import { AppContext } from '../App'


function UserRoutes() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    //const { setIsAdminPage } = useContext(UserContext);
    //const { user } = useContext(UserContext);

    // useEffect(() => {
    //     setIsAdminPage(false)
    // }, [])

    const { user } = useContext(AppContext);
    return (
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to={"/"} />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to={"/"} />} />
        </Routes>
    )
}

export default UserRoutes