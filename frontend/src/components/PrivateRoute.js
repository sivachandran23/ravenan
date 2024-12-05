import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const token = sessionStorage.getItem('authToken');
    
    if (!token) {
        return <Navigate to="/" />;
    }

    return element;
};

export default PrivateRoute;
