import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import Skeleton from '../../Component/Common/Skeleton';
import { FiEye } from "react-icons/fi";
import orderApi from '../../api/orderApi';
import { useNotification } from '../../Context/NotificationContext';

const MyOrders = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const notify = useNotification();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderApi.getHistory();
                const data = response.data || [];
                
                const mappedOrders = data.map((order, index) => ({
                    id: order.orderId || `ORD-${index + 1}`,
                    date: order.orderDate,
                    total: order.total ? order.total.toLocaleString("vi-VN") + 'đ' : '0đ',
                    status: (order.paymentMethod === 'Banking' && !order.qrCodeLink) ? 'completed' : 'pending' // Simplified status logic for demo
                }));
                setOrders(mappedOrders);
            } catch (err) {
                console.error("Fetch orders error:", err);
                // Fallback to mock data if API fails significantly or handle properly
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [t]);

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
                <div className="empty-orders">
                    <p>{t('no_orders') || "Bạn chưa có đơn hàng nào."}</p>
                    <button className="btn-continue-shopping" onClick={() => navigate('/')}>
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
                                    <Link to={`/account/orders/${order.id}`} style={{ color: '#a30251', fontWeight: 'bold' }}>
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
                                        style={{ color: '#a30251', fontSize: '18px' }}
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

