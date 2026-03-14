import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/Theme';
import { useLanguage } from '../i18n/LanguageContext';
import Header from '../Component/Header';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useCart } from '../Context/CartContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

import ScreenWrapper from '../Component/Common/ScreenWrapper';
import EmptyState from '../Component/Common/EmptyState';
import { SIZES } from '../constants/Theme';
import { showToast } from '../utils/ToastService';

import { LinearGradient } from 'expo-linear-gradient';

const CartScreen = () => {
    const navigation = useNavigation();
    const { t } = useLanguage();
    const { cartItems: products, fetchCart, deleteCartItem, updateCartQuantity } = useCart();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedItems, setSelectedItems] = useState({});

    useEffect(() => {
        fetchCart();
    }, []);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await fetchCart();
        setRefreshing(false);
    }, [fetchCart]);

    const isAllSelected = products.length > 0 && products.every(item => selectedItems[item.cartId]);

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedItems({});
        } else {
            const all = {};
            products.forEach(item => {
                all[item.cartId] = true;
            });
            setSelectedItems(all);
        }
    };

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
                        showToast(t('success'), 'success', t('delete_success'));
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

    const handleUpdateQty = (cartId, quantity, currentQty) => {
        const newQty = currentQty + quantity;
        if (newQty >= 1) {
            updateCartQuantity(cartId, newQty);
        }
    };

    const renderItem = ({ item }) => {
        const isSelected = !!selectedItems[item.cartId];
        return (
            <Swipeable renderRightActions={(p, d) => renderRightActions(p, d, item.cartId)}>
                <View style={[styles.cartCard, isSelected && styles.selectedCard]}>
                    <TouchableOpacity 
                        style={styles.contentRow} 
                        onPress={() => toggleSelection(item.cartId)} 
                        activeOpacity={0.8}
                    >
                        <View style={[styles.checkbox, isSelected && styles.checkedCheckbox]}>
                            {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
                        </View>

                        <Image
                            source={{ uri: item.image || 'https://via.placeholder.com/100' }}
                            style={styles.itemImage}
                        />

                        <View style={styles.itemInfo}>
                            <View>
                                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                {item.productVariantName && (
                                    <Text style={styles.variantName}>{item.productVariantName}</Text>
                                )}
                            </View>
                            
                            <View style={styles.priceRow}>
                                <Text style={styles.itemPrice}>{item.price.toLocaleString("vi-VN")}đ</Text>
                            </View>

                            <View style={styles.quantityPriceRow}>
                                <Text style={styles.itemTotal}>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</Text>

                                <View style={styles.qtyContainer}>
                                    <TouchableOpacity 
                                        style={styles.qtyBtn} 
                                        onPress={() => handleUpdateQty(item.cartId, -1, item.quantity)}
                                    >
                                        <Ionicons name="remove" size={16} color="#4b5563" />
                                    </TouchableOpacity>
                                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                                    <TouchableOpacity 
                                        style={styles.qtyBtn} 
                                        onPress={() => handleUpdateQty(item.cartId, 1, item.quantity)}
                                    >
                                        <Ionicons name="add" size={16} color="#4b5563" />
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
            showToast(t('error'), 'error', t('select_min_one'));
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
        <ScreenWrapper padding={0}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('cart')}</Text>
                <View style={{ width: 40 }} />
            </View>

            {products.length === 0 ? (
                <EmptyState
                    icon="cart-outline"
                    title={t('cart_empty')}
                    description={t('cart_empty_desc')}
                    actionText={t('shop_now')}
                    onAction={() => navigation.navigate('Main', { screen: 'Product' })}
                />
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={styles.selectAllHeader}>
                        <TouchableOpacity style={styles.selectAllRow} onPress={toggleSelectAll}>
                            <View style={[styles.checkbox, isAllSelected && styles.checkedCheckbox]}>
                                {isAllSelected && <Ionicons name="checkmark" size={16} color="white" />}
                            </View>
                            <Text style={styles.selectAllText}>{t('select_all')}</Text>
                        </TouchableOpacity>
                        <Text style={styles.itemCount}>{products.length} {t('items')}</Text>
                    </View>
                    
                    <FlatList
                        data={products}
                        keyExtractor={item => item.cartId?.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                </View>
            )}

            {products.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <View>
                            <Text style={styles.totalLabel}>{t('total')}</Text>
                            <Text style={styles.totalPrice}>{totalPrice.toLocaleString("vi-VN")}đ</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={handleCheckout}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={[COLORS.mainTitle, COLORS.mainTitleDark || '#880e4f']}
                                style={styles.checkoutBtn}
                            >
                                <Text style={styles.checkoutText}>
                                    {t('checkout')} ({Object.values(selectedItems).filter(Boolean).length})
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScreenWrapper>
    );
};


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 56,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    selectAllHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'white',
    },
    selectAllRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectAllText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4b5563',
    },
    itemCount: {
        fontSize: 13,
        color: '#9ca3af',
        fontWeight: '500',
    },
    listContent: {
        padding: 15,
        paddingBottom: 150,
    },
    cartCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        marginBottom: 16,
        padding: 14,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    selectedCard: {
        backgroundColor: '#fffcfc',
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginRight: 14,
    },
    checkedCheckbox: {
        backgroundColor: COLORS.mainTitle,
        borderColor: COLORS.mainTitle,
    },
    itemImage: {
        width: 85,
        height: 85,
        borderRadius: 12,
        backgroundColor: '#f9fafb',
        marginRight: 14,
    },
    itemInfo: {
        flex: 1,
        justifyContent: 'space-between',
        height: 85,
    },
    itemName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1f2937',
        lineHeight: 20,
    },
    variantName: {
        fontSize: 12,
        color: '#6b7280',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 13,
        color: '#9ca3af',
        textDecorationLine: 'none',
    },
    quantityPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTotal: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.mainTitle,
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 10,
        padding: 2,
    },
    qtyBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    qtyValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        width: 36,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 20,
        paddingBottom: 30,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 20,
    },
    totalLabel: {
        fontSize: 13,
        color: '#9ca3af',
        fontWeight: '600',
        marginBottom: 2,
    },
    totalPrice: {
        fontSize: 22,
        fontWeight: '900',
        color: '#111827',
    },
    checkoutBtn: {
        paddingHorizontal: 30,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkoutText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    deleteAction: {
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 105,
        borderRadius: 20,
        marginLeft: 10,
    },
});

export default CartScreen;
