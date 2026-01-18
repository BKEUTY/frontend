import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, Image } from 'react-native';
import { COLORS } from '../constants/Theme';
import axiosClient from '../api/axiosClient';
import { useLanguage } from '../i18n/LanguageContext';

const CartScreen = () => {
    const { t } = useLanguage();
    const [products, setProducts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedItems, setSelectedItems] = useState({});

    const fetchCart = async () => {
        try {
            const response = await axiosClient.get('/cart/1'); // userId 1
            setProducts(response.data);
            // Default select all or none? Let's select all initially for demo
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
                {/* Checkbox */}
                <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleSelection(item.cartId)}>
                    <View style={[styles.checkbox, isSelected && styles.checkedCheckbox]}>
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                </TouchableOpacity>

                {/* Image Placeholder */}
                <View style={styles.imagePlaceholder} />

                {/* Info */}
                <View style={styles.itemInfo}>
                    <View style={styles.headerRow}>
                        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                        <TouchableOpacity onPress={() => handleDelete(item.cartId)} style={styles.deleteBtn}>
                            <Text style={styles.deleteIcon}>×</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.itemPrice}>{item.price.toLocaleString("vi-VN")}đ</Text>

                    {/* Quantity Control */}
                    <View style={styles.qtyContainer}>
                        <TouchableOpacity style={styles.qtyBtn}><Text style={styles.qtyBtnText}>-</Text></TouchableOpacity>
                        <Text style={styles.qtyValue}>{item.quantity}</Text>
                        <TouchableOpacity style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('cart')}</Text>
            </View>

            {products.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{t('cart_empty')}</Text>
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
                    <TouchableOpacity style={styles.checkoutBtn}>
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
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    checkboxContainer: {
        padding: 5,
        marginRight: 5,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
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
        fontSize: 12,
        fontWeight: 'bold',
    },
    imagePlaceholder: {
        width: 70,
        height: 70,
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
        justifyContent: 'space-between',
        height: 80,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemName: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        marginRight: 10,
    },
    deleteBtn: {
        padding: 5,
    },
    deleteIcon: {
        fontSize: 20,
        color: '#999',
        marginTop: -5,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    qtyBtn: {
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    qtyBtnText: {
        fontSize: 16,
        color: '#555',
    },
    qtyValue: {
        paddingHorizontal: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#ddd',
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
