import { SEO, MembershipTag } from '@/components/common';
import OrderProgress from '@/features/orders/components/OrderProgress';
import { useLanguage } from '@/store/LanguageContext';
import { generateSlug } from '@/utils/helpers';
import generateInvoice from '@/utils/InvoiceService';
import { FaArrowLeft, FaCreditCard, FaDownload, FaMapLocationDot } from "react-icons/fa6";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useOrderDetail } from '@/features/orders/hooks/useOrders';
import './OrderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const { data: orderData, isLoading, error } = useOrderDetail(id);

    if (isLoading) {
        return (
            <div className="od-container od-loading">
                <div className="od-skeleton-header"></div>
                <div className="od-skeleton-progress"></div>
                <div className="od-skeleton-content"></div>
            </div>
        );
    }

    if (error || !orderData) {
        return (
            <div className="od-container od-not-found">
                <p>{error ? t('api_error_general') : t('order_not_found')}</p>
                <button onClick={() => navigate('/account/orders')} className="od-btn-fallback">
                    <FaArrowLeft /> {t('back')}
                </button>
            </div>
        );
    }

    const subtotal = (orderData.items || []).reduce((sum, item) => {
        const price = Number(item.price || 0);
        const promoPrice = (item.promotionPrice != null && Number(item.promotionPrice) < price) ? Number(item.promotionPrice) : price;
        return sum + (promoPrice * Number(item.quantity || 1));
    }, 0);

    const voucherDiscount = Number(orderData.voucherDiscountAmount || 0);
    const shippingFee = Number(orderData.shippingFee || 0);
    const grandTotal = Number(orderData.total || 0) + shippingFee;

    return (
        <div className="od-container">
            <SEO title={`${t('order_id_label')} #${orderData.orderId}`} />
            <div className="od-header">
                <button className="od-btn-back" onClick={() => navigate('/account/orders')}>
                    <FaArrowLeft />
                </button>
                <h2 className="od-title">{t('order_id_label')} #{orderData.orderId}</h2>
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

                        return (
                        <div className="od-item-card" key={index}>
                            <div className="od-item-img">
                                <img src={item.productVariantImage} alt={item.productVariantName} />
                            </div>
                            <div className="od-item-details">
                                <Link to={`/product/${generateSlug(item.productVariantName, item.productVariantId)}`} state={{ productId: item.productVariantId }} className="od-item-link">
                                    <h4 className="od-item-name">{item.productVariantName}</h4>
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
                                {orderData.status === 'SUCCEEDED' && (
                                    <button
                                        className="od-btn-return"
                                        onClick={() => navigate('/account/returns', {
                                            state: {
                                                orderId: orderData.orderId,
                                                item: item
                                            }
                                        })}
                                    >
                                        {t('request_return')}
                                    </button>
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
                                {orderData.buyerName || orderData.userName || t('guest')}
                            </span>
                            {orderData.membershipLevel !== undefined && (
                                <MembershipTag level={orderData.membershipLevel} />
                            )}
                        </div>
                        <p className="od-info-text">{orderData.buyerPhoneNumber || ''}</p>
                        <p className="od-info-text">
                            {orderData.address ? `${orderData.address.address}, ${orderData.address.ward?.wardName}, ${orderData.address.district?.districtName}, ${orderData.address.province?.provinceName}` : '---'}
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
                                <span>{t('voucher_discount') || 'Giảm giá voucher'}</span>
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
        </div>
    );
};

export default OrderDetail;
