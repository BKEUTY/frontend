import React, { useEffect, useRef } from 'react';
import { registerRootComponent } from 'expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/Navigation/AppNavigator';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { registerForPushNotificationsAsync } from './src/utils/NotificationService';

const App = () => {
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync();

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log("Notification Received:", notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("Notification Response:", response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <LanguageProvider>
                <AppNavigator />
            </LanguageProvider>
        </GestureHandlerRootView>
    );
};

// Use the Navigator as the root component
registerRootComponent(App);
