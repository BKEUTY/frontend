import React from 'react';
import { registerRootComponent } from 'expo';
import AppNavigator from './src/Navigation/AppNavigator';
import { LanguageProvider } from './src/i18n/LanguageContext';

const App = () => {
    return (
        <LanguageProvider>
            <AppNavigator />
        </LanguageProvider>
    );
};

// Use the Navigator as the root component
registerRootComponent(App);
