import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { FaCreditCard, FaMapLocationDot, FaArrowLeft } from "react-icons/fa6";
import { generateSlug } from '../../utils/helpers';
import './OrderDetail.css';

const OrderDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const orderData = location.state?.order;

    if (!orderData) {
        return (
            <div className="od-container od-not-found">
                <p>{t('order_not_found')}</p>
                <button onClick={() => navigate('/account/orders')} className="od-btn-fallback">
                    <FaArrowLeft /> {t('back')}
                </button>
            </div>
        );
    }

    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiscount = orderData.items.reduce((sum, item) => {
        if (item.promotionPrice < item.price) {
            return sum + ((item.price - item.promotionPrice) * item.quantity);
        }
        return sum;
    }, 0);

    return (
        <div className="od-container">
            <div className="od-header">
                <button className="od-btn-back" onClick={() => navigate('/account/orders')}>
                    <FaArrowLeft />
                </button>
                <h2 className="od-title">{t('order_id_label')} #{orderData.orderId}</h2>
            </div>

            <div className="od-dates">
                <span>{t('order_time')} <strong>{orderData.formattedDate}</strong></span>
            </div>

            <div className="od-items-section">
                <h3 className="od-section-title">{t('order_items')}</h3>
                <div className="od-items-list">
                    {orderData.items.map((item, index) => (
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
                                <span className="od-current-price">{item.promotionPrice.toLocaleString("vi-VN")}đ</span>
                                {item.promotionPrice < item.price && (
                                    <span className="od-original-price">{item.price.toLocaleString("vi-VN")}đ</span>
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

            <div className="od-info-grid">
                <div className="od-info-card">
                    <h3 className="od-info-title"><FaCreditCard /> {t('payment_header')}</h3>
                    <p className="od-info-text od-font-bold">{orderData.paymentMethod}</p>
                </div>
                <div className="od-info-card">
                    <h3 className="od-info-title"><FaMapLocationDot /> {t('delivery_header')}</h3>
                    <p className="od-info-text">
                        {`${orderData.address.address}, ${orderData.address.ward?.wardName}, ${orderData.address.district?.districtName}, ${orderData.address.province?.provinceName}`}
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
                        <span>+{orderData.shippingFee.toLocaleString("vi-VN")}đ</span>
                    </div>

                    <div className="od-summary-row od-total-row">
                        <span>{t('total')}</span>
                        <span>{orderData.total.toLocaleString("vi-VN")}đ</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
