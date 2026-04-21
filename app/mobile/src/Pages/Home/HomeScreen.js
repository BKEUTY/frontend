import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/Theme';
import { useLanguage } from '../../i18n/LanguageContext';
import Header from '../../Component/Header';
import ProductCard from '../../Component/Common/ProductCard';
import { LinearGradient } from 'expo-linear-gradient';

import productApi from '../../api/productApi';

import { useProductsPaginated } from '../../hooks/useProducts';
import { usePersonalizedRecommendations } from '../../hooks/useRecommendation';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const { t } = useLanguage();

    const { data: recData, isLoading: recLoading } = usePersonalizedRecommendations();
    const { data: bestSellersData, isLoading: bestSellersLoading } = useProductsPaginated({ size: 6, sort: 'sold_desc' });
    const { data: suggestedData, isLoading: suggestedLoading } = useProductsPaginated({ size: 6, sort: 'rating_desc' });
    const { data: mostReviewedData, isLoading: mostReviewedLoading } = useProductsPaginated({ size: 6, sort: 'reviews_desc' });
    const { data: premiumData, isLoading: premiumLoading } = useProductsPaginated({ size: 6, sort: 'price_desc' });
    const { data: availableData, isLoading: availableLoading } = useProductsPaginated({ size: 6, sort: 'stock_desc' });

    const bestSellers = bestSellersData?.items || [];
    const suggestedProducts = suggestedData?.items || [];
    const mostReviewed = mostReviewedData?.items || [];
    const premiumProducts = premiumData?.items || [];
    const availableProducts = availableData?.items || [];
    const personalizedProducts = recData?.recommendedProducts || [];

    const isGlobalLoading = bestSellersLoading && suggestedLoading;

    const renderSection = (title, products, isLoading, horizontal = true) => {
        if (!isLoading && products.length === 0) return null;

        return (
            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{title}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
                        <Text style={styles.viewAllText}>{t('view_all')}</Text>
                    </TouchableOpacity>
                </View>
                {isLoading ? (
                    <View style={styles.sectionLoading}>
                        <ActivityIndicator size="small" color={COLORS.mainTitle} />
                    </View>
                ) : horizontal ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                        {products.map(item => (
                            <ProductCard
                                key={item.id}
                                item={item}
                                onPress={() => navigation.navigate('Product', { screen: 'ProductDetail', params: { product: item } })}
                                layout="horizontal"
                                showAddToCart={false}
                            />
                        ))}
                    </ScrollView>
                ) : (
                    <View style={styles.gridContainer}>
                        {products.map(item => (
                            <ProductCard
                                key={item.id}
                                item={item}
                                onPress={() => navigation.navigate('Product', { screen: 'ProductDetail', params: { product: item } })}
                                layout="grid"
                                showAddToCart={false}
                            />
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header />
            {isGlobalLoading ? (
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
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                            style={styles.heroOverlay}
                        >
                            <View style={styles.glassCard}>
                                <Text style={styles.heroTitle}>{t('mid_autumn_promo')}</Text>
                                <Text style={styles.heroSubtitle}>{t('promo_subtitle')}</Text>
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

                    <View style={styles.mainContent}>
                        {/* AI Personalized Section */}
                        {renderSection(t('personalized_for_you'), personalizedProducts, recLoading)}

                        {/* Best Sellers */}
                        {renderSection(t('best_sellers'), bestSellers, bestSellersLoading)}

                        {/* Premium Products */}
                        {renderSection(t('premium_products'), premiumProducts, premiumLoading)}

                        {/* Most Reviewed */}
                        {renderSection(t('most_reviewed'), mostReviewed, mostReviewedLoading)}

                        {/* Suggested - Grid */}
                        <LinearGradient colors={['#fff', '#fff9fb']} style={styles.suggestedGradient}>
                            {renderSection(t('section_suggested'), suggestedProducts, suggestedLoading, false)}
                        </LinearGradient>

                        {/* Available Products */}
                        {renderSection(t('top_in_stock'), availableProducts, availableLoading)}

                        {/* Brand Story */}
                        <LinearGradient
                            colors={[COLORS.mainTitle, COLORS.mainTitleDark || '#880e4f']}
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
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        height: height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 40,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: 25,
        borderRadius: 24,
        width: width - 40,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)', // Note: standard RN doesn't support this, but good for future/web
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    heroSubtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '600',
        lineHeight: 22,
    },
    btnPrimary: {
        backgroundColor: 'white',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 16,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    btnTextPrimary: {
        color: COLORS.mainTitle,
        fontSize: 15,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    mainContent: {
        paddingTop: 10,
    },
    sectionContainer: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 5,
    },
    sectionTitle: {
        fontSize: 19,
        color: '#1e293b',
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    viewAllText: {
        fontSize: 13,
        color: COLORS.mainTitle,
        fontWeight: '700',
    },
    horizontalScroll: {
        paddingRight: 15,
        paddingBottom: 5,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    sectionLoading: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestedGradient: {
        paddingVertical: 10,
        marginVertical: 10,
    },
    brandSection: {
        padding: 40,
        alignItems: 'center',
        marginTop: 20,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
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
        fontWeight: '500',
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
