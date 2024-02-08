import { useContext, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import NotFound from './errors/NotFound'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import Verify from './Verify'
import Reset from './Reset'
import Test from './Test'
import ProfileRoutes from './Profile/ProfileRoutes'

import ActivityList from './Activities/ActivityList'
import ActivityDetails from './Activities/ActivityDetails';

import GroupList from './Groups/GroupList'

import { AppContext } from '../App'


function UserRoutes() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    const { setAdminPage, user } = useContext(AppContext);

    useEffect(() => {
        setAdminPage(false)
    }, [])

    return (
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />

            <Route path="/groupList" element={<GroupList />} />

            <Route path="/activityList" element={<ActivityList />} />
            <Route path="/activityList/:id" element={<ActivityDetails />} />

            <Route path="/login" element={!user ? <Login /> : <Navigate to={"/"} />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to={"/"} />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/test" element={<Test />} />
            <Route path="/profile/*" element={<ProfileRoutes />} />
        </Routes>
    )
}

export default UserRoutes