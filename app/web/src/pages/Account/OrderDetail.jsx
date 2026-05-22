import React, { useState, useEffect } from 'react';
import { SEO, MembershipTag } from '@/components/common';
import OrderProgress from '@/features/orders/components/OrderProgress';
import { useLanguage } from '@/store/LanguageContext';
import { generateSlug, PRODUCT_IMAGE_FALLBACK } from '@/utils/helpers';
import { getImageUrl, getOptimizedImageUrl } from '@/services/axiosClient';
import generateInvoice from '@/utils/InvoiceService';
import { FaArrowLeft, FaCreditCard, FaDownload, FaMapLocationDot } from "react-icons/fa6";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useOrderDetail } from '@/features/orders/hooks/useOrders';
import { useProvinces, useDistricts, useWards } from '@/features/account/hooks/useAddress';
import orderApi from '@/features/orders/services/orderService';
import { useNotification } from '@/store/NotificationContext';
import { Modal, Select, Input, Checkbox, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './OrderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const notify = useNotification();

    const { data: orderData, isLoading, error, refetch } = useOrderDetail(id);

    const [isRefundMode, setIsRefundMode] = useState(false);
    const [selectedItemIds, setSelectedItemIds] = useState(new Set());
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [shouldFetchAddress, setShouldFetchAddress] = useState(false);
    const [refundForm, setRefundForm] = useState({
        phone: '',
        street: '',
        province: null,
        district: null,
        ward: null,
        note: '',
        images: []
    });
    const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);

    const { data: provinces } = useProvinces({ enabled: shouldFetchAddress });
    const { data: districts } = useDistricts(refundForm.province?.id, { enabled: shouldFetchAddress });
    const { data: wards } = useWards(refundForm.district?.id, { enabled: shouldFetchAddress });

    useEffect(() => {
        if (orderData) {
            setRefundForm(prev => {
                const addr = orderData.address;
                return {
                    ...prev,
                    phone: orderData.buyerPhoneNumber ?? '',
                    street: addr?.address ?? '',
                    province: addr?.province ? {
                        id: addr.province.provinceID ?? addr.province.ProvinceID,
                        name: addr.province.provinceName ?? addr.province.ProvinceName
                    } : null,
                    district: addr?.district ? {
                        id: addr.district.districtID ?? addr.district.DistrictID,
                        name: addr.district.districtName ?? addr.district.DistrictName
                    } : null,
                    ward: addr?.ward ? {
                        id: addr.ward.wardCode ?? addr.ward.WardCode,
                        name: addr.ward.wardName ?? addr.ward.WardName
                    } : null,
                };
            });
        }
    }, [orderData]);

    if (isLoading) {
        return (
            <div className="od-container od-loading">
                <div className="od-skeleton-header"></div>
                <div className="od-skeleton-progress"></div>
                <div className="od-skeleton-content"></div>
            </div>
        );
    }

    if (error ? true : !orderData) {
        return (
            <div className="od-container od-not-found">
                <p>{error ? t('api_error_general') : t('order_not_found')}</p>
                <button onClick={() => navigate('/account/orders')} className="od-btn-fallback">
                    <FaArrowLeft /> {t('back')}
                </button>
            </div>
        );
    }

    const handleSubmitRefund = async () => {
        if (selectedItemIds.size === 0) {
            notify(t('refund_select_item_error'), 'error');
            return;
        }
        if ([refundForm.phone, refundForm.street, refundForm.province, refundForm.district, refundForm.ward].some(field => !field)) {
            notify(t('fill_all_fields'), 'error');
            return;
        }
        if (!(refundForm.note?.trim())) {
            notify(t('refund_note_empty_error'), 'error');
            return;
        }

        setIsSubmittingRefund(true);
        try {
            const formData = new FormData();
            const requestPayload = {
                orderId: orderData.orderId,
                orderItemId: Array.from(selectedItemIds)
                    .map(idx => orderData.items[idx]?.orderItemId || orderData.items[idx]?.id)
                    .filter(id => id !== undefined && id !== null),
                fromAddress: {
                    address: refundForm.street,
                    province: {
                        provinceID: Number(refundForm.province.id),
                        provinceName: refundForm.province.name
                    },
                    district: {
                        districtID: Number(refundForm.district.id),
                        districtName: refundForm.district.name
                    },
                    ward: {
                        wardCode: Number(refundForm.ward.id),
                        wardName: refundForm.ward.name
                    }
                },
                phoneNumber: refundForm.phone,
                note: refundForm.note
            };

            formData.append('request', JSON.stringify(requestPayload));
            if (refundForm.images && refundForm.images.length > 0) {
                refundForm.images.forEach(file => {
                    formData.append('images', file.originFileObj ?? file);
                });
            }

            await orderApi.createRefund(formData);
            notify(t('refund_request_success'), 'success');
            setIsRefundModalOpen(false);
            setIsRefundMode(false);
            setSelectedItemIds(new Set());
            refetch();
        } catch (error) {
            const errorMsg = error.response?.data?.message ?? t('api_error_general');
            notify(errorMsg, 'error');
        } finally {
            setIsSubmittingRefund(false);
        }
    };

    const subtotal = (orderData.items ?? []).reduce((sum, item) => {
        const price = Number(item.price ?? 0);
        const promoPrice = (item.promotionPrice != null && Number(item.promotionPrice) < price) ? Number(item.promotionPrice) : price;
        return sum + (promoPrice * Number(item.quantity ?? 1));
    }, 0);

    const voucherDiscount = (orderData.items ?? []).reduce((sum, item) => sum + Number(item.voucherDiscountAmount ?? 0), 0);
    const shippingFee = Number(orderData.shippingFee ?? 0);
    const grandTotal = Number(orderData.total ?? 0) + shippingFee;

    return (
        <div className="od-container">
            <SEO title={`${t('order_id_label')} #${orderData.orderId}`} />
            <div className="od-header">
                <button className="od-btn-back" onClick={() => navigate('/account/orders')}>
                    <FaArrowLeft />
                </button>
                <h2 className="od-title">{t('order_id_label')} #{orderData.orderId}</h2>

                {orderData.status === 'SUCCEEDED' && !orderData.items?.some(item => item.refundOrderId) && (
                    <div className="od-header-actions-refund">
                        {!isRefundMode ? (
                            <button
                                className="od-btn-refund-trigger"
                                onClick={() => setIsRefundMode(true)}
                            >
                                {t('request_refund_order')}
                            </button>
                        ) : (
                            <div className="od-refund-mode-actions">
                                <button
                                    className="od-btn-refund-cancel"
                                    onClick={() => {
                                        setIsRefundMode(false);
                                        setSelectedItemIds(new Set());
                                    }}
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    className="od-btn-refund-continue"
                                    disabled={selectedItemIds.size === 0}
                                    onClick={() => {
                                        setIsRefundModalOpen(true);
                                        setShouldFetchAddress(true);
                                    }}
                                >
                                    {t('continue')} ({selectedItemIds.size})
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <button
                    className="od-btn-download"
                    onClick={() => generateInvoice(orderData, t)}
                    title={t('download_invoice')}
                >
                    <FaDownload /> {t('invoice')}
                </button>
            </div>

            <OrderProgress
                currentStatus={orderData.status}
                shippingStatus={orderData.shippingStatus}
                paymentMethod={orderData.paymentMethod}
                paymentStatus={orderData.paymentStatus}
                orderDate={orderData.orderDate}
                estShippingDate={orderData.estShippingDate}
            />

            <div className="od-info-banner">
                <div className="od-banner-item">
                    <span className="od-banner-label">{t('order_date')}</span>
                    <strong className="od-banner-value">{new Date(orderData.orderDate).toLocaleDateString('vi-VN')}</strong>
                </div>
                {orderData.estShippingDate && (
                    <div className="od-banner-item">
                        <span className="od-banner-label">{t('est_shipping_date')}</span>
                        <strong className="od-banner-value">{new Date(orderData.estShippingDate).toLocaleDateString('vi-VN')}</strong>
                    </div>
                )}
            </div>

            <div className="od-items-section">
                <h3 className="od-section-title">{t('order_items')}</h3>
                <div className="od-items-list">
                    {orderData.items.map((item, index) => {
                        const isPromo = item.promotionPrice && item.promotionPrice < item.price;
                        const effectivePrice = isPromo ? item.promotionPrice : item.price;
                        const voucherUnit = item.voucherDiscountAmount ? Math.round(item.voucherDiscountAmount / item.quantity) : 0;
                        const lineTotal = (effectivePrice * item.quantity) - item.voucherDiscountAmount;
                        const isChecked = selectedItemIds.has(index);

                        return (
                            <div className={`od-item-card ${isRefundMode ? 'refund-selectable' : ''} ${isChecked ? 'refund-selected' : ''} ${item.refundOrderId ? 'item-has-refund' : ''}`} key={index}>
                                {isRefundMode && (
                                    <div className="od-item-select-col">
                                        <Checkbox
                                            disabled={!!item.refundOrderId || orderData.items?.some(i => i.refundOrderId)}
                                            checked={isChecked}
                                            onChange={() => {
                                                const newIds = new Set(selectedItemIds);
                                                if (isChecked) {
                                                    newIds.delete(index);
                                                } else {
                                                    newIds.add(index);
                                                }
                                                setSelectedItemIds(newIds);
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="od-item-img">
                                    <img
                                        src={item.productVariantImage ? getOptimizedImageUrl(item.productVariantImage, 256) : PRODUCT_IMAGE_FALLBACK}
                                        alt={item.productVariantName}
                                        onError={(e) => { e.target.src = PRODUCT_IMAGE_FALLBACK; }}
                                    />
                                </div>
                                <div className="od-item-details">
                                    <Link to={`/product/${generateSlug(item.productVariantName, item.productVariantId)}`} state={{ productId: item.productVariantId }} className="od-item-link">
                                        <h4 className="od-item-name">
                                            {item.productVariantName}
                                            {item.refundOrderId && (
                                                <span className="od-item-refund-label-tag" style={{ marginLeft: '8px' }}>
                                                    {t('refund_request_label')}
                                                </span>
                                            )}
                                        </h4>
                                    </Link>
                                    <p className="od-item-qty">{t('quantity')} x{item.quantity}</p>
                                </div>
                                <div className="od-item-pricing">
                                    {isPromo && (
                                        <div className="od-price-row">
                                            <span className="od-price-label">{t('original_price')}:</span>
                                            <span className="od-original-price">{item.price.toLocaleString("vi-VN")}{t('unit_vnd')}</span>
                                        </div>
                                    )}
                                    <div className="od-price-row">
                                        <span className="od-price-label">{isPromo ? t('promo_price') : t('price')}:</span>
                                        <span className={`od-unit-price ${voucherUnit > 0 ? 'has-voucher' : ''}`}>
                                            {effectivePrice.toLocaleString("vi-VN")}{t('unit_vnd')}
                                        </span>
                                    </div>
                                    {voucherUnit > 0 && (
                                        <div className="od-price-row">
                                            <span className="od-price-label">{t('voucher')}:</span>
                                            <span className="od-voucher-unit">-{voucherUnit.toLocaleString("vi-VN")}{t('unit_vnd')}</span>
                                        </div>
                                    )}
                                    <div className="od-price-row od-total-row">
                                        <span className="od-price-label">{t('total')}:</span>
                                        <span className="od-current-price">{lineTotal.toLocaleString("vi-VN")}{t('unit_vnd')}</span>
                                    </div>
                                    {item.refundOrderId && (
                                        <span className={`od-refund-badge ${item.refundStatus?.toLowerCase() ?? 'pending'}`}>
                                            {t(`refund_status_${item.refundStatus}`)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {orderData.paymentMethod === 'BANK' && orderData.paymentStatus === 'UNPAID' && orderData.status !== 'CANCELLED' && (
                <div className="od-payment-pending-card">
                    <div className="od-pp-header">
                        <h3>{t('payment_pending_title')}</h3>
                    </div>
                    <p className="od-pp-notice">
                        {t('payment_8h_notice')}
                    </p>
                    <div className="od-pp-qr-box">
                        <img src={orderData.qrCodeLink} alt="QR Code" className="od-pp-qr-img" />
                        <div className="od-pp-info">
                            <div className="od-pp-info-item">
                                <span className="label">{t('amount')}</span>
                                <span className="value highlighting">{(orderData.total + orderData.shippingFee).toLocaleString("vi-VN")}{t('unit_vnd')}</span>
                            </div>
                            <div className="od-pp-info-item">
                                <span className="label">{t('order_id')}</span>
                                <span className="value">DH{orderData.orderId}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="od-info-grid">
                <div className="od-info-card">
                    <h3 className="od-info-title"><FaCreditCard /> {t('payment_header')}</h3>
                    <div className="od-payment-info-box">
                        <p className="od-info-text od-font-bold">{t(`payment_method_${orderData.paymentMethod}`)}</p>
                        <span className={`od-status-badge ${orderData.paymentStatus === 'PAID' ? 'success' : 'warning'}`}>
                            {t(`payment_status_${orderData.paymentStatus}`)}
                        </span>
                    </div>
                </div>
                <div className="od-info-card">
                    <h3 className="od-info-title"><FaMapLocationDot /> {t('delivery_header')}</h3>
                    <div className="od-delivery-details">
                        <div className="od-user-header">
                            <span className="od-info-text od-font-bold">
                                {orderData.buyerName ?? (orderData.userName ?? t('guest'))}
                            </span>
                            {orderData.membershipLevel !== undefined && (
                                <MembershipTag level={orderData.membershipLevel} />
                            )}
                        </div>
                        <p className="od-info-text">{orderData.buyerPhoneNumber ?? ''}</p>
                        <p className="od-info-text">
                            {orderData.address ? `${orderData.address.address}, ${orderData.address.ward?.wardName ?? (orderData.address.ward?.WardName ?? '')}, ${orderData.address.district?.districtName ?? (orderData.address.district?.DistrictName ?? '')}, ${orderData.address.province?.provinceName ?? (orderData.address.province?.ProvinceName ?? '')}` : '---'}
                        </p>
                    </div>
                </div>
            </div>
            <div className="od-bottom-grid">
                <div className="od-note-section">
                    {orderData.buyerNote && (
                        <div className="od-info-card od-note-card">
                            <h3 className="od-info-title">{t('note')}</h3>
                            <p className="od-info-text">{orderData.buyerNote}</p>
                        </div>
                    )}
                </div>

                <div className="od-summary-wrapper">
                    <div className="od-summary-card">
                        <h3 className="od-summary-title">{t('order_overview')}</h3>

                        <div className="od-summary-row">
                            <span>{t('subtotal')}</span>
                            <span>{subtotal.toLocaleString("vi-VN")}{t('unit_vnd')}</span>
                        </div>

                        {voucherDiscount > 0 && (
                            <div className="od-summary-row od-discount-row" style={{ color: '#C2185B' }}>
                                <span>{t('voucher_discount')}</span>
                                <span>-{voucherDiscount.toLocaleString("vi-VN")}{t('unit_vnd')}</span>
                            </div>
                        )}

                        <div className="od-summary-row">
                            <span>{t('shipping_fee')}</span>
                            <span>+{shippingFee.toLocaleString("vi-VN")}{t('unit_vnd')}</span>
                        </div>

                        <div className="od-summary-row od-total-row">
                            <span>{t('grand_total')}</span>
                            <span>{grandTotal.toLocaleString("vi-VN")}{t('unit_vnd')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title={<span className="od-modal-title">{t('request_refund_title')}</span>}
                open={isRefundModalOpen}
                onCancel={() => setIsRefundModalOpen(false)}
                footer={null}
                width={650}
                className="od-refund-modal-luxury"
            >
                <div className="od-refund-modal-body">
                    <div style={{ backgroundColor: '#fffbeb', color: '#d97706', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fef3c7', fontSize: '13px', marginBottom: '16px', lineHeight: '1.4' }}>
                        {t('refund_warning_shipping')}
                    </div>
                    <div className="od-refund-items-summary">
                        <label className="od-field-label">{t('refund_selected_items')}</label>
                        <div className="od-refund-summary-list">
                            {orderData.items
                                .filter((item, idx) => selectedItemIds.has(idx))
                                .map((item, idx) => (
                                    <div key={idx} className="od-refund-summary-item">
                                        <img
                                            src={item.productVariantImage ? getOptimizedImageUrl(item.productVariantImage, 256) : PRODUCT_IMAGE_FALLBACK}
                                            alt={item.productVariantName}
                                            onError={(e) => { e.target.src = PRODUCT_IMAGE_FALLBACK; }}
                                        />
                                        <div className="item-info">
                                            <div className="item-name">{item.productVariantName}</div>
                                            <div className="item-qty">{t('quantity')}: x{item.quantity}</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="od-refund-form-grid">
                        <div className="od-refund-form-group">
                            <label className="od-field-label">{t('phone')}</label>
                            <Input
                                value={refundForm.phone}
                                onChange={e => setRefundForm(p => ({ ...p, phone: e.target.value }))}
                                placeholder={t('phone_placeholder')}
                            />
                        </div>

                        <div className="od-refund-form-group">
                            <label className="od-field-label">{t('address')}</label>
                            <Input
                                value={refundForm.street}
                                onChange={e => setRefundForm(p => ({ ...p, street: e.target.value }))}
                                placeholder={t('address_placeholder')}
                            />
                        </div>

                        <div className="od-refund-address-selectors">
                            <div className="od-select-item">
                                <label className="od-field-label">{t('province')}</label>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder={t('select_province')}
                                    value={refundForm.province?.id}
                                    options={provinces?.map(p => ({
                                        value: p.ProvinceID,
                                        label: p.ProvinceName
                                    }))}
                                    onChange={(id, opt) => setRefundForm(p => ({
                                        ...p,
                                        province: { id, name: opt.label },
                                        district: null,
                                        ward: null
                                    }))}
                                    showSearch
                                    filterOption={(i, o) => o.label.toLowerCase().includes(i.toLowerCase())}
                                />
                            </div>

                            <div className="od-select-item">
                                <label className="od-field-label">{t('district')}</label>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder={t('select_district')}
                                    disabled={!refundForm.province}
                                    value={refundForm.district?.id}
                                    options={districts?.map(d => ({
                                        value: d.DistrictID,
                                        label: d.DistrictName
                                    }))}
                                    onChange={(id, opt) => setRefundForm(p => ({
                                        ...p,
                                        district: { id, name: opt.label },
                                        ward: null
                                    }))}
                                    showSearch
                                    filterOption={(i, o) => o.label.toLowerCase().includes(i.toLowerCase())}
                                />
                            </div>

                            <div className="od-select-item">
                                <label className="od-field-label">{t('ward')}</label>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder={t('select_ward')}
                                    disabled={!refundForm.district}
                                    value={refundForm.ward?.id}
                                    options={wards?.map(w => ({
                                        value: w.WardCode,
                                        label: w.WardName
                                    }))}
                                    onChange={(id, opt) => setRefundForm(p => ({
                                        ...p,
                                        ward: { id, name: opt.label }
                                    }))}
                                    showSearch
                                    filterOption={(i, o) => o.label.toLowerCase().includes(i.toLowerCase())}
                                />
                            </div>
                        </div>

                        <div className="od-refund-form-group full-width">
                            <label className="od-field-label">{t('return_reason')}</label>
                            <Input.TextArea
                                rows={4}
                                value={refundForm.note}
                                onChange={e => setRefundForm(p => ({ ...p, note: e.target.value }))}
                                placeholder={t('desc_placeholder')}
                            />
                        </div>
                    </div>

                    <div className="od-refund-upload-section">
                        <label className="od-field-label">{t('upload_evidence')}</label>
                        <Upload.Dragger
                            multiple
                            listType="picture"
                            accept="image/*"
                            fileList={refundForm.images}
                            beforeUpload={(file) => {
                                const isImage = file.type.startsWith('image/');
                                if (!isImage) {
                                    notify(t('only_upload_images'), 'error');
                                    return Upload.LIST_IGNORE;
                                }
                                const isLt2M = file.size / 1024 / 1024 < 2;
                                if (!isLt2M) {
                                    notify(t('image_size_limit'), 'error');
                                    return Upload.LIST_IGNORE;
                                }
                                return false;
                            }}
                            onChange={info => {
                                let newFileList = [...info.fileList];
                                if (newFileList.length > 5) {
                                    notify(t('max_images_limit'), 'warning');
                                    newFileList = newFileList.slice(0, 5);
                                }
                                setRefundForm(p => ({ ...p, images: newFileList }));
                            }}
                        >
                            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                            <p className="ant-upload-text">{t('drag_upload_hint')}</p>
                            <p className="ant-upload-hint">{t('upload_limit_hint')}</p>
                        </Upload.Dragger>
                    </div>

                    <div className="od-refund-modal-actions">
                        <button
                            className="od-btn-modal-cancel"
                            onClick={() => setIsRefundModalOpen(false)}
                            disabled={isSubmittingRefund}
                        >
                            {t('back')}
                        </button>
                        <button
                            className="od-btn-modal-submit"
                            onClick={handleSubmitRefund}
                            disabled={isSubmittingRefund}
                        >
                            {isSubmittingRefund ? t('submitting') : t('confirm')}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OrderDetail;
