import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import productApi from '../api/productApi';
import { useLanguage } from '../i18n/LanguageContext';
import { useCart } from '../Context/CartContext';
import ScreenWrapper from '../Component/Common/ScreenWrapper';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../Component/Common/ProductCard';
import { showToast } from '../utils/ToastService';

const ProductScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const fetchProducts = useCallback(async (catId = null) => {
        setLoading(true);
        try {
            const params = {};
            if (catId && catId !== 'all') params.categoryId = catId;
            const response = await productApi.getAll(params);
            setProducts(response.data.content || []);
        } catch (err) {
            console.error("Fetch products error:", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await productApi.getCategories();
            if (res.data) {
                const dynamicCats = res.data.map(c => ({
                    id: c.id,
                    label: c.categoryName,
                    icon: 'sparkles-outline'
                }));
                // Keep 'all' category
                setCategoryList([
                    { id: 'all', label: t('all_products'), icon: 'apps-outline' },
                    ...dynamicCats
                ]);
            }
        } catch (err) {
            console.error("Fetch categories error:", err);
        }
    }, [t]);

    const [categoryList, setCategoryList] = useState([
        { id: 'all', label: t('all_products'), icon: 'apps-outline' }
    ]);

    useEffect(() => {
        fetchCategories();
        fetchProducts(activeCategory);
    }, [activeCategory, fetchProducts, fetchCategories]);

    const handleAddToCart = async (product) => {
        addToCart({
            id: product.productId || product.id,
            name: product.name,
            price: product.price,
            image: product.image || 'placeholder',
            quantity: 1
        });
        showToast(t('success'), 'success', t('add_cart_success'));
    };

    const renderItem = ({ item }) => (
        <ProductCard
            item={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            onAddToCart={handleAddToCart}
            layout="grid"
        />
    );

    return (
        <ScreenWrapper loading={loading} padding={0}>
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

            <View style={styles.categoriesSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesScroll}
                >
                    {categoryList.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.categoryChip,
                                activeCategory === cat.id && styles.activeCategoryChip
                            ]}
                            onPress={() => setActiveCategory(cat.id)}
                        >
                            <Ionicons
                                name={cat.icon}
                                size={16}
                                color={activeCategory === cat.id ? 'white' : '#666'}
                            />
                            <Text style={[
                                styles.categoryText,
                                activeCategory === cat.id && styles.activeCategoryText
                            ]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={products.filter(p => {
                    const matchesSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
                    const matchesCategory = activeCategory === 'all' ||
                        (p.category && p.category.toLowerCase() === activeCategory.toLowerCase()) ||
                        (p.type && p.type.toLowerCase() === activeCategory.toLowerCase());
                    return matchesSearch && matchesCategory;
                })}
                keyExtractor={(item) => item.productId?.toString() || Math.random().toString()}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />
        </ScreenWrapper>
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
    categoriesSection: {
        backgroundColor: 'white',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    categoriesScroll: {
        paddingHorizontal: 15,
        gap: 10,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        gap: 6,
        borderWidth: 1,
        borderColor: '#eee',
    },
    activeCategoryChip: {
        backgroundColor: '#c2185b',
        borderColor: '#c2185b',
    },
    categoryText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    activeCategoryText: {
        color: 'white',
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
