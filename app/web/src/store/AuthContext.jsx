import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authApi from '../features/auth/services/authService';
import userApi from '../features/account/services/userService';
import { 
    setAccessToken, 
    clearAccessToken, 
    getAccessToken,
    setUserSession,
    getUserSession,
    clearUserSession
} from '../services/tokenStorage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const decodeToken = (token) => {
    if (!token || typeof token !== 'string' || !token.includes('.')) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const extractUserFromToken = (accessToken) => {
    const decodedPayload = decodeToken(accessToken);
    if (!decodedPayload) throw new Error("Invalid token payload");

    if (decodedPayload.user_role !== 'user') {
        throw new Error('Access Denied: You do not have User privileges.');
    }

    return {
        id: decodedPayload.sub,
        email: decodedPayload.email,
        name: decodedPayload.name,
        user_role: decodedPayload.user_role,
        membershipLevel: 0
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => getUserSession());
    const [isInitializing, setIsInitializing] = useState(true);

    const handleSessionCleanup = useCallback(() => {
        clearAccessToken();
        clearUserSession();
        setUser(null);
    }, []);

    const fetchMembershipLevel = useCallback(async () => {
        try {
            const response = await userApi.getProfile();
            const profile = response.data;
            if (profile && profile.membershipLevel !== undefined) {
                setUser(prev => {
                    if (!prev) return prev;
                    const updated = { ...prev, membershipLevel: profile.membershipLevel };
                    setUserSession(updated);
                    return updated;
                });
            }
        } catch (e) {
            // Non-critical: profile fetch failure doesn't block auth
        }
    }, []);

    useEffect(() => {
        const initAuth = () => {
            const token = getAccessToken();
            const session = getUserSession();

            if (!token || !session) {
                handleSessionCleanup();
            } else {
                setUser(session);
                fetchMembershipLevel();
            }
            setIsInitializing(false);
        };
        initAuth();
    }, [handleSessionCleanup, fetchMembershipLevel]);

    const login = async (username, password) => {
        const response = await authApi.login({ username, password });
        const accessToken = response.data.accessToken;
        
        if (!accessToken) throw new Error('Login failed: No access token');

        const newUser = extractUserFromToken(accessToken);

        setAccessToken(accessToken);
        setUserSession(newUser);
        setUser(newUser);

        // Fetch accurate membershipLevel from profile API
        try {
            const profileRes = await userApi.getProfile();
            if (profileRes.data?.membershipLevel !== undefined) {
                const updatedUser = { ...newUser, membershipLevel: profileRes.data.membershipLevel };
                setUserSession(updatedUser);
                setUser(updatedUser);
            }
        } catch (e) {
            // Non-critical
        }
        
        return newUser;
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error(error);
        } finally {
            handleSessionCleanup();
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user && !!getAccessToken(),
            user_role: user?.user_role,
            isInitializing,
            login,
            logout,
            refreshMembership: fetchMembershipLevel
        }}>
            {!isInitializing && children}
        </AuthContext.Provider>
    );
};
