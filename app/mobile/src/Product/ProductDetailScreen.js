import React, { useState } from 'react';
import {
    View, Text, StyleSheet, Image, ScrollView,
    TouchableOpacity, Dimensions, Alert, SafeAreaView
} from 'react-native';
import { COLORS } from '../constants/Theme';
import { useCart } from '../Context/CartContext';
import { useLanguage } from '../i18n/LanguageContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const { t } = useLanguage();
    const { addToCart } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('50ml');

    const images = product.images && product.images.length > 0
        ? product.images
        : [product.image || 'https://via.placeholder.com/400'];

    const handleQuantityChange = (val) => {
        const newVal = quantity + val;
        if (newVal >= 1) setQuantity(newVal);
    };

    const handleAddToCart = () => {
        addToCart({
            id: product.productId || product.id,
            name: product.name,
            price: product.price,
            image: images[0],
            quantity: quantity
        });
        Alert.alert(t('success'), t('add_cart_success'));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
                <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
                    <Ionicons name="cart-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.gallery}>
                    {images.map((img, index) => (
                        <Image key={index} source={{ uri: img }} style={styles.mainImage} resizeMode="contain" />
                    ))}
                </ScrollView>

                <View style={styles.infoContainer}>
                    <Text style={styles.brand}>BKEUTY</Text>
                    <Text style={styles.name}>{product.name}</Text>

                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={16} color="#ffc107" />
                        <Text style={styles.ratingText}>4.8/5 (124 {t('reviews')})</Text>
                    </View>

                    <View style={styles.flashDealBanner}>
                        <View style={styles.flashLeft}>
                            <Ionicons name="flash" size={18} color="white" />
                            <Text style={styles.flashText}>FLASH DEAL</Text>
                        </View>
                        <View style={styles.flashTimer}>
                            <Text style={styles.timerBox}>02</Text>
                            <Text style={{ color: 'white' }}>:</Text>
                            <Text style={styles.timerBox}>45</Text>
                            <Text style={{ color: 'white' }}>:</Text>
                            <Text style={styles.timerBox}>12</Text>
                        </View>
                    </View>

                    <View style={styles.priceBox}>
                        <Text style={styles.currentPrice}>
                            {product.price ? product.price.toLocaleString("vi-VN") : 0}đ
                        </Text>
                        <View style={styles.oldPriceRow}>
                            <Text style={styles.marketPrice}>
                                {((product.price || 0) * 1.2).toLocaleString("vi-VN")}đ
                            </Text>
                            <Text style={styles.discountTag}>-20%</Text>
                        </View>
                    </View>

                    <View style={styles.optionSection}>
                        <Text style={styles.sectionTitle}>{t('capacity')}: {selectedSize}</Text>
                        <View style={styles.optionRow}>
                            {['30ml', '50ml', '75ml'].map(size => (
                                <TouchableOpacity
                                    key={size}
                                    style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnActive]}
                                    onPress={() => setSelectedSize(size)}
                                >
                                    <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>{size}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.optionSection}>
                        <Text style={styles.sectionTitle}>{t('quantity')}</Text>
                        <View style={styles.qtyWrapper}>
                            <TouchableOpacity onPress={() => handleQuantityChange(-1)} style={styles.qtyBtn}>
                                <Text style={styles.qtyBtnText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{quantity}</Text>
                            <TouchableOpacity onPress={() => handleQuantityChange(1)} style={styles.qtyBtn}>
                                <Text style={styles.qtyBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.shipBox}>
                        <View style={styles.shipHeader}>
                            <View style={styles.nowFreeBadge}>
                                <Text style={styles.nowFreeText}>NowFree</Text>
                            </View>
                            <Text style={styles.shipTitle}>{t('fast_delivery_2h')}</Text>
                        </View>
                        <Text style={styles.shipDesc}>
                            Order before 24h to receive by 10AM tomorrow.
                        </Text>
                    </View>

                    <View style={styles.descSection}>
                        <Text style={styles.sectionTitle}>{t('product_details')}</Text>
                        <Text style={styles.descText}>
                            {product.description || "Product description goes here. This is a very good product that helps you..."}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.addCartBtn} onPress={handleAddToCart}>
                    <Ionicons name="cart-outline" size={20} color="#d32f2f" />
                    <Text style={styles.addCartText}>{t('add_to_cart')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buyNowBtn} onPress={() => Alert.alert('Coming Soon')}>
                    <Text style={styles.buyNowMain}>{t('buy_now')}</Text>
                    <Text style={styles.buyNowSub}>NowFree 2H</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: 'white'
    },
    backBtn: {
        padding: 5
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10
    },
    cartBtn: {
        padding: 5
    },
    scrollContent: {
        paddingBottom: 100
    },
    gallery: {
        width: width,
        height: 350,
        backgroundColor: '#fff',
    },
    mainImage: {
        width: width,
        height: 350,
    },
    infoContainer: {
        padding: 15,
    },
    brand: {
        color: '#999',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 5
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        lineHeight: 28
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    ratingText: {
        marginLeft: 5,
        color: '#666',
        fontSize: 13
    },
    flashDealBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ff5722',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20
    },
    flashLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    flashText: {
        color: 'white',
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 16
    },
    flashTimer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
    },
    timerBox: {
        backgroundColor: 'black',
        color: 'white',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 'bold'
    },
    priceBox: {
        marginBottom: 20
    },
    currentPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 5
    },
    oldPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    marketPrice: {
        textDecorationLine: 'line-through',
        color: '#999',
        marginRight: 10,
        fontSize: 14
    },
    discountTag: {
        color: '#d32f2f',
        fontWeight: 'bold',
        fontSize: 14,
        backgroundColor: '#ffebee',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    },
    optionSection: {
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333'
    },
    optionRow: {
        flexDirection: 'row',
        gap: 10
    },
    sizeBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        minWidth: 60,
        alignItems: 'center'
    },
    sizeBtnActive: {
        borderColor: '#d32f2f',
        backgroundColor: '#d32f2f'
    },
    sizeText: {
        color: '#333'
    },
    sizeTextActive: {
        color: 'white',
        fontWeight: 'bold'
    },
    qtyWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        alignSelf: 'flex-start',
        height: 40
    },
    qtyBtn: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#f9f9f9'
    },
    qtyBtnText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    qtyValue: {
        width: 50,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold'
    },
    shipBox: {
        backgroundColor: '#f1f8e9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#c5e1a5'
    },
    shipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    nowFreeBadge: {
        backgroundColor: '#ff9800',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8
    },
    nowFreeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
        fontStyle: 'italic'
    },
    shipTitle: {
        color: '#2e7d32',
        fontWeight: 'bold',
        fontSize: 14
    },
    shipDesc: {
        color: '#555',
        fontSize: 13,
        lineHeight: 18
    },
    descSection: {
        marginBottom: 20
    },
    descText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#444'
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        elevation: 10,
        gap: 10
    },
    addCartBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#d32f2f',
        borderRadius: 8,
        height: 48,
        backgroundColor: 'white',
        gap: 5
    },
    addCartText: {
        color: '#d32f2f',
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase'
    },
    buyNowBtn: {
        flex: 1.5,
        backgroundColor: '#d32f2f',
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buyNowMain: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'uppercase'
    },
    buyNowSub: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 11
    }
});

export default ProductDetailScreen;
