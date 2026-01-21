import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/Theme';
import { useLanguage } from '../i18n/LanguageContext';

const Header = () => {
    const navigation = useNavigation();
    const { language, toggleLanguage } = useLanguage();

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

                <TouchableOpacity onPress={toggleLanguage} style={styles.langButton}>
                    <Text style={styles.langText}>{language === 'vi' ? 'EN' : 'VI'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 60,
        backgroundColor: '#fff0f5', // Light pink background to match web header gradient start
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
        width: 80, // Fixed width to ensure logo stays centered via absolute positioning logic or flex balance
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightContainer: {
        justifyContent: 'flex-end',
        gap: 10,
    },
    logoContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center', // Center vertically
        alignItems: 'center',     // Center horizontally
        zIndex: -1,               // Behind the side containers so buttons are clickable
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
        fontStyle: 'italic', // Mimic Oleo Script if possible
    },
    iconButton: {
        padding: 5,
    },
    iconText: {
        fontSize: 20, // Match web icon size roughly
        color: COLORS.mainTitle,
    },
    langButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: COLORS.mainTitle,
        borderRadius: 6,
        backgroundColor: 'transparent',
    },
    langText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    }
});

export default Header;
