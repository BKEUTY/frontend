import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS } from '../constants/Theme';

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
                            isExpired && styles.statusTextExpired
                        ]}>
                            {t(`promo_status_${item.status}`)}
                        </Text>
                    </View>

                    <View style={[
                        styles.appBadge,
                        item.applicable ? styles.appYes : styles.appNo,
                        isExpired && styles.statusExpired // Force gray for expired rows
                    ]}>
                        <Text style={[
                            styles.badgeText,
                            isExpired && styles.statusTextExpired // Force dark text
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
                <TextInput
                    style={styles.searchInput}
                    placeholder={t('search_placeholder') || "Search promotions..."}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
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
        backgroundColor: '#f5f5f5',
    },
    filters: {
        padding: 15,
        backgroundColor: 'white',
        elevation: 2,
    },
    searchInput: {
        height: 48,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: 'white',
        fontSize: 16,
    },
    chipContainer: {
        flexDirection: 'row',
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
        backgroundColor: '#fff',
    },
    filterChipActive: {
        backgroundColor: COLORS.mainTitle || '#c2185b',
        borderColor: COLORS.mainTitle || '#c2185b',
    },
    filterChipText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 14,
    },
    filterChipTextActive: {
        color: 'white',
    },
    listContent: {
        padding: 15,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    cardDisabled: {
        backgroundColor: '#f2f2f2',
        opacity: 0.6,
    },
    cardHeader: {
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 10,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    cardCode: {
        fontSize: 14,
        color: COLORS.mainTitle || '#c2185b',
        fontWeight: '600',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    infoLabel: {
        width: 100,
        fontWeight: '600',
        color: '#666',
        fontSize: 14,
    },
    infoValue: {
        flex: 1,
        color: '#333',
        fontSize: 14,
    },
    textDisabled: {
        color: '#999',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusOngoing: {
        backgroundColor: '#00c853',
    },
    statusUpcoming: {
        backgroundColor: '#6200ea',
    },
    statusExpired: {
        backgroundColor: '#ccc', // Gray for both expired status and badges in disabled cards
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    statusTextExpired: {
        color: '#666', // Darker text for readability on gray
    },
    appBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    appYes: {
        backgroundColor: '#00c853',
    },
    appNo: {
        backgroundColor: '#9e9e9e',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    noResult: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
    },
});

export default PromotionScreen;
