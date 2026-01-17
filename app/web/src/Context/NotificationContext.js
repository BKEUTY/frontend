import React, { createContext, useContext, useState, useCallback } from 'react';
import './../Component/Notification/Notification.css';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);
    const [type, setType] = useState('success');
    const [isFading, setIsFading] = useState(false);

    const showNotification = useCallback((message, notiType = 'success') => {
        setNotification(message);
        setType(notiType);
        setIsFading(false);

        // Auto dismiss after 3 seconds
        setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
                setNotification(null);
                setIsFading(false);
            }, 500); // Wait for fade out animation
        }, 3000);
    }, []);

    return (
        <NotificationContext.Provider value={showNotification}>
            {children}
            {notification && (
                <div className={`notification-popup ${type} ${isFading ? 'fade-out' : ''}`}>
                    {notification}
                </div>
            )}
        </NotificationContext.Provider>
    );
};
