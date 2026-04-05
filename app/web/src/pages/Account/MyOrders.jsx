import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useOrders } from '../../hooks/useOrders';
import './MyOrders.css';

const MyOrders = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { orders, loading } = useOrders();

    const getStatusClass = (status) => {
        if (!status) return 'default';
        const s = status.toUpperCase();
        if (s === 'PAID' || s === 'COMPLETED') return 'success';
        if (s === 'UNPAID' || s === 'IN_PROGRESS') return 'warning';
        if (s === 'CANCELLED') return 'danger';
        return 'default';
    };

    return (
        <div className="ord-page-container">
            <div className="ord-page-header">
                <h2 className="ord-page-title">{t('my_orders')}</h2>
            </div>
            
            <div className="ord-page-content">
                <div className="ord-table-wrapper">
                    {loading ? (
                        <div className="ord-loading"><Spin size="large" /></div>
                    ) : (
                        <table className="ord-table">
                            <thead>
                                <tr>
                                    <th>{t('order_id')}</th>
                                    <th>{t('order_date')}</th>
                                    <th>{t('total')}</th>
                                    <th style={{ textAlign: 'center' }}>{t('payment_method')}</th>
                                    <th style={{ textAlign: 'center' }}>{t('status')}</th>
                                    <th style={{ textAlign: 'center' }}>{t('actions_col')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order.id} className="ord-row">
                                            <td className="ord-id-col">
                                                <Link 
                                                    to={`/account/orders/${order.id}`} 
                                                    state={{ order: order }}
                                                >
                                                    #{order.id}
                                                </Link>
                                            </td>
                                            <td>{order.formattedDate}</td>
                                            <td><span className="ord-highlight-total">{order.formattedTotal}</span></td>
                                            <td align="center">
                                                <span className="ord-payment-text">{order.paymentMethod}</span>
                                            </td>
                                            <td align="center">
                                                <span className={`ord-status-badge ${getStatusClass(order.status)}`}>
                                                    {t(`order_status_${order.status}`)}
                                                </span>
                                            </td>
                                            <td align="center">
                                                <button 
                                                    className="ord-action-btn"
                                                    onClick={() => navigate(`/account/orders/${order.id}`, { state: { order: order } })}
                                                    title={t('view_detail')}
                                                >
                                                    <EyeOutlined />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="ord-empty-td">
                                            <div className="ord-empty-state">
                                                <p>{t('no_orders')}</p>
                                                <button onClick={() => navigate('/product')}>
                                                    {t('continue_shopping')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="ord-mobile-list">
                    {loading ? (
                        <div className="ord-loading"><Spin size="large" /></div>
                    ) : orders && orders.length > 0 ? (
                        orders.map((order) => (
                            <div className="ord-card" key={order.id}>
                                <div className="ord-card-header">
                                    <Link to={`/account/orders/${order.id}`} state={{ order: order }} className="ord-card-title">
                                        #{order.id}
                                    </Link>
                                    <span className={`ord-status-badge ${getStatusClass(order.status)}`}>
                                        {t(`order_status_${order.status}`)}
                                    </span>
                                </div>
                                <div className="ord-card-row">
                                    <span className="ord-card-label">{t('order_date')}</span>
                                    <span className="ord-card-value">{order.formattedDate}</span>
                                </div>
                                <div className="ord-card-row">
                                    <span className="ord-card-label">{t('payment_method')}</span>
                                    <span className="ord-card-value ord-payment-text">{order.paymentMethod}</span>
                                </div>
                                <div className="ord-card-row">
                                    <span className="ord-card-label">{t('total')}</span>
                                    <span className="ord-card-value ord-highlight-total">{order.formattedTotal}</span>
                                </div>
                                <div className="ord-card-footer">
                                    <button 
                                        className="ord-btn-block"
                                        onClick={() => navigate(`/account/orders/${order.id}`, { state: { order: order } })}
                                    >
                                        <EyeOutlined /> {t('view_detail')}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="ord-empty-td">
                            <div className="ord-empty-state">
                                <p>{t('no_orders')}</p>
                                <button onClick={() => navigate('/product')}>
                                    {t('continue_shopping')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
