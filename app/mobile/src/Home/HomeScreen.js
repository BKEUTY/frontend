import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS } from '../constants/Theme';
import { useLanguage } from '../i18n/LanguageContext';

const { width, height } = Dimensions.get('window');

// Mock Data mirroring Web
const mockProducts = [
    { id: 1, name: 'Kem Dưỡng Ẩm BKEUTY Hydra-Deep', price: '450.000đ', brand: 'BKEUTY', image: null, rating: '4.9', sold: '1k', tag: 'tag_hot' },
    { id: 2, name: 'Son Môi Lì Mịn Môi Matte Lipstick', price: '320.000đ', brand: 'MAC', image: null, rating: '4.7', sold: '500', discount: '10%' },
    { id: 3, name: 'Nước Hoa Hồng Dịu Nhẹ Toner', price: '150.000đ', brand: 'Laroche Posay', image: null, rating: '4.5', sold: '200' },
    { id: 4, name: 'Serum Vitamin C Sáng Da Clinical', price: '550.000đ', brand: 'Obagi', image: null, rating: '4.8', sold: '300', tag: 'tag_new' },
    { id: 5, name: 'Kem Chống Nắng Phổ Rộng Perfect UV', price: '420.000đ', brand: 'Anessa', image: null, rating: '4.6', sold: '850' },
    { id: 6, name: 'Mặt Nạ Giấy Cấp Ẩm Tea Tree', price: '25.000đ', brand: 'Innisfree', image: null, rating: '4.9', sold: '5k' },
    { id: 7, name: 'Tẩy Trang Cho Da Nhạy Cảm Sensibio', price: '180.000đ', brand: 'Bioderma', image: null, rating: '4.7', sold: '1.2k' },
    { id: 8, name: 'Xịt Khoáng Cấp Nước Mineral 89', price: '280.000đ', brand: 'Vichy', image: null, rating: '4.5', sold: '600' },
    { id: 9, name: 'Sữa Rửa Mặt Tạo Bọt Foaming Cleanser', price: '120.000đ', brand: 'Cerave', image: null, rating: '4.6', sold: '900' },
    { id: 10, name: 'Dầu Dưỡng Tóc Mềm Mượt Treatment', price: '350.000đ', brand: 'Moroccanoil', image: null, rating: '4.8', sold: '400' }
];

const bestSellers = mockProducts.slice(0, 5);
const suggestedProducts = mockProducts.slice(5, 10);

import Header from '../Component/Header';

const HomeScreen = ({ navigation }) => {
    const { t } = useLanguage();

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView style={styles.scrollContent}>
                {/* Hero Section */}
                <ImageBackground
                    // Placeholder image, ensure this asset exists or use a network image for demo
                    source={require('../Assets/Images/Banners/banner_home_1.png')}
                    style={styles.heroSection}
                    resizeMode="cover"
                    imageStyle={{ opacity: 0.9 }}
                >
                    <View style={styles.heroOverlay} />
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>
                            {t('mid_autumn_promo') || "Trung Thu tới, giá giảm phơi phới!"}
                        </Text>
                        <Text style={styles.heroSubtitle}>
                            {t('promo_subtitle') || "Ưu đãi sốc"}
                        </Text>
                        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Product')}>
                            <Text style={styles.btnTextPrimary}>{t('explore') || "Khám phá ngay"}</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>

                {/* Best Sellers */}
                <View style={[styles.contentSection, { backgroundColor: '#fff' }]}>
                    <Text style={styles.sectionTitle}>{t('best_sellers')}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
                        {bestSellers.map(item => (
                            <View key={item.id} style={styles.productCard}>
                                <View style={styles.cardBadges}>
                                    {item.tag && <Text style={styles.badgeRed}>{t(item.tag) || item.tag}</Text>}
                                </View>
                                <View style={styles.productPlaceHolder} />
                                <Text style={styles.productBrand}>{item.brand}</Text>
                                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                                <View style={styles.cardMeta}>
                                    <Text style={styles.rating}>⭐ {item.rating}</Text>
                                    <Text style={styles.sold}>({item.sold} {t('sold_count')})</Text>
                                </View>
                                <Text style={styles.productPrice}>{item.price}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Suggested Products (Grid) */}
                <View style={styles.contentSection}>
                    <Text style={styles.sectionTitle}>{t('section_suggested')}</Text>
                    <View style={styles.gridContainer}>
                        {suggestedProducts.map(item => (
                            <View key={item.id} style={styles.gridCard}>
                                <View style={styles.cardBadges}>
                                    {item.tag && <Text style={styles.badgeRed}>{t(item.tag) || item.tag}</Text>}
                                    {item.discount && <Text style={styles.badgeYellow}>-{item.discount}</Text>}
                                </View>
                                <View style={styles.productPlaceHolder} />
                                <Text style={styles.productBrand}>{item.brand}</Text>
                                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                                <View style={styles.cardMeta}>
                                    <Text style={styles.rating}>⭐ {item.rating}</Text>
                                    <Text style={styles.sold}>({item.sold} {t('sold_count')})</Text>
                                </View>
                                <View style={styles.priceRow}>
                                    {item.oldPrice && <Text style={styles.oldPrice}>{item.oldPrice}</Text>}
                                    <Text style={styles.productPrice}>{item.price}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Brand Story */}
                <View style={styles.brandSection}>
                    {/* Trust Signals */}
                    <View style={styles.trustContainer}>
                        <View style={styles.trustItem}>
                            <FontAwesome name="check-circle" size={20} color="#00e676" />
                            <Text style={styles.trustText}>{t('trust_authentic') || "Cam kết chính hãng 100%"}</Text>
                        </View>
                        <View style={styles.trustItem}>
                            <FontAwesome name="check-circle" size={20} color="#00e676" />
                            <Text style={styles.trustText}>{t('trust_return') || "Đổi trả trong 7 ngày"}</Text>
                        </View>
                        <View style={styles.trustItem}>
                            <FontAwesome name="check-circle" size={20} color="#00e676" />
                            <Text style={styles.trustText}>{t('trust_check') || "Được kiểm hàng trước khi nhận"}</Text>
                        </View>
                    </View>

                    <Text style={[styles.sectionTitle, { color: 'white', borderBottomColor: 'rgba(255,255,255,0.3)', borderBottomWidth: 1, paddingBottom: 10 }]}>{t('brand_story')}</Text>
                    <Text style={styles.sectionText}>
                        {t('brand_desc')}
                    </Text>
                    <TouchableOpacity style={styles.btnSecondary}>
                        <Text style={styles.btnTextSecondary}>{t('explore_more')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flex: 1,
    },
    heroSection: {
        height: height * 0.45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    heroContent: {
        zIndex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    btnPrimary: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'white',
    },
    btnTextPrimary: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    contentSection: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        color: COLORS.mainTitle,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    horizontalScroll: {
        paddingRight: 15,
    },
    productCard: {
        width: 160,
        marginRight: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: '#eee',
        // Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    productPlaceHolder: {
        width: '100%',
        height: 120,
        backgroundColor: '#f5f5f5',
        marginBottom: 8,
        borderRadius: 4,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridCard: {
        width: (width - 40) / 2, // 2 columns with spacing (15px padding * 2 = 30 + 10 gap = 40 approx)
        backgroundColor: 'white',
        borderRadius: 16, // Modern rounded corners
        padding: 0, // Remove padding to let image fill width if needed, or keep small
        marginBottom: 15,
        // Remove heavy border
        // shadow
        shadowColor: "#000", // Neutral shadow like web
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    // ... rest of styles
    cardBadges: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
        flexDirection: 'row',
        gap: 5,
    },
    productPlaceHolder: {
        width: '100%',
        height: 150, // Taller image
        backgroundColor: '#f9f9f9',
        marginBottom: 0,
    },
    // ...
    brandSection: {
        padding: 40,
        backgroundColor: COLORS.mainTitle, // Updated from dark #33001b to brand color
        alignItems: 'center',
        marginTop: 20,
    },
    sectionText: {
        textAlign: 'center',
        color: '#e0e0e0', // Light text for dark bg
        lineHeight: 22,
        marginBottom: 20,
    },
    btnSecondary: {
        borderColor: 'white',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    btnTextSecondary: {
        color: 'white',
        fontWeight: '600',
    },
    // Trust Signals Styles
    trustContainer: {
        flexDirection: 'column',
        width: '100%',
        marginBottom: 30,
        gap: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.15)',
        paddingBottom: 25,
    },
    trustItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 50,
        width: '100%',
    },
    trustText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
        letterSpacing: 0.5,
    },
});

export default HomeScreen;
