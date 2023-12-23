import { useContext, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
//import NotFound from './errors/NotFound'
import Home from './Home'
import Login from './Login'
//import { UserContext } from '..'


function UserRoutes() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    //const { setIsAdminPage } = useContext(UserContext);
    //const { user } = useContext(UserContext);

    // useEffect(() => {
    //     setIsAdminPage(false)
    // }, [])
    return (
        <Routes>
            <Route path='*' element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    )
}

export default UserRoutes