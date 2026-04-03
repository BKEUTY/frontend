import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Space } from "antd";
import { FiTruck, FiCreditCard } from "react-icons/fi";
import { useNotification } from "../../Context/NotificationContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { usePaymentPolling } from "../../hooks/usePaymentPolling";
import { CButton } from "../../Component/Common";
import orderApi from '../../api/orderApi';
import "./Checkout.css";

export default function Checkout() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const notify = useNotification();
    const { t } = useLanguage();
    const queryClient = useQueryClient();

    const cartIds = state?.cartIds || [];
    const selectedProducts = state?.selectedProducts || [];

    const totals = selectedProducts.reduce((acc, p) => {
        const originalPrice = p.price || 0;
        const effectivePrice = p.effectivePrice ?? p.promotionPrice ?? originalPrice;
        return {
            original: acc.original + (originalPrice * p.quantity),
            final: acc.final + (effectivePrice * p.quantity)
        };
    }, { original: 0, final: 0 });

    const totalOriginalPrice = totals.original;
    const grandTotal = totals.final;
    const totalDiscount = totalOriginalPrice - grandTotal;

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [showQR, setShowQR] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [isCheckingPayment, setIsCheckingPayment] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({ fullName: "", phone: "", address: "", note: "" });

    useEffect(() => {
        if (!state || cartIds.length === 0) navigate('/cart');
    }, [state, cartIds, navigate]);

    const handlePaymentSuccess = useCallback(() => {
        notify(t('payment_success_msg'), "success");
        queryClient.invalidateQueries({ queryKey: ['myOrders'] });
        queryClient.invalidateQueries({ queryKey: ['cartItems'] });
        setTimeout(() => navigate('/account/orders'), 2000);
    }, [notify, navigate, t, queryClient]);

    const { checkPaymentStatus } = usePaymentPolling(orderData?.orderId, showQR, handlePaymentSuccess);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async () => {
        if (!formData.fullName || !formData.phone || !formData.address) {
            notify(t('fill_delivery_info'), "error");
            return;
        }
        setIsProcessing(true);
        try {
            const response = await orderApi.placeOrder({
                paymentMethod: paymentMethod === 'banking' ? 'Banking' : 'COD',
                address: formData.address,
                phone: formData.phone,
                recipientName: formData.fullName,
                note: formData.note,
                orderItems: cartIds.map(id => ({ cartItemId: id })),
            });

            const actualData = response.data || response;
            if (paymentMethod === 'banking') {
                setOrderData(actualData);
                setShowQR(true);
            } else {
                notify(t('order_success'), "success");
                queryClient.invalidateQueries({ queryKey: ['myOrders'] });
                queryClient.invalidateQueries({ queryKey: ['cartItems'] });
                setTimeout(() => navigate('/account/orders'), 2000);
            }
        } catch {
            notify(t('payment_error_try_again'), "error");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleManualCheck = async () => {
        setIsCheckingPayment(true);
        const isPaid = await checkPaymentStatus();
        if (!isPaid) notify(t('payment_not_yet'), "info");
        setIsCheckingPayment(false);
    };

    if (showQR && orderData) {
        return (
            <main className="checkout-qr-page">
                <div className="qr-container">
                    <div className="qr-header">
                        <h2>{t('payment_qr_title')}</h2>
                        <div className="order-chip">#{orderData.orderId}</div>
                    </div>
                    <p className="qr-desc">{t('scan_qr_desc')}</p>
                    <div className="qr-card">
                        <div className="qr-code-box">
                            <img src={orderData.qrCodeLink} alt="QR Code" />
                            <div className="qr-overlay-scan"></div>
                        </div>
                        <div className="qr-info-grid">
                            <div className="qr-info-item">
                                <span className="label">{t('amount')}</span>
                                <span className="value highlighting">{(orderData.total || grandTotal).toLocaleString("vi-VN")}đ</span>
                            </div>
                            <div className="qr-info-item">
                                <span className="label">{t('order_id')}</span>
                                <span className="value">DH{orderData.orderId}</span>
                            </div>
                        </div>
                    </div>
                    <div className="qr-actions">
                        <CButton type="primary" block size="large" loading={isCheckingPayment} onClick={handleManualCheck}>
                            {isCheckingPayment ? t('payment_checking') : t('paid_confirm')}
                        </CButton>
                        <CButton type="secondary" block size="large" onClick={() => setShowQR(false)}>
                            {t('back')}
                        </CButton>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <h1 className="checkout-title">{t('checkout')}</h1>
            <div className="checkout-container">
                <div className="checkout-left">
                    <div className="checkout-section">
                        <h2 className="section-header">{t('delivery_info')}</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>{t('full_name')}</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder={t('full_name_placeholder')} />
                            </div>
                            <div className="form-group">
                                <label>{t('phone')}</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder={t('phone_placeholder')} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>{t('address')}</label>
                            <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder={t('address_placeholder')} />
                        </div>
                        <div className="form-group">
                            <label>{t('note')}</label>
                            <textarea name="note" value={formData.note} onChange={handleInputChange} placeholder={t('note_placeholder')} />
                        </div>
                    </div>

                    <div className="checkout-section">
                        <h2 className="section-header">{t('payment_method')}</h2>
                        <div className="payment-methods">
                            <div className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cod')}>
                                <div className="payment-icon"><FiTruck /></div>
                                <div className="payment-detail"><div className="payment-name">{t('payment_cod')}</div></div>
                                <div className="radio-circle"></div>
                            </div>
                            <div className={`payment-option ${paymentMethod === 'banking' ? 'selected' : ''}`} onClick={() => setPaymentMethod('banking')}>
                                <div className="payment-icon"><FiCreditCard /></div>
                                <div className="payment-detail"><div className="payment-name">{t('payment_banking')}</div></div>
                                <div className="radio-circle"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="checkout-right">
                    <div className="order-summary-box">
                        <h2 className="summary-title">{t('order_summary')} ({selectedProducts.length} {t('items')})</h2>
                        <div className="order-items-list">
                            {selectedProducts.map((p, idx) => {
                                const effectivePrice = p.effectivePrice ?? p.promotionPrice ?? p.price;
                                const hasDiscount = p.price > 0 && effectivePrice < p.price;
                                return (
                                    <div key={idx} className="summary-item">
                                        <div className="summary-item-image">
                                            <img src={p.image} alt={p.name} onError={(e) => e.target.src = 'https://placehold.co/100x100?text=Product'} />
                                        </div>
                                        <div className="summary-item-info">
                                            <div className="summary-item-name">{p.name}</div>
                                            <div className="summary-item-qty">x{p.quantity}</div>
                                            {hasDiscount && (
                                                <div className="summary-item-original-price">
                                                    {p.price.toLocaleString("vi-VN")}đ
                                                </div>
                                            )}
                                        </div>
                                        <div className="summary-item-price">
                                            {(effectivePrice * p.quantity).toLocaleString("vi-VN")}đ
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row">
                            <span>{t('total_original_price') || 'Tổng giá gốc'}</span>
                            <span>{totalOriginalPrice.toLocaleString("vi-VN")}đ</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className="summary-row discount">
                                <span>{t('total_discount') || 'Tổng giá giảm'}</span>
                                <span>-{totalDiscount.toLocaleString("vi-VN")}đ</span>
                            </div>
                        )}
                        <div className="summary-divider"></div>
                        <div className="summary-total">
                            <span>{t('total')}</span>
                            <span className="total-price">{grandTotal.toLocaleString("vi-VN")}đ</span>
                        </div>
                        <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                            <CButton type="primary" block size="large" loading={isProcessing} disabled={isProcessing} onClick={handleCheckout}>
                                {isProcessing ? t('loading') : (paymentMethod === 'banking' ? t('continue_payment') : t('place_order'))}
                            </CButton>
                            <CButton type="secondary" block size="large" onClick={() => navigate('/cart')}>
                                {t('back_to_cart')}
                            </CButton>
                        </Space>
                    </div>
                </div>
            </div>
        </main>
    );
}
