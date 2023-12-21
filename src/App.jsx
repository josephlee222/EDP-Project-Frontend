// Navbar and footer should be added here

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserRoutes from './pages/Home';


function App() {
    return (
        <>
            <Routes>
                <Route path='*' element={<UserRoutes />} />
            </Routes>
        </>
        
    );
}

export default App;