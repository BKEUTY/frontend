import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/Theme';
import { useLanguage } from '../../i18n/LanguageContext';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const OrderDetailScreen = () => {
    const navigation = useNavigation();
    const { t } = useLanguage();

    const orderData = {
        id: '3354654654526',
        createdAt: '10/10/2023',
        expectedDelivery: '10/10/2023',
        status_logs: [
            { title: t('order_placed_success') || 'Đặt hàng thành công', desc: t('order_placed_desc') || 'Đơn hàng đã được đặt', time: '11:45 PM', icon: 'box-open' },
            { title: t('preparing_order') || 'Đang được chuẩn bị', desc: t('preparing_order_desc') || 'Người gửi đang chuẩn bị hàng', time: '11:45 PM', icon: 'cogs' },
            { title: t('international_processing') || 'Đang được xử lý ở nước ngoài', desc: t('international_processing_desc') || 'Đơn hàng đã xuất kho quốc tế : Nam Ninh', time: '11:45 PM', icon: 'plane-departure' }
        ],
        subtotal: 15755,
        discount: 15755,
        shipping: 30000,
        tax: 0,
        total: 46000
    };

    const renderTimelineStep = (icon, label, date, isActive, isCompleted) => {
        return (
            <View style={styles.timelineStep}>
                <View style={[
                    styles.stepIconBox,
                    isCompleted && styles.stepCompleted,
                    isActive && styles.stepActive
                ]}>
                    <FontAwesome5
                        name={icon}
                        size={18}
                        color={isActive || isCompleted ? 'white' : '#bbb'}
                        style={isCompleted && !isActive ? { color: COLORS.mainTitle } : {}}
                    />
                </View>
                <View style={[styles.stepContent]}>
                    <Text style={[styles.stepLabel, isActive && styles.textActive]}>{label}</Text>
                    <Text style={styles.stepDate}>{date}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header / Nav */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('order_detail') || 'Chi tiết đơn hàng'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showVerticalScrollIndicator={false}>
                {/* Order ID & Actions */}
                <View style={styles.sectionCard}>
                    <View style={styles.orderIdRow}>
                        <Text style={styles.orderIdLabel}>{t('order_id_label') || 'Đơn hàng #'}{orderData.id}</Text>
                    </View>
                    <View style={styles.actionButtonsRow}>
                        <TouchableOpacity style={styles.btnInvoice}>
                            <FontAwesome5 name="file-invoice" size={14} color="#333" />
                            <Text style={styles.btnText}>{t('invoice') || 'Hóa đơn'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnTrack}>
                            <FontAwesome5 name="map-marked-alt" size={14} color="white" />
                            <Text style={[styles.btnText, { color: 'white' }]}>{t('track_order') || 'Theo dõi'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Dates */}
                <View style={styles.datesCard}>
                    <Text style={styles.dateText}>{t('order_time') || 'Thời gian:'} <Text style={styles.bold}>{orderData.createdAt}</Text></Text>
                    <View style={styles.expectedRow}>
                        <FontAwesome5 name="shipping-fast" size={14} color={COLORS.mainTitle} />
                        <Text style={styles.expectedText}>{t('expected_delivery') || 'Giao dự kiến:'} <Text style={styles.bold}>{orderData.expectedDelivery}</Text></Text>
                    </View>
                </View>

                {/* Vertical Timeline for Mobile (easier to read than horizontal) */}
                <View style={styles.sectionCard}>
                    <View style={styles.timelineContainer}>
                        {/* Connecting Line */}
                        <View style={styles.timelineLine} />

                        {renderTimelineStep('check', t('timeline_paid') || 'Đã thanh toán', '10/10/2023', false, true)}
                        {renderTimelineStep('box-open', t('timeline_shipped') || 'Đã giao ĐVVC', '10/10/2023', false, true)}
                        {renderTimelineStep('shipping-fast', t('timeline_delivering') || 'Đang giao hàng', 'Dự kiến 12/10', true, false)}
                        {renderTimelineStep('inbox', t('timeline_delivered') || 'Đã nhận', '---', false, false)}
                    </View>
                </View>

                {/* Logs */}
                <View style={styles.sectionCard}>
                    <View style={styles.logsContainer}>
                        {/* Vertical Line aligned to icon center */}
                        <View style={styles.logsLine} />

                        {orderData.status_logs.map((log, index) => (
                            <View key={index} style={styles.logItem}>
                                <View style={[styles.logIconBox, index === 0 && styles.logIconActive]}>
                                    <FontAwesome5
                                        name={log.icon}
                                        size={16}
                                        color={index === 0 ? 'white' : '#666'}
                                    />
                                </View>
                                <View style={styles.logContent}>
                                    <Text style={[styles.logTitle, index === 0 && styles.textActive]}>{log.title}</Text>
                                    <Text style={styles.logDesc}>{log.desc}</Text>
                                    <Text style={styles.logTime}>{log.time}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Info Grid */}
                <View style={styles.infoCard}>
                    <View style={styles.infoSection}>
                        <Text style={styles.infoTitle}>{t('payment_header') || 'Thanh toán'}</Text>
                        <Text style={styles.infoText}>Visa **56 <Text style={styles.visaBadge}> VISA </Text></Text>
                    </View>
                    <View style={[styles.infoSection, { borderTopWidth: 1, borderTopColor: '#fceef5', marginTop: 10, paddingTop: 10 }]}>
                        <Text style={styles.infoTitle}>{t('delivery_header') || 'Địa chỉ nhận hàng'}</Text>
                        <Text style={styles.infoText}>192/4 Lý tự trọng, Ninh Kiều, Cần Thơ</Text>
                    </View>
                </View>

                {/* Summary */}
                <View style={[styles.sectionCard, styles.summaryCard]}>
                    <Text style={[styles.infoTitle, { marginBottom: 15 }]}>{t('order_overview') || 'Chi tiết thanh toán'}</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('subtotal') || 'Tổng tiền hàng'}</Text>
                        <Text style={styles.summaryValue}>{orderData.subtotal.toLocaleString()}đ</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('discount') || 'Giảm giá'}</Text>
                        <Text style={styles.summaryValue}>(20%) - {orderData.discount.toLocaleString()}đ</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('shipping_fee') || 'Phí vận chuyển'}</Text>
                        <Text style={styles.summaryValue}>{orderData.shipping.toLocaleString()}đ</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>{t('total') || 'Thành tiền'}</Text>
                        <Text style={styles.totalValue}>{orderData.total.toLocaleString()}đ</Text>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 55,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
        padding: 15,
    },
    sectionCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 2,
    },
    orderIdRow: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f9f9f9',
        paddingBottom: 15,
    },
    orderIdLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.mainTitle,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 15,
    },
    btnInvoice: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: 'white',
        gap: 8,
    },
    btnTrack: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
        backgroundColor: COLORS.mainTitle,
        gap: 8,
    },
    btnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    datesCard: {
        backgroundColor: '#fafafa',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    dateText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    expectedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    expectedText: {
        fontSize: 14,
        color: COLORS.mainTitle,
        fontWeight: '600',
    },
    bold: {
        fontWeight: '700',
    },

    /* Vertical Timeline Styles */
    timelineContainer: {
        position: 'relative',
        paddingLeft: 10,
    },
    timelineLine: {
        position: 'absolute',
        left: 30, // Center of 40px icon (20) + paddingLeft(10)? No. paddingLeft is container. Icon container is 40px width. Center is 20px. So line should avail at 20px relative to item.
        // Let's align relative to the stepIconBox.
        top: 20,
        bottom: 20,
        width: 2,
        backgroundColor: '#e9e9e9',
        zIndex: 0,
    },
    timelineStep: {
        flexDirection: 'row',
        marginBottom: 25,
        alignItems: 'flex-start',
    },
    stepIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        zIndex: 1,
    },
    stepCompleted: {
        borderColor: COLORS.mainTitle,
        backgroundColor: 'white',
    },
    stepActive: {
        borderColor: COLORS.mainTitle,
        backgroundColor: COLORS.mainTitle,
        elevation: 4,
    },
    stepContent: {
        flex: 1,
        paddingTop: 8,
    },
    stepLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 4,
    },
    stepDate: {
        fontSize: 12,
        color: '#999',
    },
    textActive: {
        color: COLORS.mainTitle,
        fontWeight: '700',
    },

    /* Logs Styles */
    logsContainer: {
        position: 'relative',
        paddingLeft: 5,
    },
    logsLine: {
        position: 'absolute',
        top: 20,
        bottom: 20,
        left: 20, // Center of 40px icon is 20px.
        width: 2,
        backgroundColor: '#e9e9e9',
        zIndex: 0,
    },
    logItem: {
        flexDirection: 'row',
        marginBottom: 25,
        alignItems: 'flex-start',
    },
    logIconBox: {
        width: 32, // Smaller detailed logs
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        borderWidth: 2,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        zIndex: 1,
        // Centering alignment: 32px width => center 16px. Line is at 20px?
        // Let's make icon 40px to match line or adjust line.
        // Web uses 40px icon. Let's use 40px.
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    logIconActive: {
        backgroundColor: COLORS.mainTitle,
        borderColor: 'white',
        elevation: 4,
    },
    logContent: {
        flex: 1,
        paddingTop: 8, // Align text with icon center visually
    },
    logTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    logDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    logTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 6,
        textAlign: 'right',
    },

    /* Info Grid */
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#fceef5',
        overflow: 'hidden',
    },
    infoSection: {
        padding: 20,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.mainTitle,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
    },
    visaBadge: {
        backgroundColor: '#1a1f71',
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },

    /* Summary */
    summaryCard: {
        backgroundColor: '#fffbfc',
        borderColor: '#f8e1eb',
        borderWidth: 1,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#555',
    },
    summaryValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#dabac8',
        borderStyle: 'dashed', // iOS doesn't support 'dashed' well for borderTop? It mostly works or use View.
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.mainTitle,
    },
});

export default OrderDetailScreen;
