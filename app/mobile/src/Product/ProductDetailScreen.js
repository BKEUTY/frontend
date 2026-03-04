import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, Image, ScrollView,
    TouchableOpacity, Dimensions, Alert, SafeAreaView,
    ActivityIndicator
} from 'react-native';
import productApi from '../api/productApi';
import { COLORS } from '../constants/Theme';
import { useCart } from '../Context/CartContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const { t } = useLanguage();
    const { addToCart } = useCart();

    const [variants, setVariants] = useState([]);
    const [isLoadingVariants, setIsLoadingVariants] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [currentVariant, setCurrentVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const productOptions = product.options || [];

    useEffect(() => {
        const fetchVariants = async () => {
            try {
                const res = await productApi.getVariants(product.productId || product.id);
                setVariants(res.data || []);
            } catch (err) {
                // Silently handle error for better UX
            } finally {
                setIsLoadingVariants(false);
            }
        };
        fetchVariants();
    }, [product]);

    useEffect(() => {
        if (productOptions.length > 0) {
            const initialOptions = {};
            productOptions.forEach(opt => {
                if (opt.optionValues && opt.optionValues.length > 0) {
                    initialOptions[opt.optionName] = opt.optionValues[0];
                }
            });
            setSelectedOptions(initialOptions);
        }
    }, [product]);

    useEffect(() => {
        if (variants.length > 0 && Object.keys(selectedOptions).length > 0) {
            const match = variants.find(v => {
                if (!v.optionValues || v.optionValues.length === 0) return false;
                return productOptions.every(opt => {
                    const selectedVal = selectedOptions[opt.optionName]?.toString().toLowerCase().trim();
                    if (!selectedVal) return true;
                    return v.optionValues.some(vOpt => vOpt?.toString().toLowerCase().trim() === selectedVal);
                });
            });
            setCurrentVariant(match || null);
        }
    }, [selectedOptions, variants]);

    const images = product.images && product.images.length > 0
        ? product.images
        : [product.image || 'https://via.placeholder.com/400'];

    const handleQuantityChange = (val) => {
        const newVal = quantity + val;
        if (newVal >= 1) setQuantity(newVal);
    };

    const handleAddToCart = () => {
        const itemToCart = {
            id: currentVariant ? currentVariant.id : (product.productId || product.id),
            name: currentVariant ? `${product.name} - ${currentVariant.productVariantName || currentVariant.displayVariantName}` : product.name,
            price: currentVariant ? currentVariant.price : (product.price || 0),
            image: (currentVariant && currentVariant.productImageUrl) ? currentVariant.productImageUrl : images[0],
            quantity: quantity,
            isVariant: !!currentVariant
        };
        addToCart(itemToCart);
        Alert.alert(t('success'), t('add_cart_success'));
    };

    const isOutOfStock = currentVariant ? currentVariant.stockQuantity === 0 : false;

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


                    <View style={styles.priceBox}>
                        <Text style={styles.currentPrice}>
                            {(currentVariant ? currentVariant.price : (product.price || 0)).toLocaleString("vi-VN")}đ
                        </Text>
                        {isLoadingVariants && <ActivityIndicator size="small" color={COLORS.mainTitle} style={{ alignSelf: 'flex-start', marginTop: 5 }} />}
                    </View>

                    {productOptions.map((opt, idx) => (
                        <View key={idx} style={styles.optionSection}>
                            <View style={styles.optionLabelRow}>
                                <Text style={styles.sectionTitle}>{opt.optionName}</Text>
                                <Text style={styles.selectedOptionText}>: {selectedOptions[opt.optionName]}</Text>
                            </View>
                            <View style={styles.optionRow}>
                                {opt.optionValues.map(val => (
                                    <TouchableOpacity
                                        key={val}
                                        style={[
                                            styles.sizeBtn,
                                            selectedOptions[opt.optionName]?.toString().toLowerCase().trim() === val?.toString().toLowerCase().trim() && styles.sizeBtnActive
                                        ]}
                                        onPress={() => setSelectedOptions(prev => ({ ...prev, [opt.optionName]: val }))}
                                    >
                                        <Text style={[
                                            styles.sizeText,
                                            selectedOptions[opt.optionName]?.toString().toLowerCase().trim() === val?.toString().toLowerCase().trim() && styles.sizeTextActive
                                        ]}>{val}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}

                    {currentVariant && (
                        <View style={styles.selectedVariantBox}>
                            <Text style={styles.selectedVariantLabel}>{t('variant_selected_label')}: </Text>
                            <Text style={styles.selectedVariantValue}>
                                {currentVariant.optionValues ? currentVariant.optionValues.join(' - ') : currentVariant.productVariantName}
                            </Text>
                        </View>
                    )}

                    <View style={{ marginBottom: 15, paddingHorizontal: 5 }}>
                        <Text style={{ color: '#666', fontSize: 13 }}>
                            {t('in_stock_label')}: <Text style={{ fontWeight: 'bold', color: '#333' }}>{currentVariant ? currentVariant.stockQuantity : 0}</Text> {t('items_available')}
                        </Text>
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
                                <Text style={styles.nowFreeText}>{t('now_free_badge')}</Text>
                            </View>
                            <Text style={styles.shipTitle}>{t('fast_delivery_2h')}</Text>
                        </View>
                        <Text style={styles.shipDesc}>
                            {t('fast_delivery_details_ext')}
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
                <TouchableOpacity
                    style={[styles.addCartBtn, isOutOfStock && styles.disabledBtnOutline]}
                    onPress={handleAddToCart}
                    disabled={isOutOfStock}
                >
                    <Ionicons name="cart-outline" size={20} color={isOutOfStock ? '#999' : COLORS.mainTitle} />
                    <Text style={[styles.addCartText, isOutOfStock && { color: '#999' }]}>{isOutOfStock ? t('out_of_stock_btn') : t('add_to_cart')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buyNowBtn, isOutOfStock && styles.disabledBtnSolid]}
                    onPress={() => Alert.alert('Coming Soon')}
                    disabled={isOutOfStock}
                >
                    <Text style={styles.buyNowMain}>{isOutOfStock ? t('out_of_stock_btn') : t('buy_now')}</Text>
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
    priceBox: {
        marginBottom: 20
    },
    currentPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
        marginBottom: 5
    },
    optionSection: {
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333'
    },
    optionLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    selectedOptionText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.mainTitle
    },
    selectedVariantBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0'
    },
    selectedVariantLabel: {
        fontSize: 14,
        color: '#64748b'
    },
    selectedVariantValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.mainTitle
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
        borderColor: COLORS.mainTitle,
        backgroundColor: COLORS.mainTitle
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
        backgroundColor: '#fdf2f6',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.mainTitle
    },
    shipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    nowFreeBadge: {
        backgroundColor: COLORS.mainTitle,
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
        color: COLORS.mainTitle,
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
        borderColor: COLORS.mainTitle,
        borderRadius: 8,
        height: 48,
        backgroundColor: 'white',
        gap: 5
    },
    addCartText: {
        color: COLORS.mainTitle,
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase'
    },
    buyNowBtn: {
        flex: 1.5,
        backgroundColor: COLORS.mainTitle,
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
        display: 'none'
    },
    disabledBtnOutline: {
        borderColor: '#ccc',
        backgroundColor: '#f5f5f5'
    },
    disabledBtnSolid: {
        backgroundColor: '#ccc'
    }
});

export default ProductDetailScreen;
