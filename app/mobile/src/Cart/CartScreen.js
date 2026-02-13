import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/Theme';
import { useLanguage } from '../i18n/LanguageContext';
import Header from '../Component/Header';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useCart } from '../Context/CartContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const CartScreen = () => {
    const navigation = useNavigation();
    const { t } = useLanguage();
    const { cartItems: products, fetchCart, deleteCartItem } = useCart();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedItems, setSelectedItems] = useState({});

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchCart();
        setRefreshing(false);
    }, [fetchCart]);

    const toggleSelection = (cartId) => {
        setSelectedItems(prev => ({
            ...prev,
            [cartId]: !prev[cartId]
        }));
    };

    const handleDelete = (cartId) => {
        Alert.alert(
            t('confirm_delete_title'),
            t('confirm_delete_message'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('delete'),
                    style: 'destructive',
                    onPress: async () => {
                        await deleteCartItem(cartId);
                    }
                }
            ]
        );
    };

    const totalPrice = products.reduce((sum, item) => {
        if (selectedItems[item.cartId]) {
            return sum + (item.price * item.quantity);
        }
        return sum;
    }, 0);

    const renderRightActions = (progress, dragX, cartId) => {
        return (
            <TouchableOpacity
                style={styles.deleteAction}
                onPress={() => handleDelete(cartId)}
            >
                <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }) => {
        const isSelected = !!selectedItems[item.cartId];
        return (
            <Swipeable renderRightActions={(p, d) => renderRightActions(p, d, item.cartId)}>
                <View style={[styles.cartCard, isSelected && styles.selectedCard]}>
                    <TouchableOpacity style={styles.contentRow} onPress={() => toggleSelection(item.cartId)} activeOpacity={0.7}>
                        <View style={[styles.checkbox, isSelected && styles.checkedCheckbox]}>
                            {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                        </View>

                        <Image
                            source={{ uri: item.image || 'https://via.placeholder.com/100' }}
                            style={styles.itemImage}
                        />

                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                            <Text style={styles.itemPrice}>{item.price.toLocaleString("vi-VN")}đ</Text>

                            <View style={styles.quantityPriceRow}>
                                <Text style={styles.itemTotal}>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</Text>

                                <View style={styles.qtyContainer}>
                                    <TouchableOpacity style={styles.qtyBtn}>
                                        <Ionicons name="remove" size={18} color="#555" />
                                    </TouchableOpacity>
                                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                                    <TouchableOpacity style={styles.qtyBtn}>
                                        <Ionicons name="add" size={18} color="#555" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </Swipeable>
        );
    };

    const handleCheckout = () => {
        const selectedIds = Object.keys(selectedItems).filter(id => selectedItems[id]);
        if (selectedIds.length === 0) {
            Alert.alert("Error", t('select_min_one'));
            return;
        }

        const selectedProductsList = products.filter(p => selectedItems[p.cartId]);

        navigation.navigate('Checkout', {
            cartIds: selectedIds,
            selectedProducts: selectedProductsList,
            subTotal: totalPrice,
            discount: 0
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
                    <Ionicons name="cart-outline" size={80} color="#ddd" />
                    <Text style={styles.emptyText}>{t('cart_empty')}</Text>
                    <TouchableOpacity style={styles.shopNowBtn} onPress={() => navigation.navigate('Main', { screen: 'Product' })}>
                        <Text style={styles.shopNowText}>{t('shop_now')}</Text>
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
                        <Text style={styles.totalPrice}>{totalPrice.toLocaleString("vi-VN")}đ</Text>
                    </View>
                    <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                        <Text style={styles.checkoutText}>
                            {t('checkout')} ({Object.values(selectedItems).filter(Boolean).length})
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingVertical: 15,
        backgroundColor: 'white',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        textTransform: 'uppercase',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#9ca3af',
        fontSize: 16,
        marginTop: 15,
        marginBottom: 25,
    },
    shopNowBtn: {
        backgroundColor: '#c2185b',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    shopNowText: {
        color: 'white',
        fontWeight: '700',
    },
    listContent: {
        padding: 15,
        paddingBottom: 120,
    },
    cartCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 15,
        padding: 12,
        borderWidth: 1,
        borderColor: 'transparent',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    selectedCard: {
        borderColor: '#fce4ec',
        backgroundColor: '#fffdfd',
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginRight: 12,
    },
    checkedCheckbox: {
        backgroundColor: '#c2185b',
        borderColor: '#c2185b',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
        justifyContent: 'space-between',
        height: 80,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        lineHeight: 18,
    },
    itemPrice: {
        fontSize: 12,
        color: '#9ca3af',
    },
    quantityPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTotal: {
        fontSize: 15,
        fontWeight: '700',
        color: '#c2185b',
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f2f6',
        borderRadius: 8,
        height: 32,
    },
    qtyBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        width: 30,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        paddingBottom: 30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 20,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 14,
        color: '#9ca3af',
        fontWeight: '600',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: '800',
        color: '#c2185b',
    },
    checkoutBtn: {
        backgroundColor: '#c2185b',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkoutText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    deleteAction: {
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 104,
        borderRadius: 16,
        marginLeft: 10,
    },
});

export default CartScreen;
