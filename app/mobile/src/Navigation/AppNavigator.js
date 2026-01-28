import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

import HomeScreen from '../Home/HomeScreen';
import ProductScreen from '../Product/ProductScreen';
import CartScreen from '../Cart/CartScreen';
import CheckoutScreen from '../Cart/CheckoutScreen';
import AccountScreen from '../Account/AccountScreen';
import ProfileScreen from '../Account/ProfileScreen';
import RetailSystemScreen from '../StaticPages/RetailSystemScreen';
import ServiceScreen from '../StaticPages/ServiceScreen';
import PromotionScreen from '../StaticPages/PromotionScreen';
import { COLORS } from '../constants/Theme';
import { useLanguage } from '../i18n/LanguageContext';
import { AboutUsScreen, ContactScreen, AppInfoScreen, FAQScreen, TermsScreen } from '../StaticPages/StaticScreens';
import Chatbot from '../Component/Chatbot/Chatbot';

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
                    let iconName;
                    if (route.name === 'Home') iconName = '🏠';
                    else if (route.name === 'Product') iconName = '🛍️';
                    else if (route.name === 'Service') iconName = '🛠️';
                    else if (route.name === 'Cart') iconName = '🛒';
                    else if (route.name === 'Account') iconName = '👤';

                    return <Text style={{ fontSize: 24, color: color }}>{iconName}</Text>;
                },
                tabBarLabelStyle: { fontSize: 12, paddingBottom: 5 }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('home') }} />
            <Tab.Screen name="Product" component={ProductScreen} options={{ title: t('product') }} />
            <Tab.Screen name="Service" component={ServiceScreen} options={{ title: t('service') || "Service" }} />
            <Tab.Screen name="Cart" component={CartScreen} options={{ title: t('cart') }} />
            <Tab.Screen name="Account" component={AccountScreen} options={{ title: t('account') }} />
        </Tab.Navigator >
    );
}

export default function AppNavigator() {
    const { t } = useLanguage();
    return (
        <>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Main" component={TabNavigator} />
                    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: true, title: t('checkout') }} />

                    {/* Static Pages */}
                    <Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ headerShown: true, title: t('about_brand') }} />
                    <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: true, title: t('contact') }} />
                    <Stack.Screen name="FAQ" component={FAQScreen} options={{ headerShown: true, title: t('faq') }} />
                    <Stack.Screen name="RetailSystem" component={RetailSystemScreen} options={{ headerShown: true, title: t('retail_system') }} />
                    <Stack.Screen name="Promotions" component={PromotionScreen} options={{ headerShown: true, title: t('promotions') }} />

                    <Stack.Screen name="Terms" component={TermsScreen} options={{ headerShown: true, title: t('terms') }} />

                    {/* Profile Screen */}
                    <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: true, title: t('account') }} />

                    <Stack.Screen name="AppInfo" component={AppInfoScreen} options={{ headerShown: true, title: "App Info" }} />
                </Stack.Navigator>
            </NavigationContainer>
            <Chatbot />
        </>
    );
}
