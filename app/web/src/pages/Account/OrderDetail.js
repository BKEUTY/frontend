import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { FaCreditCard, FaMapLocationDot, FaArrowLeft } from "react-icons/fa6";
import './OrderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const orderData = location.state?.order;

    if (!orderData) {
        return (
            <div className="order-detail-container" style={{ textAlign: 'center', padding: '50px' }}>
                <p>{t('order_not_found') || 'Không tìm thấy thông tin đơn hàng.'}</p>
                <button onClick={() => navigate('/account/orders')} className="btn-back-fallback">
                    <FaArrowLeft /> {t('back')}
                </button>
            </div>
        );
    }
    const subtotal = orderData.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || orderData.total;
    const totalDiscount = orderData.items?.reduce((sum, item) => {
        if (item.promotionPrice && item.promotionPrice < item.price) {
            return sum + ((item.price - item.promotionPrice) * item.quantity);
        }
        return sum;
    }, 0) || 0;

    return (
        <div className="order-detail-container animate-fade-in">
            <div className="order-header animate-slide-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button className="btn-back" onClick={() => navigate('/account/orders')}>
                        <FaArrowLeft />
                    </button>
                    <h2>{t('order_id_label') || 'Mã đơn hàng: '}#{orderData.orderId || id}</h2>
                </div>
            </div>

            <div className="order-dates animate-slide-up delay-100">
                <span>{t('order_time') || 'Ngày đặt:'} <strong>{orderData.orderDate}</strong></span>
            </div>

            <div className="order-items-list animate-slide-up delay-200">
                <h3 className="section-title">{t('order_items') || 'Danh sách sản phẩm'}</h3>
                {orderData.items?.map((item, index) => (
                    <div className="order-item-card" key={index}>
                        <div className="item-img">
                            <img src={item.productVariantImage || 'https://placehold.co/100x100?text=Product'} alt={item.productVariantName} />
                        </div>
                        <div className="item-details">
                            <h4>{item.productVariantName}</h4>
                            <p className="item-qty">Số lượng: x{item.quantity}</p>
                        </div>
                        <div className="item-pricing">
                            <span className="current-price">{(item.promotionPrice || item.price).toLocaleString("vi-VN")}đ</span>
                            {item.promotionPrice < item.price && (
                                <span className="original-price">{item.price.toLocaleString("vi-VN")}đ</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="order-info-grid animate-slide-up delay-300">
                <div className="info-section">
                    <h3><FaCreditCard /> {t('payment_header') || 'Phương thức thanh toán'}</h3>
                    <p className="info-text font-bold">{orderData.paymentMethod}</p>
                </div>
                <div className="info-section">
                    <h3><FaMapLocationDot /> {t('delivery_header') || 'Địa chỉ giao hàng'}</h3>
                    <div className="address-box">
                        <p>{orderData.address}</p>
                    </div>
                </div>
            </div>

            <div className="order-summary-section animate-slide-up delay-300">
                <div className="summary-section">
                    <h3>{t('order_overview') || 'Tổng quan đơn hàng'}</h3>
                    <div className="summary-row">
                        <span>{t('subtotal') || 'Tổng giá gốc'}</span>
                        <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                    </div>
                    {totalDiscount > 0 && (
                        <div className="summary-row discount-row">
                            <span>{t('discount') || 'Tổng giảm giá'}</span>
                            <span>-{totalDiscount.toLocaleString("vi-VN")}đ</span>
                        </div>
                    )}
                    <div className="summary-row total-row">
                        <span>{t('total') || 'Tổng cộng'}</span>
                        <span>{orderData.total.toLocaleString("vi-VN")}đ</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
