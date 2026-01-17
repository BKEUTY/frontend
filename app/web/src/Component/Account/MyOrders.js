import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

const MyOrders = () => {
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Correct API endpoint: /api/order/{userId}
        fetch(`${process.env.REACT_APP_API_URL}/order/1`) // userId fixed as 1
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("API not available");
            })
            .then(data => {
                // Map backend response (OrderResponseDTO) to UI format
                // DTO: { total, paymentMethod, orderDate, address, items }
                // UI expects: { id, date, total, status }
                const mappedOrders = data.map((order, index) => ({
                    id: order.id || `ORD-${index + 1}`, // Fallback ID if not present
                    date: order.orderDate,
                    total: order.total ? order.total.toLocaleString("vi-VN") + 'đ' : '0đ',
                    status: 'pending' // Default status as backend DTO doesn't have it yet
                }));
                setOrders(mappedOrders);
                setLoading(false);
            })
            .catch(err => {
                console.log("Using mock data due to error or missing API:", err);
                setOrders([
                    { id: 1001, date: '2026-10-20', total: '500.000đ', status: 'completed' },
                    { id: 1002, date: '2026-10-25', total: '1.200.000đ', status: 'pending' },
                    { id: 1003, date: '2026-11-02', total: '350.000đ', status: 'cancelled' },
                ]);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>{t('loading')}...</div>;

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
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.date}</td>
                                <td>{order.total}</td>
                                <td>
                                    <span className={`order-status status-${order.status}`}>
                                        {order.status === 'completed' ? t('completed') :
                                            order.status === 'cancelled' ? t('cancelled') : t('pending')}
                                    </span>
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
