import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../constants/Theme';
import { useLanguage } from '../../i18n/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import orderApi from '../../api/orderApi';

const { width } = Dimensions.get('window');

const OrderDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId } = route.params || {};
    const { t } = useLanguage();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const response = await orderApi.getHistory();
                if (response.data) {
                    const found = response.data.find(o => 
                        o.id?.toString() === orderId?.toString() || 
                        o.orderId?.toString() === orderId?.toString()
                    );
                    setOrder(found);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetail();
        } else {
            setLoading(false);
        }
    }, [orderId]);

    const getStatusText = (status) => {
        if (!status) return 'PENDING';
        return status.toUpperCase();
    };

    if (loading) {
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

    const orderData = {
        id: order.id || order.orderId,
        createdAt: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '---',
        status: getStatusText(order.status),
        subtotal: order.total || 0,
        discount: 0,
        shipping: 20000,
        total: (order.total || 0) + 20000,
        paymentMethod: order.paymentMethod,
        address: order.address,
        items: order.items || []
    };

    const renderTimelineStep = (icon, label, date, isActive, isCompleted) => {
        return (
            <View style={styles.timelineStep}>
                <View style={styles.stepIconBoxOuter}>
                    {isActive || isCompleted ? (
                        <LinearGradient
                            colors={isActive ? [COLORS.mainTitle, COLORS.mainTitleDark || '#880e4f'] : ['#f3f4f6', '#f3f4f6']}
                            style={[styles.stepIconBox, isActive && styles.stepActiveShadow]}
                        >
                            <Ionicons
                                name={icon}
                                size={18}
                                color={isActive ? 'white' : COLORS.mainTitle}
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
                    <Text style={styles.stepDate}>{date}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('order_detail')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.mainCard}>
                    <View style={styles.orderIdHeader}>
                        <View>
                            <Text style={styles.orderIdLabel}>{t('order_id_label')} #{orderData.id}</Text>
                            <Text style={styles.orderDate}>{t('order_time')}: {orderData.createdAt}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: orderData.status === 'PAID' ? '#ecfdf5' : '#fff7ed' }]}>
                            <Text style={[styles.statusBadgeText, { color: orderData.status === 'PAID' ? '#059669' : '#ea580c' }]}>
                                {t(orderData.status.toLowerCase()) || orderData.status}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.itemSection}>
                        {orderData.items.map((item, index) => (
                            <View key={index} style={styles.productItem}>
                                <Image 
                                    source={{ uri: item.productVariantImage || 'https://via.placeholder.com/100' }} 
                                    style={styles.productImage} 
                                />
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName} numberOfLines={1}>{item.productVariantName}</Text>
                                    <Text style={styles.productQty}>x{item.quantity}</Text>
                                    <Text style={styles.productPrice}>{item.price?.toLocaleString()}đ</Text>
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
                    {renderTimelineStep('card-outline', t('timeline_paid'), orderData.status === 'PAID' ? orderData.createdAt : '---', false, orderData.status === 'PAID')}
                    {renderTimelineStep('cube-outline', t('preparing_order'), orderData.createdAt, false, true)}
                    {renderTimelineStep('bicycle-outline', t('timeline_delivering'), '---', true, false)}
                    {renderTimelineStep('checkmark-circle-outline', t('timeline_delivered'), '---', false, false)}
                </View>

                <View style={styles.infoGrid}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="location-outline" size={20} color={COLORS.mainTitle} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>{t('delivery_header')}</Text>
                            <Text style={styles.infoValue} numberOfLines={2}>{orderData.address}</Text>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="card-outline" size={20} color={COLORS.mainTitle} />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>{t('payment_header')}</Text>
                            <Text style={styles.infoValue}>{orderData.paymentMethod}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>{t('order_overview')}</Text>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
                        <Text style={styles.summaryValue}>{orderData.subtotal.toLocaleString()}đ</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('shipping_fee')}</Text>
                        <Text style={styles.summaryValue}>{orderData.shipping.toLocaleString()}đ</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>{t('total')}</Text>
                        <Text style={styles.totalValue}>{orderData.total.toLocaleString()}đ</Text>
                    </View>
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 56,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
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
        fontWeight: 'bold',
        color: '#111827',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    mainCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#f9fafb',
    },
    orderIdHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    orderIdLabel: {
        fontSize: 17,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 13,
        color: '#9ca3af',
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    itemSection: {
        marginTop: 10,
    },
    productItem: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
    },
    productInfo: {
        marginLeft: 15,
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 4,
    },
    productQty: {
        fontSize: 12,
        color: '#9ca3af',
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
        marginTop: 4,
    },
    sectionHeader: {
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#111827',
    },
    timelineCard: {
        backgroundColor: '#f9fafb',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        position: 'relative',
    },
    timelineLine: {
        position: 'absolute',
        left: 44,
        top: 40,
        bottom: 40,
        width: 2,
        backgroundColor: '#e5e7eb',
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
        borderColor: '#e5e7eb',
    },
    stepActiveShadow: {
        elevation: 5,
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
        color: '#111827',
        marginBottom: 2,
    },
    stepDate: {
        fontSize: 12,
        color: '#9ca3af',
        fontWeight: '500',
    },
    textActive: {
        color: COLORS.mainTitle,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 24,
    },
    infoCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        alignItems: 'center',
    },
    infoIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fff1f2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoContent: {
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#9ca3af',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
        textAlign: 'center',
    },
    summaryCard: {
        backgroundColor: '#111827',
        borderRadius: 24,
        padding: 24,
        marginBottom: 40,
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
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#9ca3af',
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 14,
        color: 'white',
        fontWeight: '700',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingTop: 15,
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
        color: COLORS.mainTitle,
    },
});

export default OrderDetailScreen;
