import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, Image, ScrollView,
    TouchableOpacity, Dimensions, Alert, SafeAreaView,
    ActivityIndicator
} from 'react-native';
import productApi from '../../api/productApi';
import { COLORS } from '../../constants/Theme';
import { useCart } from '../../Context/CartContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { CButton } from '../../Component/Common';
import { LinearGradient } from 'expo-linear-gradient';
import { getImageUrl } from '../../api/axiosClient';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const { t, language } = useLanguage();
    const { addToCart } = useCart();

    const [productDetail, setProductDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [variants, setVariants] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [currentVariant, setCurrentVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('details');
    const [relatedProducts, setRelatedProducts] = useState([]);

    const localizedContent = {
        en: {
            details: "This product is formulated with natural ingredients to provide the best results for your skin health and beauty.",
            application: "1. Cleanse your skin.\n2. Apply a proper amount to the targeted area.\n3. Massage gently until absorbed.",
            ingredients: "Aqua, Glycerin, Botanical Extracts, Vitamins, Natural Oils.",
            benefits_list: ["Revitalizing", "Repairing", "Moisturizing"]
        },
        vi: {
            details: "Sản phẩm được chiết xuất từ thành phần tự nhiên, giúp nuôi dưỡng làn da khỏe mạnh và rạng rỡ từ bên trong.",
            application: "1. Làm sạch da.\n2. Thoa một lượng vừa đủ lên vùng da cần chăm sóc.\n3. Massage nhẹ nhàng để dưỡng chất thấm sâu.",
            ingredients: "Nước khoáng, Glycerin, Chiết xuất thảo mộc, Vitamin, Tinh dầu tự nhiên.",
            benefits_list: ["Tái Tạo", "Phục Hồi", "Dưỡng Ẩm"]
        }
    };

    const currentLang = language === 'vi' ? 'vi' : 'en';
    const content = localizedContent[currentLang];

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
                    price: parseFloat(v.price) || 0,
                    stockQuantity: v.stockQuantity || 0
                }));

                setProductDetail(found);
                setVariants(mappedVariants);

                if (found.options?.length > 0) {
                    const initialSelected = {};
                    found.options.forEach(opt => {
                        if (opt.values?.length > 0) initialSelected[opt.name] = opt.values[0];
                    });
                    setSelectedOptions(initialSelected);
                } else if (mappedVariants.length > 0) {
                    setCurrentVariant(mappedVariants[0]);
                }
            }

            // Fetch related products (using same category if available)
            const relatedRes = await productApi.getAll(0, null, res.data?.categories?.[0]?.id);
            if (relatedRes.data) {
                setRelatedProducts(relatedRes.data.content?.filter(p => p.id !== productId).slice(0, 6) || []);
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
                return Object.entries(selectedOptions).every(([name, selectedVal]) => {
                    const vVal = vOpts[name];
                    return vVal?.toString().toLowerCase() === selectedVal?.toString().toLowerCase();
                });
            });
            setCurrentVariant(match || null);
        }
    }, [selectedOptions, variants]);

    const images = [];
    if (currentVariant && currentVariant.productImageUrl) {
        images.push(currentVariant.productImageUrl);
    }
    if (productDetail?.images?.length > 0) {
        productDetail.images.forEach(img => { if (!images.includes(img)) images.push(img); });
    } else if (productDetail?.image) {
        if (!images.includes(productDetail.image)) images.push(productDetail.image);
    }
    if (images.length === 0) images.push('https://via.placeholder.com/400');

    const handleQuantityChange = (val) => {
        const newVal = quantity + val;
        if (newVal >= 1) setQuantity(newVal);
    };

    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        const index = Math.floor(contentOffset / viewSize);
        setActiveImageIndex(index);
    };

    const handleAddToCart = () => {
        const selectedVariantId = currentVariant?.id || (variants.length > 0 ? variants[0].id : (productDetail.productId || productDetail.id));
        
        const itemToCart = {
            productVariantId: selectedVariantId,
            id: selectedVariantId,
            cartId: `local_${Date.now()}`,
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
    const isAdminPreview = route.params?.isPreview || false;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return <Text style={styles.tabContentText}>{productDetail?.description || content.details}</Text>;
            case 'application':
                return <Text style={styles.tabContentText}>{content.application}</Text>;
            case 'ingredients':
                return <Text style={styles.tabContentText}>{content.ingredients}</Text>;
            case 'reviews':
                return (
                    <View>
                        <View style={styles.reviewOverview}>
                            <View style={styles.ratingBigBox}>
                                <Text style={styles.bigRating}>4.8</Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map(s => <Ionicons key={s} name="star" size={12} color="#f59e0b" />)}
                                </View>
                                <Text style={styles.totalReviewText}>128 {t('reviews')}</Text>
                            </View>
                            <View style={styles.ratingBars}>
                                {[5, 4, 3, 2, 1].map(r => (
                                    <View key={r} style={styles.barRow}>
                                        <Text style={styles.barLabel}>{r} ★</Text>
                                        <View style={styles.barBg}>
                                            <View style={[styles.barFill, { width: r === 5 ? '80%' : (r === 4 ? '15%' : '5%') }]} />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.mainTitle} /></View>;
    if (!productDetail) return <View style={styles.center}><Text>{t('no_data')}</Text></View>;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{productDetail.name}</Text>
                <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
                    <Ionicons name="cart-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={{ width: width, height: width }}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {images.map((img, index) => (
                            <Image key={index} source={{ uri: getImageUrl(img) }} style={styles.mainImage} resizeMode="cover" />
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
                        </View>
                        <View style={styles.soldBox}>
                            <Text style={styles.soldText}>{t('sold_count')}: 1.2k</Text>
                        </View>
                    </LinearGradient>

                    {(productDetail.options || []).map((opt, optIndex) => (
                        <View key={optIndex} style={styles.optionSection}>
                            <View style={styles.optionLabelRow}>
                                <Text style={styles.sectionTitle}>{opt.name}</Text>
                                <Text style={styles.selectedOptionText}>: {selectedOptions[opt.name]}</Text>
                            </View>
                            <View style={styles.optionRow}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {opt.values?.map((v, valIndex) => (
                                        <TouchableOpacity
                                            key={valIndex}
                                            style={[styles.sizeBtn, selectedOptions[opt.name] === v && styles.sizeBtnActive]}
                                            onPress={() => setSelectedOptions(prev => ({ ...prev, [opt.name]: v }))}
                                        >
                                            <Text style={[styles.sizeText, selectedOptions[opt.name] === v && styles.sizeTextActive]}>{v}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    ))}

                    <View style={styles.qtySection}>
                        <Text style={styles.sectionTitle}>{t('quantity')}</Text>
                        <View style={styles.qtyWrapper}>
                            <TouchableOpacity onPress={() => handleQuantityChange(-1)} style={styles.qtyBtn}>
                                <Ionicons name="remove" size={18} color="#4b5563" />
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{quantity}</Text>
                            <TouchableOpacity onPress={() => handleQuantityChange(1)} style={styles.qtyBtn}>
                                <Ionicons name="add" size={18} color="#4b5563" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ color: '#6b7280', fontSize: 13 }}>
                            {t('in_stock_label')}: <Text style={{ fontWeight: '700', color: '#111827' }}>{currentVariant ? currentVariant.stockQuantity : 0}</Text> {t('items_available')}
                        </Text>
                    </View>

                    <View style={styles.tabSection}>
                        <View style={styles.tabHeaders}>
                            {['details', 'application', 'ingredients', 'reviews'].map(tab => (
                                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}>
                                    <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>{t(tab)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.tabBody}>
                            {renderTabContent()}
                        </View>
                    </View>

                    {relatedProducts.length > 0 && (
                        <View style={styles.relatedSection}>
                            <Text style={styles.sectionTitle}>{t('related_products')}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {relatedProducts.map(p => (
                                    <TouchableOpacity key={p.id} onPress={() => navigation.push('ProductDetail', { product: p })} style={styles.relatedCard}>
                                        <Image source={{ uri: getImageUrl(p.image) }} style={styles.relatedImage} />
                                        <Text style={styles.relatedName} numberOfLines={1}>{p.name}</Text>
                                        <Text style={styles.relatedPrice}>{p.variants?.[0]?.price?.toLocaleString()}đ</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.bottomActions}>
                <TouchableOpacity 
                    style={[styles.cartActionBtn, (isOutOfStock || isAdminPreview) && styles.disabledBtn]} 
                    onPress={handleAddToCart}
                    disabled={isOutOfStock || isAdminPreview}
                >
                    <Ionicons name="cart-outline" size={20} color={isOutOfStock || isAdminPreview ? '#9ca3af' : COLORS.mainTitle} />
                    <Text style={[styles.cartActionText, (isOutOfStock || isAdminPreview) && { color: '#9ca3af' }]}>{t('add_to_cart')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.buyActionBtn, (isOutOfStock || isAdminPreview) && styles.disabledBtn]} 
                    onPress={handleBuyNow}
                    disabled={isOutOfStock || isAdminPreview}
                >
                    <Text style={styles.buyActionText}>{t('buy_now')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 56, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#111827' },
    cartBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
    scrollContent: { paddingBottom: 100 },
    imageContainer: { width: width, height: width, position: 'relative' },
    mainImage: { width: width, height: width },
    galleryDots: { position: 'absolute', bottom: 20, flexDirection: 'row', width: '100%', justifyContent: 'center', gap: 6 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.1)' },
    activeDot: { width: 18, backgroundColor: COLORS.mainTitle },
    infoContainer: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: 'white', marginTop: -30 },
    brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    brand: { color: COLORS.mainTitle, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    ratingText: { color: '#92400e', fontSize: 12, fontWeight: '700' },
    name: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 16, lineHeight: 30 },
    priceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 24 },
    priceBox: { flex: 1 },
    currentPrice: { fontSize: 28, fontWeight: '900', color: COLORS.mainTitle },
    vatText: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
    soldBox: { backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    soldText: { fontSize: 12, color: '#4b5563', fontWeight: '600' },
    optionSection: { marginBottom: 20 },
    optionLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: '#374151' },
    selectedOptionText: { fontSize: 15, fontWeight: '700', color: COLORS.mainTitle },
    optionRow: { flexDirection: 'row' },
    sizeBtn: { paddingVertical: 10, paddingHorizontal: 20, borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, marginRight: 10 },
    sizeBtnActive: { borderColor: COLORS.mainTitle, backgroundColor: COLORS.mainTitle },
    sizeText: { color: '#4b5563', fontWeight: '600', fontSize: 14 },
    sizeTextActive: { color: 'white', fontWeight: '700' },
    qtySection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    qtyWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, padding: 4 },
    qtyBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 10 },
    qtyValue: { width: 44, textAlign: 'center', fontSize: 16, fontWeight: '800', color: '#111827' },
    tabSection: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
    tabHeaders: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    tabBtn: { paddingVertical: 15, marginRight: 25, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabBtnActive: { borderBottomColor: COLORS.mainTitle },
    tabBtnText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
    tabBtnTextActive: { color: COLORS.mainTitle },
    tabBody: { paddingVertical: 20 },
    tabContentText: { fontSize: 14, lineHeight: 22, color: '#4b5563' },
    reviewOverview: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 15, borderRadius: 12, gap: 20 },
    ratingBigBox: { alignItems: 'center', minWidth: 80 },
    bigRating: { fontSize: 32, fontWeight: '800', color: COLORS.mainTitle },
    starsRow: { flexDirection: 'row' },
    totalReviewText: { fontSize: 11, color: '#64748b', marginTop: 4 },
    ratingBars: { flex: 1 },
    barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 10 },
    barLabel: { fontSize: 10, color: '#64748b', width: 25 },
    barBg: { flex: 1, height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden' },
    barFill: { height: '100%', backgroundColor: COLORS.mainTitle },
    relatedSection: { marginTop: 30 },
    relatedCard: { width: 140, marginRight: 15 },
    relatedImage: { width: 140, height: 140, borderRadius: 12, backgroundColor: '#f8fafc' },
    relatedName: { fontSize: 13, fontWeight: '600', color: '#333', marginTop: 8 },
    relatedPrice: { fontSize: 14, fontWeight: '700', color: COLORS.mainTitle, marginTop: 4 },
    bottomActions: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 15, flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
    cartActionBtn: { flex: 1, height: 52, borderRadius: 12, borderWidth: 1, borderColor: COLORS.mainTitle, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
    cartActionText: { color: COLORS.mainTitle, fontWeight: '700' },
    buyActionBtn: { flex: 1.5, height: 52, borderRadius: 12, backgroundColor: COLORS.mainTitle, justifyContent: 'center', alignItems: 'center' },
    buyActionText: { color: 'white', fontWeight: '700', fontSize: 16 },
    disabledBtn: { backgroundColor: '#f3f4f6', borderColor: '#f3f4f6' },
});

export default ProductDetailScreen;
