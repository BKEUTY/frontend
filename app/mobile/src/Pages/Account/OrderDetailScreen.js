import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../constants/Theme';
import { useLanguage } from '../../i18n/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useOrderDetail } from '../../hooks/useOrders';

const { width } = Dimensions.get('window');

const OrderDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId } = route.params || {};
    const { t } = useLanguage();
    
    const { data: order, isLoading } = useOrderDetail(orderId);

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

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.mainTitle} />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle-outline" size={60} color="#e5e7eb" />
                <Text style={{ marginTop: 10, color: '#6b7280' }}>{t('no_data')}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
                    <Text style={{ color: COLORS.mainTitle, fontWeight: 'bold' }}>{t('back')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderTimelineStep = (icon, label, date, isActive, isCompleted) => {
        return (
            <View style={styles.timelineStep}>
                <View style={styles.stepIconBoxOuter}>
                    {isActive || isCompleted ? (
                        <LinearGradient
                            colors={isActive ? [COLORS.mainTitle, COLORS.mainTitleDark || '#880e4f'] : ['#ecfdf5', '#ecfdf5']}
                            style={[styles.stepIconBox, isActive && styles.stepActiveShadow, isCompleted && !isActive && { borderColor: '#10b981' }]}
                        >
                            <Ionicons
                                name={icon}
                                size={18}
                                color={isActive ? 'white' : '#10b981'}
                            />
                        </LinearGradient>
                    ) : (
                        <View style={styles.stepIconBox}>
                            <Ionicons name={icon} size={18} color="#9ca3af" />
                        </View>
                    )}
                </View>
                <View style={styles.stepContent}>
                    <Text style={[styles.stepLabel, isActive && styles.textActive]}>{label}</Text>
                    <Text style={styles.stepDate}>{date || '---'}</Text>
                </View>
            </View>
        );
    };

    const isBankPending = order.paymentMethod === 'BANK' && order.paymentStatus === 'UNPAID' && order.status !== 'CANCELLED';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('order_detail')}</Text>
                <TouchableOpacity style={styles.downloadBtn}>
                    <Ionicons name="download-outline" size={22} color={COLORS.mainTitle} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* QR Code Section for Pending Payments */}
                {isBankPending && (
                    <View style={styles.qrCard}>
                        <LinearGradient colors={['#fff', '#fdf2f8']} style={styles.qrGradient}>
                            <Text style={styles.qrTitle}>{t('payment_pending_title')}</Text>
                            <Text style={styles.qrDesc}>{t('payment_8h_notice')}</Text>
                            
                            <View style={styles.qrBox}>
                                <Image source={{ uri: order.qrCodeLink }} style={styles.qrImage} />
                                <View style={styles.qrBadge}>
                                    <Text style={styles.qrBadgeText}>SECURE PAYMENT</Text>
                                </View>
                            </View>

                            <View style={styles.paymentDetails}>
                                <View style={styles.payRow}>
                                    <Text style={styles.payLabel}>{t('amount')}</Text>
                                    <Text style={styles.payValue}>{order.grandTotal.toLocaleString()}{t('unit_vnd')}</Text>
                                </View>
                                <View style={styles.payRow}>
                                    <Text style={styles.payLabel}>{t('order_id')}</Text>
                                    <Text style={styles.payValue}>DH{order.id}</Text>
                                </View>
                            </View>

                            <View style={styles.pollingStatus}>
                                <ActivityIndicator size="small" color={COLORS.mainTitle} />
                                <Text style={styles.pollingText}>{t('payment_checking')}</Text>
                            </View>
                        </LinearGradient>
                    </View>
                )}

                <View style={styles.mainCard}>
                    <View style={styles.orderIdHeader}>
                        <View>
                            <Text style={styles.orderIdLabel}>{t('order_id_label')} #{order.id}</Text>
                            <Text style={styles.orderDateText}>{t('order_time')}: {order.formattedDate}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
                            <Text style={[styles.statusBadgeText, { color: getStatusColor(order.status) }]}>
                                {t(order.status.toLowerCase()) || order.status}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.itemSection}>
                        {order.items?.map((item, index) => (
                            <View key={index} style={styles.productItem}>
                                <View style={styles.imageWrapper}>
                                    <Image 
                                        source={{ uri: item.productVariantImage || 'https://via.placeholder.com/100' }} 
                                        style={styles.productImage} 
                                    />
                                </View>
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={2}>{item.productVariantName}</Text>
                                    <View style={styles.qtyPriceRow}>
                                        <Text style={styles.productQty}>x{item.quantity}</Text>
                                        <Text style={styles.productPrice}>{(item.promotionPrice || item.price)?.toLocaleString()}{t('unit_vnd')}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t('shipping_timeline')}</Text>
                </View>

                <View style={styles.timelineCard}>
                    <View style={styles.timelineLine} />
                    {renderTimelineStep('card-outline', t('timeline_paid'), order.paymentStatus === 'PAID' ? order.formattedDate : null, order.paymentStatus === 'PAID', order.paymentStatus === 'PAID')}
                    {renderTimelineStep('cube-outline', t('preparing_order'), order.status === 'PROCESSING' ? order.formattedDate : null, order.status === 'PROCESSING', ['PROCESSING', 'SHIPPING', 'SUCCEEDED'].includes(order.status))}
                    {renderTimelineStep('bicycle-outline', t('timeline_delivering'), order.status === 'SHIPPING' ? order.formattedDate : null, order.status === 'SHIPPING', ['SHIPPING', 'SUCCEEDED'].includes(order.status))}
                    {renderTimelineStep('checkmark-circle-outline', t('timeline_delivered'), order.status === 'SUCCEEDED' ? order.formattedDate : null, order.status === 'SUCCEEDED', order.status === 'SUCCEEDED')}
                </View>

                <View style={styles.infoGrid}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="location-outline" size={20} color={COLORS.mainTitle} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>{t('delivery_header')}</Text>
                            <Text style={[styles.infoValue, { fontWeight: '800' }]} numberOfLines={1}>
                                {order.buyerName || order.userName || t('guest')}
                            </Text>
                            <Text style={styles.infoValue} numberOfLines={1}>
                                {order.buyerPhoneNumber || ''}
                            </Text>
                            <Text style={[styles.infoValue, { fontSize: 11, marginTop: 4 }]} numberOfLines={2}>
                                {order.address ? `${order.address.address}, ${order.address.ward?.wardName}, ${order.address.district?.districtName}, ${order.address.province?.provinceName}` : '---'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="card-outline" size={20} color={COLORS.mainTitle} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>{t('payment_header')}</Text>
                            <Text style={styles.infoValue}>{t(`payment_method_${order.paymentMethod}`) || order.paymentMethod}</Text>
                            <Text style={[styles.paymentStatusText, { color: order.paymentStatus === 'PAID' ? '#10b981' : '#f59e0b' }]}>
                                {t(`payment_status_${order.paymentStatus}`)}
                            </Text>
                        </View>
                    </View>
                </View>
                
                {order.buyerNote && (
                    <View style={[styles.infoCard, { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 15, marginTop: -8, marginBottom: 24 }]}>
                        <View style={[styles.infoIconBox, { marginBottom: 0, marginRight: 15 }]}>
                            <Ionicons name="document-text-outline" size={20} color={COLORS.mainTitle} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.infoLabel, { marginBottom: 2, textAlign: 'left' }]}>{t('note')}</Text>
                            <Text style={[styles.infoValue, { textAlign: 'left' }]}>{order.buyerNote}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>{t('order_overview')}</Text>
                    
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
                        <Text style={styles.summaryValue}>{order.subtotal.toLocaleString()}{t('unit_vnd')}</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('shipping_fee')}</Text>
                        <Text style={styles.summaryValue}>+{(order.shippingFee || 0).toLocaleString()}{t('unit_vnd')}</Text>
                    </View>

                    {order.discount > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: '#10b981' }]}>{t('discount')}</Text>
                            <Text style={[styles.summaryValue, { color: '#10b981' }]}>-{(order.discount || 0).toLocaleString()}{t('unit_vnd')}</Text>
                        </View>
                    )}
                    
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>{t('grand_total')}</Text>
                        <Text style={styles.totalValue}>{order.grandTotal.toLocaleString()}{t('unit_vnd')}</Text>
                    </View>
                </View>

                {order.status === 'SUCCEEDED' && (
                    <TouchableOpacity 
                        style={styles.returnBtn}
                        onPress={() => navigation.navigate('Returns', { orderId: order.id })}
                    >
                        <Text style={styles.returnBtnText}>{t('request_return')}</Text>
                    </TouchableOpacity>
                )}

                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 60,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    downloadBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    qrCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
        elevation: 8,
        shadowColor: COLORS.mainTitle,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        backgroundColor: 'white',
    },
    qrGradient: {
        padding: 24,
        alignItems: 'center',
    },
    qrTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 8,
    },
    qrDesc: {
        fontSize: 13,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    qrBox: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 20,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        marginBottom: 24,
        position: 'relative',
    },
    qrImage: {
        width: 180,
        height: 180,
    },
    qrBadge: {
        position: 'absolute',
        bottom: -10,
        alignSelf: 'center',
        backgroundColor: '#1e293b',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    qrBadgeText: {
        color: 'white',
        fontSize: 9,
        fontWeight: '900',
    },
    paymentDetails: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    payRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    payLabel: {
        color: '#64748b',
        fontSize: 14,
    },
    payValue: {
        fontWeight: '800',
        color: '#1e293b',
        fontSize: 15,
    },
    pollingStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    pollingText: {
        fontSize: 13,
        color: COLORS.mainTitle,
        fontWeight: '700',
    },
    mainCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    orderIdHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    orderIdLabel: {
        fontSize: 17,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 4,
    },
    orderDateText: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 16,
    },
    itemSection: {
        gap: 16,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageWrapper: {
        width: 70,
        height: 70,
        borderRadius: 14,
        backgroundColor: '#f8fafc',
        padding: 4,
    },
    productImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    productInfo: {
        marginLeft: 16,
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 6,
        lineHeight: 20,
    },
    qtyPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productQty: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '600',
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1e293b',
    },
    sectionHeader: {
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1e293b',
    },
    timelineCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    timelineLine: {
        position: 'absolute',
        left: 44,
        top: 44,
        bottom: 44,
        width: 2,
        backgroundColor: '#f1f5f9',
        zIndex: 0,
    },
    timelineStep: {
        flexDirection: 'row',
        marginBottom: 24,
        alignItems: 'center',
    },
    stepIconBoxOuter: {
        width: 40,
        height: 40,
        marginRight: 20,
        zIndex: 1,
    },
    stepIconBox: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    stepActiveShadow: {
        elevation: 6,
        shadowColor: COLORS.mainTitle,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        borderWidth: 0,
    },
    stepContent: {
        flex: 1,
    },
    stepLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
        marginBottom: 2,
    },
    stepDate: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
    textActive: {
        color: '#1e293b',
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    infoCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        alignItems: 'center',
    },
    infoIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#fff1f2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoContent: {
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 11,
        fontWeight: '900',
        color: '#94a3b8',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
        textAlign: 'center',
        lineHeight: 18,
    },
    paymentStatusText: {
        fontSize: 11,
        fontWeight: '800',
        marginTop: 4,
        textTransform: 'uppercase',
    },
    summaryCard: {
        backgroundColor: '#1e293b',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: 'white',
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '600',
    },
    summaryValue: {
        fontSize: 14,
        color: 'white',
        fontWeight: '700',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        borderStyle: 'dashed',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '900',
        color: '#f43f5e',
    },
    returnBtn: {
        backgroundColor: 'white',
        borderWidth: 1.5,
        borderColor: '#f1f5f9',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    returnBtnText: {
        color: '#64748b',
        fontWeight: '800',
        fontSize: 15,
    },
});

export default OrderDetailScreen;
