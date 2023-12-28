import { useContext, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import NotFound from '../errors/NotFound'
import Test from '../Test'
import { AppContext } from '../../App'
import { useSnackbar } from 'notistack'
import { validateAdmin } from '../../functions/user'


export default function AdminRoutes() {
    //Routes for admin pages. To add authenication so that only admins can access these pages, add a check for the user's role in the UserContext
    const { setAdminPage, user } = useContext(AppContext); 
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        setAdminPage(true)
        if (!validateAdmin()) {
            enqueueSnackbar("You must be an admin to view this page", { variant: "error" });
            navigate("/")
        }
    }, [])

    return (
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/test" element={<Test />} />
            
        </Routes>
    )
}

