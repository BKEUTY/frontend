import React, { useState, useEffect } from 'react';
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
import { CButton } from '../Component/Common';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const { t } = useLanguage();
    const { addToCart } = useCart();

    const [productDetail, setProductDetail] = useState(product);
    const [isLoading, setIsLoading] = useState(false);
    const [variants, setVariants] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [currentVariant, setCurrentVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const fetchProductDetail = async () => {
        const productId = product.productId || product.id;
        if (!productId) return;

        setIsLoading(true);
        try {
            const res = await productApi.getById(productId);
            if (res.data) {
                const found = res.data;
                const fetchedVariants = found.variants || [];

                const mappedVariants = fetchedVariants.map(v => ({
                    ...v,
                    id: v.id,
                    price: parseFloat(v.price) || 0,
                    stockQuantity: v.stockQuantity || 0,
                    productImageUrl: v.productImageUrl,
                    productVariantName: v.productVariantName,
                    variantOptions: v.variantOptions || {}
                }));

                let derivedOptions = found.options || [];
                if (derivedOptions.length === 0) {
                    const optionsMap = {};
                    mappedVariants.forEach(v => {
                        if (v.variantOptions) {
                            Object.entries(v.variantOptions).forEach(([name, val]) => {
                                if (!optionsMap[name]) optionsMap[name] = new Set();
                                optionsMap[name].add(val);
                            });
                        }
                    });

                    derivedOptions = Object.entries(optionsMap).map(([name, valuesSet]) => ({
                        name: name,
                        values: Array.from(valuesSet)
                    }));
                }

                setProductDetail({
                    ...found,
                    productId: found.id,
                    images: found.image ? [found.image] : [],
                    options: derivedOptions,
                    variants: mappedVariants
                });
                setVariants(mappedVariants);

                if (derivedOptions.length > 0) {
                    const initialSelected = {};
                    derivedOptions.forEach(opt => {
                        if (opt.values.length > 0) initialSelected[opt.name] = opt.values[0];
                    });
                    setSelectedOptions(initialSelected);
                } else if (mappedVariants.length > 0) {
                    setCurrentVariant(mappedVariants[0]);
                }
            }
        } catch (err) {
            console.error("Fetch product detail error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetail();
    }, [product]);

    useEffect(() => {
        if (variants.length > 0 && Object.keys(selectedOptions).length > 0) {
            const match = variants.find(v => {
                const vOpts = v.variantOptions || {};
                
                // Compare all selected options with variant options (case-insensitive)
                return Object.entries(selectedOptions).every(([name, selectedVal]) => {
                    const vVal = vOpts[name];
                    if (!vVal || !selectedVal) return false;
                    return vVal.toString().toLowerCase().trim() === selectedVal.toString().toLowerCase().trim();
                });
            });
            setCurrentVariant(match || null);
        }
    }, [selectedOptions, variants]);

    const images = [];
    if (currentVariant && currentVariant.productImageUrl) {
        images.push(currentVariant.productImageUrl);
    }
    if (productDetail.images && productDetail.images.length > 0) {
        productDetail.images.forEach(img => {
            if (!images.includes(img)) images.push(img);
        });
    } else if (productDetail.image) {
        if (!images.includes(productDetail.image)) images.push(productDetail.image);
    }
    
    if (images.length === 0) {
        images.push('https://via.placeholder.com/400');
    }

    const handleQuantityChange = (val) => {
        const newVal = quantity + val;
        if (newVal >= 1) setQuantity(newVal);
    };

    const handleAddToCart = () => {
        const itemToCart = {
            id: currentVariant ? currentVariant.id : (productDetail.productId || productDetail.id),
            name: currentVariant ? `${productDetail.name} - ${currentVariant.productVariantName}` : productDetail.name,
            price: currentVariant ? currentVariant.price : (productDetail.price || 0),
            image: (currentVariant && currentVariant.productImageUrl) ? currentVariant.productImageUrl : images[0],
            quantity: quantity,
            isVariant: !!currentVariant
        };
        addToCart(itemToCart);
        Alert.alert(t('success'), t('add_cart_success'));
    };

    const isOutOfStock = currentVariant ? currentVariant.stockQuantity === 0 : false;

    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        const index = Math.floor(contentOffset / viewSize);
        setActiveImageIndex(index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{productDetail.name}</Text>
                <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')} activeOpacity={0.7}>
                    <Ionicons name="cart-outline" size={24} color="#111827" />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.mainTitle} />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.imageContainer}>
                            <ScrollView 
                                horizontal 
                                pagingEnabled 
                                showsHorizontalScrollIndicator={false} 
                                style={styles.gallery}
                                onScroll={handleScroll}
                                scrollEventThrottle={16}
                            >
                                {images.map((img, index) => (
                                    <Image key={index} source={{ uri: img }} style={styles.mainImage} resizeMode="cover" />
                                ))}
                            </ScrollView>
                            <View style={styles.galleryDots}>
                                {images.map((_, i) => (
                                    <View key={i} style={[styles.dot, activeImageIndex === i && styles.activeDot]} />
                                ))}
                            </View>
                        </View>

                        <View style={styles.infoContainer}>
                            <View style={styles.brandRow}>
                                <Text style={styles.brand}>BKEUTY PREMIUM</Text>
                                <View style={styles.ratingRow}>
                                    <Ionicons name="star" size={14} color="#fbbf24" />
                                    <Text style={styles.ratingText}>4.8</Text>
                                </View>
                            </View>
                            <Text style={styles.name}>{productDetail.name}</Text>

                            <LinearGradient
                                colors={['#fff1f2', '#fff']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.priceContainer}
                            >
                                <View style={styles.priceBox}>
                                    <Text style={styles.currentPrice}>
                                        {(currentVariant ? currentVariant.price : (productDetail.price || 0)).toLocaleString("vi-VN")}đ
                                    </Text>
                                    <Text style={styles.vatText}>{t('vat_included')}</Text>
                                </View>
                                <View style={styles.soldBox}>
                                    <Text style={styles.soldText}>{t('sold_count')}: 1.2k</Text>
                                </View>
                            </LinearGradient>

                            {(productDetail.options || []).map((opt, optIndex) => (
                                <View key={optIndex} style={styles.optionSection}>
                                    <View style={styles.optionLabelRow}>
                                        <View style={styles.sectionIcon}>
                                            <Ionicons name={opt.name.toLowerCase().includes('color') ? 'color-palette-outline' : 'layers-outline'} size={16} color={COLORS.mainTitle} />
                                        </View>
                                        <Text style={styles.sectionTitle}>{opt.name}</Text>
                                        <Text style={styles.selectedOptionText}>: {selectedOptions[opt.name]}</Text>
                                    </View>
                                    <View style={styles.optionRow}>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 5 }}>
                                            {opt.values.map((v, valIndex) => (
                                                <TouchableOpacity
                                                    key={valIndex}
                                                    activeOpacity={0.8}
                                                    style={[
                                                        styles.sizeBtn,
                                                        selectedOptions[opt.name] === v && styles.sizeBtnActive
                                                    ]}
                                                    onPress={() => setSelectedOptions(prev => ({ ...prev, [opt.name]: v }))}
                                                >
                                                    <Text style={[
                                                        styles.sizeText,
                                                        selectedOptions[opt.name] === v && styles.sizeTextActive
                                                    ]}>{v}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                </View>
                            ))}

                            <View style={styles.qtySection}>
                                <Text style={styles.sectionTitle}>{t('quantity')}</Text>
                                <View style={styles.qtyWrapper}>
                                    <TouchableOpacity 
                                        onPress={() => handleQuantityChange(-1)} 
                                        style={styles.qtyBtn}
                                        activeOpacity={0.6}
                                    >
                                        <Ionicons name="remove" size={18} color="#4b5563" />
                                    </TouchableOpacity>
                                    <Text style={styles.qtyValue}>{quantity}</Text>
                                    <TouchableOpacity 
                                        onPress={() => handleQuantityChange(1)} 
                                        style={styles.qtyBtn}
                                        activeOpacity={0.6}
                                    >
                                        <Ionicons name="add" size={18} color="#4b5563" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ marginBottom: 20 }}>
                                <Text style={{ color: '#6b7280', fontSize: 13 }}>
                                    {t('in_stock_label')}: <Text style={{ fontWeight: '700', color: '#111827' }}>{currentVariant ? currentVariant.stockQuantity : 0}</Text> {t('items_available')}
                                </Text>
                            </View>

                            <LinearGradient
                                colors={['#fff5f7', '#fff']}
                                style={styles.shipBox}
                            >
                                <View style={styles.shipHeader}>
                                    <LinearGradient
                                        colors={['#ef4444', '#b91c1c']}
                                        style={styles.nowFreeBadge}
                                    >
                                        <Text style={styles.nowFreeText}>{t('now_free_badge')}</Text>
                                    </LinearGradient>
                                    <Text style={styles.shipTitle}>{t('fast_delivery_2h')}</Text>
                                </View>
                                <Text style={styles.shipDesc}>
                                    {t('fast_delivery_details_ext')}
                                </Text>
                            </LinearGradient>

                            <View style={styles.descSection}>
                                <View style={styles.sectionHeaderRow}>
                                    <Text style={styles.sectionTitlePremium}>{t('product_details')}</Text>
                                    <Ionicons name="chevron-down" size={20} color="#9ca3af" />
                                </View>
                                <Text style={styles.descText}>
                                    {productDetail.description || "Product description goes here..."}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.bottomBar}>
                        <CButton
                            type="outline"
                            title={isOutOfStock ? t('out_of_stock_btn') : t('add_to_cart')}
                            onPress={handleAddToCart}
                            disabled={isOutOfStock}
                            icon={<Ionicons name="cart-outline" size={20} color={isOutOfStock ? '#9ca3af' : COLORS.mainTitle} />}
                            style={styles.cartBtnMain}
                            textStyle={{ fontSize: 13, fontWeight: '700' }}
                        />
                        
                        <CButton
                            type="primary"
                            title={isOutOfStock ? t('out_of_stock_btn') : t('buy_now')}
                            onPress={() => navigation.navigate('Cart')}
                            disabled={isOutOfStock}
                            style={styles.buyBtnMain}
                        />
                    </View>
                </View>
            )}
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
        height: 56,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginHorizontal: 10
    },
    cartBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollContent: {
        paddingBottom: 100
    },
    imageContainer: {
        width: width,
        height: width,
        position: 'relative',
    },
    gallery: {
        width: width,
        height: width,
    },
    mainImage: {
        width: width,
        height: width,
    },
    galleryDots: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    activeDot: {
        width: 18,
        backgroundColor: COLORS.mainTitle,
    },
    infoContainer: {
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white',
        marginTop: -30,
    },
    brandRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    brand: {
        color: COLORS.mainTitle,
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#fef3c7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        color: '#92400e',
        fontSize: 12,
        fontWeight: '700',
    },
    name: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 16,
        lineHeight: 30,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
    },
    priceBox: {
        flex: 1,
    },
    currentPrice: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.mainTitle,
    },
    vatText: {
        fontSize: 11,
        color: '#9ca3af',
        marginTop: 2,
    },
    soldBox: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    soldText: {
        fontSize: 12,
        color: '#4b5563',
        fontWeight: '600',
    },
    optionSection: {
        marginBottom: 24,
    },
    optionLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff1f2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
    },
    selectedOptionText: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.mainTitle,
    },
    optionRow: {
        flexDirection: 'row',
    },
    sizeBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        marginRight: 10,
        backgroundColor: 'white',
    },
    sizeBtnActive: {
        borderColor: COLORS.mainTitle,
        backgroundColor: COLORS.mainTitle,
    },
    sizeText: {
        color: '#4b5563',
        fontWeight: '600',
        fontSize: 14,
    },
    sizeTextActive: {
        color: 'white',
        fontWeight: '700',
    },
    qtySection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    qtyWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        padding: 4,
    },
    qtyBtn: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    qtyValue: {
        width: 44,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
    },
    shipBox: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    shipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    nowFreeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 10,
    },
    nowFreeText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 11,
    },
    shipTitle: {
        color: COLORS.mainTitle,
        fontWeight: '800',
        fontSize: 15,
    },
    shipDesc: {
        color: '#6b7280',
        fontSize: 13,
        lineHeight: 20,
    },
    descSection: {
        marginBottom: 20,
        backgroundColor: '#f9fafb',
        padding: 20,
        borderRadius: 15,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitlePremium: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
    },
    descText: {
        fontSize: 14,
        lineHeight: 24,
        color: '#4b5563',
    },
    bottomBar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        gap: 12,
    },
    cartBtnMain: {
        flex: 1,
        height: 52,
    },
    buyBtnMain: {
        flex: 1.5,
        height: 52,
    }
});

export default ProductDetailScreen;
