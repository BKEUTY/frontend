import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import Skeleton from '../../Component/Common/Skeleton';
import { FiEye } from "react-icons/fi";

const MyOrders = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/order/1`)
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("API not available");
            })
            .then(data => {
                const mappedOrders = data.map((order, index) => ({
                    id: order.id || `ORD-${index + 1}`,
                    date: order.orderDate,
                    total: order.total ? order.total.toLocaleString("vi-VN") + 'đ' : '0đ',
                    status: 'pending'
                }));
                setOrders(mappedOrders);
                setLoading(false);
            })
            .catch(err => {
                setOrders([
                    { id: 1001, date: '2026-10-20', total: '500.000đ', status: 'completed' },
                    { id: 1002, date: '2026-10-25', total: '1.200.000đ', status: 'pending' },
                    { id: 1003, date: '2026-11-02', total: '350.000đ', status: 'cancelled' },
                ]);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div>
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
        <div>
            <h2>{t('my_orders')}</h2>
            <br />
            {orders.length === 0 ? <p>{t('no_orders')}</p> : (
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

