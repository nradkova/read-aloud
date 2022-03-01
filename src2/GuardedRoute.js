import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import AuthContext from './context/authContext';

export const AuthRoute = () => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? <Outlet /> : <Navigate to="/home" />
}

export const UserRoute = () => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? <Navigate to="/home" /> : <Outlet />
}
