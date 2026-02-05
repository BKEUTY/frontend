
import React, { useEffect, useState } from 'react';
import { Table, Button, message, Card, Typography, Tooltip, Tag, Space } from 'antd';
import {
    PlusOutlined, ReloadOutlined,
    EditOutlined, DeleteOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import { useLanguage } from '../../../i18n/LanguageContext';
import '../Admin.css';

const { Title, Text } = Typography;

const ProductList = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const fetchProducts = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const response = await adminApi.getAllProducts(page - 1, size);
            const content = response.data.content || [];
            const totalElements = response.data.totalElements || 0;

            setData(content);
            setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: size,
                total: totalElements
            }));
        } catch (error) {
            message.error(t('error_fetch_products'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(pagination.current, pagination.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTableChange = (newPagination) => {
        fetchProducts(newPagination.current, newPagination.pageSize);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'productId',
            key: 'id',
            width: 80,
            render: (id) => <Text style={{ color: '#8c8c8c', fontFamily: 'monospace' }}>#{id}</Text>
        },
        {
            title: t('admin_product_image'),
            dataIndex: 'image',
            key: 'image',
            width: 100,
            render: (src) => (
                <div style={{
                    width: 48, height: 48, borderRadius: 12, overflow: 'hidden',
                    border: '1px solid #f0f0f0', backgroundColor: '#fafafa'
                }}>
                    {src ? (
                        <img src={src} alt="p" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <ShoppingOutlined style={{ margin: 14, color: '#ccc' }} />
                    )}
                </div>
            )
        },
        {
            title: t('admin_product_name'),
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <Text style={{ fontWeight: 700, color: '#111', fontSize: 15 }}>
                    {text}
                </Text>
            )
        },
        {
            title: t('admin_product_category'),
            dataIndex: 'categories',
            key: 'categories',
            render: (cats) => (
                <Space size={[0, 4]} wrap>
                    {Array.isArray(cats) && cats.map((c, i) => (
                        <Tag key={i} style={{ borderRadius: 6, border: 'none', background: '#f5f5f5', color: '#666', fontWeight: 600 }}>
                            {c}
                        </Tag>
                    ))}
                </Space>
            )
        },
        {
            title: t('admin_product_action'),
            key: 'action',
            width: 120,
            align: 'right',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={t('edit')}>
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ color: '#1890ff' }} />}
                            onClick={() => message.info('Coming soon')}
                        />
                    </Tooltip>
                    <Tooltip title={t('delete')}>
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => message.info('Coming soon')}
                        />
                    </Tooltip>
                </Space>
            )
        },
    ];

    return (
        <div className="admin-product-list-container" style={{ paddingBottom: 40 }}>
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: '#111', letterSpacing: '-0.5px' }}>
                        {t('admin_product_list')}
                    </h2>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                        <Text strong style={{ color: 'var(--admin-primary)' }}>{pagination.total}</Text> {t('items')} • <Text strong style={{ color: '#52c41a' }}>{t('available')}</Text>
                    </Text>
                </div>

                <Space size="middle">
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => fetchProducts(pagination.current, pagination.pageSize)}
                        loading={loading}
                        style={{ borderRadius: 12, height: 44, fontWeight: 600 }}
                    >
                        {t('refresh')}
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/admin/products/create')}
                        className="modern-btn-primary"
                        style={{ height: 44 }}
                    >
                        {t('admin_product_create')}
                    </Button>
                </Space>
            </div>

            <Card bordered={false} className="modern-step-card" bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="productId"
                    className="beauty-table"
                    pagination={{
                        ...pagination,
                        showTotal: (total) => `${t('total')} ${total} ${t('items')}`,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                        locale: { items_per_page: `/ ${t('page')}` }
                    }}
                    loading={loading}
                    onChange={handleTableChange}
                    scroll={{ x: 1000 }}
                />
            </Card>
        </div>
    );
};

export default ProductList;
