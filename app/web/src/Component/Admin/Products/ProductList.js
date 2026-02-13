
import React, { useEffect, useState } from 'react';
import { Table, Button, notification, Card, Typography, Tooltip, Tag, Space, Empty, Modal } from 'antd';
import {
    PlusOutlined, ReloadOutlined,
    EditOutlined, DeleteOutlined,
    ShoppingOutlined, EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import { getImageUrl } from '../../../api/axiosClient';
import { useLanguage } from '../../../i18n/LanguageContext';
import './ProductList.css';
import ProductDetail from '../../../pages/Product/ProductDetail';

const { Text } = Typography;

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
    const [previewProduct, setPreviewProduct] = useState(null);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);

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
            // Error is handled globally
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

    const handlePreview = (record) => {
        setPreviewProduct(record);
        setIsPreviewVisible(true);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'productId',
            key: 'id',
            width: 100,
            align: 'center',
            render: (id) => <Text style={{ color: '#64748b', fontFamily: 'monospace', fontWeight: 600 }}>#{id}</Text>
        },
        {
            title: t('admin_product_image'),
            dataIndex: 'image',
            key: 'image',
            width: 120,
            align: 'center',
            render: (src) => (
                <div style={{
                    width: 48, height: 48, borderRadius: 12, overflow: 'hidden',
                    border: '1px solid #f0f0f0', backgroundColor: '#fafafa'
                }}>
                    {src ? (
                        <img src={getImageUrl(src)} alt="p" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            width: 150,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={t('preview_product')}>
                        <Button
                            type="text"
                            icon={<EyeOutlined style={{ color: 'var(--admin-secondary)' }} />} // Changed from Green to Secondary (Blue)
                            onClick={() => handlePreview(record)}
                        />
                    </Tooltip>
                    <Tooltip title={t('edit')}>
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ color: 'var(--admin-primary)' }} />} // Changed from Blue to Primary
                            onClick={() => notification.info({ message: 'Info', description: 'Coming soon', key: 'coming_soon' })}
                        />
                    </Tooltip>
                    <Tooltip title={t('delete')}>
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => notification.info({ message: 'Info', description: 'Coming soon', key: 'coming_soon' })}
                        />
                    </Tooltip>
                </Space>
            )
        },
    ];

    return (
        <div className="admin-product-list-container" style={{ paddingBottom: 40 }}>
            <div className="admin-page-header">
                <div className="admin-header-title-box">
                    <h2 className="dashboard-title">
                        {t('admin_product_list')}
                    </h2>
                    <div className="admin-subtitle-wrapper">
                        <Text className="admin-subtitle">
                            {t('available')} • <Text strong className="admin-subtitle-count">{pagination.total}</Text> {t('items')}
                        </Text>
                    </div>
                </div>

                <Space size="large" wrap>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => fetchProducts(pagination.current, pagination.pageSize)}
                        loading={loading}
                        className="admin-btn-responsive admin-btn-secondary"
                        style={{ height: 52, borderRadius: 16 }}
                    >
                        {t('refresh')}
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/admin/products/create')}
                        className="modern-btn-primary admin-btn-responsive"
                    >
                        {t('admin_product_create')}
                    </Button>
                </Space>
            </div>

            <Card bordered={false} className="beauty-card" bodyStyle={{ padding: 0 }}>
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
                    locale={{
                        emptyText: (
                            <div className="admin-empty-state">
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={<span className="admin-empty-text">{t('no_products_found')}</span>}
                                />
                            </div>
                        )
                    }}
                />
            </Card>


            <Modal
                title={null}
                open={isPreviewVisible}
                onCancel={() => setIsPreviewVisible(false)}
                footer={null}
                width={1200}
                centered
                bodyStyle={{ padding: 0, overflow: 'hidden', borderRadius: 8 }}
                style={{ top: 20 }}
                destroyOnClose
            >
                {previewProduct && (
                    <div style={{ height: '90vh', overflowY: 'auto' }}>
                        <ProductDetail previewProduct={previewProduct} />
                    </div>
                )}
            </Modal>
        </div >
    );
};

export default ProductList;
