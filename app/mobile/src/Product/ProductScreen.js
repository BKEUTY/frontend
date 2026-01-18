import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { COLORS } from '../constants/Theme';
import axiosClient from '../api/axiosClient';
import { useLanguage } from '../i18n/LanguageContext';

const ProductScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axiosClient.get('/product');
            setProducts(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch products error:", err);
            setLoading(false);
        }
    };

    const addToCart = async (productId) => {
        try {
            await axiosClient.post('/cart', {
                productId: productId,
                userId: 1,
            });
            Alert.alert(t('success') || "Thành công", t('add_cart_success') || "Đã thêm vào giỏ hàng");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to add to cart");
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.productItem}>
            <View style={styles.imagePlaceholder}>
                {/* Placeholders */}
            </View>

            <View style={styles.productInfo}>
                <Text style={styles.productBrand}>BKEUTY</Text>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <View style={styles.ratingRow}>
                    <Text style={{ color: '#ffc107', fontSize: 10 }}>⭐⭐⭐⭐⭐</Text>
                    <Text style={{ fontSize: 10, color: '#999' }}>(100)</Text>
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>{item.price ? item.price.toLocaleString("vi-VN") : 0}đ</Text>
                    <TouchableOpacity style={styles.addToCartBtn} onPress={() => addToCart(item.productId)}>
                        <Text style={styles.addToCartText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={COLORS.mainTitle} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('product')}</Text>
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        placeholder={t('search_placeholder') || "Tìm kiếm sản phẩm..."}
                        style={styles.searchInput}
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            <FlatList
                data={products}
                keyExtractor={(item) => item.productId?.toString() || Math.random().toString()}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        backgroundColor: 'white',
        paddingBottom: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
        marginBottom: 15,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 45,
    },
    searchIcon: {
        marginRight: 10,
        fontSize: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    listContent: {
        padding: 15,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productItem: {
        width: '48%',
        backgroundColor: 'white',
        marginBottom: 15,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 2, // Shadow for android
        shadowColor: '#000', // Shadow for IOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    imagePlaceholder: {
        width: '100%',
        height: 140,
        backgroundColor: '#f9f9f9',
    },
    productInfo: {
        padding: 10,
    },
    productBrand: {
        fontSize: 10,
        color: '#999',
        marginBottom: 3,
        textTransform: 'uppercase',
    },
    productName: {
        fontWeight: '500',
        fontSize: 13,
        marginBottom: 6,
        color: '#333',
        height: 36, // 2 lines fixed
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 5,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    },
    addToCartBtn: {
        backgroundColor: COLORS.mainTitle,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addToCartText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 18,
    },
});

export default ProductScreen;
