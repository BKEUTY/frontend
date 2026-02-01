
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Initialize user from localStorage if present
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = async (email, password) => {
        // Mock Login Logic
        return new Promise((resolve) => {
            setTimeout(() => {
                let role = 'USER';
                // Mock Admin if email contains 'admin' or is specific admin email
                if (email.toLowerCase().includes('admin') || email === 'admin@gmail.com') {
                    role = 'ADMIN';
                }

                const mockUser = {
                    id: role === 'ADMIN' ? 'admin-01' : 'user-01',
                    email: email,
                    name: role === 'ADMIN' ? 'Admin Bkeuty' : 'Khách tánh',
                    role: role,
                    token: 'mock-jwt-token-123456'
                };

                setUser(mockUser);
                localStorage.setItem('user', JSON.stringify(mockUser));
                localStorage.setItem('token', mockUser.token); // Important for API interceptors
                resolve(mockUser);
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
