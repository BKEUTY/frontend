import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity, Text } from 'react-native';
import productApi from '../../api/productApi';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCart } from '../../Context/CartContext';
import ScreenWrapper from '../../Component/Common/ScreenWrapper';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../Component/Common/ProductCard';
import { showToast } from '../../utils/ToastService';
import { useProducts } from '../../hooks/useProducts';
import { COLORS } from '../../constants/Theme';

const ProductScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const [searchText, setSearchText] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [categoryList, setCategoryList] = useState([]);

    const { products, isLoading, fetchProducts } = useProducts(50);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await productApi.getCategories();
            if (res.data) {
                const dynamicCats = res.data.map(c => ({
                    id: c.id,
                    label: c.categoryName,
                    icon: 'sparkles-outline'
                }));
                setCategoryList([
                    { id: 'all', label: t('all_products'), icon: 'apps-outline' },
                    ...dynamicCats
                ]);
            }
        } catch (err) {
            // Silently fail
        }
    }, [t]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts(1, false, searchText, activeCategory);
    }, [activeCategory, searchText, fetchProducts]);

    const handleAddToCart = async (product) => {
        addToCart({
            cartId: `local_${Date.now()}`,
            id: product.originalId || product.id,
            productVariantId: product.originalId || product.id,
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
        <ScreenWrapper loading={isLoading} padding={0}>
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
                data={products}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    !isLoading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={50} color="#e2e8f0" />
                            <Text style={styles.emptyText}>{t('no_products_found')}</Text>
                        </View>
                    )
                }
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    activeCategoryText: {
        color: 'white',
    },
    listContent: {
        padding: 15,
        paddingBottom: 30,
        flexGrow: 1,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 12,
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: '500',
    }
});

export default ProductScreen;
