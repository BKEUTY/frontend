import React, { createContext, useContext, useCallback } from 'react';
import { notification } from 'antd';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    // We can configure global notification settings here if needed
    // notification.config({ ... });

    const showNotification = useCallback((message, type = 'success', description = '') => {
        // Types: success,info,warning,error
        notification[type]({
            message: message,
            description: description,
            placement: 'topRight',
            duration: 3,
            // icon: <Icon /> // Antd automatically provides icons based on type
        });
    }, []);

    return (
        <NotificationContext.Provider value={showNotification}>
            {children}
        </NotificationContext.Provider>
    );
};
