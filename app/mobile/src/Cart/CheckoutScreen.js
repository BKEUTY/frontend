import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../constants/Theme';
import { useLanguage } from '../i18n/LanguageContext';
import axiosClient from '../api/axiosClient';

const CheckoutScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useLanguage();

    const { cartIds, subTotal, discount, selectedProducts } = route.params || {};
    const shippingFee = 20000;
    const grandTotal = Math.max(0, (subTotal || 0) + shippingFee - (discount || 0));

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [showQR, setShowQR] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        note: ""
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckout = async () => {
        if (!formData.fullName || !formData.phone || !formData.address) {
            Alert.alert("Error", t('fill_delivery_info'));
            return;
        }

        if (!cartIds || cartIds.length === 0) {
            Alert.alert("Error", t('no_products_payment'));
            return;
        }

        if (paymentMethod === 'banking') {
            setShowQR(true);
            return;
        }

        await processOrder("COD");
    };

    const processOrder = async (method) => {
        try {
            await axiosClient.post('/order', {
                userId: 1, // Fixed user ID
                paymentMethod: method,
                address: formData.address,
                phone: formData.phone,
                recipientName: formData.fullName,
                note: formData.note,
                orderItems: cartIds.map((id) => ({ cartItemId: id })),
            });

            Alert.alert("Success", t('order_success'), [
                { text: "OK", onPress: () => navigation.navigate('Main', { screen: 'Home' }) }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", t('payment_error_try_again'));
        }
    };

    if (showQR) {
        return (
            <View style={styles.container}>
                <View style={styles.qrContainer}>
                    <Text style={styles.qrTitle}>{t('payment_qr_title')}</Text>
                    <Text style={styles.qrDesc}>{t('scan_qr_desc')}</Text>
                    <View style={styles.qrCodeBox}>
                        <Image
                            source={{ uri: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BKEUTY_ORDER_PAYMENT" }}
                            style={styles.qrImage}
                        />
                    </View>
                    <Text style={styles.amountDisplay}>
                        {t('amount')}: <Text style={styles.amountValue}>{grandTotal.toLocaleString("vi-VN")}đ</Text>
                    </Text>
                    <TouchableOpacity style={styles.confirmBtn} onPress={() => processOrder("Banking")}>
                        <Text style={styles.btnText}>{t('paid_confirm')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backBtn} onPress={() => setShowQR(false)}>
                        <Text style={styles.backText}>{t('back')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                    <Text style={{ fontSize: 24 }}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('checkout')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Delivery Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>{t('delivery_info')}</Text>

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

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>{t('payment_method')}</Text>
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === 'cod' && styles.selectedOption]}
                        onPress={() => setPaymentMethod('cod')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.radioCircle, paymentMethod === 'cod' && styles.selectedRadio]}>
                            {paymentMethod === 'cod' && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.optionText}>{t('payment_cod')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === 'banking' && styles.selectedOption]}
                        onPress={() => setPaymentMethod('banking')}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.radioCircle, paymentMethod === 'banking' && styles.selectedRadio]}>
                            {paymentMethod === 'banking' && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.optionText}>{t('payment_banking')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>{t('order_summary')}</Text>
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
                        <Text>{t('subtotal')}</Text>
                        <Text>{(subTotal || 0).toLocaleString("vi-VN")}đ</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text>{t('shipping_fee')}</Text>
                        <Text>{shippingFee.toLocaleString("vi-VN")}đ</Text>
                    </View>
                    {(discount || 0) > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.discountText}>{t('discount')}</Text>
                            <Text style={styles.discountText}>-{(discount).toLocaleString("vi-VN")}đ</Text>
                        </View>
                    )}
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>{t('total')}</Text>
                        <Text style={styles.totalValue}>{grandTotal.toLocaleString("vi-VN")}đ</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.placeOrderBtn} onPress={handleCheckout}>
                    <Text style={styles.btnText}>
                        {paymentMethod === 'banking' ? t('continue_payment') : t('place_order')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        elevation: 2,
    },
    backIcon: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    },
    scrollContent: {
        padding: 15,
        paddingBottom: 100,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionHeader: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 16,
        color: '#333',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        backgroundColor: '#fdfdfd',
        color: '#333',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 14,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1.5,
        borderColor: '#eee',
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: 'white',
    },
    selectedOption: {
        borderColor: COLORS.mainTitle,
        backgroundColor: '#fff5f8',
    },
    radioCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#bbb',
        marginRight: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedRadio: {
        borderColor: COLORS.mainTitle,
        backgroundColor: 'white',
    },
    // Inner dot for Radio
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.mainTitle,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    orderList: {
        marginBottom: 10,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    itemQty: {
        fontSize: 12,
        color: '#888',
    },
    itemPrice: {
        fontWeight: 'bold',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    },
    discountText: {
        color: 'green',
    },
    footer: {
        padding: 15,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    placeOrderBtn: {
        backgroundColor: COLORS.checkoutButton || '#c2185b',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'uppercase',
    },
    qrContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    qrTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.mainTitle,
        marginBottom: 10,
    },
    qrDesc: {
        color: '#666',
        marginBottom: 20,
    },
    qrCodeBox: {
        marginVertical: 20,
    },
    qrImage: {
        width: 250,
        height: 250,
    },
    amountDisplay: {
        fontSize: 18,
        marginBottom: 30,
    },
    amountValue: {
        fontWeight: 'bold',
        color: COLORS.mainTitle,
    },
    confirmBtn: {
        width: '100%',
        padding: 15,
        backgroundColor: 'green',
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    backBtn: {
        padding: 10,
    },
    backText: {
        color: '#666',
        textDecorationLine: 'underline',
    },
});

export default CheckoutScreen;
