import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        return new Promise((resolve) => {
            setTimeout(async () => {
                let role = 'USER';

                if (email.toLowerCase().includes('admin') || email === 'admin@gmail.com') {
                    role = 'ADMIN';
                }

                const mockUser = {
                    id: role === 'ADMIN' ? 'admin-01' : 'user-01',
                    email: email,
                    name: role === 'ADMIN' ? 'Admin Bkeuty' : 'Thanh Phong',
                    role: role,
                    token: 'mock-jwt-token-123456',
                    avatar: null,
                    level: "Member Gold",
                    points: 1250,
                };

                setUser(mockUser);
                await AsyncStorage.setItem('user', JSON.stringify(mockUser));
                await AsyncStorage.setItem('token', mockUser.token);
                resolve(mockUser);
            }, 800);
        });
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('token');
    };

    const value = {
        user,
        isAuthenticated: !!user,
        role: user?.role,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
