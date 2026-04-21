import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/Theme';
import { useLanguage } from '../../i18n/LanguageContext';
import ScreenWrapper from '../../Component/Common/ScreenWrapper';
import { Ionicons } from '@expo/vector-icons';
import { showToast } from '../../utils/ToastService';
import { useOrders } from '../../hooks/useOrders';

import { useDebounce } from '../../hooks/useDebounce';

const OrderListScreen = () => {
    const navigation = useNavigation();
    const { t } = useLanguage();
    const [searchInput, setSearchInput] = useState('');
    const debouncedSearch = useDebounce(searchInput, 500);

    const { data: orders, isLoading, isRefetching, refetch } = useOrders({
        search: debouncedSearch
    });

    const getStatusColor = (status) => {
        const s = status?.toUpperCase();
        switch (s) {
            case 'PAID':
            case 'COMPLETED':
            case 'SUCCEEDED':
                return '#10b981';
            case 'UNPAID':
            case 'PENDING':
            case 'PROCESSING':
                return '#f59e0b';
            case 'CANCELLED':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const renderOrderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
            activeOpacity={0.8}
        >
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.orderId}>#{item.id}</Text>
                    <Text style={styles.orderDate}>{new Date(item.orderDate).toLocaleDateString()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{t(item.status.toLowerCase()) || item.status}</Text>
                </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.cardFooter}>
                <View style={styles.paymentMethod}>
                    <Ionicons name="card-outline" size={16} color="#6b7280" />
                    <Text style={styles.methodText}>{item.paymentMethod}</Text>
                </View>
                <View style={styles.totalBox}>
                    <Text style={styles.totalLabel}>{t('total')}:</Text>
                    <Text style={styles.totalValue}>{item.total?.toLocaleString()}đ</Text>
                </View>
            </View>
            
            <TouchableOpacity 
                style={styles.viewDetailBtn}
                onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
            >
                <Text style={styles.viewDetailText}>{t('view_detail')}</Text>
                <Ionicons name="chevron-forward" size={14} color={COLORS.mainTitle} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper loading={isLoading && !isRefetching} padding={0}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('my_orders')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={t('search_orders_placeholder') || t('search')}
                    placeholderTextColor="#94a3b8"
                    value={searchInput}
                    onChangeText={setSearchInput}
                />
                {searchInput.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchInput('')} style={styles.clearIcon}>
                        <Ionicons name="close-circle" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[COLORS.mainTitle]} />
                }
                ListEmptyComponent={
                    !isLoading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="cube-outline" size={80} color="#e5e7eb" />
                            <Text style={styles.emptyText}>{t('no_orders') || t('no_data')}</Text>
                        </View>
                    )
                }
            />
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
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        marginHorizontal: 15,
        marginVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 14,
        height: 48,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    searchIcon: {
        marginRight: 10,
    },
    clearIcon: {
        padding: 4,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    listContent: {
        padding: 15,
        paddingBottom: 40,
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderId: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 2,
    },
    orderDate: {
        fontSize: 12,
        color: '#9ca3af',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    divider: {
        height: 1,
        backgroundColor: '#f3f4f6',
        marginVertical: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    methodText: {
        fontSize: 13,
        color: '#6b7280',
        fontWeight: '500',
    },
    totalBox: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    totalLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    },
    viewDetailBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: '#fff1f2',
        borderRadius: 10,
        gap: 6,
    },
    viewDetailText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.mainTitle,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 16,
        color: '#9ca3af',
        fontWeight: '500',
    },
});

export default OrderListScreen;
