// Navbar and footer should be added here

import React, { useState, createContext} from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import UserRoutes from './pages/UserRoutes';
import Navbar from './components/Navbar';

export const AppContext = createContext(null);
function App() {
    const location = useLocation();
    const [user, setUser] = useState(null);
    return (
        <>
            <AppContext.Provider value={{
                user, setUser
            }}>
                <Navbar />
                <Routes location={location}>
                    <Route path='*' element={<UserRoutes />} />
                </Routes>
            </AppContext.Provider>
        </>
        
    );
}

export default App;