import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useNotification } from "@/store/NotificationContext";
import { useLanguage } from "@/store/LanguageContext";
import { usePaymentPolling } from "@/features/checkout/hooks/usePaymentPolling";
import { CButton, CInput, SEO } from "@/components/common";
import orderApi from '@/features/orders/services/orderService';
import { useUserProfile, useUpdateProfile, useAddAddress, useDeleteAddress } from "@/features/account/hooks/useUser";
import { useProvinces, useDistricts, useWards } from "@/features/account/hooks/useAddress";
import { useShippingFee, useShippingLeadTime } from "@/features/checkout/hooks/useShipping";
import { Modal, Select } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { FiTruck, FiCreditCard, FiTrash2, FiCalendar, FiTag, FiCheckCircle, FiClock } from "react-icons/fi";
import { useVouchers } from "@/features/promotions/hooks/useVouchers";
import { useAuth } from "@/store/AuthContext";
import { useCart } from "@/store/CartContext";
import "./Checkout.css";

export default function Checkout() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const notify = useNotification();
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { fetchCart, clearCartItems } = useCart();

    const cartIds = state?.cartIds || [];
    const selectedProducts = state?.selectedProducts || [];

    const totals = selectedProducts.reduce((acc, p) => {
        const originalPrice = p.price || 0;
        const effectivePrice = (p.effectivePrice !== undefined && p.effectivePrice !== null) ? p.effectivePrice : 
                             ((p.promotionPrice !== undefined && p.promotionPrice !== null) ? p.promotionPrice : originalPrice);
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
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [formData, setFormData] = useState({ fullName: "", phone: "", email: "", note: "" });
    const [newAddr, setNewAddr] = useState({ street: "", province: null, district: null, ward: null });
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

    const { data: vouchers, isLoading: isVouchersLoading } = useVouchers({ userId: user?.id });
    const { data: profile, isLoading: isProfileLoading } = useUserProfile();
    const updateProfileMutation = useUpdateProfile();
    const addAddressMutation = useAddAddress();
    const deleteAddressMutation = useDeleteAddress();

    const handleDeleteAddress = (addr, idx, e) => {
        e.stopPropagation();
        
        Modal.confirm({
            title: t('confirm_delete_message'),
            icon: <ExclamationCircleOutlined />,
            okText: t('yes'),
            okType: 'danger',
            cancelText: t('no'),
            onOk: () => {
                const payload = {
                    address: addr.address,
                    ward: {
                        wardCode: Number(addr.ward.wardCode),
                        wardName: addr.ward.wardName
                    },
                    district: {
                        districtID: Number(addr.district.districtID),
                        districtName: addr.district.districtName
                    },
                    province: {
                        provinceID: Number(addr.province.provinceID),
                        provinceName: addr.province.provinceName
                    }
                };

                deleteAddressMutation.mutate(payload, {
                    onSuccess: () => {
                        notify(t('delete_success'), "success");
                        if (selectedAddressIndex === idx) {
                            setSelectedAddressIndex(0);
                        } else if (selectedAddressIndex > idx) {
                            setSelectedAddressIndex(prev => prev - 1);
                        }
                    },
                    onError: () => {
                        notify(t('delete_failed'), "error");
                    }
                });
            }
        });
    };

    const currentAddress = profile?.addresses?.[selectedAddressIndex];

    const { data: provinces } = useProvinces();
    const { data: districts } = useDistricts(newAddr.province?.id);
    const { data: wards } = useWards(newAddr.district?.id);

    const { data: shippingFee, isLoading: isFeeLoading } = useShippingFee({
        toWardCode: currentAddress?.ward?.wardCode,
        toDistrictId: currentAddress?.district?.districtID
    });

    const { data: shippingLeadTime, isLoading: isLeadTimeLoading } = useShippingLeadTime({
        toWardCode: currentAddress?.ward?.wardCode,
        toDistrictId: currentAddress?.district?.districtID
    });

    const calculateVoucherDiscount = () => {
        if (!selectedVoucher) return 0;
        
        const subtotal = grandTotal;
        if (selectedVoucher.minOrderValue && subtotal < selectedVoucher.minOrderValue) return 0;

        let discount = 0;
        if (selectedVoucher.discountType === 'PERCENTAGE') {
            discount = subtotal * (selectedVoucher.discountValue / 100);
            if (selectedVoucher.maxDiscount && discount > selectedVoucher.maxDiscount) {
                discount = selectedVoucher.maxDiscount;
            }
        } else {
            discount = selectedVoucher.discountValue;
        }
        return Math.min(discount, subtotal);
    };

    const voucherDiscount = calculateVoucherDiscount();
    const finalPaymentAmount = grandTotal + (shippingFee || 0) - voucherDiscount;

    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                fullName: `${profile.lastname || ""} ${profile.firstname || ""}`.trim(),
                phone: profile.phoneNumber || "",
                email: profile.email || ""
            }));
        }
    }, [profile]);


    useEffect(() => {
        if (!state || cartIds.length === 0) navigate('/cart');
    }, [state, cartIds, navigate]);

    const handlePaymentSuccess = useCallback(() => {
        notify(t('payment_success_msg'), "success");
        queryClient.invalidateQueries({ queryKey: ['myOrders'] });
        clearCartItems(cartIds);
        fetchCart();
        setTimeout(() => navigate('/thank-you', { state: { orderId: orderData?.orderId } }), 1500);
    }, [notify, navigate, t, queryClient, orderData, fetchCart]);

    const { checkPaymentStatus } = usePaymentPolling(orderData?.orderId, showQR, handlePaymentSuccess);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async () => {
        if (!formData.fullName || !formData.phone || !currentAddress) {
            notify(t('fill_delivery_info'), "error");
            return;
        }
        setIsProcessing(true);
        try {
            const response = await orderApi.placeOrder({
                paymentMethod: paymentMethod === 'banking' ? 'BANK' : 'COD',
                address: currentAddress,
                phoneNumber: formData.phone,
                name: formData.fullName,
                note: formData.note,
                shippingFee: shippingFee || 0,
                orderItems: cartIds.map(id => ({ cartItemId: id })),
                voucherId: selectedVoucher?.id,
                membershipLevel: user?.membershipLevel || 0,
            });

            const actualData = response.data || response;
            queryClient.invalidateQueries({ queryKey: ['myOrders'] });
            clearCartItems(cartIds);
            fetchCart();
            if (paymentMethod === 'banking') {
                setOrderData(actualData);
                setShowQR(true);
            } else {
                notify(t('order_success'), "success");
                setTimeout(() => navigate('/thank-you', { state: { orderId: actualData?.orderId } }), 1500);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || t('payment_error_try_again');
            notify(errorMessage, "error");
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
                    <div className="qr-payment-notice">
                        <FiCalendar style={{ marginRight: '8px' }} />
                        <span>{t('payment_8h_notice')}</span>
                    </div>

                    <div className="qr-card">
                        <div className="qr-code-box">
                            <img src={orderData.qrCodeLink} alt="QR Code" />
                            <div className="qr-overlay-scan"></div>
                        </div>
                        <div className="qr-info-grid">
                            <div className="qr-info-item">
                                <span className="label">{t('amount')}</span>
                                <span className="value highlighting">{((orderData.total || grandTotal) + (orderData.shippingFee || 0)).toLocaleString("vi-VN")}đ</span>
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
                        <CButton type="outline" block size="large" onClick={() => navigate(`/account/orders/${orderData.orderId}`)} style={{ marginTop: 12 }}>
                            {t('pay_later_and_view_orders')}
                        </CButton>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <SEO title={t('checkout')} />
            <h1 className="checkout-title">{t('checkout')}</h1>
            <div className="checkout-container">
                <div className="checkout-left">
                    <div className="checkout-section">
                        <div className="section-head-with-action">
                            <h2 className="section-header">{t('contact_info')}</h2>
                            <CButton type="outline" size="small" onClick={() => {
                                updateProfileMutation.mutate({
                                    firstname: profile.firstname,
                                    lastname: profile.lastname,
                                    email: formData.email,
                                    phoneNumber: formData.phone
                                }, { onSuccess: () => notify(t('update_success'), "success") });
                            }}>
                                {t('save')}
                            </CButton>
                        </div>
                        <div className="form-grid">
                            <CInput label={t('full_name')} name="fullName" value={formData.fullName} onChange={handleInputChange} />
                            <CInput label={t('phone')} name="phone" value={formData.phone} onChange={handleInputChange} />
                            <div className="form-group full-width">
                                <CInput label={t('step_email')} name="email" value={formData.email} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    <div className="checkout-section mt-20">
                        <div className="section-head-with-action">
                            <h2 className="section-header">{t('delivery_address')}</h2>
                            <CButton type="outline" size="small" onClick={() => setIsAddressModalOpen(true)}>
                                {t('change')}
                            </CButton>
                        </div>
                        {currentAddress ? (
                            <div className="current-address-display">
                                <div className="addr-main">{currentAddress.address?.replace(/^,\s*/, '')}</div>
                                <div className="addr-sub">
                                    {currentAddress.ward.wardName}, {currentAddress.district.districtName}, {currentAddress.province.provinceName}
                                </div>
                                <div className="shipping-info">
                                    <div className="shipping-fee-notice">
                                        <FiTruck className="shipping-icon" />
                                        <span>{t('shipping_fee')}: <b>{isFeeLoading ? "..." : (shippingFee ? `${shippingFee.toLocaleString("vi-VN")}đ` : "Miễn phí")}</b></span>
                                    </div>
                                    
                                    <div className="shipping-fee-notice estimate-notice">
                                        <FiCalendar className="shipping-icon" />
                                        <span>Dự kiến giao: <b>{isLeadTimeLoading ? "..." : (shippingLeadTime ? new Date(shippingLeadTime).toLocaleDateString('vi-VN') : "--/--/----")}</b></span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="no-address-hint" onClick={() => setIsAddressModalOpen(true)}>
                                {t('add_address_first')}
                            </div>
                        )}

                        <div className="form-group full-width mt-15">
                            <label className="c-input-label">{t('note')}</label>
                            <textarea 
                                className="c-input-field c-textarea" 
                                name="note" 
                                value={formData.note} 
                                onChange={handleInputChange} 
                                placeholder={t('note_placeholder')} 
                            />
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
                                const effectivePrice = (p.effectivePrice !== undefined && p.effectivePrice !== null) ? p.effectivePrice : 
                                                       ((p.promotionPrice !== undefined && p.promotionPrice !== null) ? p.promotionPrice : p.price);
                                const hasDiscount = effectivePrice < p.price;
                                return (
                                    <div key={idx} className="summary-item">
                                        <div className="summary-item-image">
                                            <img src={p.image} alt={p.name} onError={(e) => e.target.src = 'https://placehold.co/100x100?text=Product'} />
                                        </div>
                                        <div className="summary-item-info">
                                            <div className="summary-item-name">{p.name}</div>
                                            <div className="summary-item-details">
                                                {hasDiscount && (
                                                    <span className="item-original-price">{p.price.toLocaleString("vi-VN")}đ</span>
                                                )}
                                                <span className="item-current-price">{effectivePrice.toLocaleString("vi-VN")}đ</span>
                                                <span className="item-qty">x{p.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="summary-item-total">
                                            {(effectivePrice * p.quantity).toLocaleString("vi-VN")}đ
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row">
                            <span>{t('total_original_price')}</span>
                            <span>{totalOriginalPrice.toLocaleString("vi-VN")}đ</span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className="summary-row discount">
                                <span>{t('total_discount')}</span>
                                <span>-{totalDiscount.toLocaleString("vi-VN")}đ</span>
                            </div>
                        )}
                        
                        <div className="summary-divider"></div>

                        {selectedVoucher && (
                            <div className="summary-row discount">
                                <span>{t('voucher_discount')}</span>
                                <span>-{voucherDiscount.toLocaleString("vi-VN")}đ</span>
                            </div>
                        )}

                        <div className="voucher-section-summary">
                            <div className="summary-row voucher-trigger" onClick={() => setIsVoucherModalOpen(true)}>
                                <div className="voucher-label">
                                    <FiTag />
                                    <span>{selectedVoucher ? selectedVoucher.code : t('select_voucher')}</span>
                                </div>
                                <span className="voucher-action-text">{selectedVoucher ? t('change') : t('apply')}</span>
                            </div>
                        </div>

                        <div className="summary-divider"></div>
                        <div className="summary-row">
                            <span>{t('shipping_fee')}</span>
                            <span>{isFeeLoading ? "..." : (shippingFee ? `${shippingFee.toLocaleString("vi-VN")}đ` : "0đ")}</span>
                        </div>

                        <div className="summary-divider"></div>
                        <div className="summary-total">
                            <span>{t('total')}</span>
                            <span className="total-price">{Math.max(0, finalPaymentAmount).toLocaleString("vi-VN")}đ</span>
                        </div>

                        
                        <div className="checkout-actions">
                            <CButton type="primary" block size="large" loading={isProcessing} disabled={isProcessing} onClick={handleCheckout}>
                                {isProcessing ? t('loading') : (paymentMethod === 'banking' ? t('continue_payment') : t('place_order'))}
                            </CButton>
                            <CButton type="outline" block size="large" onClick={() => navigate('/cart')} className="btn-back-cart">
                                {t('back_to_cart')}
                            </CButton>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title={t('delivery_address')}
                open={isAddressModalOpen}
                onCancel={() => setIsAddressModalOpen(false)}
                footer={[
                    <CButton key="add" type="outline" onClick={() => setIsAddAddressModalOpen(true)}>
                        {t('add_new_address')}
                    </CButton>,
                    <CButton key="ok" type="primary" onClick={() => setIsAddressModalOpen(false)}>
                        {t('confirm')}
                    </CButton>
                ]}
                className="address-selection-modal"
            >
                <div className="address-list-container">
                    {profile?.addresses?.map((addr, idx) => (
                        <div 
                            key={idx} 
                            className={`address-item-card ${selectedAddressIndex === idx ? 'selected' : ''}`}
                            onClick={() => setSelectedAddressIndex(idx)}
                        >
                            <div className="addr-check-circle"></div>
                            <div className="addr-content">
                                <div className="addr-street">{addr.address}</div>
                                <div className="addr-full">{addr.ward.wardName}, {addr.district.districtName}, {addr.province.provinceName}</div>
                            </div>

                            {profile.addresses.length > 1 && (
                                <button 
                                    className="btn-delete-addr"
                                    onClick={(e) => handleDeleteAddress(addr, idx, e)}
                                    disabled={deleteAddressMutation.isPending}
                                    title="Xóa địa chỉ"
                                >
                                    <FiTrash2 />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </Modal>

            <Modal
                title={t('add_new_address')}
                open={isAddAddressModalOpen}
                onCancel={() => setIsAddAddressModalOpen(false)}
                onOk={() => {
                    if (!newAddr.street || !newAddr.ward) return;
                    addAddressMutation.mutate({
                        address: newAddr.street,
                        province: { provinceID: newAddr.province.id, provinceName: newAddr.province.name },
                        district: { districtID: newAddr.district.id, districtName: newAddr.district.name },
                        ward: { wardCode: newAddr.ward.id, wardName: newAddr.ward.name }
                    }, { 
                        onSuccess: () => {
                            setIsAddAddressModalOpen(false);
                            setIsAddressModalOpen(false);
                            notify(t('add_address_success'), "success");
                            if (profile?.addresses) {
                                setSelectedAddressIndex(profile.addresses.length);
                            } else {
                                setSelectedAddressIndex(0);
                            }
                        } 
                    });

                }}
                okText={t('confirm')}
                cancelText={t('back')}
            >
                <div className="add-addr-modal-body">
                    <CInput 
                        label={t('address')} 
                        placeholder={t('address_placeholder')} 
                        value={newAddr.street}
                        onChange={(e) => setNewAddr(p => ({ ...p, street: e.target.value }))}
                    />
                    <div className="addr-select-grid">
                        <div className="select-item">
                            <label>{t('province')}</label>
                            <Select
                                style={{ width: '100%' }}
                                placeholder={t('select_province')}
                                value={newAddr.province?.id}
                                options={provinces?.map((p, index) => ({ 
                                    value: p.ProvinceID, 
                                    key: index,
                                    label: p.ProvinceName
                                }))}
                                onChange={(id, opt) => setNewAddr({ street: newAddr.street, province: { id, name: opt.label }, district: null, ward: null })}
                                showSearch filterOption={(i, o) => o.label.toLowerCase().includes(i.toLowerCase())}
                            />
                        </div>
                        <div className="select-item">
                            <label>{t('district')}</label>
                            <Select
                                style={{ width: '100%' }}
                                placeholder={t('select_district')}
                                disabled={!newAddr.province}
                                value={newAddr.district?.id}
                                options={districts?.map(d => ({ value: d.DistrictID, label: d.DistrictName }))}
                                onChange={(id, opt) => setNewAddr(p => ({ ...p, district: { id, name: opt.label }, ward: null }))}
                                showSearch filterOption={(i, o) => o.label.toLowerCase().includes(i.toLowerCase())}
                            />
                        </div>
                        <div className="select-item">
                            <label>{t('ward')}</label>
                            <Select
                                style={{ width: '100%' }}
                                placeholder={t('select_ward')}
                                disabled={!newAddr.district}
                                value={newAddr.ward?.id}
                                options={wards?.map(w => ({ value: w.WardCode, label: w.WardName }))}
                                onChange={(id, opt) => setNewAddr(p => ({ ...p, ward: { id, name: opt.label } }))}
                                showSearch filterOption={(i, o) => o.label.toLowerCase().includes(i.toLowerCase())}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                title={t('select_voucher')}
                open={isVoucherModalOpen}
                onCancel={() => setIsVoucherModalOpen(false)}
                footer={null}
                className="voucher-selection-modal"
                width={500}
            >
                <div className="voucher-list-container">
                    {vouchers?.length > 0 ? (
                        vouchers.map((v) => {
                            const isApplicable = !v.minOrderValue || grandTotal >= v.minOrderValue;
                            const hasUsagesLeft = v.remainingUsages === undefined || v.remainingUsages > 0;
                            const isUsable = isApplicable && hasUsagesLeft;
                            const isSelected = selectedVoucher?.id === v.id;
                            
                            return (
                                <div 
                                    key={v.id} 
                                    className={`voucher-card ${isSelected ? 'selected' : ''} ${!isUsable ? 'disabled' : ''}`}
                                    onClick={() => isUsable && setSelectedVoucher(isSelected ? null : v)}
                                >
                                    <div className="voucher-left-pattern">
                                        <div className="voucher-type-icon"><FiTag /></div>
                                    </div>
                                    <div className="voucher-main">
                                        <div className="voucher-code-row">
                                            <span className="voucher-code-badge">{v.code}</span>
                                            {isSelected && <FiCheckCircle className="selected-check" />}
                                        </div>
                                        <div className="voucher-title-text">{v.title}</div>
                                        <div className="voucher-desc-text">
                                            {v.discountType === 'PERCENTAGE' 
                                                ? `${t('discount')} ${v.discountValue}% ${v.maxDiscount ? `(${t('max')} ${v.maxDiscount.toLocaleString()}đ)` : ''}`
                                                : `${t('discount')} ${v.discountValue.toLocaleString()}đ`
                                            }
                                        </div>
                                        <div className="voucher-min-row">
                                            {v.minOrderValue > 0 ? `${t('min_order')}: ${v.minOrderValue.toLocaleString()}đ` : t('no_min_order')}
                                        </div>
                                        {!isApplicable && (
                                            <div className="voucher-error-text">
                                                {t('need_more')} {(v.minOrderValue - grandTotal).toLocaleString()}đ {t('to_apply')}
                                            </div>
                                        )}
                                        {!hasUsagesLeft && (
                                            <div className="voucher-error-text">
                                                {t('voucher_no_usages_left')}
                                            </div>
                                        )}
                                        <div className="voucher-meta-info">
                                            <span>
                                                <FiClock /> {v.endAt ? `${t('voucher_hsd')}: ${new Date(v.endAt).toLocaleDateString('vi-VN')}` : t('voucher_no_limit')}
                                            </span>
                                            <span>
                                                {v.remainingQuantity != null ? `${t('voucher_remaining')}: ${v.remainingQuantity}` : ''}
                                                {v.remainingUsages != null ? ` • Lượt còn lại: ${v.remainingUsages}` : (v.usageLimitPerUser ? ` • ${t('voucher_max_usage')}: ${v.usageLimitPerUser} ${t('voucher_per_user')}` : '')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-vouchers-hint">{t('no_promos_found')}</div>
                    )}
                </div>
                <div className="voucher-modal-footer">
                    <CButton type="primary" block onClick={() => setIsVoucherModalOpen(false)}>
                        {t('confirm')}
                    </CButton>
                </div>
            </Modal>
        </main>
    );
}
