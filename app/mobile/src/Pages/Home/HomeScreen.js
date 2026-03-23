import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/Theme';
import { useLanguage } from '../../i18n/LanguageContext';
import Header from '../../Component/Header';
import ProductCard from '../../Component/Common/ProductCard';
import { LinearGradient } from 'expo-linear-gradient';

import productApi from '../../api/productApi';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [bestSellers, setBestSellers] = useState([]);
    const [suggestedProducts, setSuggestedProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productApi.getAll({ page: 0, size: 10 });
                const products = response.data.content || [];
                setBestSellers(products.slice(0, 5));
                setSuggestedProducts(products.slice(5, 10));
            } catch (error) {
                console.error("Failed to fetch home products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <View style={styles.container}>
            <Header />
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.mainTitle} />
                </View>
            ) : (
                <ScrollView 
                    style={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <ImageBackground
                        source={require('../../Assets/Images/Banners/banner_home_1.png')}
                        style={styles.heroSection}
                        resizeMode="cover"
                        imageStyle={{ borderRadius: 0 }}
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.6)']}
                            style={styles.heroOverlay}
                        >
                            <View style={styles.heroContent}>
                                <Text style={styles.heroTitle}>
                                    {t('mid_autumn_promo')}
                                </Text>
                                <Text style={styles.heroSubtitle}>
                                    {t('promo_subtitle')}
                                </Text>
                                <TouchableOpacity 
                                    style={styles.btnPrimary} 
                                    onPress={() => navigation.navigate('ProductList')}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.btnTextPrimary}>{t('explore')}</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </ImageBackground>

                    <View style={styles.contentSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{t('best_sellers')}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
                                <Text style={styles.viewAllText}>{t('view_all')}</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                            {bestSellers.map(item => (
                                <ProductCard
                                    key={item.id}
                                    item={item}
                                    onPress={() => navigation.navigate('Product', { screen: 'ProductDetail', params: { product: item } })}
                                    layout="horizontal"
                                    showAddToCart={false}
                                />
                            ))}
                        </ScrollView>
                    </View>

                    <LinearGradient
                        colors={['#fff', '#fff0f3']}
                        style={styles.gridSection}
                    >
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{t('section_suggested')}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
                                <Text style={styles.viewAllText}>{t('view_all')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.gridContainer}>
                            {suggestedProducts.map(item => (
                                <ProductCard
                                    key={item.id}
                                    item={item}
                                    onPress={() => navigation.navigate('Product', { screen: 'ProductDetail', params: { product: item } })}
                                    layout="grid"
                                    showAddToCart={false}
                                />
                            ))}
                        </View>
                    </LinearGradient>

                    <LinearGradient
                        colors={[COLORS.mainTitle, COLORS.mainTitleDark]}
                        style={styles.brandSection}
                    >
                        <View style={styles.certContainer}>
                            <Image
                                source={{ uri: 'http://online.gov.vn/Content/EndUser/LogoCCDVSaleNoti/logoSaleNoti.png' }}
                                style={styles.certImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.brandTitle}>{t('brand_story')}</Text>
                        <Text style={styles.sectionText}>
                            {t('brand_desc')}
                        </Text>
                        <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.7}>
                            <Text style={styles.btnTextSecondary}>{t('explore_more')}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollContent: {
        flex: 1,
    },
    heroSection: {
        height: height * 0.45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContent: {
        zIndex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: 'white',
        textAlign: 'center',
        marginBottom: 12,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 15,
        letterSpacing: -1,
        lineHeight: 44,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 35,
        fontWeight: '600',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    btnPrimary: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingVertical: 16,
        paddingHorizontal: 45,
        borderRadius: 20,
        elevation: 15,
        shadowColor: COLORS.mainTitle || '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
    },
    btnTextPrimary: {
        color: COLORS.mainTitle || '#c2185b',
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    contentSection: {
        paddingVertical: 25,
        paddingHorizontal: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    sectionTitle: {
        fontSize: 20,
        color: COLORS.text,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    viewAllText: {
        fontSize: 14,
        color: COLORS.mainTitle,
        fontWeight: '600',
    },
    horizontalScroll: {
        paddingRight: 15,
        paddingBottom: 10,
    },
    gridSection: {
        paddingVertical: 30,
        paddingHorizontal: 15,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    brandSection: {
        padding: 40,
        alignItems: 'center',
        marginTop: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 20,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    brandTitle: {
        fontSize: 22,
        color: 'white',
        fontWeight: '900',
        marginBottom: 15,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    sectionText: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 24,
        marginBottom: 30,
        fontSize: 15,
    },
    btnSecondary: {
        borderColor: 'white',
        borderWidth: 1.5,
        paddingVertical: 12,
        paddingHorizontal: 35,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    btnTextSecondary: {
        color: 'white',
        fontWeight: '800',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    certContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
        paddingBottom: 25,
    },
    certImage: {
        width: 160,
        height: 60,
        tintColor: 'white',
    },
});

export default HomeScreen;
