// Navbar and footer should be added here

import React, { useState, createContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import UserRoutes from './pages/UserRoutes';
import AdminRoutes from './pages/Admin/AdminRoutes';
import Navbar from './components/Navbar';
import http from './http';

export const AppContext = createContext(null);
function App() {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [adminPage, setAdminPage] = useState(false);

    useEffect(() => {
        try {
            // Request to the server to check if the token is valid
            setUserLoading(true)
            http.get("User/Refresh").then((res) => {
                // If the token is valid, set the user context to the decoded token
                setUser(res.data.user)
                // Set the token in local storage
                localStorage.setItem("token", res.data.token)
                // Set the loading state to false
                setUserLoading(false)
            }).catch((err) => {
                // If the token is invalid, set the user context to null
                setUser(null)
                setUserLoading(false)
            })
            console.log("User set")
        } catch {
            setUser(null)
            setUserLoading(false)
        }
    }, [])


    return (
        <>
            <AppContext.Provider value={{
                user, setUser, userLoading, setUserLoading, adminPage, setAdminPage
            }}>
                <Navbar />
                <Routes location={location}>
                    <Route path='*' element={<UserRoutes />} />
                    <Route path='/admin/*' element={<AdminRoutes />} />
                </Routes>
            </AppContext.Provider>
        </>

    );
}

export default App;