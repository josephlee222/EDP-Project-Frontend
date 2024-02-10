import { useContext, useEffect } from 'react'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import NotFound from '../errors/NotFound'
import ViewCart from './ViewCart'
import Checkout from './Checkout'
import CheckoutSuccess from './CheckoutSuccess'
import { validateUser } from "../../functions/user";


function CartRoutes() {
    // Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    const navigate = useNavigate();

    useEffect(() => {
        if (!validateUser()) {
            enqueueSnackbar("You must be logged in to view this page", { variant: "error" });
            navigate("/login");
        }
    }, [])

    return (
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<ViewCart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/Success" element={<CheckoutSuccess />} />
        </Routes>
    )
}

export default CartRoutes