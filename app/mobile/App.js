import React, { useEffect, useRef } from 'react';
import { registerRootComponent } from 'expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/Navigation/AppNavigator';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { AuthProvider } from './src/Context/AuthContext';
import { CartProvider } from './src/Context/CartContext';
import { ToastProvider } from './src/Context/ToastContext';
import { registerForPushNotificationsAsync } from './src/utils/NotificationService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const App = () => {
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync();

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <LanguageProvider>
                    <AuthProvider>
                        <CartProvider>
                            <ToastProvider>
                                <AppNavigator />
                            </ToastProvider>
                        </CartProvider>
                    </AuthProvider>
                </LanguageProvider>
            </GestureHandlerRootView>
        </QueryClientProvider>
    );
};

registerRootComponent(App);
