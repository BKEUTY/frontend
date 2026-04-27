import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { COLORS } from '../../constants/Theme';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../../i18n/LanguageContext';
import Header from '../../Component/Header';
import { useAuth } from '../../Context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

import { LinearGradient } from 'expo-linear-gradient';

const AccountScreen = () => {
    const navigation = useNavigation();
    const { t, changeLanguage, language } = useLanguage();

    const { user, logout, isAuthenticated } = useAuth();
    
    const mainFeatures = isAuthenticated ? [
        { id: 'info', iconName: 'person-outline', title: t('account'), route: 'Profile', color: '#6366f1' },
        { id: 'orders', iconName: 'cube-outline', title: t('my_orders'), route: 'OrderList', color: '#f59e0b' },
        { id: 'returns', iconName: 'reload-outline', title: t('return_requests'), route: 'Returns', color: '#8b5cf6' },
        { id: 'appointments', iconName: 'calendar-outline', title: t('my_appointments'), route: 'Appointments', color: '#ec4899' },
        { id: 'wallet', iconName: 'wallet-outline', title: t('my_wallet'), route: 'Wallet', color: '#14b8a6' },
    ] : [];

    const supportItems = [
        { id: 6, title: t('about_brand'), route: 'AboutUs' },
        { id: 7, title: t('retail_system'), route: 'RetailSystem' },
        { id: 8, title: t('faq'), route: 'FAQ' },
        { id: 9, title: t('beauty_corner'), route: 'BeautyCorner' },
        { id: 10, title: t('terms_and_policy'), route: 'Terms' },
        { id: 11, title: t('contact'), route: 'Contact' },
    ];

    const handlePress = (item) => {
        if (item.route) {
            navigation.navigate(item.route);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigation.navigate('Home');
    };

    const toggleLang = () => {
        const next = language === 'vi' ? 'en' : 'vi';
        changeLanguage(next);
    };

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {isAuthenticated && user ? (
                    <View style={styles.profileHeaderWrapper}>
                        <LinearGradient
                            colors={['#fff', '#fff']}
                            style={styles.profileCard}
                        >
                            <View style={styles.headerContent}>
                                <View style={styles.avatarSection}>
                                    {user.avatar ? (
                                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                                    ) : (
                                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                            <Text style={styles.avatarText}>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</Text>
                                        </View>
                                    )}
                                    <TouchableOpacity style={styles.editAvatarBtn}>
                                        <Ionicons name="camera" size={14} color="white" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.userInfo}>
                                    <Text style={styles.usernameText}>{user.name || t('account')}</Text>
                                    <Text style={styles.userIdSubtext}>#{user.id}</Text>
                                </View>
                                <Ionicons name="chevron-up" size={18} color={COLORS.mainTitle} style={{ opacity: 0.6 }} />
                            </View>
                        </LinearGradient>
                    </View>
                ) : (
                    <View style={styles.guestContainer}>
                        <LinearGradient
                            colors={['#fff1f2', '#fff']}
                            style={styles.guestCard}
                        >
                            <Ionicons name="person-circle-outline" size={60} color={COLORS.mainTitle} />
                            <Text style={styles.guestTitle}>{t('welcome_landing') || 'Welcome'}</Text>
                            <Text style={styles.guestSubtitle}>{t('login_subtitle') || 'Login to continue'}</Text>
                            <View style={styles.guestButtons}>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ flex: 1 }}>
                                    <LinearGradient
                                        colors={[COLORS.mainTitle, COLORS.mainTitleDark || '#880e4f']}
                                        style={styles.loginBtn}
                                    >
                                        <Text style={styles.loginBtnText}>{t('login')}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.registerBtn} 
                                    onPress={() => navigation.navigate('Register')}
                                >
                                    <Text style={styles.registerBtnText}>{t('register')}</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>
                )}

                {isAuthenticated && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('dashboard')}</Text>
                        <View style={styles.menuSection}>
                            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.menuIconContainer, { backgroundColor: '#fff1f2' }]}>
                                        <Ionicons name="person" size={20} color={COLORS.mainTitle} />
                                    </View>
                                    <Text style={styles.menuItemText}>{t('account')}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('OrderList')}>
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.menuIconContainer, { backgroundColor: '#fff1f2' }]}>
                                        <Ionicons name="time" size={20} color={COLORS.mainTitle} />
                                    </View>
                                    <Text style={styles.menuItemText}>{t('my_orders') || 'Lịch sử giao dịch'}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Returns')}>
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.menuIconContainer, { backgroundColor: '#fff7ed' }]}>
                                        <Ionicons name="reload" size={20} color="#f59e0b" />
                                    </View>
                                    <Text style={styles.menuItemText}>{t('return_requests')}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings')}</Text>
                    <View style={styles.menuSection}>
                        {supportItems.map(item => (
                            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handlePress(item)}>
                                <View style={styles.menuItemLeft}>
                                    <Text style={styles.menuItemText}>{item.title}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity style={styles.menuItem} onPress={toggleLang}>
                            <View style={styles.menuItemLeft}>
                                <Text style={styles.menuItemText}>{t('language')}</Text>
                            </View>
                            <View style={styles.langBadge}>
                                <Text style={styles.langBadgeText}>
                                    {language === 'vi' ? 'VI' : 'EN'}
                                </Text>
                                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                            </View>
                        </TouchableOpacity>

                        {isAuthenticated && (
                            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                                <View style={styles.menuItemLeft}>
                                    <View style={[styles.menuIconContainer, { backgroundColor: '#fff1f0' }]}>
                                        <Ionicons name="log-out" size={20} color="#ef4444" />
                                    </View>
                                    <Text style={[styles.menuItemText, styles.logoutText]}>{t('logout')}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flex: 1,
    },
    profileHeaderWrapper: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 25,
    },
    profileCard: {
        borderRadius: 24,
        padding: 20,
        elevation: 12,
        shadowColor: COLORS.mainTitle,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarSection: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'white',
    },
    avatarPlaceholder: {
        backgroundColor: '#fde3cf', // Web-style light brown
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#10b981',
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'white',
    },
    userInfo: {
        flex: 1,
    },
    usernameText: {
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.mainTitle,
        letterSpacing: -0.5,
    },
    userIdSubtext: {
        fontSize: 13,
        color: '#9ca3af',
        fontWeight: '600',
        marginTop: 2,
    },
    guestContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 30,
    },
    guestCard: {
        borderRadius: 30,
        padding: 30,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    guestTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#111827',
        marginTop: 15,
        marginBottom: 8,
    },
    guestSubtitle: {
        fontSize: 15,
        color: '#6b7280',
        marginBottom: 30,
        textAlign: 'center',
    },
    guestButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    loginBtn: {
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBtnText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 16,
    },
    registerBtn: {
        flex: 1,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: COLORS.mainTitle,
        backgroundColor: 'white',
    },
    registerBtnText: {
        color: COLORS.mainTitle,
        fontWeight: '800',
        fontSize: 16,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 15,
        letterSpacing: -0.5,
    },
    menuSection: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
    },
    langBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    langBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.mainTitle,
        backgroundColor: '#fff1f2',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    logoutItem: {
        marginTop: 5,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#f9fafb',
    },
    logoutText: {
        color: '#ef4444',
    },
});

export default AccountScreen;
