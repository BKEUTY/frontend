import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../../constants/Theme';
import { useLanguage } from '../../i18n/LanguageContext';
import ScreenWrapper from '../../Component/Common/ScreenWrapper';
import orderApi from '../../api/orderApi';
import paymentApi from '../../api/paymentApi';
import { showToast } from '../../utils/ToastService';
import { Ionicons } from '@expo/vector-icons';

const CheckoutScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useLanguage();

    const { cartIds, subTotal, discount, selectedProducts } = route.params || {};
    const shippingFee = 20000;
    const grandTotal = Math.max(0, (subTotal || 0) + shippingFee - (discount || 0));

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [orderResponse, setOrderResponse] = useState(null);
    const [showQR, setShowQR] = useState(false);
    const [loading, setLoading] = useState(false);
    const [polling, setPolling] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        note: ""
    });

    const pollingInterval = useRef(null);

    useEffect(() => {
        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckout = async () => {
        if (!formData.fullName || !formData.phone || !formData.address) {
            showToast(t('error'), 'error', t('fill_delivery_info'));
            return;
        }

        if (!cartIds || cartIds.length === 0) {
            showToast(t('error'), 'error', t('no_products_payment'));
            return;
        }

        setLoading(true);
        try {
            const data = {
                paymentMethod: paymentMethod === 'banking' ? 'BANK' : 'COD',
                address: formData.address,
                phone: formData.phone,
                recipientName: formData.fullName,
                note: formData.note,
                orderItems: cartIds.map((id) => ({ cartItemId: id })),
            };

            const response = await orderApi.placeOrder(data);
            
            if (paymentMethod === 'banking' && response.data?.qrCodeLink) {
                setOrderResponse(response.data);
                setShowQR(true);
                startPolling(response.data.orderId);
            } else {
                showToast(t('success'), 'success', t('order_success'));
                navigation.navigate('Main', { screen: 'Home' });
            }
        } catch (error) {
            showToast(t('error'), 'error', t('api_error_checkout'));
        } finally {
            setLoading(false);
        }
    };

    const startPolling = (orderId) => {
        setPolling(true);
        pollingInterval.current = setInterval(async () => {
            try {
                const statusRes = await paymentApi.checkStatus(orderId);
                if (statusRes.data?.status === 'PAID') {
                    clearInterval(pollingInterval.current);
                    setPolling(false);
                    showToast(t('success'), 'success', t('payment_success_msg'));
                    navigation.navigate('Main', { screen: 'Home' });
                }
            } catch (error) {
                // Silently fail or handle error
            }
        }, 5000);
    };

    const checkStatusManual = async () => {
        if (!orderResponse?.orderId) return;
        setLoading(true);
        try {
            const statusRes = await paymentApi.checkStatus(orderResponse.orderId);
            if (statusRes.data?.status === 'PAID') {
                if (pollingInterval.current) clearInterval(pollingInterval.current);
                showToast(t('success'), 'success', t('payment_success_msg'));
                navigation.navigate('Main', { screen: 'Home' });
            } else {
                showToast(t('info'), 'info', t('payment_not_yet'));
            }
        } catch (error) {
            showToast(t('error'), 'error', t('api_error_general'));
        } finally {
            setLoading(false);
        }
    };

    if (showQR) {
        return (
            <ScreenWrapper loading={loading} padding={0}>
                <View style={styles.qrContainer}>
                    <Text style={styles.qrTitle}>{t('payment_qr_title')}</Text>
                    <Text style={styles.qrDesc}>{t('scan_qr_desc')}</Text>
                    
                    <View style={styles.qrCodeCard}>
                        {orderResponse?.qrCodeLink ? (
                            <Image
                                source={{ uri: orderResponse.qrCodeLink }}
                                style={styles.qrImage}
                            />
                        ) : (
                            <ActivityIndicator size="large" color={COLORS.mainTitle} />
                        )}
                        <View style={styles.qrOverlay}>
                            <Text style={styles.sepayBadge}>SePay Protected</Text>
                        </View>
                    </View>

                    <View style={styles.infoBox}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('amount')}</Text>
                            <Text style={styles.infoValue}>{grandTotal.toLocaleString("vi-VN")}đ</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{t('order_id')}</Text>
                            <Text style={styles.infoValue}>DH{orderResponse?.orderId}</Text>
                        </View>
                    </View>

                    {polling && (
                        <View style={styles.pollingBox}>
                            <ActivityIndicator size="small" color={COLORS.mainTitle} />
                            <Text style={styles.pollingText}>{t('payment_checking')}</Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.confirmBtn} onPress={checkStatusManual}>
                        <Text style={styles.btnText}>{t('paid_confirm')}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.backBtn} onPress={() => {
                        if (pollingInterval.current) clearInterval(pollingInterval.current);
                        setShowQR(false);
                    }}>
                        <Text style={styles.backText}>{t('back')}</Text>
                    </TouchableOpacity>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper loading={loading} padding={0}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('checkout')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>
                        <Ionicons name="location-outline" size={18} color={COLORS.mainTitle} /> {t('delivery_info')}
                    </Text>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>{t('full_name')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('full_name_placeholder')}
                            value={formData.fullName}
                            onChangeText={(text) => handleInputChange('fullName', text)}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>{t('phone')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('phone_placeholder')}
                            keyboardType="phone-pad"
                            value={formData.phone}
                            onChangeText={(text) => handleInputChange('phone', text)}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>{t('address')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('address_placeholder')}
                            value={formData.address}
                            onChangeText={(text) => handleInputChange('address', text)}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>{t('note')}</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder={t('note_placeholder')}
                            multiline
                            numberOfLines={3}
                            value={formData.note}
                            onChangeText={(text) => handleInputChange('note', text)}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>
                        <Ionicons name="card-outline" size={18} color={COLORS.mainTitle} /> {t('payment_method')}
                    </Text>
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === 'cod' && styles.selectedOption]}
                        onPress={() => setPaymentMethod('cod')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.radioCircle, paymentMethod === 'cod' && styles.selectedRadio]}>
                            {paymentMethod === 'cod' && <View style={styles.radioInner} />}
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionText}>{t('payment_cod')}</Text>
                            <Text style={styles.optionSubText}>Thanh toán khi nhận hàng</Text>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === 'banking' && styles.selectedOption]}
                        onPress={() => setPaymentMethod('banking')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.radioCircle, paymentMethod === 'banking' && styles.selectedRadio]}>
                            {paymentMethod === 'banking' && <View style={styles.radioInner} />}
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionText}>{t('payment_banking')}</Text>
                            <Text style={styles.optionSubText}>Chuyển khoản nhanh qua QR Code</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={[styles.section, { marginBottom: 100 }]}>
                    <Text style={styles.sectionHeader}>
                        <Ionicons name="receipt-outline" size={18} color={COLORS.mainTitle} /> {t('order_summary')}
                    </Text>
                    <View style={styles.orderList}>
                        {selectedProducts?.map((item, index) => (
                            <View key={index} style={styles.orderItem}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.itemQty}>x{item.quantity}</Text>
                                </View>
                                <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('subtotal')}</Text>
                        <Text style={styles.summaryValue}>{(subTotal || 0).toLocaleString("vi-VN")}đ</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('shipping_fee')}</Text>
                        <Text style={styles.summaryValue}>{shippingFee.toLocaleString("vi-VN")}đ</Text>
                    </View>
                    {discount > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: '#10b981' }]}>{t('discount')}</Text>
                            <Text style={{ color: '#10b981', fontWeight: 'bold' }}>-{(discount).toLocaleString("vi-VN")}đ</Text>
                        </View>
                    )}
                    <View style={styles.totalDivider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>{t('total')}</Text>
                        <Text style={styles.totalValue}>{grandTotal.toLocaleString("vi-VN")}đ</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.placeOrderBtn, loading && styles.disabledBtn]} 
                    onPress={handleCheckout}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.btnText}>
                            {paymentMethod === 'banking' ? t('continue_payment') : t('place_order')}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 56,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backIcon: {
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
        marginRight: 40,
    },
    scrollContent: {
        padding: 15,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#111827',
        flexDirection: 'row',
        alignItems: 'center',
    },
    formGroup: {
        marginBottom: 14,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
        color: '#4b5563',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        backgroundColor: '#f9fafb',
        color: '#111827',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 16,
        marginBottom: 12,
    },
    selectedOption: {
        borderColor: COLORS.mainTitle,
        backgroundColor: '#fff1f2',
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#d1d5db',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedRadio: {
        borderColor: COLORS.mainTitle,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.mainTitle,
    },
    optionContent: {
        flex: 1,
    },
    optionText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111827',
    },
    optionSubText: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    itemName: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    itemQty: {
        fontSize: 12,
        color: '#9ca3af',
    },
    itemPrice: {
        fontWeight: 'bold',
        color: '#111827',
    },
    divider: {
        height: 1,
        backgroundColor: '#f3f4f6',
        marginVertical: 12,
    },
    totalDivider: {
        height: 1,
        backgroundColor: '#f3f4f6',
        marginVertical: 12,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderRadius: 1,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderColor: '#f3f4f6',
    },
    placeOrderBtn: {
        backgroundColor: COLORS.mainTitle,
        height: 54,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.mainTitle,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    qrContainer: {
        flex: 1,
        padding: 24,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 10,
    },
    qrDesc: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    qrCodeCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 30,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        marginBottom: 30,
        position: 'relative',
    },
    qrImage: {
        width: 200,
        height: 200,
    },
    qrOverlay: {
        position: 'absolute',
        bottom: -10,
        alignSelf: 'center',
        backgroundColor: '#111827',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    sepayBadge: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    infoBox: {
        width: '100%',
        backgroundColor: '#f9fafb',
        borderRadius: 20,
        padding: 20,
        marginBottom: 30,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    infoLabel: {
        color: '#6b7280',
        fontSize: 14,
    },
    infoValue: {
        fontWeight: 'bold',
        color: '#111827',
        fontSize: 16,
    },
    pollingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 30,
    },
    pollingText: {
        fontSize: 14,
        color: COLORS.mainTitle,
        fontWeight: '600',
    },
    confirmBtn: {
        width: '100%',
        height: 54,
        backgroundColor: '#10b981',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    backBtn: {
        padding: 10,
    },
    backText: {
        color: '#9ca3af',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

export default CheckoutScreen;
