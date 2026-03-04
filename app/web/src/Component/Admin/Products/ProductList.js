import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, notification, Card, Typography, Tooltip, Tag, Space, Empty } from 'antd';
import {
    PlusOutlined, SyncOutlined,
    FormOutlined, DeleteOutlined,
    ShoppingOutlined, EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../../api/adminApi';
import { getImageUrl } from '../../../api/axiosClient';
import { useLanguage } from '../../../i18n/LanguageContext';
import usePagination from '../../../hooks/usePagination';
import PageWrapper from '../../Common/PageWrapper';
import EmptyState from '../../Common/EmptyState';
import './ProductList.css';
import ProductDetail from '../../../pages/Product/ProductDetail';


const { Text } = Typography;

const ProductList = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const { pagination, setTotal, setCurrent } = usePagination();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchProducts = useCallback(async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const response = await adminApi.getAllProducts(page - 1, size);
            setData(response.data.content || []);
            setTotal(response.data.totalElements || 0);
            setCurrent(page, size);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    }, [setTotal, setCurrent]);

    useEffect(() => {
        fetchProducts(pagination.current, pagination.pageSize);
    }, [fetchProducts, pagination.current, pagination.pageSize]);

    const handleTableChange = (newPagination) => {
        fetchProducts(newPagination.current, newPagination.pageSize);
    };


    const handlePreview = (record) => {
        const id = record.productId || record.id;
        navigate(`/admin/products/${id}`);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'productId',
            key: 'id',
            width: 100,
            align: 'center',
            render: (id) => <span className="admin-table-id">#{id}</span>
        },
        {
            title: t('admin_product_image'),
            dataIndex: 'image',
            key: 'image',
            width: 120,
            align: 'center',
            render: (src) => (
                <div className="admin-table-image-wrapper">
                    {src ? (
                        <img src={getImageUrl(src)} alt="p" className="admin-table-image" />
                    ) : (
                        <ShoppingOutlined className="admin-table-image-placeholder" />
                    )}
                </div>
            )
        },
        {
            title: t('admin_product_name'),
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="admin-table-product-name">{text}</span>
        },
        {
            title: t('admin_product_category'),
            dataIndex: 'categories',
            key: 'categories',
            render: (cats) => (
                <Space size={[0, 4]} wrap>
                    {Array.isArray(cats) && cats.map((c, i) => (
                        <Tag key={i} className="admin-table-tag">
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
            render: (_, record) => {
                const id = record.productId || record.id;
                return (
                    <Space size="middle">
                        <Tooltip title={t('preview_product')}>
                            <Button
                                type="text"
                                className="admin-action-btn view-btn"
                                icon={<EyeOutlined />}
                                onClick={() => handlePreview(record)}
                            />
                        </Tooltip>
                        <Tooltip title={t('edit')}>
                            <Button
                                type="text"
                                className="admin-action-btn edit-btn"
                                icon={<FormOutlined />}
                                onClick={() => notification.info({ message: 'Info', description: 'Coming soon', key: 'coming_soon' })}
                            />
                        </Tooltip>
                        <Tooltip title={t('delete')}>
                            <Button
                                type="text"
                                className="admin-action-btn delete-btn"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => notification.info({ message: 'Info', description: 'Coming soon', key: 'coming_soon' })}
                            />
                        </Tooltip>
                    </Space>
                );
            }
        },
    ];

    return (
        <div className="admin-product-list-container">
            <PageWrapper
                title={t('admin_product_list')}
                subtitle={
                    <>
                        {t('available')} • <Text strong className="admin-subtitle-count">{pagination.total}</Text> {t('items')}
                    </>
                }
                extra={
                    <Space size="large" wrap>
                        <Button
                            icon={<SyncOutlined />}
                            onClick={() => fetchProducts(pagination.current, pagination.pageSize)}
                            loading={loading}
                            className="admin-btn-responsive admin-btn-secondary"
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
                }
            >
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
                            <EmptyState
                                description={t('no_products_found')}
                            />
                        )
                    }}
                />
            </PageWrapper>

        </div>
    );
};

export default ProductList;
