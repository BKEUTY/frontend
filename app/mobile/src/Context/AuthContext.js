import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authApi from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const decodeToken = (token) => {
    try {
        const parts = token.split('.');
        if (parts.length < 2) return {};
        const payload = parts[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        
        // Basic base64 decode for mobile environment
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let output = '';
        let str = base64.replace(/=+$/, '');
        for (
            let bc = 0, bs, buffer, idx = 0;
            (buffer = str.charAt(idx++));
            ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
                ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
                : 0
        ) {
            buffer = chars.indexOf(buffer);
        }
        
        return JSON.parse(decodeURIComponent(escape(output)));
    } catch (e) {
        console.error('Token decode error:', e);
        return {};
    }
};

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
        try {
            const data = {
                username: email,
                password: password
            };
            const response = await authApi.login(data);
            const { accessToken } = response.data;
            
            const userData = decodeToken(accessToken);
            const role = userData.realm_access?.roles?.includes('ADMIN') ? 'ADMIN' : 'USER';
            
            const user = {
                id: userData.sub || email,
                email: userData.email || email,
                name: userData.name || userData.preferred_username || email.split('@')[0],
                role: role,
                token: accessToken,
                avatar: null,
                membership_level: role === 'ADMIN' ? 'ADMIN' : 'Diamond',
                points: 1250,
                total_spent: 85000000,
                target_spent: 100000000,
                next_level: "VIP"
            };
            
            setUser(user);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            await AsyncStorage.setItem('token', accessToken);
            
            return user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            setUser(null);
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('refreshToken');
        }
    };

    const register = async (data) => {
        try {
            await authApi.register(data);
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        role: user?.role,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
