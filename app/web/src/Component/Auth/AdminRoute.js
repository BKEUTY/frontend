import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, role } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role !== 'ADMIN') {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default AdminRoute;
