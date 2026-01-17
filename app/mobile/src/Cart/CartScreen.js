import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { COLORS } from '../constants/Theme';
import axiosClient from '../api/axiosClient';
import { useLanguage } from '../i18n/LanguageContext';

const CartScreen = () => {
    const { t } = useLanguage();
    const [products, setProducts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCart = async () => {
        try {
            const response = await axiosClient.get('/cart/1'); // userId 1
            setProducts(response.data);
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

    const handleDelete = (cartId) => {
        Alert.alert(
            t('confirm_delete_title') || "Xác nhận xóa",
            t('confirm_delete_message') || "Bạn có chắc chắn muốn xóa sản phẩm này?",
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
                            console.error(error);
                            Alert.alert('Error', 'Failed to delete item');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price.toLocaleString("vi-VN")}đ</Text>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
            </View>
            <View style={styles.itemRight}>
                <Text style={styles.itemTotal}>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</Text>
                <TouchableOpacity onPress={() => handleDelete(item.cartId)}>
                    <Text style={styles.deleteText}>{t('delete') || "Xóa"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const totalPrice = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>{t('cart')}</Text>

            {products.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text>{t('cart_empty')}</Text>
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

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>{t('total')}:</Text>
                    <Text style={styles.totalValue}>{totalPrice.toLocaleString("vi-VN")}đ</Text>
                </View>
                <TouchableOpacity style={styles.checkoutBtn}>
                    <Text style={styles.checkoutText}>{t('checkout')} ({products.length})</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
        textAlign: 'center',
        paddingVertical: 20,
        backgroundColor: COLORS.background,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 15,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 10,
        elevation: 1,
    },
    itemInfo: {
        flex: 1,
    },
    itemRight: {
        alignItems: 'flex-end',
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: '#666',
    },
    itemQty: {
        fontSize: 14,
        color: COLORS.mainTitle,
        fontWeight: 'bold',
        marginTop: 2,
    },
    itemTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
        marginBottom: 5,
    },
    deleteText: {
        color: 'red',
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        elevation: 5,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '500',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    },
    checkoutBtn: {
        backgroundColor: COLORS.checkoutButton, // Black
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
    },
    checkoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CartScreen;
