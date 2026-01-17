import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

import HomeScreen from '../Home/HomeScreen';
import ProductScreen from '../Product/ProductScreen';
import CartScreen from '../Cart/CartScreen';
import AccountScreen from '../Account/AccountScreen';
import { COLORS } from '../constants/Theme';
import { useLanguage } from '../i18n/LanguageContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
    const { t } = useLanguage();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.mainTitle,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: { paddingBottom: 5, height: 60 },
                tabBarIcon: ({ focused, color, size }) => {
                    // Simple placeholder icons or text since we haven't set up full vector icons yet
                    let iconName;
                    if (route.name === 'Home') iconName = '🏠';
                    else if (route.name === 'Product') iconName = '🛍️';
                    else if (route.name === 'Cart') iconName = '🛒';
                    else if (route.name === 'Account') iconName = '👤';

                    return <Text style={{ fontSize: 24 }}>{iconName}</Text>;
                },
                tabBarLabelStyle: { fontSize: 12, paddingBottom: 5 }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('home') }} />
            <Tab.Screen name="Product" component={ProductScreen} options={{ title: t('product') }} />
            <Tab.Screen name="Cart" component={CartScreen} options={{ title: t('cart') }} />
            <Tab.Screen name="Account" component={AccountScreen} options={{ title: t('account') }} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={TabNavigator} />
                {/* Add Detail screens here later, e.g. ProductDetail, Checkout */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
