import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { useLanguage } from '../../i18n/LanguageContext';
import { COLORS } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

const MOCK_PROMOTIONS = [
    {
        id: 1,
        name: "Trung Thu Tới, Giá Giảm Phơi Phới",
        code: "BKEUTY-TRUNGTHU-2025",
        discount: "50%",
        target: "Khách hàng VIP",
        startDate: "2025-10-01",
        endDate: "2025-10-08",
        status: "expired",
        applicable: true,
        description: "Ưu đãi cực sốc lên tới 50% cho tất cả các mặt hàng mỹ phẩm tại BKEUTY nhân dịp Tết Trung Thu. Áp dụng cho đơn hàng từ 500k trở lên."
    },
    {
        id: 2,
        name: "Phụ Nữ Việt Nam, Deal Sốc Sập Sàn",
        code: "BKEUTY-PNVN-2025",
        discount: "100.000đ",
        target: "Tất cả",
        startDate: "2025-10-14",
        endDate: "2025-10-21",
        status: "ongoing",
        applicable: true,
        description: "Tặng ngay voucher trị giá 100.000đ cho hóa đơn mua sắm từ 1.000.000đ. Chào mừng ngày Phụ Nữ Việt Nam 20/10."
    },
    {
        id: 3,
        name: "Quốc Khánh Rực Rỡ, Sale Hết Cỡ",
        code: "BKEUTY-QUOCKHANH-2025",
        discount: "200.000đ",
        target: "Tất cả",
        startDate: "2025-08-29",
        endDate: "2025-09-03",
        status: "expired",
        applicable: false,
        description: "Giảm trực tiếp 200.000đ cho các set combo chăm sóc da toàn diện. Ưu đãi mừng Lễ Quốc Khánh 2/9."
    },
    {
        id: 4,
        name: "Halloween Deal Sốc Hóa Trang",
        code: "BKEUTY-HALLOWEEN-2025",
        discount: "30%",
        target: "Khách hàng VIP",
        startDate: "2025-10-29",
        endDate: "2025-11-02",
        status: "upcoming",
        applicable: true,
        description: "Sắm đồ trang điểm 'chất' Halloween với ưu đãi giảm 30%. Chỉ dành riêng cho hội viện VIP của BKEUTY."
    },
    {
        id: 5,
        name: "Hè Sang Shopping Thả Ga",
        code: "BKEUTY-SUMMER-2025",
        discount: "Freeship",
        target: "Tất cả",
        startDate: "2025-07-01",
        endDate: "2025-08-31",
        status: "expired",
        applicable: true,
        description: "Miễn phí vận chuyển toàn quốc cho mọi đơn hàng trong suốt mùa hè rực rỡ."
    },
    {
        id: 6,
        name: "Siêu Hội 11.11 Bùng Nổ",
        code: "BKEUTY-1111-2025",
        discount: "Mua 1 Tặng 1",
        target: "Khách hàng Premium",
        startDate: "2025-11-10",
        endDate: "2025-11-11",
        status: "upcoming",
        applicable: false,
        description: "Săn deal 11.11 với chương trình Mua 1 Tặng 1 cho các dòng son môi và kem nền bán chạy nhất."
    }
];

const PromotionScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [showVipInfo, setShowVipInfo] = useState(false);

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

    const InfoIcon = () => (
        <TouchableOpacity
            onPress={() => setShowVipInfo(true)}
            style={styles.infoIconTouch}
        >
            <Ionicons name="information-circle-outline" size={16} color="#94a3b8" />
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => {
        const isExpired = item.status === 'expired';
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedPromo(item)}
                style={[styles.card, isExpired && styles.cardDisabled]}
            >
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, isExpired && styles.textDisabled]}>{item.name}</Text>
                    <Text style={[styles.cardCode, isExpired && styles.textDisabled]}>{item.code}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, isExpired && styles.textDisabled]}>{t('promo_col_discount')}:</Text>
                    <Text style={[styles.infoValue, styles.highlightValue, isExpired && styles.textDisabled]}>{item.discount}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, isExpired && styles.textDisabled]}>
                        {t('promo_col_target')}:
                    </Text>
                    <View style={styles.rowInline}>
                        <Text style={[styles.infoValue, isExpired && styles.textDisabled]}>{item.target}</Text>
                        <InfoIcon />
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, isExpired && styles.textDisabled]}>{t('promo_col_time')}:</Text>
                    <Text style={[styles.infoValue, isExpired && styles.textDisabled]}>
                        {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </Text>
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
            </TouchableOpacity>
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

            {/* Promo Detail Modal */}
            <Modal
                visible={!!selectedPromo}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setSelectedPromo(null)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setSelectedPromo(null)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('promo_info_title')}</Text>
                            <TouchableOpacity onPress={() => setSelectedPromo(null)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {selectedPromo && (
                            <ScrollView style={styles.modalBody}>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalLabel}>{t('promo_col_name')}:</Text>
                                    <Text style={styles.modalValue}>{selectedPromo.name}</Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalLabel}>{t('promo_col_code')}:</Text>
                                    <Text style={[styles.modalValue, styles.modalCode]}>{selectedPromo.code}</Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalLabel}>{t('promo_col_discount')}:</Text>
                                    <Text style={[styles.modalValue, styles.modalDiscount]}>{selectedPromo.discount}</Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalLabel}>{t('promo_col_target')}:</Text>
                                    <Text style={styles.modalValue}>{selectedPromo.target}</Text>
                                </View>
                                <View style={styles.modalDetailRow}>
                                    <Text style={styles.modalLabel}>{t('promo_col_time')}:</Text>
                                    <Text style={styles.modalValue}>
                                        {formatDate(selectedPromo.startDate)} - {formatDate(selectedPromo.endDate)}
                                    </Text>
                                </View>
                                <View style={styles.modalDescription}>
                                    <Text style={styles.modalLabel}>{t('description')}:</Text>
                                    <Text style={styles.modalDescriptionText}>{selectedPromo.description}</Text>
                                </View>
                            </ScrollView>
                        )}

                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setSelectedPromo(null)}
                        >
                            <Text style={styles.modalCloseButtonText}>{t('confirm')}</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {/* VIP Info Modal */}
            <Modal
                visible={showVipInfo}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowVipInfo(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowVipInfo(false)}
                >
                    <View style={[styles.modalContent, styles.vipModal]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('vip_condition_title')}</Text>
                            <TouchableOpacity onPress={() => setShowVipInfo(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            {t('vip_condition_content').split('\n').map((line, i) => (
                                <Text key={i} style={styles.vipConditionLine}>{line}</Text>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setShowVipInfo(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>{t('cancel') || 'Đóng'}</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
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
    // New Styles
    infoIconTouch: {
        marginLeft: 6,
        padding: 2,
    },
    rowInline: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    highlightValue: {
        color: COLORS.mainTitle || '#c2185b',
        fontWeight: '800',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        width: '100%',
        maxHeight: '80%',
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    vipModal: {
        maxHeight: '40%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    modalBody: {
        padding: 20,
    },
    modalDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc',
    },
    modalLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    modalValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
        flex: 1,
        textAlign: 'right',
        marginLeft: 20,
    },
    modalCode: {
        color: COLORS.mainTitle || '#c2185b',
        fontFamily: 'monospace',
    },
    modalDiscount: {
        color: '#059669',
        fontSize: 16,
    },
    modalDescription: {
        marginTop: 10,
        paddingBottom: 20,
    },
    modalDescriptionText: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 22,
        color: '#475569',
    },
    modalCloseButton: {
        backgroundColor: COLORS.mainTitle || '#c2185b',
        padding: 16,
        alignItems: 'center',
        margin: 20,
        borderRadius: 16,
    },
    modalCloseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '800',
    },
    vipConditionLine: {
        fontSize: 14,
        lineHeight: 22,
        color: '#334155',
        marginBottom: 12,
    }
});


export default PromotionScreen;
