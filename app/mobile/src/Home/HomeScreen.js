import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { COLORS } from '../constants/Theme';
import { useLanguage } from '../i18n/LanguageContext';

const { width, height } = Dimensions.get('window');

// Mock Data matching Web
const bestSellers = [
    { id: 1, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9', sold: '314 đã bán' },
    { id: 2, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9', sold: '314 đã bán' },
    { id: 3, name: 'Nước Hoa Hồng Obagi 2% BHA Giảm Nhờn Mụn 148ml', price: '1.150.000đ', rating: '4.9', sold: '314 đã bán' },
];

const suggestedProducts = [
    { id: 1, name: 'Sữa Chống Nắng Anessa Dưỡng Da Kiềm Dầu 60ml', price: '431.000đ', oldPrice: '700.000đ', discount: '47%', tag: 'DEAL SỐC', rating: '4.9', sold: '1.4k đã bán' },
    { id: 2, name: 'Sữa Chống Nắng Anessa Dưỡng Da Kiềm Dầu 60ml', price: '431.000đ', oldPrice: '700.000đ', discount: '47%', tag: 'DEAL SỐC', rating: '4.9', sold: '1.4k đã bán' },
    { id: 3, name: 'Sữa Chống Nắng Anessa Dưỡng Da Kiềm Dầu 60ml', price: '431.000đ', oldPrice: '700.000đ', discount: '47%', tag: 'DEAL SỐC', rating: '4.9', sold: '1.4k đã bán' },
    { id: 4, name: 'Sữa Chống Nắng Anessa Dưỡng Da Kiềm Dầu 60ml', price: '431.000đ', oldPrice: '700.000đ', discount: '47%', tag: 'DEAL SỐC', rating: '4.9', sold: '1.4k đã bán' },
];

const HomeScreen = ({ navigation }) => {
    const { t } = useLanguage();

    return (
        <ScrollView style={styles.container}>
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
                                <Text style={styles.badgeRed}>HOT</Text>
                            </View>
                            <View style={styles.productPlaceHolder} />
                            <Text style={styles.productBrand}>Obagi</Text>
                            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                            <View style={styles.cardMeta}>
                                <Text style={styles.rating}>⭐ {item.rating}</Text>
                                <Text style={styles.sold}>({item.sold})</Text>
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
                                <Text style={styles.badgeRed}>{item.tag}</Text>
                                {item.discount && <Text style={styles.badgeYellow}>-{item.discount}</Text>}
                            </View>
                            <View style={styles.productPlaceHolder} />
                            <Text style={styles.productBrand}>Anessa</Text>
                            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                            <View style={styles.cardMeta}>
                                <Text style={styles.rating}>⭐ {item.rating}</Text>
                                <Text style={styles.sold}>({item.sold})</Text>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.oldPrice}>{item.oldPrice}</Text>
                                <Text style={styles.productPrice}>{item.price}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Brand Story */}
            <View style={styles.brandSection}>
                <Text style={[styles.sectionTitle, { color: COLORS.mainTitle }]}>{t('brand_story')}</Text>
                <Text style={styles.sectionText}>
                    {t('brand_desc')}
                </Text>
                <TouchableOpacity style={styles.btnSecondary}>
                    <Text style={styles.btnTextSecondary}>{t('explore_more')}</Text>
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
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
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
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    cardBadges: {
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 10,
        flexDirection: 'row',
        gap: 5,
    },
    badgeRed: {
        backgroundColor: COLORS.mainTitle,
        color: 'white',
        fontSize: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 2,
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    badgeYellow: {
        backgroundColor: '#ffc107',
        color: 'black',
        fontSize: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 2,
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    productBrand: {
        fontSize: 11,
        color: '#888',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    productName: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 5,
        color: '#333',
        height: 36, // 2 lines
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    rating: {
        fontSize: 11,
        color: '#ffc107',
        marginRight: 5,
    },
    sold: {
        fontSize: 11,
        color: '#999',
    },
    productPrice: {
        color: COLORS.mainTitle,
        fontWeight: 'bold',
        fontSize: 15,
    },
    oldPrice: {
        textDecorationLine: 'line-through',
        color: '#aaa',
        fontSize: 12,
        marginRight: 6,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    brandSection: {
        padding: 40,
        backgroundColor: 'white',
        alignItems: 'center',
        marginTop: 10,
    },
    sectionText: {
        textAlign: 'center',
        color: '#555',
        lineHeight: 22,
        marginBottom: 20,
    },
    btnSecondary: {
        borderColor: COLORS.mainTitle,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    btnTextSecondary: {
        color: COLORS.mainTitle,
        fontWeight: '600',
    },
});

export default HomeScreen;
