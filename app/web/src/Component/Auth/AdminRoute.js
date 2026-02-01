
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';


const AdminRoute = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    // In a real app with async auth check, you might want a loading state here
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user?.role !== 'ADMIN') {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default AdminRoute;
