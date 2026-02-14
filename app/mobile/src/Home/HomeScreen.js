import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';
import { COLORS } from '../constants/Theme';
import { useLanguage } from '../i18n/LanguageContext';

const { width, height } = Dimensions.get('window');


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
import ProductCard from '../Component/Common/ProductCard';

const HomeScreen = ({ navigation }) => {
    const { t } = useLanguage();

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView style={styles.scrollContent}>

                <ImageBackground

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


                <View style={[styles.contentSection, { backgroundColor: '#fff' }]}>
                    <Text style={styles.sectionTitle}>{t('best_sellers')}</Text>
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

                <View style={styles.contentSection}>
                    <Text style={styles.sectionTitle}>{t('section_suggested')}</Text>
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
                </View>


                <View style={styles.brandSection}>

                    <View style={styles.certContainer}>
                        <Image
                            source={{ uri: 'http://online.gov.vn/Content/EndUser/LogoCCDVSaleNoti/logoSaleNoti.png' }}
                            style={styles.certImage}
                            resizeMode="contain"
                        />
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
        height: height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)', // Slightly darker for better text contrast
    },
    heroContent: {
        zIndex: 1,
        alignItems: 'center',
        paddingHorizontal: 40,
        width: '100%',
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: 'white',
        textAlign: 'center',
        marginBottom: 12,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
        letterSpacing: -0.5,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '500',
        lineHeight: 24,
    },
    btnPrimary: {
        backgroundColor: 'white',
        paddingVertical: 14,
        paddingHorizontal: 36,
        borderRadius: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        transform: [{ scale: 1 }],
    },
    btnTextPrimary: {
        color: COLORS.mainTitle,
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
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
        width: (width - 40) / 2,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 0,
        marginBottom: 15,


        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },

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
        height: 150,
        backgroundColor: '#f9f9f9',
        marginBottom: 0,
    },
    // ...
    brandSection: {
        padding: 40,
        backgroundColor: COLORS.mainTitle,
        alignItems: 'center',
        marginTop: 20,
    },
    sectionText: {
        textAlign: 'center',
        color: '#e0e0e0',
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

    certContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.15)',
        paddingBottom: 20,
    },
    certImage: {
        width: 150,
        height: 55,
    },
});

export default HomeScreen;
