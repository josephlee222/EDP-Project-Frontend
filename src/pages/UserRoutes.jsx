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
import ReviewDetails from './Activities/ReviewDetails';
import { AppContext } from '../App'
import CreateBooking from './Activities/Booking'
import EditBooking from './Activities/EditBooking'
import CreateReview from './Activities/Review'
import Faq from './Faq'

import CartRoutes from './Cart/CartRoutes'


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

            <Route path="/activityList" element={<ActivityList />} />
            <Route path="/activityList/:id" element={<ActivityDetails />} />
            <Route path="/booking/:id" element={<CreateBooking />}/>
            <Route path="/editBooking/:id" element={<EditBooking />}/>
            <Route path="/review/:id" element={<CreateReview />}/>
            <Route path="/reviewDetails/:id" element={<ReviewDetails />}/>
            <Route path="/login" element={!user ? <Login /> : <Navigate to={"/"} />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to={"/"} />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/test" element={<Test />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/profile/*" element={<ProfileRoutes />} />
            <Route path="/cart/*" element={<CartRoutes />} />
        </Routes>
    )
}

export default UserRoutes