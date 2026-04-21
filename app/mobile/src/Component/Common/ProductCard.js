import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/Theme';
import { getImageUrl } from '../../api/axiosClient';

const { width } = Dimensions.get('window');
const GRID_WIDTH = (width - 45) / 2;

const ProductCard = ({
    item,
    onPress,
    onAddToCart,
    layout = 'grid',
    showRating = true,
    showAddToCart = true
}) => {
    const { t } = useLanguage();
    const isGrid = layout === 'grid';
    const cardStyle = isGrid ? styles.gridCard : styles.horizontalCard;
    const imageStyle = isGrid ? styles.gridImageContainer : styles.horizontalImageContainer;

    return (
        <TouchableOpacity
            style={cardStyle}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={imageStyle}>
                {item.image ? (
                    <Image 
                        source={{ uri: getImageUrl(item.image) }} 
                        style={styles.image} 
                        resizeMode="cover" 
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="image-outline" size={40} color="#e5e7eb" />
                    </View>
                )}

                <View style={styles.badgeContainer}>
                    {item.hasDiscount && (
                        <LinearGradient
                            colors={['#ec4899', '#be185d']}
                            style={styles.discountBadge}
                        >
                            <Text style={styles.discountText}>{t('promotion')}</Text>
                        </LinearGradient>
                    )}
                </View>
            </View>

            <View style={styles.infoContainer}>
                <View>
                    <Text style={styles.brandText}>{item.brand?.toUpperCase() || 'BKEUTY'}</Text>
                    <Text style={styles.nameText} numberOfLines={2}>{item.name}</Text>

                    {item.categories && item.categories.length > 0 && (
                        <View style={styles.catContainer}>
                            {item.categories.slice(0, 1).map((cat, idx) => (
                                <View key={cat.id || idx} style={styles.catPill}>
                                    <Text style={styles.catPillText}>{cat.categoryName}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {showRating && (
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={10} color="#ffc107" />
                            <Text style={styles.ratingValue}>{Number(item.averageRating || 0).toFixed(1)}</Text>
                            <Text style={styles.ratingCount}>({item.ratingCount || 0})</Text>
                        </View>
                    )}
                </View>

                <View style={styles.footerContainer}>
                    <View style={styles.priceRow}>
                        <View>
                            {item.hasDiscount && (
                                <Text style={styles.oldPriceText}>
                                    {item.oldPrice?.toLocaleString("vi-VN")}đ
                                </Text>
                            )}
                            <Text style={[styles.priceText, item.hasDiscount && styles.discountedPrice]}>
                                {item.price?.toLocaleString("vi-VN")}đ
                            </Text>
                        </View>

                        {showAddToCart && onAddToCart && (
                            <TouchableOpacity style={styles.addToCartBtn} onPress={() => onAddToCart(item)}>
                                <Ionicons name="add" size={20} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.metaRow}>
                        <View style={[styles.stockBadge, item.stockQuantity > 0 ? styles.inStock : styles.outOfStock]}>
                            <Text style={[styles.stockText, item.stockQuantity > 0 ? styles.inStockText : styles.outOfStockText]}>
                                {item.stockQuantity > 0 ? `${t('in_stock')} ${item.stockQuantity}` : t('out_of_stock_btn')}
                            </Text>
                        </View>
                        <Text style={styles.soldText}>
                            {t('sold')} {item.sold || 0}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    gridCard: {
        width: GRID_WIDTH,
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        overflow: 'hidden',
    },
    gridImageContainer: {
        width: '100%',
        height: 180,
        backgroundColor: '#f8fafc',
        position: 'relative',
    },
    horizontalCard: {
        width: 170,
        marginRight: 15,
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        padding: 0,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        overflow: 'hidden',
    },
    horizontalImageContainer: {
        width: '100%',
        height: 140,
        backgroundColor: '#f8fafc',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    discountBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    discountText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    infoContainer: {
        padding: 12,
        flex: 1,
        justifyContent: 'space-between',
    },
    brandText: {
        fontSize: 10,
        color: '#94a3b8',
        fontWeight: '800',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    nameText: {
        fontWeight: '700',
        fontSize: 14,
        marginBottom: 6,
        color: '#1e293b',
        height: 40,
        lineHeight: 20,
    },
    catContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
        gap: 4,
    },
    catPill: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    catPillText: {
        fontSize: 9,
        color: '#64748b',
        fontWeight: '600',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 2,
    },
    ratingValue: {
        fontSize: 11,
        fontWeight: '800',
        color: '#1e293b',
        marginLeft: 2,
    },
    ratingCount: {
        fontSize: 10,
        color: '#94a3b8',
        marginLeft: 2,
    },
    footerContainer: {
        marginTop: 'auto',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    oldPriceText: {
        fontSize: 11,
        color: '#94a3b8',
        textDecorationLine: 'line-through',
        marginBottom: 1,
        fontWeight: '500',
    },
    priceText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1e293b',
    },
    discountedPrice: {
        color: COLORS.mainTitle,
    },
    addToCartBtn: {
        backgroundColor: COLORS.mainTitle,
        width: 32,
        height: 32,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.mainTitle,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 8,
    },
    stockBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    inStock: {
        backgroundColor: '#ecfdf5',
    },
    outOfStock: {
        backgroundColor: '#fef2f2',
    },
    stockText: {
        fontSize: 9,
        fontWeight: '700',
    },
    inStockText: {
        color: '#059669',
    },
    outOfStockText: {
        color: '#ef4444',
    },
    soldText: {
        fontSize: 9,
        color: '#94a3b8',
        fontWeight: '600',
    },
});

export default ProductCard;
