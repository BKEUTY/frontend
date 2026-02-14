import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, TextInput, Dimensions } from 'react-native';
import { COLORS } from '../constants/Theme';
import axiosClient from '../api/axiosClient';
import { useLanguage } from '../i18n/LanguageContext';
import { useCart } from '../Context/CartContext';
import Header from '../Component/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductCard from '../Component/Common/ProductCard';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 45) / 2;

const ProductScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const { addToCart } = useCart();
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

    const handleAddToCart = async (product) => {
        addToCart({
            id: product.productId || product.id,
            name: product.name,
            price: product.price,
            image: product.image || 'placeholder',
            quantity: 1
        });
        Alert.alert(t('success'), t('add_cart_success'));
    };

    const renderItem = ({ item }) => (
        <ProductCard
            item={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            onAddToCart={handleAddToCart}
            layout="grid"
        />
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
            <Header />
            <View style={styles.searchHeader}>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={18} color="#999" />
                    <TextInput
                        placeholder={t('search_placeholder')}
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
        backgroundColor: '#f8f9fa',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchHeader: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f2f6',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
    },
    listContent: {
        padding: 15,
        paddingBottom: 30,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productItem: {
        width: COLUMN_WIDTH,
        backgroundColor: 'white',
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    imageContainer: {
        width: '100%',
        height: 160,
        backgroundColor: '#f9f9f9',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5',
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#ff4081',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    productInfo: {
        padding: 12,
    },
    productBrand: {
        fontSize: 10,
        color: '#9ca3af',
        fontWeight: '700',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    productName: {
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 8,
        color: '#111827',
        height: 40,
        lineHeight: 20,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 2,
    },
    ratingCount: {
        fontSize: 10,
        color: '#9ca3af',
        marginLeft: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#c2185b',
    },
    addToCartBtn: {
        backgroundColor: '#c2185b',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#c2185b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default ProductScreen;
