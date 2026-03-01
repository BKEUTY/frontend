import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/Theme';
import { useLanguage } from '../i18n/LanguageContext';
import { useCart } from '../Context/CartContext';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
    const navigation = useNavigation();
    const { language, changeLanguage } = useLanguage();
    const { cartItems } = useCart();

    const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

    const handleToggleLanguage = () => {
        changeLanguage(language === 'vi' ? 'en' : 'vi');
    };

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.menuButton}>
                <Ionicons name="menu-outline" size={32} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoContainer} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.logoText}>BKEUTY</Text>
            </TouchableOpacity>
            <View style={styles.rightContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.iconButton}>
                    <Ionicons name="cart-outline" size={26} color="#333" />
                    {cartCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{cartCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Account')} style={styles.accountButton}>
                    <Ionicons name="person-outline" size={24} color="#333" />
                </TouchableOpacity>

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
        backgroundColor: '#fce4ec',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        zIndex: 100,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    menuButton: {
        padding: 5,
        justifyContent: 'center',
        zIndex: 10,
        marginLeft: -5,
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
        gap: 12,
        zIndex: 10,
    },
    logoContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        marginLeft: 15,
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
        padding: 5,
        marginRight: 10,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -6,
        backgroundColor: '#ffc107',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#fce4ec',
    },
    badgeText: {
        color: '#333',
        fontSize: 9,
        fontWeight: 'bold',
    },
    accountButton: {
        padding: 5,
        marginRight: 10,
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
