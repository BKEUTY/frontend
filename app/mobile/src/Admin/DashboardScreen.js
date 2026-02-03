import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../../i18n/LanguageContext';
import { COLORS } from '../../constants/Theme';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
    const { t } = useLanguage();

    const stats = [
        {
            title: t('admin_dashboard_sales', 'Doanh thu hôm nay'),
            value: '40,689,000 đ',
            icon: 'currency-usd',
            iconLib: MaterialCommunityIcons,
            trend: 8.5,
            trendType: 'up',
            color: '#c2185b',
            bg: '#fce7f3'
        },
        {
            title: t('admin_dashboard_orders', 'Tổng đơn hàng'),
            value: '1,250',
            icon: 'shopping-bag',
            iconLib: FontAwesome5,
            trend: 5.2,
            trendType: 'up',
            color: '#3b82f6',
            bg: '#dbeafe'
        },
        {
            title: t('admin_dashboard_appointments', 'Lịch hẹn'),
            value: '600',
            icon: 'calendar-check',
            iconLib: MaterialCommunityIcons,
            trend: 12,
            trendType: 'up',
            color: '#10b981',
            bg: '#d1fae5'
        }
    ];

    const products = [
        { id: '1', name: 'Anti-Aging Cream', category: 'Skincare', price: '1,200,000 đ', sold: 342 },
        { id: '2', name: 'Matte Lipstick', category: 'Makeup', price: '450,000 đ', sold: 215 },
        { id: '3', name: 'Vitamin C Serum', category: 'Skincare', price: '890,000 đ', sold: 189 },
        { id: '4', name: 'Rose Water Toner', category: 'Toner', price: '320,000 đ', sold: 156 },
    ];

    const renderStatCard = (item) => {
        const IconLib = item.iconLib;
        return (
            <View key={item.title} style={styles.statCard}>
                <View style={[styles.iconWrapper, { backgroundColor: item.bg }]}>
                    <IconLib name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel} numberOfLines={1}>{item.title}</Text>
                <View style={[styles.trendPill, item.trendType === 'up' ? styles.trendUp : styles.trendDown]}>
                    <IconLib name={item.trendType === 'up' ? 'arrow-up' : 'arrow-down'} size={12} color={item.trendType === 'up' ? '#059669' : '#dc2626'} />
                    <Text style={[styles.trendText, { color: item.trendType === 'up' ? '#059669' : '#dc2626' }]}>
                        {Math.abs(item.trend)}%
                    </Text>
                </View>
            </View>
        );
    };

    const renderProductItem = ({ item }) => (
        <View style={styles.productItem}>
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
                </View>
            </View>
            <View style={styles.productMeta}>
                <Text style={styles.productPrice}>{item.price}</Text>
                <Text style={styles.productSold}>{t('sold', 'Đã bán')}: {item.sold}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('dashboard', 'Tổng quan')}</Text>
            </View>

            <View style={styles.statsGrid}>
                {stats.map(renderStatCard)}
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('admin_top_products', 'Sản phẩm bán chạy')}</Text>
            </View>

            <View style={styles.tableCard}>
                <FlatList
                    data={products}
                    renderItem={renderProductItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            </View>

            <View style={{ height: 30 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
    },
    header: {
        marginBottom: 20,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        width: (width - 44) / 2,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#6b7280',
        marginBottom: 8,
    },
    trendPill: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    trendUp: {
        backgroundColor: '#ecfdf5',
    },
    trendDown: {
        backgroundColor: '#fef2f2',
    },
    trendText: {
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    sectionHeader: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    tableCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    productItem: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 6,
    },
    categoryPill: {
        backgroundColor: '#fce7f3',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    categoryText: {
        color: '#be185d',
        fontSize: 10,
        fontWeight: '700',
    },
    productMeta: {
        alignItems: 'flex-end',
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    productSold: {
        fontSize: 12,
        color: '#ec4899',
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: '#f3f4f6',
        marginHorizontal: 16,
    },
});

export default DashboardScreen;
