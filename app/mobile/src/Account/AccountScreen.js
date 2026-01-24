import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { COLORS } from '../constants/Theme';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../i18n/LanguageContext';
import Header from '../Component/Header';

const { width } = Dimensions.get('window');

const AccountScreen = () => {
    const navigation = useNavigation();
    const { t, toggleLanguage, language } = useLanguage();

    const user = {
        name: "Thanh Phong",
        email: "phongdeptrai28@gmail.com",
        avatar: null,
        level: "Member Gold",
        points: 1250
    };

    const mainFeatures = [
        { id: 'info', icon: '👤', title: t('account'), route: 'Profile' },
        { id: 'orders', icon: '📦', title: t('my_orders'), route: 'Orders' },
        { id: 'appointments', icon: '📅', title: t('my_appointments'), route: 'Appointments' },
        { id: 'wallet', icon: '💳', title: t('my_wallet'), route: 'Wallet' },
    ];

    const supportItems = [
        { id: 6, title: t('about_brand'), route: 'AboutUs' },
        { id: 7, title: t('retail_system'), route: 'RetailSystem' },
        { id: 8, title: t('faq'), route: 'FAQ' },
        { id: 9, title: t('beauty_corner'), route: 'BeautyCorner' },
        { id: 10, title: t('terms'), route: 'Terms' },
        { id: 11, title: t('contact'), route: 'Contact' },
    ];

    const handlePress = (item) => {
        if (item.route) {
            navigation.navigate(item.route);
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Header Card */}
                <View style={styles.profileHeader}>
                    <View style={styles.headerContent}>
                        <View style={styles.avatarSection}>
                            {user.avatar ? (
                                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                    <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.username}>{user.name}</Text>

                            {/* Membership Pill Row */}
                            <View style={styles.membershipContainer}>
                                <View style={styles.premiumBadge}>
                                    <Text style={styles.premiumBadgeText}>DIAMOND</Text>
                                </View>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: '70%' }]} />
                                </View>
                                <Text style={styles.pointsText}>{user.points} {t('pts')}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Main Features Bento Grid */}
                <Text style={styles.sectionTitle}>Dashboard</Text>
                <View style={styles.bentoGrid}>
                    {mainFeatures.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.bentoCard}
                            onPress={() => handlePress(item)}
                        >
                            <View style={styles.cardIconContainer}>
                                <Text style={styles.cardIcon}>{item.icon}</Text>
                            </View>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Support List */}
                <Text style={styles.sectionTitle}>{t('support_header') || "Support"}</Text>
                <View style={styles.menuSection}>
                    {supportItems.map(item => (
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

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 15,
    },
    profileHeader: {
        marginTop: 20,
        marginBottom: 25,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        overflow: 'hidden',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarSection: {
        marginRight: 15,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: COLORS.mainTitle,
    },
    avatarPlaceholder: {
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#888',
    },
    userInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    username: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.mainTitle,
        marginBottom: 8,
        // Added stroke effect for better visibility/style
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    /* Mobile Membership Pill Styles */
    membershipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f2f6',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 10,
        alignSelf: 'flex-start', // Fit content
    },
    premiumBadge: {
        backgroundColor: '#00d2d3', // Teal/Cyan matching web
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 8,
    },
    premiumBadgeText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 10,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        width: 60,
        marginRight: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#fbc531', // Gold
        borderRadius: 3,
    },
    pointsText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#57606f',
    },

    // Bento Grid
    sectionTitle: {
        fontSize: 22, // Increased from 18 to match unified header styles
        fontWeight: '800',
        color: '#333',
        marginBottom: 15,
        marginLeft: 5,
    },
    bentoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    bentoCard: {
        width: (width - 45) / 2, // 2 columns with padding calculation
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 2,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cardIconContainer: {
        width: 45,
        height: 45,
        backgroundColor: '#fff0f6',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardIcon: {
        fontSize: 22,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },

    // Menu Section
    menuSection: {
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 1,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    menuItemText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    chevron: {
        color: '#ddd',
        fontSize: 16,
    },
    logoutItem: {
        borderBottomWidth: 0,
        marginTop: 5,
    },
    logoutText: {
        color: 'red',
        fontWeight: '600',
    },
});

export default AccountScreen;
