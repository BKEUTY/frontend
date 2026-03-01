import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS } from '../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

const MOCK_PROMOTIONS = [
    {
        id: 1,
        name: "Trung Thu Tới, Giá Giảm Phơi Phới",
        code: "BKEUTY-TRUNGTHU-2025",
        revenue: 290000000,
        target: "Khách hàng VIP",
        startDate: "2025-10-01",
        endDate: "2025-10-08",
        status: "expired",
        applicable: true
    },
    {
        id: 2,
        name: "Phụ Nữ Việt Nam, Deal Sốc Sập Sàn",
        code: "BKEUTY-PNVN-2025",
        revenue: 350000000,
        target: "Tất cả",
        startDate: "2025-10-14",
        endDate: "2025-10-21",
        status: "ongoing",
        applicable: true
    },
    {
        id: 3,
        name: "Halloween Săn Sale Hóa Trang Cực Chất",
        code: "BKEUTY-HALLOWEEN-2025",
        revenue: 0,
        target: "Thành viên kim cương",
        startDate: "2025-10-25",
        endDate: "2025-11-01",
        status: "upcoming",
        applicable: false
    },
    {
        id: 4,
        name: "Black Friday Siêu Sale, Giảm Tới Bến",
        code: "BKEUTY-BLACKFRIDAY-2025",
        revenue: 0,
        target: "Tất cả",
        startDate: "2025-11-20",
        endDate: "2025-11-30",
        status: "upcoming",
        applicable: true
    },
    {
        id: 5,
        name: "Mừng Giáng Sinh, Rinh Quà Lung Linh",
        code: "BKEUTY-CHRISTMAS-2025",
        revenue: 0,
        target: "Khách hàng mới",
        startDate: "2025-12-20",
        endDate: "2025-12-27",
        status: "upcoming",
        applicable: false
    }
];

const PromotionScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredData = useMemo(() => {
        return MOCK_PROMOTIONS.filter(item => {
            const searchMatch =
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.code.toLowerCase().includes(searchTerm.toLowerCase());

            if (!searchMatch) return false;

            if (filterType === 'all') return true;
            if (filterType === 'applicable') return item.applicable;
            return item.status === filterType;
        });
    }, [filterType, searchTerm]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN').format(val);
    };

    const formatDate = (dateStr) => {
        const [y, m, d] = dateStr.split('-');
        return `${d}/${m}/${y}`;
    };

    const renderItem = ({ item }) => {
        const isExpired = item.status === 'expired';
        return (
            <View style={[styles.card, isExpired && styles.cardDisabled]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, isExpired && styles.textDisabled]}>{item.name}</Text>
                    <Text style={[styles.cardCode, isExpired && styles.textDisabled]}>{item.code}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, isExpired && styles.textDisabled]}>{t('promo_col_time')}:</Text>
                    <Text style={[styles.infoValue, isExpired && styles.textDisabled]}>
                        {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, isExpired && styles.textDisabled]}>{t('promo_col_target')}:</Text>
                    <Text style={[styles.infoValue, isExpired && styles.textDisabled]}>{item.target}</Text>
                </View>

                <View style={styles.footerRow}>
                    <View style={[
                        styles.statusBadge,
                        item.status === 'ongoing' && styles.statusOngoing,
                        item.status === 'upcoming' && styles.statusUpcoming,
                        item.status === 'expired' && styles.statusExpired
                    ]}>
                        <Text style={[
                            styles.statusText,
                            item.status === 'ongoing' && styles.statusTextOngoing,
                            item.status === 'upcoming' && styles.statusTextUpcoming,
                            item.status === 'expired' && styles.statusTextExpired
                        ]}>
                            {t(`promo_status_${item.status}`)}
                        </Text>
                    </View>

                    <View style={[
                        styles.appBadge,
                        item.applicable ? styles.appYes : styles.appNo,
                        isExpired && styles.statusExpired
                    ]}>
                        <Text style={[
                            styles.badgeText,
                            item.applicable ? styles.appYesText : styles.appNoText,
                            isExpired && styles.statusTextExpired
                        ]}>
                            {item.applicable ? t('yes') : t('no')}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <View style={styles.filters}>
                <Text style={styles.headerTitle}>{t('promo_list_title')}</Text>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('search_placeholder') || "Search promotions..."}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        placeholderTextColor="#999"
                    />
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                    {['all', 'ongoing', 'upcoming', 'expired', 'applicable'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.filterChip, filterType === type && styles.filterChipActive]}
                            onPress={() => setFilterType(type)}
                        >
                            <Text style={[styles.filterChipText, filterType === type && styles.filterChipTextActive]}>
                                {type === 'all' ? t('all') :
                                    type === 'applicable' ? t('promo_tab_applicable') :
                                        t(`promo_tab_${type}`)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.noResult}>{t('no_promos_found')}</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    filters: {
        padding: 20,
        backgroundColor: 'white',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        paddingBottom: 25,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#111',
        marginBottom: 20,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchIcon: {
        marginRight: 10,
        opacity: 0.8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#334155',
        fontWeight: '500',
    },
    chipContainer: {
        flexDirection: 'row',
        paddingVertical: 5,
    },
    filterChip: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginRight: 10,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: COLORS.mainTitle || '#c2185b',
        elevation: 6,
        shadowColor: COLORS.mainTitle || '#c2185b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    filterChipText: {
        color: '#64748b',
        fontWeight: '700',
        fontSize: 14,
    },
    filterChipTextActive: {
        color: 'white',
    },
    listContent: {
        padding: 16,
        paddingTop: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    cardDisabled: {
        backgroundColor: '#f8fafc',
        opacity: 0.7,
    },
    cardHeader: {
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 6,
        lineHeight: 24,
    },
    cardCode: {
        fontSize: 13,
        color: COLORS.mainTitle || '#c2185b',
        fontWeight: '800',
        backgroundColor: '#f1f5f9',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
    infoLabel: {
        width: 100,
        fontWeight: '700',
        color: '#94a3b8',
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        flex: 1,
        color: '#334155',
        fontSize: 14,
        fontWeight: '600',
    },
    textDisabled: {
        color: '#94a3b8',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        alignItems: 'center',
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#f8fafc',
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 100,
        minWidth: 110,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    statusOngoing: {
        backgroundColor: '#ecfdf5',
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    statusUpcoming: {
        backgroundColor: '#fdf4ff',
        borderColor: 'rgba(217, 70, 239, 0.2)',
    },
    statusExpired: {
        backgroundColor: '#f8fafc',
        borderColor: 'rgba(203, 213, 225, 0.2)',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statusTextOngoing: {
        color: '#059669',
    },
    statusTextUpcoming: {
        color: '#a855f7',
    },
    statusTextExpired: {
        color: '#64748b',
    },
    appBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        minWidth: 70,
        alignItems: 'center',
    },
    appYes: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    appNo: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    appYesText: {
        color: '#059669',
    },
    appNoText: {
        color: '#ef4444',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '800',
    },
    noResult: {
        textAlign: 'center',
        marginTop: 60,
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: '600',
    },
});


export default PromotionScreen;
