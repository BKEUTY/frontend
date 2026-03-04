
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'admin@bkeuty.com' && password === 'admin123') {
                    const mockUser = {
                        id: 'admin-001',
                        email: 'admin@bkeuty.com',
                        name: 'Admin Bkeuty',
                        role: 'ADMIN',
                        token: 'mock-jwt-token-admin'
                    };
                    setUser(mockUser);
                    localStorage.setItem('user', JSON.stringify(mockUser));
                    localStorage.setItem('token', mockUser.token);
                    resolve(mockUser);
                } else if (email === 'user@gmail.com' && password === 'user123') {
                    const mockUser = {
                        id: 'user-001',
                        email: 'user@gmail.com',
                        name: 'Nguyễn Văn Khách',
                        role: 'USER',
                        token: 'mock-jwt-token-user'
                    };
                    setUser(mockUser);
                    localStorage.setItem('user', JSON.stringify(mockUser));
                    localStorage.setItem('token', mockUser.token);
                    resolve(mockUser);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const value = {
        user,
        isAuthenticated: !!user,
        role: user?.role,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
