import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const login = (token) => {
        sessionStorage.setItem('authToken', token);
    };

    const logout = () => {
        sessionStorage.removeItem('authToken');
        setUser(null);
    };

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            setUser(jwtDecode(token));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
