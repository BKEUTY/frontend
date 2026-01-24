import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS } from '../constants/Theme';

const RetailSystemScreen = ({ navigation }) => {
    const { t, language } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBranch, setSelectedBranch] = useState(null);

    // Mock Data (Synced with Web)
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
        backgroundColor: '#f5f5f5',
    },
    filters: {
        padding: 15,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 24, // 1.5rem
        fontWeight: 'bold',
        color: COLORS.mainTitle || '#c2185b',
        marginBottom: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25, // Pill shape
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        height: 48,
        marginBottom: 15,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 10,
        opacity: 0.5,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    statusFilters: {
        flexDirection: 'row',
    },
    filterChip: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25, // Pill shape
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
        backgroundColor: '#fff',
    },
    filterChipActive: {
        backgroundColor: COLORS.mainTitle || '#c2185b',
        borderColor: COLORS.mainTitle || '#c2185b',
        elevation: 4,
        shadowColor: COLORS.mainTitle || '#c2185b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
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
        paddingBottom: 30,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        marginBottom: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardDisabled: {
        backgroundColor: '#f2f2f2',
        opacity: 0.6,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    badgeOpen: {
        backgroundColor: '#00c853',
    },
    badgeClosed: {
        backgroundColor: '#9e9e9e',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    infoIcon: {
        marginRight: 8,
        fontSize: 16,
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
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    detailButtonDisabled: {
        borderColor: '#ddd',
        backgroundColor: 'transparent',
    },
    detailButtonText: {
        color: COLORS.mainTitle || '#c2185b',
        fontWeight: 'bold',
        fontSize: 15,
    },
    detailButtonTextDisabled: {
        color: '#999',
    },
    noResult: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
    },
    backButton: {
        padding: 15,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        color: COLORS.mainTitle || '#c2185b',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    detailContainer: {
        padding: 24,
        backgroundColor: 'white',
        flex: 1,
        margin: 15,
        borderRadius: 16,
        elevation: 4,
    },
    detailTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.mainTitle || '#c2185b',
        marginBottom: 20,
        textAlign: 'left',
    },
    detailRow: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 15,
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#888',
        fontSize: 14,
        marginBottom: 5,
    },
    detailValue: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default RetailSystemScreen;
