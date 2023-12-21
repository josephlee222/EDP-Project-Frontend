import { useContext, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import NotFound from './errors/NotFound'
import App from './Test'
import Home from './Home'
import { UserContext } from '..'


function UserRoutes() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    //const { setIsAdminPage } = useContext(UserContext);
    //const { user } = useContext(UserContext);

    // useEffect(() => {
    //     setIsAdminPage(false)
    // }, [])
    return (
        <Routes>
            <Route path='*' element={<NotFound />} />
            <Route path="/" element={<Home />} />
        </Routes>
    )
}

export default UserRoutes