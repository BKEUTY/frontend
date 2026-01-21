import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/Theme';
import axiosClient from '../api/axiosClient';
import { useLanguage } from '../i18n/LanguageContext';

import Header from '../Component/Header';

const CartScreen = () => {
    const navigation = useNavigation();
    const { t } = useLanguage();
    const [products, setProducts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedItems, setSelectedItems] = useState({});

    const fetchCart = async () => {
        try {
            const response = await axiosClient.get('/cart/1');
            setProducts(response.data);
            const initialSelection = {};
            response.data.forEach(item => initialSelection[item.cartId] = true);
            setSelectedItems(initialSelection);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchCart().then(() => setRefreshing(false));
    }, []);

    const toggleSelection = (cartId) => {
        setSelectedItems(prev => ({
            ...prev,
            [cartId]: !prev[cartId]
        }));
    };

    const handleDelete = (cartId) => {
        Alert.alert(
            t('confirm_delete_title') || "Xác nhận xóa",
            t('confirm_delete_message') || "Bạn có muốn xóa sản phẩm này?",
            [
                { text: t('cancel') || "Hủy", style: 'cancel' },
                {
                    text: t('delete') || "Xóa",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axiosClient.delete(`/cart/${cartId}`);
                            setProducts(prev => prev.filter(item => item.cartId !== cartId));
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete item');
                        }
                    }
                }
            ]
        );
    };

    // Calculate Total
    const totalPrice = products.reduce((sum, item) => {
        if (selectedItems[item.cartId]) {
            return sum + (item.price * item.quantity);
        }
        return sum;
    }, 0);

    const renderItem = ({ item }) => {
        const isSelected = !!selectedItems[item.cartId];
        return (
            <View style={styles.cartCard}>
                {/* Top Row: CheckBox + Image + Name + Delete */}
                <View style={styles.topRow}>
                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleSelection(item.cartId)}>
                        <View style={[styles.checkbox, isSelected && styles.checkedCheckbox]}>
                            {isSelected && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                    </TouchableOpacity>

                    <View style={styles.imagePlaceholder} />

                    <View style={styles.itemInfo}>
                        <View style={styles.headerRow}>
                            <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                            <TouchableOpacity onPress={() => handleDelete(item.cartId)} style={styles.deleteBtn}>
                                <Text style={styles.deleteIcon}>×</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Bottom Row: Price/Total + Qty */}
                <View style={styles.bottomRow}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.itemPrice}>{item.price.toLocaleString("vi-VN")}đ</Text>
                        <Text style={styles.itemTotal}>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</Text>
                    </View>

                    <View style={styles.qtyContainer}>
                        <TouchableOpacity style={styles.qtyBtn}><Text style={styles.qtyBtnText}>-</Text></TouchableOpacity>
                        <Text style={styles.qtyValue}>{item.quantity}</Text>
                        <TouchableOpacity style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const handleCheckout = () => {
        const selectedIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
        if (selectedIds.length === 0) {
            Alert.alert("Error", t('select_min_one'));
            return;
        }

        const selectedProductsList = products.filter(p => selectedItems[p.cartId]);

        // Mock promo logic similar to web
        const discount = 0; // Or calculate if promo selected

        navigation.navigate('Checkout', {
            cartIds: selectedIds,
            selectedProducts: selectedProductsList,
            subTotal: totalPrice,
            discount: discount
        });
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('cart')}</Text>
            </View>

            {products.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{t('cart_empty')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Product' })}>
                        <Text style={{ color: COLORS.mainTitle, marginTop: 10 }}>{t('shop_now')}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={item => item.cartId?.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}

            {products.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>{t('total')}:</Text>
                        <Text style={styles.totalValue}>{totalPrice.toLocaleString("vi-VN")}đ</Text>
                    </View>
                    <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                        <Text style={styles.checkoutText}>{t('checkout')} ({Object.values(selectedItems).filter(Boolean).length})</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        elevation: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
        textTransform: 'uppercase',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#888',
        fontSize: 16,
    },
    listContent: {
        padding: 15,
        paddingBottom: 100, // Space for footer
    },
    cartCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    checkboxContainer: {
        padding: 5,
        marginRight: 8,
        justifyContent: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    checkedCheckbox: {
        backgroundColor: COLORS.mainTitle,
        borderColor: COLORS.mainTitle,
    },
    checkmark: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    imagePlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
        minHeight: 80,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemName: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        fontWeight: '600',
        marginRight: 10,
        marginBottom: 4,
    },
    deleteBtn: {
        padding: 8,
        marginTop: -8,
        marginRight: -8,
    },
    deleteIcon: {
        fontSize: 22,
        color: '#999',
    },
    // Bottom Row for Price, Qty, Total
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#f9f9f9',
        paddingTop: 10,
    },
    priceContainer: {
        flex: 1,
    },
    itemPrice: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    itemTotal: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    qtyBtn: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyBtnText: {
        fontSize: 18,
        color: '#555',
        fontWeight: '500',
    },
    qtyValue: {
        paddingHorizontal: 15,
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#eee',
        height: 24, // Visual separator height
        textAlignVertical: 'center', // Android
        lineHeight: 24, // iOS
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    },
    checkoutBtn: {
        backgroundColor: COLORS.checkoutButton,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: COLORS.mainTitle,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    checkoutText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default CartScreen;
