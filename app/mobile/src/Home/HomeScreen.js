import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';
import { COLORS, FONTS } from '../constants/Theme';
import { useLanguage } from '../i18n/LanguageContext';

const { width, height } = Dimensions.get('window');

// Mock Data matching Web
const bestSellers = [
    { id: 1, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9/5', sold: '314 đã bán' },
    { id: 2, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9/5', sold: '314 đã bán' },
    { id: 3, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9/5', sold: '314 đã bán' },
];

const suggestedProducts = [
    { id: 1, name: 'Sữa Chống Nắng Anessa Dưỡng Da Kiềm Dầu 60ml', price: '431.000đ', oldPrice: '700.000đ', discount: '47%', tag: 'DEAL SỐC' },
    { id: 2, name: 'Sữa Chống Nắng Anessa Dưỡng Da Kiềm Dầu 60ml', price: '431.000đ', oldPrice: '700.000đ', discount: '47%', tag: 'DEAL SỐC' },
    { id: 3, name: 'Sữa Chống Nắng Anessa Dưỡng Da Kiềm Dầu 60ml', price: '431.000đ', oldPrice: '700.000đ', discount: '47%', tag: 'DEAL SỐC' },
];

const HomeScreen = ({ navigation }) => {
    const { t } = useLanguage();

    return (
        <ScrollView style={styles.container}>
            <ImageBackground
                source={require('../Assets/Images/Banners/blog image.svg')} // Placeholder
                style={styles.heroSection}
                resizeMode="cover"
            >
                <View style={styles.heroOverlay} />
                <View style={styles.heroContent}>
                    <Text style={styles.heroTitle}>
                        {t('mid_autumn_promo') || "Trung Thu tới, giá giảm phơi phới!"}
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        {t('promo_subtitle') || "Ưu đãi sốc"}
                    </Text>
                    <View style={styles.heroButtons}>
                        <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Product')}>
                            <Text style={styles.btnTextPrimary}>{t('shop_now')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>

            <View style={styles.contentSection}>
                <Text style={styles.sectionTitle}>{t('best_sellers') || "SẢN PHẨM BÁN CHẠY"}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {bestSellers.map(item => (
                        <View key={item.id} style={styles.productCard}>
                            <View style={styles.productPlaceHolder} />
                            <Text style={styles.productBrand}>Obagi</Text>
                            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                            <Text style={styles.productPrice}>{item.price}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={[styles.contentSection, { backgroundColor: '#f9f9f9' }]}>
                <Text style={styles.sectionTitle}>{t('section_suggested') || "GỢI Ý CHO BẠN"}</Text>
                <View style={styles.gridContainer}>
                    {suggestedProducts.map(item => (
                        <View key={item.id} style={[styles.productCard, styles.gridCard]}>
                            <View style={styles.cardBadges}>
                                <Text style={styles.badgeRed}>{item.tag}</Text>
                            </View>
                            <View style={styles.productPlaceHolder} />
                            <Text style={styles.productBrand}>Anessa</Text>
                            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.oldPrice}>{item.oldPrice}</Text>
                                <Text style={styles.productPrice}>{item.price}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.brandSection}>
                <Text style={[styles.sectionTitle, { color: 'white' }]}>{t('brand_story')}</Text>
                <Text style={styles.sectionText}>
                    {t('brand_desc')}
                </Text>
                <TouchableOpacity style={styles.btnSecondary}>
                    <Text style={styles.btnTextSecondary}>{t('explore')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    heroSection: {
        height: height * 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    heroContent: {
        zIndex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    btnPrimary: {
        backgroundColor: '#e91e63',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    btnTextPrimary: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    contentSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#e91e63',
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    horizontalScroll: {
        paddingBottom: 10,
    },
    productCard: {
        width: 160,
        marginRight: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        elevation: 2,
        marginBottom: 10,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridCard: {
        width: '48%',
        marginRight: 0,
        marginBottom: 15,
    },
    productPlaceHolder: {
        width: '100%',
        height: 120,
        backgroundColor: '#e0e0e0',
        marginBottom: 10,
        borderRadius: 4,
    },
    productBrand: {
        fontSize: 10,
        color: '#888',
        marginBottom: 2,
    },
    productName: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 5,
        height: 35,
    },
    productPrice: {
        color: '#e91e63',
        fontWeight: 'bold',
        fontSize: 14,
    },
    oldPrice: {
        textDecorationLine: 'line-through',
        color: '#aaa',
        fontSize: 12,
        marginRight: 5,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardBadges: {
        position: 'absolute',
        top: 5,
        left: 5,
        zIndex: 10,
    },
    badgeRed: {
        backgroundColor: '#e91e63',
        color: 'white',
        fontSize: 8,
        padding: 3,
        fontWeight: 'bold',
    },
    brandSection: {
        padding: 30,
        alignItems: 'center',
        backgroundColor: '#4a142f',
    },
    sectionText: {
        textAlign: 'center',
        color: '#ddd',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    btnSecondary: {
        borderWidth: 1,
        borderColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
    btnTextSecondary: {
        color: 'white',
        fontWeight: '600',
    },
});

export default HomeScreen;
