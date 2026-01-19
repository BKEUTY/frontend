import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { COLORS } from '../constants/Theme';

import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../i18n/LanguageContext';

const AccountScreen = () => {
    const navigation = useNavigation();
    const { t, toggleLanguage, language } = useLanguage();

    // Placeholder data
    const user = {
        name: "Thanh Phong",
        email: "phongdeptrai28@gmail.com",
        avatar: null
    };

    const menuItems = [
        { id: 1, title: t('account') },
        { id: 2, title: t('my_orders') },
        { id: 3, title: t('my_appointments') },
        { id: 4, title: t('my_wallet') },
        { id: 5, title: t('shipping_address') },
        // Static Pages
        { id: 6, title: t('about_brand'), route: 'AboutUs' },
        { id: 7, title: t('retail_system'), route: 'RetailSystem' },
        { id: 8, title: t('faq'), route: 'FAQ' },
        { id: 9, title: t('beauty_corner'), route: 'BeautyCorner' },
        { id: 10, title: t('terms'), route: 'Terms' },
        { id: 11, title: t('contact'), route: 'Contact' },
        { id: 12, title: 'App Info', route: 'AppInfo' },
    ];

    const handlePress = (item) => {
        if (item.route) {
            navigation.navigate(item.route);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    {user.avatar ? (
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.username}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>

            <View style={styles.menuSection}>
                {menuItems.map(item => (
                    <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handlePress(item)}>
                        <Text style={styles.menuItemText}>{item.title}</Text>
                        <Text style={styles.chevron}>{'>'}</Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.menuItem} onPress={toggleLanguage}>
                    <Text style={styles.menuItemText}>{t('language')}</Text>
                    <Text style={{ fontWeight: 'bold', color: COLORS.mainTitle }}>
                        {language === 'vi' ? 'Tiếng Việt' : 'English'} &gt;
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, styles.logoutItem]}>
                    <Text style={[styles.menuItemText, styles.logoutText]}>{t('logout')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: 'white',
        padding: 30,
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        marginBottom: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: COLORS.mainTitle,
    },
    avatarPlaceholder: {
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#888',
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
        marginBottom: 5,
    },
    email: {
        color: '#666',
        fontSize: 14,
    },
    menuSection: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
    },
    chevron: {
        color: '#ccc',
        fontSize: 18,
    },
    logoutItem: {
        borderBottomWidth: 0,
        marginTop: 10,
    },
    logoutText: {
        color: 'red',
    },
});

export default AccountScreen;
