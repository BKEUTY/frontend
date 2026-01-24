import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/Theme';
import { useLanguage } from '../i18n/LanguageContext';

const Header = () => {
    const navigation = useNavigation();
    const { language, changeLanguage } = useLanguage();

    const handleToggleLanguage = () => {
        changeLanguage(language === 'vi' ? 'en' : 'vi');
    };

    return (
        <View style={styles.headerContainer}>
            {/* Left: Hamburger Menu */}
            <TouchableOpacity style={styles.menuButton}>
                <View style={[styles.menuBar, { marginBottom: 4 }]} />
                <View style={[styles.menuBar, { marginBottom: 4 }]} />
                <View style={styles.menuBar} />
            </TouchableOpacity>

            {/* Centered Logo */}
            <View style={styles.logoContainer}>
                {/* Using Text for logo as placeholder, matching Web Mobile style */}
                <Text style={styles.logoText}>BKEUTY</Text>
            </View>

            {/* Right Icons */}
            <View style={styles.rightContainer}>
                {/* Cart with Badge */}
                <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.iconButton}>
                    <Text style={styles.cartIcon}>🛒</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>3</Text>
                    </View>
                </TouchableOpacity>

                {/* Account Button - Styled like Web Mobile */}
                <TouchableOpacity onPress={() => navigation.navigate('Account')} style={styles.accountButton}>
                    <Text style={styles.accountIcon}>👤</Text>
                </TouchableOpacity>

                {/* Language Toggle - Text Only */}
                <TouchableOpacity onPress={handleToggleLanguage} style={styles.langButton}>
                    <Text style={styles.langText}>{language === 'vi' ? 'VI' : 'EN'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        backgroundColor: '#fce4ec', // Matches web light pink bg
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    menuButton: {
        padding: 5,
        justifyContent: 'center',
        zIndex: 10,
    },
    menuBar: {
        width: 22,
        height: 2.5,
        backgroundColor: COLORS.mainTitle,
        borderRadius: 2,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12, // Consistent spacing
        zIndex: 10,
    },
    logoContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    logoText: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.mainTitle,
        fontStyle: 'italic',
        letterSpacing: 0.5,
    },
    iconButton: {
        position: 'relative',
        padding: 4,
    },
    cartIcon: {
        fontSize: 24,
        color: COLORS.mainTitle,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -6,
        backgroundColor: '#d32f2f',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#fce4ec',
    },
    badgeText: {
        color: 'white',
        fontSize: 9,
        fontWeight: 'bold',
    },
    accountButton: {
        width: 34,
        height: 34,
        backgroundColor: COLORS.mainTitle,
        borderRadius: 10, // Modern rounded square
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    accountIcon: {
        fontSize: 20,
        color: 'white',
    },
    langButton: {
        padding: 4,
    },
    langText: {
        fontSize: 13,
        fontWeight: '900',
        color: COLORS.mainTitle,
    },
});

export default Header;
