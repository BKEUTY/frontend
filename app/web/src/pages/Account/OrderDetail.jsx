import { SEO } from '@/components/common';
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

    const subtotal = orderData.items?.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0) || 0;

    const totalDiscount = orderData.items?.reduce((sum, item) => {
        if (item.promotionPrice && item.promotionPrice < item.price) {
            return sum + ((item.price - item.promotionPrice) * item.quantity);
        }
        return sum;
    }, 0) || 0;

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
            />

            <div className="od-dates">
                <span>{t('order_time')} <strong>{orderData.formattedDate}</strong></span>
            </div>

            <div className="od-items-section">
                <h3 className="od-section-title">{t('order_items')}</h3>
                <div className="od-items-list">
                    {orderData.items?.map((item, index) => (
                        <div className="od-item-card" key={index}>
                            <div className="od-item-img">
                                <img src={item.productVariantImage || 'https://placehold.co/100x100?text=Product'} alt={item.productVariantName} />
                            </div>
                            <div className="od-item-details">
                                <Link to={`/product/${generateSlug(item.productVariantName, item.productVariantId)}`} className="od-item-link">
                                    <h4 className="od-item-name">{item.productVariantName}</h4>
                                </Link>
                                <p className="od-item-qty">{t('quantity')} x{item.quantity}</p>
                            </div>
                            <div className="od-item-pricing">
                                {item.promotionPrice && item.promotionPrice < item.price ? (
                                    <>
                                        <span className="od-current-price">{item.promotionPrice.toLocaleString("vi-VN")}đ</span>
                                        <span className="od-original-price">{item.price.toLocaleString("vi-VN")}đ</span>
                                    </>
                                ) : (
                                    <span className="od-current-price">{item.price.toLocaleString("vi-VN")}đ</span>
                                )}
                                {orderData.status === 'COMPLETED' && (
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
                    ))}
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
                                <span className="value highlighting">{(orderData.total + (orderData.shippingFee || 0)).toLocaleString("vi-VN")}đ</span>
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
                    <p className="od-info-text">
                        {orderData.address ? `${orderData.address.address}, ${orderData.address.ward?.wardName}, ${orderData.address.district?.districtName}, ${orderData.address.province?.provinceName}` : '---'}
                    </p>
                </div>
            </div>

            <div className="od-summary-wrapper">
                <div className="od-summary-card">
                    <h3 className="od-summary-title">{t('order_overview')}</h3>

                    <div className="od-summary-row">
                        <span>{t('subtotal')}</span>
                        <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                    </div>

                    {totalDiscount > 0 && (
                        <div className="od-summary-row od-discount-row">
                            <span>{t('discount')}</span>
                            <span>-{totalDiscount.toLocaleString("vi-VN")}đ</span>
                        </div>
                    )}

                    <div className="od-summary-row">
                        <span>{t('shipping_fee')}</span>
                        <span>+{(orderData.shippingFee || 0).toLocaleString("vi-VN")}đ</span>
                    </div>

                    <div className="od-summary-row od-total-row">
                        <span>{t('total')}</span>
                        <span>{(orderData.total + (orderData.shippingFee || 0)).toLocaleString("vi-VN")}đ</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
