
import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { FaBoxOpen, FaGear, FaPlaneDeparture, FaCheck, FaTruckFast, FaInbox, FaFileInvoice, FaMapLocationDot, FaCircleInfo, FaBox, FaRotateLeft, FaArrowUpRightFromSquare } from "react-icons/fa6";
import './OrderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const { t } = useLanguage();

    const orderData = {
        id: id || '3354654654526',
        createdAt: '10/10/2023',
        expectedDelivery: '10/10/2023',
        status_logs: [
            { title: t('order_placed_success'), desc: t('order_placed_desc'), time: '11:45 PM', icon: <FaBoxOpen /> },
            { title: t('preparing_order'), desc: t('preparing_order_desc'), time: '11:45 PM', icon: <FaGear /> },
            { title: t('international_processing'), desc: t('international_processing_desc'), time: '11:45 PM', icon: <FaPlaneDeparture /> }
        ],
        subtotal: 15755,
        discount: 15755,
        shipping: 30000,
        tax: 0,
        total: 46000
    };

    return (
        <div className="order-detail-container animate-fade-in">
            <div className="order-header animate-slide-up">
                <h2>{t('order_id_label')}{orderData.id}</h2>
                <div className="order-actions">
                    <button className="btn-invoice"><FaFileInvoice /> {t('invoice')}</button>
                    <button className="btn-track"><FaMapLocationDot /> {t('track_order')}</button>
                </div>
            </div>

            <div className="order-dates animate-slide-up delay-100">
                <span>{t('order_time')} <strong>{orderData.createdAt}</strong></span>
                <span className="expected-date"><FaTruckFast /> {t('expected_delivery')} <strong>{orderData.expectedDelivery}</strong></span>
            </div>

            <div className="order-timeline animate-slide-up delay-200">
                <div className="timeline-step completed">
                    <div className="step-icon-box"><FaCheck /></div>
                    <div className="step-info">
                        <div className="step-label">{t('timeline_paid')}</div>
                        <div className="step-date">10/10/2023</div>
                    </div>
                </div>
                <div className="timeline-step completed">
                    <div className="step-icon-box"><FaBoxOpen /></div>
                    <div className="step-info">
                        <div className="step-label">{t('timeline_shipped')}</div>
                        <div className="step-date">10/10/2023</div>
                    </div>
                </div>
                <div className="timeline-step active">
                    <div className="step-icon-box"><FaTruckFast /></div>
                    <div className="step-info">
                        <div className="step-label">{t('timeline_delivering')}</div>
                        <div className="step-date">{t('timeline_date_expected')} 12/10</div>
                    </div>
                </div>
                <div className="timeline-step">
                    <div className="step-icon-box"><FaInbox /></div>
                    <div className="step-info">
                        <div className="step-label">{t('timeline_delivered')}</div>
                        <div className="step-date">---</div>
                    </div>
                </div>
            </div>

            <div className="order-logs animate-slide-up delay-300">
                {orderData.status_logs.map((log, index) => (
                    <div className="log-item" key={index}>
                        <div className="log-icon-placeholder">{log.icon}</div>
                        <div className="log-content">
                            <h4>{log.title}</h4>
                            <p>{log.desc}</p>
                        </div>
                        <div className="log-time">{log.time}</div>
                    </div>
                ))}
            </div>

            <div className="order-info-grid animate-slide-up delay-300">
                <div className="info-section">
                    <h3>{t('payment_header')}</h3>
                    <p className="info-text">Visa **56 <span className="visa-badge">VISA</span></p>
                </div>
                <div className="info-section">
                    <h3>{t('delivery_header')}</h3>
                    <div className="address-box">
                        <p className="address-label">{t('address')}</p>
                        <p>192/4 Lý tự trọng, Ninh Kiều, Cần Thơ</p>
                    </div>
                </div>
            </div>

            <div className="order-summary-section animate-slide-up delay-300">
                <div className="help-section">
                    <h3>{t('support_header')}</h3>
                    <ul className="help-links">
                        <li>
                            <FaCircleInfo className="help-icon" />
                            <span>{t('issue_delivery')}</span>
                            <FaArrowUpRightFromSquare className="link-arrow" />
                        </li>
                        <li>
                            <FaBox className="help-icon" />
                            <span>{t('issue_order_info')}</span>
                            <FaArrowUpRightFromSquare className="link-arrow" />
                        </li>
                        <li>
                            <FaRotateLeft className="help-icon" />
                            <span>{t('issue_return')}</span>
                            <FaArrowUpRightFromSquare className="link-arrow" />
                        </li>
                    </ul>
                </div>

                <div className="summary-section">
                    <h3>{t('order_overview')}</h3>
                    <div className="summary-row">
                        <span>{t('subtotal')}</span>
                        <span>{orderData.subtotal.toLocaleString()}đ</span>
                    </div>
                    <div className="summary-row">
                        <span>{t('discount')}</span>
                        <span>(20%) - {orderData.discount.toLocaleString()}đ</span>
                    </div>
                    <div className="summary-row">
                        <span>{t('shipping_fee')}</span>
                        <span>{orderData.shipping.toLocaleString()}đ</span>
                    </div>
                    <div className="summary-row">
                        <span>{t('tax')}</span>
                        <span>{orderData.tax}đ</span>
                    </div>
                    <div className="summary-row total-row">
                        <span>{t('total')}</span>
                        <span>{orderData.total.toLocaleString()}đ</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
