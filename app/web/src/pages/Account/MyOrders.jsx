import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { Table, Tag, Button, Typography, Tooltip, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useOrders } from '../../hooks/useOrders';

const { Text } = Typography;

const MyOrders = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { orders, loading } = useOrders();

    const getStatusColor = (status) => {
        switch (status) {
            case 'PAID':
            case 'COMPLETED': return 'success';
            case 'UNPAID':
            case 'IN_PROGRESS': return 'warning';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    const columns = [
        {
            title: t('order_id'),
            dataIndex: 'id',
            key: 'id',
            width: 100,
            align: 'center',
            render: (id, record) => (
                <Link 
                    to={`/account/orders/${id}`} 
                    state={{ order: record }} 
                    className="admin-table-id" 
                    style={{ color: 'var(--color_main_title)', cursor: 'pointer', textDecoration: 'none', fontWeight: 'bold' }}
                >
                    #{id}
                </Link>
            ),
        },
        {
            title: t('order_date'),
            dataIndex: 'formattedDate',
            key: 'orderDate',
            width: 120,
            render: (date) => <Text>{date}</Text>,
        },
        {
            title: t('total'),
            dataIndex: 'formattedTotal',
            key: 'total',
            width: 130,
            render: (total) => <Text strong style={{ color: '#10b981' }}>{total}</Text>,
        },
        {
            title: t('payment_method'),
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            width: 120,
            align: 'center',
            render: (method) => <Text type="secondary">{method}</Text>,
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center',
            render: (status) => (
                <Tag color={getStatusColor(status)} style={{ margin: 0, padding: '2px 10px', borderRadius: '4px' }}>
                    {t(`order_status_${status}`)}
                </Tag>
            ),
        },
        {
            title: t('actions_col'),
            key: 'action',
            width: 80,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={t('view_detail')}>
                        <Button 
                            type="text" 
                            className="admin-action-btn edit-btn" 
                            icon={<EyeOutlined />} 
                            onClick={() => navigate(`/account/orders/${record.id}`, { state: { order: record } })} 
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="my-orders-page admin-list-container" style={{ padding: '0', backgroundColor: 'transparent', minHeight: 'auto' }}>
            <h2 style={{ marginBottom: '20px' }}>{t('my_orders')}</h2>
            
            <div className="admin-table-wrapper">
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    className="beauty-table"
                    pagination={false}
                    loading={loading}
                    scroll={{ x: 'max-content' }}
                    locale={{
                        emptyText: (
                            <div style={{ padding: '40px 0' }}>
                                <p style={{ color: '#666', marginBottom: '20px' }}>{t('no_orders')}</p>
                                <button 
                                    onClick={() => navigate('/product')}
                                    style={{ padding: '10px 24px', background: 'var(--color_main_title)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    {t('continue_shopping')}
                                </button>
                            </div>
                        )
                    }}
                />
            </div>
        </div>
    );
};

export default MyOrders;
