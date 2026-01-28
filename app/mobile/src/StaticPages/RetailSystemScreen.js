import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS } from '../constants/Theme';

const RetailSystemScreen = ({ navigation }) => {
    const { t, language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBranch, setSelectedBranch] = useState(null);


    const branches = useMemo(() => [
        { id: 1, name: "BKEUTY - Quận 1", address: "123 Lê Lợi, Phường Bến Nghé, Quận 1", phone: "0908 741 625", status: "Open", open_date: "2024-01-15", manager: "Nguyễn Văn A" },
        { id: 9, name: "BKEUTY - Đồng Nai", address: "Ấp Đất Mới, xã Long Phước, Đồng Nai", phone: "0908 741 633", status: "Closed", open_date: "2024-05-10", manager: "Nguyễn Văn I" },
        { id: 2, name: "BKEUTY - Quận 2", address: "45 Thảo Điền, Phường Thảo Điền, Quận 2", phone: "0908 741 626", status: "Open", open_date: "2024-02-01", manager: "Trần Thị B" },
        { id: 3, name: "BKEUTY - Quận 3", address: "78 Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3", phone: "0908 741 627", status: "Open", open_date: "2024-02-10", manager: "Lê Văn C" },
        { id: 12, name: "BKEUTY - Hà Nội 2", address: "789 Phố Huế, Hai Bà Trưng, Hà Nội", phone: "0908 741 636", status: "Closed", open_date: "2024-07-01", manager: "Hoàng Thị M" },
        { id: 4, name: "BKEUTY - Quận 5", address: "90 Nguyễn Trãi, Phường 3, Quận 5", phone: "0908 741 628", status: "Open", open_date: "2024-03-05", manager: "Phạm Thị D" },
        { id: 5, name: "BKEUTY - Quận 7", address: "101 Nguyễn Văn Linh, Tân Phong, Quận 7", phone: "0908 741 629", status: "Open", open_date: "2024-03-20", manager: "Hoàng Văn E" },
        { id: 6, name: "BKEUTY - Quận 10", address: "123 Tô Hiến Thành, Phường 14, Quận 10", phone: "0908 741 630", status: "Open", open_date: "2024-04-01", manager: "Nguyễn Văn F" },
        { id: 7, name: "BKEUTY - Quận 11", address: "234 Lạc Long Quân, Phường 5, Quận 11", phone: "0908 741 631", status: "Open", open_date: "2024-04-15", manager: "Trần Văn G" },
        { id: 8, name: "BKEUTY - Quận 12", address: "456 Lê Văn Khương, Thới An, Quận 12", phone: "0908 741 632", status: "Open", open_date: "2024-05-01", manager: "Lê Thị H" },
        { id: 10, name: "BKEUTY - Thủ Đức", address: "438 Võ Văn Ngân, TP. Thủ Đức", phone: "0908 741 634", status: "Open", open_date: "2024-06-01", manager: "Trần Văn K" },
        { id: 11, name: "BKEUTY - Hà Nội 1", address: "101 Cầu Giấy, Quận Cầu Giấy, Hà Nội", phone: "0908 741 635", status: "Open", open_date: "2024-06-15", manager: "Phạm Văn L" },
    ], []);

    const filteredBranches = useMemo(() => {
        return branches.filter(branch => {
            const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [branches, searchTerm, statusFilter]);

    if (selectedBranch) {
        return (
            <ScrollView style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => setSelectedBranch(null)}>
                    <Text style={styles.backButtonText}>❮ {t('retail_back_to_list')}</Text>
                </TouchableOpacity>

                <View style={styles.detailContainer}>
                    <Text style={styles.detailTitle}>{selectedBranch.name}</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('retail_address')}:</Text>
                        <Text style={styles.detailValue}>{selectedBranch.address}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('retail_phone')}:</Text>
                        <Text style={styles.detailValue}>{selectedBranch.phone}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('status')}:</Text>
                        <Text style={[styles.detailValue, { color: selectedBranch.status === 'Open' ? '#2e7d32' : '#d32f2f', fontWeight: 'bold' }]}>
                            {selectedBranch.status === 'Open' ? t('retail_status_open') : t('retail_status_closed')}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('retail_open_date')}:</Text>
                        <Text style={styles.detailValue}>{selectedBranch.open_date}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('retail_manager')}:</Text>
                        <Text style={styles.detailValue}>{selectedBranch.manager}</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }

    const renderItem = ({ item }) => {
        const isClosed = item.status === 'Closed';
        return (
            <View style={[styles.card, isClosed && styles.cardDisabled]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <View style={[styles.badge, item.status === 'Open' ? styles.badgeOpen : styles.badgeClosed]}>
                        <Text style={styles.badgeText}>
                            {item.status === 'Open' ? t('retail_status_open') : t('retail_status_closed')}
                        </Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📍</Text>
                    <Text style={styles.infoText}>{item.address}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📞</Text>
                    <Text style={styles.infoText}>{item.phone}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.detailButton, isClosed && styles.detailButtonDisabled]}
                    onPress={() => !isClosed && setSelectedBranch(item)}
                    disabled={isClosed}
                >
                    <Text style={[styles.detailButtonText, isClosed && styles.detailButtonTextDisabled]}>
                        {t('retail_detail')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.filters}>
                <Text style={styles.headerTitle}>{t('retail_system')}</Text>
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('retail_search_placeholder')}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        placeholderTextColor="#999"
                    />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
                    <TouchableOpacity
                        style={[styles.filterChip, statusFilter === 'all' && styles.filterChipActive]}
                        onPress={() => setStatusFilter('all')}
                    >
                        <Text style={[styles.filterChipText, statusFilter === 'all' && styles.filterChipTextActive]}>
                            {t('all')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, statusFilter === 'Open' && styles.filterChipActive]}
                        onPress={() => setStatusFilter('Open')}
                    >
                        <Text style={[styles.filterChipText, statusFilter === 'Open' && styles.filterChipTextActive]}>
                            {t('retail_status_open')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterChip, statusFilter === 'Closed' && styles.filterChipActive]}
                        onPress={() => setStatusFilter('Closed')}
                    >
                        <Text style={[styles.filterChipText, statusFilter === 'Closed' && styles.filterChipTextActive]}>
                            {t('retail_status_closed')}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {filteredBranches.length > 0 ? (
                <FlatList
                    data={filteredBranches}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <Text style={styles.noResult}>{t('retail_no_result')}</Text>
            )}
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
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        paddingBottom: 25,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.mainTitle || '#c2185b',
        marginBottom: 20,
        letterSpacing: -0.5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 27,
        borderWidth: 1,
        borderColor: '#eee',
        paddingHorizontal: 18,
        height: 54,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    searchIcon: {
        fontSize: 20,
        marginRight: 12,
        opacity: 0.4,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
    },
    statusFilters: {
        flexDirection: 'row',
        paddingVertical: 5,
    },
    filterChip: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginRight: 12,
        backgroundColor: '#fff',
        minWidth: 80,
        alignItems: 'center',
    },
    filterChipActive: {
        backgroundColor: COLORS.mainTitle || '#c2185b',
        borderColor: COLORS.mainTitle || '#c2185b',
        elevation: 6,
        shadowColor: COLORS.mainTitle || '#c2185b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    filterChipText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 14,
    },
    filterChipTextActive: {
        color: 'white',
        fontWeight: '700',
    },
    listContent: {
        padding: 15,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    cardDisabled: {
        backgroundColor: '#f9f9f9',
        opacity: 0.7,
        elevation: 0,
        borderColor: '#eee',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
        gap: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        flex: 1,
        lineHeight: 24,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    badgeOpen: {
        backgroundColor: '#e8f5e9',
    },
    badgeClosed: {
        backgroundColor: '#f5f5f5',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2e7d32',
    },


    infoRow: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    infoIcon: {
        marginRight: 10,
        fontSize: 16,
        opacity: 0.7,
        marginTop: 2,
    },
    infoText: {
        color: '#555',
        fontSize: 15,
        flex: 1,
        lineHeight: 22,
    },
    detailButton: {
        marginTop: 15,
        borderWidth: 1,
        borderColor: COLORS.mainTitle || '#c2185b',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    detailButtonDisabled: {
        borderColor: '#e0e0e0',
        backgroundColor: 'transparent',
    },
    detailButtonText: {
        color: COLORS.mainTitle || '#c2185b',
        fontWeight: '700',
        fontSize: 15,
    },
    detailButtonTextDisabled: {
        color: '#aaa',
    },
    noResult: {
        textAlign: 'center',
        marginTop: 60,
        color: '#999',
        fontSize: 16,
    },
    backButton: {
        padding: 20,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButtonText: {
        color: COLORS.mainTitle || '#c2185b',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    },
    detailContainer: {
        padding: 24,
        backgroundColor: 'white',
        flex: 1,
    },
    detailTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.mainTitle || '#c2185b',
        marginBottom: 25,
        textAlign: 'left',
    },
    detailRow: {
        marginBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        paddingBottom: 15,
    },
    detailLabel: {
        fontWeight: '700',
        color: '#888',
        fontSize: 13,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailValue: {
        color: '#333',
        fontSize: 17,
        fontWeight: '500',
        lineHeight: 24,
    },
});


export default RetailSystemScreen;
