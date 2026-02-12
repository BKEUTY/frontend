import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../../i18n/LanguageContext';
import { COLORS } from '../../constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';

const DashboardScreen = () => {
    const { t } = useLanguage();
    const { width } = useWindowDimensions();

    const stats = [
        {
            title: t('admin_dashboard_sales'),
            value: '40,689,000 đ',
            icon: 'currency-usd',
            iconLib: MaterialCommunityIcons,
            trend: 8.5,
            trendType: 'up',
            colors: ['#c2185b', '#e91e63'],
            bgLight: '#fce7f3'
        },
        {
            title: t('admin_dashboard_orders'),
            value: '1,250',
            icon: 'shopping-bag',
            iconLib: FontAwesome5,
            trend: 5.2,
            trendType: 'up',
            colors: ['#2980b9', '#3498db'],
            bgLight: '#dbeafe'
        },
        {
            title: t('admin_dashboard_appointments'),
            value: '600',
            icon: 'calendar-check',
            iconLib: MaterialCommunityIcons,
            trend: 12,
            trendType: 'up',
            colors: ['#059669', '#10b981'],
            bgLight: '#d1fae5'
        },
        {
            title: t('admin_dashboard_users'),
            value: '128',
            icon: 'account-group',
            iconLib: MaterialCommunityIcons,
            trend: 2.4,
            trendType: 'down',
            colors: ['#d97706', '#f59e0b'],
            bgLight: '#fef3c7'
        }
    ];

    const products = [
        { id: '1', name: 'Anti-Aging Cream', category: 'Skincare', price: '1,200,000 đ', sold: 342 },
        { id: '2', name: 'Matte Lipstick', category: 'Makeup', price: '450,000 đ', sold: 215 },
        { id: '3', name: 'Vitamin C Serum', category: 'Skincare', price: '890,000 đ', sold: 189 },
        { id: '4', name: 'Rose Water Toner', category: 'Toner', price: '320,000 đ', sold: 156 },
        { id: '5', name: 'Sunscreen SPF 50', category: 'Sunscreen', price: '550,000 đ', sold: 120 },
    ];

    const renderStatCard = (item, index) => {
        const IconLib = item.iconLib;
        const isTablet = width > 600;
        const cardWidth = isTablet ? (width - 48) / 4 : (width - 48) / 2;

        return (
            <TouchableOpacity
                key={index}
                style={[styles.statCard, { width: cardWidth }]}
                activeOpacity={0.9}
            >
                <View style={[styles.iconWrapper, { backgroundColor: item.bgLight }]}>
                    <IconLib name={item.icon} size={24} color={item.colors[0]} />
                </View>

                <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>{item.value}</Text>
                <Text style={styles.statLabel} numberOfLines={1}>{item.title}</Text>

                <View style={[styles.trendPill, item.trendType === 'up' ? styles.trendUp : styles.trendDown]}>
                    <Ionicons
                        name={item.trendType === 'up' ? 'trending-up' : 'trending-down'}
                        size={14}
                        color={item.trendType === 'up' ? '#059669' : '#dc2626'}
                    />
                    <Text style={[styles.trendText, { color: item.trendType === 'up' ? '#059669' : '#dc2626' }]}>
                        {Math.abs(item.trend)}%
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderProductItem = ({ item }) => (
        <View style={styles.productItem}>
            <View style={styles.productIcon}>
                <MaterialCommunityIcons name="package-variant-closed" size={24} color={COLORS.mainTitle} />
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <View style={styles.categoryPill}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                </View>
            </View>
            <View style={styles.productMeta}>
                <Text style={styles.productPrice}>{item.price}</Text>
                <Text style={styles.productSold}>{t('sold', 'Sold')}: {item.sold}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <LinearGradient
                colors={[COLORS.mainTitle, '#e91e63']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.headerSubtitle}>{t('welcome', 'Xin chào')}, Admin</Text>
                        <Text style={styles.headerTitle}>{t('dashboard', 'Tổng quan')}</Text>
                    </View>
                    <TouchableOpacity style={styles.profileBtn}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>A</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <View style={styles.contentContainer}>
                <View style={styles.statsGrid}>
                    {stats.map((item, index) => renderStatCard(item, index))}
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t('admin_top_products', 'Sản phẩm bán chạy')}</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>{t('view_all', 'Xem tất cả')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.tableCard}>
                    {products.length > 0 ? (
                        <FlatList
                            data={products}
                            renderItem={renderProductItem}
                            keyExtractor={item => item.id}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="package-variant-closed" size={48} color="#e2e8f0" />
                            <Text style={styles.emptyText}>{t('no_products_found', 'No products found')}</Text>
                        </View>
                    )}
                </View>
            </View>
            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerGradient: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#ffffff',
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    avatarText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 18,
    },
    contentContainer: {
        padding: 20,
        marginTop: -20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 4,
        marginBottom: 8,
    },
    iconWrapper: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0f172a',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 12,
    },
    trendPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    trendUp: {
        backgroundColor: '#f0fdf4',
    },
    trendDown: {
        backgroundColor: '#fef2f2',
    },
    trendText: {
        fontSize: 12,
        fontWeight: '800',
        marginLeft: 4,
    },
    trendLabel: {
        fontSize: 10,
        marginLeft: 4,
        color: '#94a3b8',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1a1a1a',
    },
    seeAllText: {
        fontSize: 14,
        color: COLORS.mainTitle,
        fontWeight: '600',
    },
    tableCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    productItem: {
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },
    productIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fce7f3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    categoryPill: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    categoryText: {
        color: '#64748b',
        fontSize: 11,
        fontWeight: '600',
    },
    productMeta: {
        alignItems: 'flex-end',
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.mainTitle,
        marginBottom: 2,
    },
    productSold: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginHorizontal: 18,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 220,
        backgroundColor: '#fafafa',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        borderStyle: 'dashed',
    },
    emptyText: {
        marginTop: 12,
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '500',
    },
});

export default DashboardScreen;
