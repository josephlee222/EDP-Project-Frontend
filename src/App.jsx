// Navbar and footer should be added here

import React, { useState, createContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import UserRoutes from './pages/UserRoutes';
import AdminRoutes from './pages/Admin/AdminRoutes';
import Navbar from './components/Navbar';
import http from './http';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useSnackbar } from 'notistack';
import { Home } from '@mui/icons-material';

export const AppContext = createContext(null);
function App() {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [currentNotification, setCurrentNotification] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [adminPage, setAdminPage] = useState(false);
    const [connection, setConnection] = useState(null);
    const [title, setTitle] = useState(document.title);
    const [icon, setIcon] = useState(() => Home);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        try {
            // Request to the server to check if the token is valid
            setUserLoading(true)
            http.get("User/Refresh").then((res) => {
                // If the token is valid, set the user context to the decoded token
                setUser(res.data.user)
                setNotifications(res.data.user.notifications)
                // Set the token in local storage
                localStorage.setItem("token", res.data.token)

                // Create a new connection to the actions hub
                const connect = new HubConnectionBuilder()
                    .withUrl(import.meta.env.VITE_API_URL + "/hubs/actions")
                    .withAutomaticReconnect()
                    .build();

                setConnection(connect);

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

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    connection.invoke("Register", user.id)

                    connection.on("ReceiveMessage", (message) => {
                        console.log(message);
                    });

                    connection.on("refresh", () => {
                        http.get("User").then((res) => {
                            setUser(res.data)
                            setNotifications(res.data.notifications)
                            console.log("User refreshed")
                            //enqueueSnackbar("[Debug] Refreshed.", { variant: "success" })
                        }).catch((err) => {
                            setUser(null)
                        })
                    });

                    connection.on("notification", (n) => {
                        setNotifications(o => [n, ...o])
                        setCurrentNotification(n)
                    });

                    connection.onreconnected(() => {
                        connection.invoke("Register", user.id)
                    });
                })
                .catch((error) => console.log(error));
        }
    }, [connection]);

    return (
        <>
            <AppContext.Provider value={{
                user,
                setUser, 
                userLoading, 
                setUserLoading, 
                adminPage, 
                setAdminPage, 
                connection, 
                setConnection, 
                notifications, 
                setNotifications,
                title,
                setTitle,
                icon,
                setIcon,
                currentNotification,
                setCurrentNotification,
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