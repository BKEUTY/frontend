import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import productApi from '../../api/productApi';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCart } from '../../Context/CartContext';
import ScreenWrapper from '../../Component/Common/ScreenWrapper';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../../Component/Common/ProductCard';
import { showToast } from '../../utils/ToastService';
import { useProducts } from '../../hooks/useProducts';
import { COLORS, SHADOWS } from '../../constants/Theme';
import { Modal } from 'react-native';

import { useDebounce } from '../../hooks/useDebounce';

const ProductScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput, 500);
    const [activeCategory, setActiveCategory] = useState('all');
    const [categoryList, setCategoryList] = useState([]);
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);
    const [sortOption, setSortOption] = useState('default');

    const sortOptions = [
        { label: t('default_sort'), value: 'default' },
        { label: t('price_low_high'), value: 'price_asc' },
        { label: t('price_high_low'), value: 'price_desc' },
        { label: t('stock_high_low'), value: 'stock_desc' },
        { label: t('stock_low_high'), value: 'stock_asc' },
        { label: t('sold_high_low'), value: 'sold_desc' },
        { label: t('sold_low_high'), value: 'sold_asc' },
        { label: t('rating_high_low'), value: 'rating_desc' },
        { label: t('rating_low_high'), value: 'rating_asc' },
        { label: t('reviews_high_low'), value: 'reviews_desc' },
        { label: t('reviews_low_high'), value: 'reviews_asc' },
    ];

    const { 
        data, 
        isLoading, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage,
        refetch
    } = useProducts({
        pageSize: 20,
        searchTerm: debouncedSearch,
        categoryId: activeCategory,
        sort: sortOption
    });

    const products = data?.pages.flatMap(page => page.items) || [];

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
                    <Ionicons name="search-outline" size={20} color="#1e293b" />
                    <TextInput
                        placeholder={t('search_placeholder')}
                        style={styles.searchInput}
                        value={searchInput}
                        onChangeText={setSearchInput}
                        placeholderTextColor="#94a3b8"
                    />
                    {searchInput.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchInput('')}>
                            <Ionicons name="close-circle" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity 
                    style={styles.sortBtn} 
                    onPress={() => setIsSortModalVisible(true)}
                >
                    <Ionicons name="options-outline" size={22} color="white" />
                </TouchableOpacity>
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
                onEndReached={() => hasNextPage && fetchNextPage()}
                onEndReachedThreshold={0.5}
                refreshing={isLoading}
                onRefresh={refetch}
                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View style={{ paddingVertical: 20 }}>
                            <ActivityIndicator color={COLORS.primary} />
                        </View>
                    ) : null
                }
                ListEmptyComponent={
                    !isLoading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={50} color="#e2e8f0" />
                            <Text style={styles.emptyText}>{t('no_products_found')}</Text>
                        </View>
                    )
                }
            />
            <Modal
                visible={isSortModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsSortModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('sort_by')}</Text>
                            <TouchableOpacity onPress={() => setIsSortModalVisible(false)}>
                                <Ionicons name="close-outline" size={24} color="#1e293b" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
                            {sortOptions.map((opt) => (
                                <TouchableOpacity 
                                    key={opt.value} 
                                    style={[
                                        styles.sortOption,
                                        sortOption === opt.value && styles.activeSortOption
                                    ]}
                                    onPress={() => {
                                        setSortOption(opt.value);
                                        setIsSortModalVisible(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.sortOptionText,
                                        sortOption === opt.value && styles.activeSortOptionText
                                    ]}>
                                        {opt.label}
                                    </Text>
                                    {sortOption === opt.value && (
                                        <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    searchHeader: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        ...SHADOWS.small,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 48,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    sortBtn: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#1e293b',
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.medium,
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        gap: 8,
        borderWidth: 1.5,
        borderColor: '#f1f5f9',
    },
    activeCategoryChip: {
        backgroundColor: '#1e293b',
        borderColor: '#1e293b',
    },
    categoryText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1e293b',
    },
    sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    activeSortOption: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginHorizontal: -12,
    },
    sortOptionText: {
        fontSize: 15,
        color: '#475569',
        fontWeight: '600',
    },
    activeSortOptionText: {
        color: COLORS.primary,
        fontWeight: '700',
    }
});

export default ProductScreen;
