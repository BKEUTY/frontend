import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
            {/* Left Placeholder for spacing balance */}
            <View style={styles.sideContainer}>
                {/* Optional: Add Hamburger or Back button if needed */}
            </View>

            {/* Centered Logo */}
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>BKEUTY</Text>
            </View>

            {/* Right Icons */}
            <View style={[styles.sideContainer, styles.rightContainer]}>
                <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.iconButton}>
                    <Text style={styles.iconText}>🛒</Text>
                    {/* Optional Badge */}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleToggleLanguage} style={styles.langButton}>
                    <Text style={styles.langIcon}>🌐</Text>
                    <Text style={styles.langText}>{language === 'vi' ? 'VI' : 'EN'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        backgroundColor: '#fce4ec', // Matches web header gradient start
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 100,
    },
    sideContainer: {
        width: 80,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightContainer: {
        justifyContent: 'flex-end',
        gap: 15,
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
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
        fontStyle: 'italic',
    },
    iconButton: {
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 24,
        color: COLORS.mainTitle,
    },
    langButton: {
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0, // Tight spacing
    },
    langIcon: {
        fontSize: 22,
        color: COLORS.mainTitle,
        lineHeight: 24,
    },
    langText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
        lineHeight: 12,
    }
});

export default Header;
