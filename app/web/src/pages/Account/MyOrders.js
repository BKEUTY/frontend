import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import Skeleton from '../../Component/Common/Skeleton';
import { FiEye } from "react-icons/fi";
import { useOrders } from '../../hooks/useOrders';

const MyOrders = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    
    const { orders, loading } = useOrders();

    if (loading) {
        return (
            <div className="my-orders-page">
                <h2>{t('my_orders')}</h2>
                <br />
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>{t('order_id')}</th>
                            <th>{t('order_date')}</th>
                            <th>{t('total')}</th>
                            <th>{t('status')}</th>
                            <th className="text-center">{t('actions_col')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array(5).fill(0).map((_, i) => (
                            <tr key={i}>
                                <td><Skeleton width="80px" height="20px" /></td>
                                <td><Skeleton width="100px" height="20px" /></td>
                                <td><Skeleton width="80px" height="20px" /></td>
                                <td><Skeleton width="100px" height="24px" borderRadius="12px" /></td>
                                <td className="text-center"><Skeleton width="24px" height="24px" borderRadius="4px" style={{ display: 'inline-block' }} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="my-orders-page">
            <h2>{t('my_orders')}</h2>
            <br />
            {orders.length === 0 ? (
                <div className="empty-orders" style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p style={{ color: '#666', marginBottom: '20px' }}>{t('no_orders')}</p>
                    <button 
                        className="btn-continue-shopping" 
                        onClick={() => navigate('/product')}
                        style={{ padding: '10px 24px', background: 'var(--color_main_title)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {t('continue_shopping')}
                    </button>
                </div>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>{t('order_id')}</th>
                            <th>{t('order_date')}</th>
                            <th>{t('total')}</th>
                            <th>{t('status')}</th>
                            <th className="text-center">{t('actions_col')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td data-label={t('order_id')}>
                                    <Link to={`/account/orders/${order.id}`} style={{ color: 'var(--color_main_title)', fontWeight: 'bold' }}>
                                        #{order.id}
                                    </Link>
                                </td>
                                <td data-label={t('order_date')}>{order.date}</td>
                                <td data-label={t('total')}>{order.total}</td>
                                <td data-label={t('status')}>
                                    <span className={`order-status status-${order.status}`}>
                                        {order.status === 'completed' ? t('completed') :
                                            order.status === 'cancelled' ? t('cancelled') : t('pending')}
                                    </span>
                                </td>
                                <td data-label={t('actions_col')} className="text-center">
                                    <button
                                        className="btn-icon"
                                        title={t('view_detail')}
                                        onClick={() => navigate(`/account/orders/${order.id}`)}
                                        style={{ color: 'var(--color_main_title)', fontSize: '18px' }}
                                    >
                                        <FiEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyOrders;
